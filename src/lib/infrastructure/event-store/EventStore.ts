import type { DomainEvent } from '$lib/domain/events/base';

export interface Snapshot<T = any> {
  aggregateId: string;
  data: T;
  version: number;
  savedAt: string;
}

export type EventSubscriber = (event: DomainEvent) => void;
export type Unsubscribe = () => void;

export class EventStore {
  private events: DomainEvent[] = [];
  private snapshots: Map<string, Snapshot> = new Map();
  private projections: Map<string, any> = new Map();
  private subscribers: EventSubscriber[] = [];

  append(event: DomainEvent): DomainEvent {
    this.events.push(event);
    this.notifySubscribers(event);
    return event;
  }

  getEvents(aggregateId: string, fromVersion: number = 0): DomainEvent[] {
    return this.events
      .filter(e => e.aggregateId === aggregateId && e.version > fromVersion)
      .sort((a, b) => a.version - b.version);
  }

  getAllEvents(): DomainEvent[] {
    return [...this.events];
  }

  subscribe(callback: EventSubscriber): Unsubscribe {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers(event: DomainEvent): void {
    this.subscribers.forEach(callback => callback(event));
  }

  saveSnapshot<T>(aggregateId: string, snapshot: Omit<Snapshot<T>, 'savedAt'>): void {
    this.snapshots.set(aggregateId, {
      ...snapshot,
      savedAt: new Date().toISOString()
    });
  }

  getSnapshot<T>(aggregateId: string): Snapshot<T> | undefined {
    return this.snapshots.get(aggregateId) as Snapshot<T> | undefined;
  }

  replay(fromEventIndex: number = 0): DomainEvent[] {
    return this.events.slice(fromEventIndex);
  }

  clear(): void {
    this.events = [];
    this.snapshots.clear();
    this.projections.clear();
  }
}