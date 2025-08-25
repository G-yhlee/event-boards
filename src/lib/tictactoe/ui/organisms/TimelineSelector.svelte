<script lang="ts">
  import type { Timeline } from '$lib/infrastructure/event-store/BranchingEventStore';
  
  interface Props {
    timelines: Timeline[];
    currentTimelineId: string;
    onSelectTimeline: (timelineId: string) => void;
  }
  
  let { timelines, currentTimelineId, onSelectTimeline }: Props = $props();
  
  const getTimelineName = (timeline: Timeline): string => {
    if (timeline.id === 'main') return '🌍 Main Timeline';
    if (timeline.branchPoint !== undefined) {
      return `⚡ ${timeline.name} (from event ${timeline.branchPoint + 1})`;
    }
    return timeline.name;
  };
</script>

<div class="timeline-selector">
  <h3>Timelines</h3>
  <div class="timelines">
    {#each timelines as timeline}
      <button
        class="timeline"
        class:active={timeline.id === currentTimelineId}
        onclick={() => onSelectTimeline(timeline.id)}
      >
        <span class="timeline-name">{getTimelineName(timeline)}</span>
        <span class="event-count">{timeline.events.length} events</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .timeline-selector {
    background: #f9fafb;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .timeline-selector h3 {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
    font-weight: 600;
  }
  
  .timelines {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .timeline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    width: 100%;
  }
  
  .timeline:hover {
    background: #f3f4f6;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .timeline.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
  
  .timeline-name {
    font-weight: 500;
    font-size: 0.875rem;
  }
  
  .event-count {
    font-size: 0.75rem;
    opacity: 0.7;
  }
</style>