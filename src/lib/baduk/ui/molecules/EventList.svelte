<script lang="ts">
  import type { DomainEvent } from '$lib/baduk/domain/events/base';
  
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
        const size = (event.payload as any).boardSize;
        return `Game Started (${size}×${size})`;
      case 'StonePlaced':
        const player = (event.payload as any).player;
        const position = (event.payload as any).position;
        const stoneSymbol = player === 'black' ? '⚫' : '⚪';
        return `${stoneSymbol} ${player === 'black' ? 'Black' : 'White'} → (${position.x + 1}, ${position.y + 1})`;
      case 'Pass':
        const passingPlayer = (event.payload as any).player;
        const passSymbol = passingPlayer === 'black' ? '⚫' : '⚪';
        return `${passSymbol} ${passingPlayer === 'black' ? 'Black' : 'White'} Pass`;
      case 'GameEnded':
        const winner = (event.payload as any).winner;
        if (winner === 'draw') {
          return '🤝 Game Draw';
        }
        const winnerSymbol = winner === 'black' ? '⚫' : '⚪';
        return `${winnerSymbol} ${winner === 'black' ? 'Black' : 'White'} Won!`;
      case 'Resignation':
        const resigningPlayer = (event.payload as any).player;
        const resignSymbol = resigningPlayer === 'black' ? '⚫' : '⚪';
        return `${resignSymbol} ${resigningPlayer === 'black' ? 'Black' : 'White'} Resigned`;
      default:
        return event.eventType;
    }
  };
</script>

<div class="event-list">
  <h4>Move History</h4>
  <div class="events">
    {#each events as event, index}
      {@const hasBranch = branches.some(b => b.index === index)}
      {@const isBranchPoint = currentBranchPoint === index}
      {@const isActive = index <= currentEventIndex}
      {@const isFuture = index > currentEventIndex}
      {@const isCurrent = index === currentEventIndex}
      
      <button
        class="event"
        class:stone-black={event.eventType === 'StonePlaced' && (event.payload as any).player === 'black'}
        class:stone-white={event.eventType === 'StonePlaced' && (event.payload as any).player === 'white'}
        class:pass={event.eventType === 'Pass'}
        class:game-event={event.eventType === 'GameStarted' || event.eventType === 'GameEnded'}
        class:active={isActive}
        class:current={isCurrent}
        class:future={isFuture}
        class:has-branch={hasBranch}
        class:branch-point={isBranchPoint}
        onclick={() => onEventClick?.(index)}
        disabled={!onEventClick}
        style="cursor: {onEventClick ? 'pointer' : 'default'}"
      >
        <span class="event-number">
          {index + 1}
          {#if hasBranch}
            <span class="branch-indicator">⚡</span>
          {/if}
          {#if isCurrent}
            <span class="current-indicator">📍</span>
          {/if}
        </span>
        <span class="event-description">{getEventDescription(event)}</span>
        <span class="event-time">{new Date(event.occurredAt).toLocaleTimeString()}</span>
      </button>
    {/each}
  </div>
  
  {#if events.length === 0}
    <div class="empty-state">
      <p>No moves yet</p>
      <small>Start a game to see move history</small>
    </div>
  {/if}
</div>

<style>
  .event-list {
    background: #ffffff;
    border-radius: 12px;
    padding: 0;
    max-height: 400px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .event-list h4 {
    margin: 0;
    padding: 16px 16px 12px 16px;
    font-size: 16px;
    font-weight: 600;
    color: #1c1c1e;
    border-bottom: 1px solid #f2f2f7;
  }
  
  .events {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }
  
  .event {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    margin-bottom: 4px;
    background: #f7f7f8;
    border-radius: 8px;
    font-size: 14px;
    width: 100%;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    position: relative;
  }
  
  .event:hover:not(:disabled) {
    background: #e8e8ed;
    transform: translateX(2px);
  }
  
  .event.active {
    background: #eff6ff;
    border-left: 3px solid #3b82f6;
  }
  
  .event.current {
    background: #f0fdf4;
    border-left: 3px solid #10b981;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
  }
  
  .event.future {
    opacity: 0.5;
    background: #f9f9f9;
  }
  
  .event.has-branch {
    border-left: 3px solid #f59e0b;
    background: #fffbeb;
  }
  
  .event.branch-point {
    background: #fef3c7;
    border-left: 3px solid #d97706;
  }
  
  .event.stone-black {
    border-left: 3px solid #1c1c1e;
  }
  
  .event.stone-white {
    border-left: 3px solid #e5e5e5;
  }
  
  .event.pass {
    border-left: 3px solid #f59e0b;
    background: #fffbeb;
  }
  
  .event.game-event {
    border-left: 3px solid #8b5cf6;
    background: #f5f3ff;
  }
  
  .event-number {
    min-width: 32px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #8e8e93;
    position: relative;
    font-size: 12px;
    background: #ffffff;
    border-radius: 6px;
  }
  
  .branch-indicator {
    position: absolute;
    top: -6px;
    right: -6px;
    font-size: 10px;
    animation: pulse 2s infinite;
  }
  
  .current-indicator {
    position: absolute;
    top: -6px;
    left: -6px;
    font-size: 10px;
    animation: bounce 1s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
  }
  
  .event-description {
    flex: 1;
    font-weight: 500;
    color: #1c1c1e;
    line-height: 1.4;
  }
  
  .event-time {
    color: #8e8e93;
    font-size: 11px;
    font-weight: 500;
  }
  
  .empty-state {
    padding: 32px 16px;
    text-align: center;
    color: #8e8e93;
  }
  
  .empty-state p {
    margin: 0 0 4px 0;
    font-size: 14px;
    font-weight: 500;
  }
  
  .empty-state small {
    font-size: 12px;
  }
  
  /* 스크롤바 스타일링 */
  .events::-webkit-scrollbar {
    width: 4px;
  }
  
  .events::-webkit-scrollbar-track {
    background: #f7f7f8;
    border-radius: 2px;
  }
  
  .events::-webkit-scrollbar-thumb {
    background: #d1d1d6;
    border-radius: 2px;
  }
  
  .events::-webkit-scrollbar-thumb:hover {
    background: #a1a1aa;
  }
</style>