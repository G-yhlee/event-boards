export interface EventMetadata {
  userId?: string;
  correlationId?: string;
  [key: string]: any;
}

export class DomainEvent<T = any> {
  public readonly id: string;
  public readonly aggregateId: string;
  public readonly eventType: string;
  public readonly payload: T;
  public readonly metadata: EventMetadata;
  public readonly occurredAt: string;
  public version: number;

  constructor(
    aggregateId: string,
    eventType: string,
    payload: T,
    metadata: EventMetadata = {}
  ) {
    this.id = crypto.randomUUID();
    this.aggregateId = aggregateId;
    this.eventType = eventType;
    this.payload = payload;
    this.metadata = metadata;
    this.occurredAt = new Date().toISOString();
    this.version = 1;
  }
}