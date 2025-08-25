import { BadukAggregate, type GameState } from '../aggregates/BadukAggregate';
import type { EventStore } from '$lib/shared/infrastructure/event-store/EventStore';
import type { Stone, Player, BoardSize, Position } from '../events/BadukEvents';

export interface Command {
  type: string;
  aggregateId: string;
  payload: any;
}

export interface StartGameCommand extends Command {
  type: 'StartGame';
  payload: {
    boardSize: BoardSize;
    playerBlack: string;
    playerWhite: string;
    handicap?: number;
    komi?: number;
  };
}

export interface PlaceStoneCommand extends Command {
  type: 'PlaceStone';
  payload: {
    player: Player;
    position: Position;
  };
}

export interface PassCommand extends Command {
  type: 'Pass';
  payload: {
    player: Player;
  };
}

export interface ResignCommand extends Command {
  type: 'Resign';
  payload: {
    player: Player;
  };
}

export type BadukCommand = StartGameCommand | PlaceStoneCommand | PassCommand | ResignCommand;

export class BadukCommandHandler {
  constructor(private eventStore: EventStore) {}

  async handle(command: BadukCommand): Promise<GameState> {
    const aggregate = await this.loadAggregate(command.aggregateId);
    
    switch (command.type) {
      case 'StartGame':
        aggregate.startGame(
          command.payload.boardSize,
          command.payload.playerBlack,
          command.payload.playerWhite,
          command.payload.handicap || 0,
          command.payload.komi || 6.5
        );
        break;
      case 'PlaceStone':
        aggregate.placeStone(command.payload.player, command.payload.position);
        break;
      case 'Pass':
        aggregate.pass(command.payload.player);
        break;
      case 'Resign':
        aggregate.resign(command.payload.player);
        break;
      default:
        throw new Error(`Unknown command type: ${(command as any).type}`);
    }

    const events = aggregate.getUncommittedEvents();
    events.forEach(event => this.eventStore.append(event));
    aggregate.markEventsAsCommitted();

    return aggregate.getState();
  }

  private async loadAggregate(aggregateId: string): Promise<BadukAggregate> {
    const aggregate = new BadukAggregate(aggregateId);
    const events = this.eventStore.getEvents(aggregateId);
    aggregate.loadFromHistory(events);
    return aggregate;
  }
}