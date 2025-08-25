<script lang="ts">
  import BadukBoard from '../molecules/BadukBoard.svelte';
  import LeftPanel from '../organisms/LeftPanel.svelte';
  import RightPanel from '../organisms/RightPanel.svelte';
  import { BranchingEventStore, type Timeline } from '$lib/shared/infrastructure/event-store/BranchingEventStore';
  import { BadukCommandHandler, type StartGameCommand, type PlaceStoneCommand, type PassCommand, type ResignCommand } from '$lib/baduk/domain/commands/BadukCommandHandler';
  import { BadukAggregate, type GameState } from '$lib/baduk/domain/aggregates/BadukAggregate';
  import type { DomainEvent } from '$lib/baduk/domain/events/base';
  import type { Board, Player, Position, BoardSize } from '$lib/baduk/domain/events/BadukEvents';
  import { onMount } from 'svelte';
  
  const eventStore = new BranchingEventStore();
  const commandHandler = new BadukCommandHandler(eventStore);
  
  let gameId = crypto.randomUUID();
  let gameState = $state<GameState>({
    id: gameId,
    boardSize: 19,
    board: Array(19).fill(null).map(() => Array(19).fill(null)) as Board,
    currentPlayer: 'black',
    playerBlack: 'Black Player',
    playerWhite: 'White Player',
    handicap: 0,
    komi: 6.5,
    status: 'waiting',
    consecutivePasses: 0,
    capturedStones: { black: 0, white: 0 },
    version: 0
  });
  
  let events = $state<DomainEvent[]>([]);
  let currentEventIndex = $state<number>(-1);
  let isReplaying = $state<boolean>(false);
  let timelines = $state<Timeline[]>([]);
  let currentTimelineId = $state<string>('main');
  let branches = $state<{ index: number; count: number }[]>([]);
  let currentBranchPoint = $state<number | undefined>(undefined);
  let lastMovePosition = $state<Position | undefined>(undefined);
  
  eventStore.subscribe((event) => {
    const allEvents = eventStore.getAllEvents();
    // Only update if events array actually changed
    if (events.length !== allEvents.length) {
      events = allEvents;
      currentEventIndex = events.length - 1;
    }
    
    // Track last move position for visual indication
    if (event?.eventType === 'StonePlaced') {
      lastMovePosition = (event.payload as any).position;
    }
  });
  
  eventStore.subscribeToTimelines((timeline) => {
    timelines = eventStore.getAllTimelines();
    currentTimelineId = eventStore.getCurrentTimelineId();
    updateBranches();
  });
  
  let lastTimelinesHash = $state('');
  
  const updateBranches = () => {
    // Create a hash of timelines to detect changes
    const timelinesHash = timelines.map(t => `${t.id}-${t.branchPoint}`).join('|');
    
    // Only update if timelines actually changed
    if (timelinesHash === lastTimelinesHash) return;
    lastTimelinesHash = timelinesHash;
    
    const branchMap = new Map<number, number>();
    timelines.forEach(timeline => {
      if (timeline.branchPoint !== undefined) {
        branchMap.set(timeline.branchPoint, (branchMap.get(timeline.branchPoint) || 0) + 1);
      }
    });
    branches = Array.from(branchMap.entries()).map(([index, count]) => ({ index, count }));
    
    const currentTimeline = timelines.find(t => t.id === currentTimelineId);
    currentBranchPoint = currentTimeline?.branchPoint;
  };
  
  const handleStartGame = async (config: { boardSize: BoardSize; handicap: number; komi: number }) => {
    const command: StartGameCommand = {
      type: 'StartGame',
      aggregateId: gameId,
      payload: {
        boardSize: config.boardSize,
        playerBlack: 'Black Player',
        playerWhite: 'White Player',
        handicap: config.handicap,
        komi: config.komi
      }
    };
    
    const newState = await commandHandler.handle(command);
    gameState = newState;
  };
  
  const handleIntersectionClick = async (position: Position) => {
    if (gameState.status !== 'playing') return;
    
    // If we're not at the end of current timeline, create a branch
    if (currentEventIndex < events.length - 1) {
      const branchName = `Timeline from move ${currentEventIndex + 2}`;
      const branchId = eventStore.createBranch(currentTimelineId, currentEventIndex, branchName);
      events = eventStore.getAllEvents();
      currentTimelineId = branchId;
    }
    
    const command: PlaceStoneCommand = {
      type: 'PlaceStone',
      aggregateId: gameId,
      payload: {
        player: gameState.currentPlayer,
        position
      }
    };
    
    try {
      const newState = await commandHandler.handle(command);
      gameState = newState;
    } catch (error) {
      console.error('Move error:', error instanceof Error ? error.message : error);
    }
  };
  
  const handlePass = async () => {
    const command: PassCommand = {
      type: 'Pass',
      aggregateId: gameId,
      payload: {
        player: gameState.currentPlayer
      }
    };
    
    const newState = await commandHandler.handle(command);
    gameState = newState;
  };
  
  const handleResign = async () => {
    const command: ResignCommand = {
      type: 'Resign',
      aggregateId: gameId,
      payload: {
        player: gameState.currentPlayer
      }
    };
    
    const newState = await commandHandler.handle(command);
    gameState = newState;
  };
  
  const handleNewGame = async () => {
    gameId = crypto.randomUUID();
    eventStore.clear();
    events = [];
    currentEventIndex = -1;
    timelines = [eventStore.getCurrentTimeline()];
    currentTimelineId = 'main';
    branches = [];
    currentBranchPoint = undefined;
    lastMovePosition = undefined;
    lastReplayEventIndex = -2;
    lastTimelinesHash = '';
    gameState = {
      id: gameId,
      boardSize: 19,
      board: Array(19).fill(null).map(() => Array(19).fill(null)) as Board,
      currentPlayer: 'black',
      playerBlack: 'Black Player',
      playerWhite: 'White Player',
      handicap: 0,
      komi: 6.5,
      status: 'waiting',
      consecutivePasses: 0,
      capturedStones: { black: 0, white: 0 },
      version: 0
    };
  };
  
  const handleEventClick = async (eventIndex: number) => {
    console.log('Event clicked:', eventIndex);
    await handleReplayToEvent(eventIndex);
  };
  
  let lastReplayEventIndex = $state(-2); // Track last replayed index to avoid unnecessary work
  
  const handleReplayToEvent = async (eventIndex: number) => {
    console.log('Replaying to event:', eventIndex, 'events.length:', events.length);
    if (eventIndex < -1 || eventIndex >= events.length) return;
    
    // Avoid replaying to the same position
    if (eventIndex === lastReplayEventIndex) {
      console.log('Same position, skipping replay');
      return;
    }
    
    isReplaying = true;
    currentEventIndex = eventIndex;
    lastReplayEventIndex = eventIndex;
    
    const aggregate = new BadukAggregate(gameId);
    if (eventIndex >= 0) {
      const eventsToReplay = events.slice(0, eventIndex + 1);
      console.log('Replaying events:', eventsToReplay.length, 'events');
      aggregate.loadFromHistory(eventsToReplay);
      
      // Update last move position
      const lastEvent = eventsToReplay[eventsToReplay.length - 1];
      if (lastEvent?.eventType === 'StonePlaced') {
        lastMovePosition = (lastEvent.payload as any).position;
      } else {
        lastMovePosition = undefined;
      }
    } else {
      // Reset to initial state
      lastMovePosition = undefined;
    }
    
    const newState = aggregate.getState();
    console.log('New game state:', newState);
    gameState = newState;
    
    isReplaying = false;
  };
  
  const handleSelectTimeline = (timelineId: string) => {
    eventStore.switchTimeline(timelineId);
    events = eventStore.getAllEvents();
    currentTimelineId = timelineId;
    currentEventIndex = events.length - 1;
    
    // Replay to current state
    const aggregate = new BadukAggregate(gameId);
    aggregate.loadFromHistory(events);
    gameState = aggregate.getState();
    
    // Update last move position
    const lastEvent = events[events.length - 1];
    if (lastEvent?.eventType === 'StonePlaced') {
      lastMovePosition = (lastEvent.payload as any).position;
    } else {
      lastMovePosition = undefined;
    }
  };
  
  onMount(() => {
    timelines = eventStore.getAllTimelines();
    currentTimelineId = eventStore.getCurrentTimelineId();
    updateBranches();
    
    // Set header height CSS variable for proper sizing
    const setHeaderHeight = () => {
      const headerHeight = document.querySelector('.baduk-nav')?.getBoundingClientRect().height || 80;
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    };
    
    setHeaderHeight();
    // Update header height on resize
    window.addEventListener('resize', setHeaderHeight);
    
    return () => {
      window.removeEventListener('resize', setHeaderHeight);
    };
  });
</script>

<div class="full-screen-layout">
  <!-- 좌측 설정 패널 -->
  <LeftPanel 
    onStartGame={handleStartGame}
    onPass={handlePass}
    onResign={handleResign}
    onNewGame={handleNewGame}
    status={gameState.status}
    currentPlayer={gameState.currentPlayer}
  />
  
  <!-- 중앙 게임 영역 -->
  <div class="center-area">
    <div class="board-container">
      <BadukBoard
        board={gameState.board}
        boardSize={gameState.boardSize}
        onIntersectionClick={handleIntersectionClick}
        {lastMovePosition}
        territories={gameState.territories}
      />
    </div>
  </div>
  
  <!-- 우측 상태 패널 -->
  <RightPanel 
    currentPlayer={gameState.currentPlayer}
    status={gameState.status}
    winner={gameState.winner}
    consecutivePasses={gameState.consecutivePasses}
    capturedStones={gameState.capturedStones}
    komi={gameState.komi}
    boardSize={gameState.boardSize}
    {events}
    {currentEventIndex}
    onEventClick={handleEventClick}
    {branches}
    {currentBranchPoint}
    {timelines}
    {currentTimelineId}
    onSelectTimeline={handleSelectTimeline}
    onReplayToEvent={handleReplayToEvent}
    {isReplaying}
  />
</div>

<style>
  .full-screen-layout {
    width: 100vw;
    height: 100vh;
    background: #fafafa;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    display: flex;
    position: relative;
    overflow: hidden;
  }
  
  .center-area {
    flex: 1;
    margin-left: 300px;
    margin-right: 360px;
    height: calc(100vh - var(--header-height, 80px));
    display: flex;
    flex-direction: column;
    background: #ffffff;
    transition: all 0.3s ease;
  }
  
  .board-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
    background: #fafafa;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  /* 반응형 디자인 */
  @media (max-width: 1400px) {
    .center-area {
      min-width: 600px;
    }
  }
  
  @media (max-width: 1200px) {
    .game-header {
      padding: 1.5rem;
    }
    
    .logo h1 {
      font-size: 2rem;
    }
    
    .game-title h2 {
      font-size: 1.25rem;
    }
  }
  
  @media (max-width: 1200px) {
    .center-area {
      margin-left: 280px;
      margin-right: 320px;
    }
  }
  
  @media (max-width: 768px) {
    .center-area {
      margin-left: 60px;
      margin-right: 60px;
    }
    
    .game-header {
      padding: 1rem;
    }
    
    .logo {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .logo h1 {
      font-size: 1.75rem;
    }
    
    .game-title h2 {
      font-size: 1.125rem;
    }
    
    .board-container {
      padding: 1rem;
    }
  }
  
  /* 다크모드에서도 잘 보이도록 */
  @media (prefers-color-scheme: dark) {
    .saas-layout {
      background: #0f172a;
    }
  }
</style>