import type { DomainEvent } from '$lib/tictactoe/domain/events/base';

export abstract class AggregateRoot {
  protected id: string;
  protected version: number = 0;
  private uncommittedEvents: DomainEvent[] = [];

  constructor(id: string) {
    this.id = id;
  }

  protected applyEvent(event: DomainEvent): void {
    const handlerName = `on${event.eventType}` as keyof this;
    const handler = this[handlerName];
    
    if (typeof handler === 'function') {
      handler.call(this, event);
    }
    
    this.version = event.version;
  }

  protected raiseEvent(event: DomainEvent): void {
    event.version = this.version + 1;
    this.applyEvent(event);
    this.uncommittedEvents.push(event);
  }

  markEventsAsCommitted(): void {
    this.uncommittedEvents = [];
  }

  getUncommittedEvents(): DomainEvent[] {
    return [...this.uncommittedEvents];
  }

  loadFromHistory(events: DomainEvent[]): void {
    events.forEach(event => this.applyEvent(event));
  }

  getId(): string {
    return this.id;
  }

  getVersion(): number {
    return this.version;
  }
}