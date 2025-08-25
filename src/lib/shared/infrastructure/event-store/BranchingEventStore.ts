import type { DomainEvent } from '$lib/domain/events/base';

export interface Timeline {
  id: string;
  name: string;
  events: DomainEvent[];
  parentTimelineId?: string;
  branchPoint?: number; // Index in parent timeline where branch occurred
  createdAt: string;
}

export type TimelineSubscriber = (timeline: Timeline) => void;

export class BranchingEventStore {
  private timelines: Map<string, Timeline> = new Map();
  private currentTimelineId: string;
  private subscribers: TimelineSubscriber[] = [];
  private eventSubscribers: ((event: DomainEvent) => void)[] = [];

  constructor() {
    const mainTimeline: Timeline = {
      id: 'main',
      name: 'Main Timeline',
      events: [],
      createdAt: new Date().toISOString()
    };
    this.timelines.set('main', mainTimeline);
    this.currentTimelineId = 'main';
  }

  append(event: DomainEvent): DomainEvent {
    const timeline = this.getCurrentTimeline();
    timeline.events.push(event);
    this.notifyEventSubscribers(event);
    this.notifyTimelineSubscribers(timeline);
    return event;
  }

  createBranch(fromTimelineId: string, atEventIndex: number, branchName?: string): string {
    const parentTimeline = this.timelines.get(fromTimelineId);
    if (!parentTimeline) {
      throw new Error(`Timeline ${fromTimelineId} not found`);
    }

    const branchId = `branch-${Date.now()}`;
    const newTimeline: Timeline = {
      id: branchId,
      name: branchName || `Branch from ${parentTimeline.name}`,
      events: [...parentTimeline.events.slice(0, atEventIndex + 1)],
      parentTimelineId: fromTimelineId,
      branchPoint: atEventIndex,
      createdAt: new Date().toISOString()
    };

    this.timelines.set(branchId, newTimeline);
    this.currentTimelineId = branchId;
    this.notifyTimelineSubscribers(newTimeline);
    
    return branchId;
  }

  switchTimeline(timelineId: string): void {
    if (!this.timelines.has(timelineId)) {
      throw new Error(`Timeline ${timelineId} not found`);
    }
    this.currentTimelineId = timelineId;
    this.notifyTimelineSubscribers(this.getCurrentTimeline());
  }

  getCurrentTimeline(): Timeline {
    const timeline = this.timelines.get(this.currentTimelineId);
    if (!timeline) {
      throw new Error('Current timeline not found');
    }
    return timeline;
  }

  getAllTimelines(): Timeline[] {
    return Array.from(this.timelines.values());
  }

  getEvents(aggregateId: string, fromVersion: number = 0): DomainEvent[] {
    const timeline = this.getCurrentTimeline();
    return timeline.events
      .filter(e => e.aggregateId === aggregateId && e.version > fromVersion)
      .sort((a, b) => a.version - b.version);
  }

  getAllEvents(): DomainEvent[] {
    return [...this.getCurrentTimeline().events];
  }

  subscribe(callback: (event: DomainEvent) => void): () => void {
    this.eventSubscribers.push(callback);
    return () => {
      this.eventSubscribers = this.eventSubscribers.filter(sub => sub !== callback);
    };
  }

  subscribeToTimelines(callback: TimelineSubscriber): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifyEventSubscribers(event: DomainEvent): void {
    this.eventSubscribers.forEach(callback => callback(event));
  }

  private notifyTimelineSubscribers(timeline: Timeline): void {
    this.subscribers.forEach(callback => callback(timeline));
  }

  clear(): void {
    this.timelines.clear();
    const mainTimeline: Timeline = {
      id: 'main',
      name: 'Main Timeline',
      events: [],
      createdAt: new Date().toISOString()
    };
    this.timelines.set('main', mainTimeline);
    this.currentTimelineId = 'main';
  }

  getCurrentTimelineId(): string {
    return this.currentTimelineId;
  }
}