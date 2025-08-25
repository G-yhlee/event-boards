<script lang="ts">
  import Button from '../atoms/Button.svelte';
  import type { DomainEvent } from '$lib/tictactoe/domain/events/base';
  
  interface Props {
    events?: DomainEvent[];
    currentEventIndex?: number;
    onReplayToEvent: (index: number) => void;
    isReplaying?: boolean;
  }
  
  let { 
    events = [], 
    currentEventIndex = $bindable(),
    onReplayToEvent,
    isReplaying = false
  }: Props = $props();
  
  const handleSliderChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const index = parseInt(target.value);
    onReplayToEvent(index);
  };
</script>

<div class="time-travel">
  <h3>Time Travel Debugger</h3>
  
  {#if events.length > 0}
    <div class="controls">
      <input
        type="range"
        min="0"
        max={events.length - 1}
        value={currentEventIndex}
        onchange={handleSliderChange}
        disabled={isReplaying}
        class="slider"
      />
      
      <div class="event-info">
        Event {currentEventIndex + 1} of {events.length}
        {#if events[currentEventIndex]}
          <span class="event-type">({events[currentEventIndex].eventType})</span>
        {/if}
      </div>
    </div>
    
    <div class="navigation">
      <Button 
        onclick={() => onReplayToEvent(Math.max(0, currentEventIndex - 1))}
        variant="secondary"
      >
        {#snippet children()}← Previous{/snippet}
      </Button>
      
      <Button 
        onclick={() => onReplayToEvent(Math.min(events.length - 1, currentEventIndex + 1))}
        variant="secondary"
      >
        {#snippet children()}Next →{/snippet}
      </Button>
    </div>
  {:else}
    <p class="empty">No events to replay yet. Start playing!</p>
  {/if}
</div>

<style>
  .time-travel {
    background: #f9fafb;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 1rem;
  }
  
  .time-travel h3 {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
    font-weight: 600;
  }
  
  .controls {
    margin-bottom: 1rem;
  }
  
  .slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
    margin-bottom: 0.5rem;
  }
  
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #2563eb;
    cursor: pointer;
  }
  
  .slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #2563eb;
    cursor: pointer;
  }
  
  .event-info {
    text-align: center;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .event-type {
    font-weight: 500;
    color: #374151;
  }
  
  .navigation {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  
  .empty {
    text-align: center;
    color: #6b7280;
    font-size: 0.875rem;
  }
</style>