<script lang="ts">
  import type { DomainEvent } from '$lib/domain/events/base';
  
  interface Props {
    events?: DomainEvent[];
    currentEventIndex?: number;
    onEventClick?: (index: number) => void;
    branches?: { index: number; count: number }[];
    currentBranchPoint?: number;
  }
  
  let { 
    events = [], 
    currentEventIndex = -1,
    onEventClick,
    branches = [],
    currentBranchPoint
  }: Props = $props();
  
  const getEventDescription = (event: DomainEvent): string => {
    switch (event.eventType) {
      case 'GameStarted':
        return 'Game Started';
      case 'MoveMade':
        const player = (event.payload as any).player;
        const position = (event.payload as any).position;
        const row = Math.floor(position / 3) + 1;
        const col = (position % 3) + 1;
        return `Player ${player} → (${row}, ${col})`;
      case 'GameWon':
        const winner = (event.payload as any).winner;
        return `Player ${winner} Won!`;
      case 'GameDrawn':
        return 'Game Draw';
      case 'GameReset':
        return 'Game Reset';
      default:
        return event.eventType;
    }
  };
</script>

<div class="event-list">
  <h3>Event History</h3>
  <div class="events">
    {#each events as event, index}
      {@const hasBranch = branches.some(b => b.index === index)}
      {@const isBranchPoint = currentBranchPoint === index}
      {@const isActive = index <= currentEventIndex}
      {@const isFuture = index > currentEventIndex}
      
      <button
        class="event"
        class:move-x={event.eventType === 'MoveMade' && (event.payload as any).player === 'X'}
        class:move-o={event.eventType === 'MoveMade' && (event.payload as any).player === 'O'}
        class:active={isActive}
        class:future={isFuture}
        class:has-branch={hasBranch}
        class:branch-point={isBranchPoint}
        onclick={() => onEventClick?.(index)}
        disabled={!onEventClick}
      >
        <span class="event-number">
          {index + 1}
          {#if hasBranch}
            <span class="branch-indicator">⚡</span>
          {/if}
        </span>
        <span class="event-type">{getEventDescription(event)}</span>
        <span class="event-time">{new Date(event.occurredAt).toLocaleTimeString()}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .event-list {
    background: #f9fafb;
    border-radius: 0.5rem;
    padding: 1rem;
    max-height: 400px;
    overflow-y: auto;
  }
  
  .event-list h3 {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
    font-weight: 600;
  }
  
  .events {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .event {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: white;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    width: 100%;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }
  
  .event:hover:not(:disabled) {
    background: #f3f4f6;
    transform: translateX(4px);
  }
  
  .event.active {
    background: #eff6ff;
    border-color: #3b82f6;
  }
  
  .event.future {
    opacity: 0.5;
  }
  
  .event.has-branch {
    border-left: 4px solid #f59e0b;
  }
  
  .event.branch-point {
    background: #fef3c7;
    border-color: #f59e0b;
  }
  
  .event-number {
    min-width: 2rem;
    text-align: center;
    font-weight: 600;
    color: #6b7280;
    position: relative;
  }
  
  .branch-indicator {
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 0.75rem;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .event-type {
    flex: 1;
    font-weight: 500;
  }
  
  .event-time {
    color: #6b7280;
    font-size: 0.75rem;
  }
  
  .event.move-x .event-type {
    color: #2563eb;
    font-weight: 600;
  }
  
  .event.move-o .event-type {
    color: #dc2626;
    font-weight: 600;
  }
</style>