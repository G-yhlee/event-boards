<script lang="ts">
  import BadukBoard from '../molecules/BadukBoard.svelte';
  import GameStatus from '../molecules/GameStatus.svelte';
  import GameControls from '../organisms/GameControls.svelte';
  import ThemeSelector from '../molecules/ThemeSelector.svelte';
  import EventList from '$lib/tictactoe/ui/molecules/EventList.svelte';
  import TimelineSelector from '$lib/tictactoe/ui/organisms/TimelineSelector.svelte';
  import TimeTravel from '$lib/tictactoe/ui/organisms/TimeTravel.svelte';
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
    events = eventStore.getAllEvents();
    currentEventIndex = events.length - 1;
    
    // Track last move position for visual indication
    const lastEvent = events[events.length - 1];
    if (lastEvent?.eventType === 'StonePlaced') {
      lastMovePosition = (lastEvent.payload as any).position;
    }
  });
  
  eventStore.subscribeToTimelines((timeline) => {
    timelines = eventStore.getAllTimelines();
    currentTimelineId = eventStore.getCurrentTimelineId();
    updateBranches();
  });
  
  const updateBranches = () => {
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
      // You might want to show this error to the user
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
    await handleReplayToEvent(eventIndex);
  };
  
  const handleReplayToEvent = async (eventIndex: number) => {
    if (eventIndex < -1 || eventIndex >= events.length) return;
    
    isReplaying = true;
    currentEventIndex = eventIndex;
    
    const aggregate = new BadukAggregate(gameId);
    if (eventIndex >= 0) {
      const eventsToReplay = events.slice(0, eventIndex + 1);
      aggregate.loadFromHistory(eventsToReplay);
      
      // Update last move position
      const lastEvent = eventsToReplay[eventsToReplay.length - 1];
      if (lastEvent?.eventType === 'StonePlaced') {
        lastMovePosition = (lastEvent.payload as any).position;
      } else {
        lastMovePosition = undefined;
      }
    } else {
      lastMovePosition = undefined;
    }
    gameState = aggregate.getState();
    
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
  });
</script>

<div class="baduk-game">
  <div class="game-area">
    <h1>⚫⚪ Baduk (Go) - Event Sourcing</h1>
    
    <ThemeSelector />
    
    <GameStatus
      currentPlayer={gameState.currentPlayer}
      status={gameState.status}
      winner={gameState.winner}
      consecutivePasses={gameState.consecutivePasses}
      capturedStones={gameState.capturedStones}
      komi={gameState.komi}
      boardSize={gameState.boardSize}
    />
    
    <BadukBoard
      board={gameState.board}
      boardSize={gameState.boardSize}
      onIntersectionClick={handleIntersectionClick}
      {lastMovePosition}
      territories={gameState.territories}
    />
    
    <GameControls
      onStartGame={handleStartGame}
      onPass={handlePass}
      onResign={handleResign}
      onNewGame={handleNewGame}
      status={gameState.status}
      currentPlayer={gameState.currentPlayer}
    />
  </div>
  
  <div class="sidebar">
    <TimelineSelector
      {timelines}
      {currentTimelineId}
      onSelectTimeline={handleSelectTimeline}
    />
    <EventList 
      {events}
      {currentEventIndex}
      onEventClick={handleEventClick}
      {branches}
      {currentBranchPoint}
    />
    <TimeTravel 
      {events}
      bind:currentEventIndex
      onReplayToEvent={handleReplayToEvent}
      {isReplaying}
    />
  </div>
</div>

<style>
  .baduk-game {
    display: flex;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    min-height: calc(100vh - 80px);
  }
  
  .game-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .game-area h1 {
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
    background: linear-gradient(135deg, #1f2937, #4b5563);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .sidebar {
    width: 350px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  @media (max-width: 1200px) {
    .baduk-game {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100%;
      order: -1;
    }
  }
  
  @media (max-width: 768px) {
    .baduk-game {
      padding: 1rem;
      gap: 1rem;
    }
    
    .game-area h1 {
      font-size: 1.5rem;
    }
  }
</style>