<script lang="ts">
  import BoardComponent from '../molecules/Board.svelte';
  import GameStatus from '../molecules/GameStatus.svelte';
  import GameControls from '../organisms/GameControls.svelte';
  import EventList from '../molecules/EventList.svelte';
  import TimeTravel from '../organisms/TimeTravel.svelte';
  import TimelineSelector from '../organisms/TimelineSelector.svelte';
  import { BranchingEventStore, type Timeline } from '$lib/infrastructure/event-store/BranchingEventStore';
  import { GameCommandHandler, type StartGameCommand, type MakeMoveCommand } from '$lib/domain/commands/GameCommandHandler';
  import { GameAggregate, type GameState } from '$lib/domain/aggregates/GameAggregate';
  import type { DomainEvent } from '$lib/domain/events/base';
  import type { Board, Player } from '$lib/domain/events/GameEvents';
  import { onMount } from 'svelte';
  
  const eventStore = new BranchingEventStore();
  const commandHandler = new GameCommandHandler(eventStore);
  
  let gameId = crypto.randomUUID();
  let gameState = $state<GameState>({
    id: gameId,
    board: Array(9).fill(null) as Board,
    currentPlayer: null,
    winner: null,
    isDraw: false,
    playerX: null,
    playerO: null,
    status: 'waiting',
    version: 0
  });
  
  let events = $state<DomainEvent[]>([]);
  let currentEventIndex = $state<number>(-1);
  let isReplaying = $state<boolean>(false);
  let timelines = $state<Timeline[]>([]);
  let currentTimelineId = $state<string>('main');
  let branches = $state<{ index: number; count: number }[]>([]);
  let currentBranchPoint = $state<number | undefined>(undefined);
  
  eventStore.subscribe((event) => {
    events = eventStore.getAllEvents();
    currentEventIndex = events.length - 1;
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
  
  const handleStartGame = async () => {
    const command: StartGameCommand = {
      type: 'StartGame',
      aggregateId: gameId,
      payload: {
        playerX: 'X',
        playerO: 'O'
      }
    };
    
    const newState = await commandHandler.handle(command);
    gameState = newState;
  };
  
  const handleCellClick = async (position: number) => {
    if (gameState.status !== 'playing') return;
    
    const command: MakeMoveCommand = {
      type: 'MakeMove',
      aggregateId: gameId,
      payload: {
        player: gameState.currentPlayer as Player,
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
  
  const handleResetGame = async () => {
    gameId = crypto.randomUUID();
    eventStore.clear();
    events = [];
    currentEventIndex = -1;
    timelines = [eventStore.getCurrentTimeline()];
    currentTimelineId = 'main';
    branches = [];
    currentBranchPoint = undefined;
    gameState = {
      id: gameId,
      board: Array(9).fill(null) as Board,
      currentPlayer: null,
      winner: null,
      isDraw: false,
      playerX: null,
      playerO: null,
      status: 'waiting',
      version: 0
    };
  };
  
  const handleReplayToEvent = async (eventIndex: number) => {
    if (eventIndex < -1 || eventIndex >= events.length) return;
    
    isReplaying = true;
    currentEventIndex = eventIndex;
    
    const aggregate = new GameAggregate(gameId);
    if (eventIndex >= 0) {
      const eventsToReplay = events.slice(0, eventIndex + 1);
      aggregate.loadFromHistory(eventsToReplay);
    }
    gameState = aggregate.getState();
    
    isReplaying = false;
  };
  
  const handleEventClick = async (eventIndex: number) => {
    await handleReplayToEvent(eventIndex);
  };
  
  const handleCellClickWithBranching = async (position: number) => {
    if (gameState.status !== 'playing') return;
    
    // If we're not at the end of current timeline, create a branch
    if (currentEventIndex < events.length - 1) {
      const branchName = `Timeline from event ${currentEventIndex + 2}`;
      const branchId = eventStore.createBranch(currentTimelineId, currentEventIndex, branchName);
      events = eventStore.getAllEvents();
      currentTimelineId = branchId;
    }
    
    // Continue with normal move logic
    await handleCellClick(position);
  };
  
  const handleSelectTimeline = (timelineId: string) => {
    eventStore.switchTimeline(timelineId);
    events = eventStore.getAllEvents();
    currentTimelineId = timelineId;
    currentEventIndex = events.length - 1;
    
    // Replay to current state
    const aggregate = new GameAggregate(gameId);
    aggregate.loadFromHistory(events);
    gameState = aggregate.getState();
  };
  
  let canStart = $derived(gameState.status === 'waiting' || gameState.status === 'finished');
  let canReset = $derived(gameState.status === 'finished' || (gameState.status === 'playing' && events.length > 1));
  
  onMount(() => {
    timelines = eventStore.getAllTimelines();
    currentTimelineId = eventStore.getCurrentTimelineId();
    updateBranches();
  });
</script>

<div class="game-template">
  <div class="game-area">
    <h1>Event Sourcing Tic-Tac-Toe</h1>
    
    <GameStatus
      currentPlayer={gameState.currentPlayer}
      winner={gameState.winner}
      isDraw={gameState.isDraw}
      status={gameState.status}
    />
    
    <BoardComponent
      board={gameState.board}
      onCellClick={handleCellClickWithBranching}
    />
    
    <GameControls
      onStartGame={handleStartGame}
      onResetGame={handleResetGame}
      {canStart}
      {canReset}
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
  .game-template {
    display: flex;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .game-area {
    flex: 1;
  }
  
  .game-area h1 {
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }
  
  .sidebar {
    width: 300px;
  }
  
  @media (max-width: 768px) {
    .game-template {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100%;
    }
  }
</style>