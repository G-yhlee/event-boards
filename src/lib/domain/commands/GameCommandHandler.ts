import { GameAggregate, type GameState } from '../aggregates/GameAggregate';
import type { EventStore } from '$lib/infrastructure/event-store/EventStore';
import type { Player } from '../events/GameEvents';

export interface Command {
  type: string;
  aggregateId: string;
  payload: any;
}

export interface StartGameCommand extends Command {
  type: 'StartGame';
  payload: {
    playerX: Player;
    playerO: Player;
  };
}

export interface MakeMoveCommand extends Command {
  type: 'MakeMove';
  payload: {
    player: Player;
    position: number;
  };
}

export interface ResetGameCommand extends Command {
  type: 'ResetGame';
  payload: {};
}

export type GameCommand = StartGameCommand | MakeMoveCommand | ResetGameCommand;

export class GameCommandHandler {
  constructor(private eventStore: EventStore) {}

  async handle(command: GameCommand): Promise<GameState> {
    const aggregate = await this.loadAggregate(command.aggregateId);
    
    switch (command.type) {
      case 'StartGame':
        aggregate.startGame(command.payload.playerX, command.payload.playerO);
        break;
      case 'MakeMove':
        aggregate.makeMove(command.payload.player, command.payload.position);
        break;
      case 'ResetGame':
        aggregate.reset();
        break;
      default:
        throw new Error(`Unknown command type: ${(command as any).type}`);
    }

    const events = aggregate.getUncommittedEvents();
    events.forEach(event => this.eventStore.append(event));
    aggregate.markEventsAsCommitted();

    return aggregate.getState();
  }

  private async loadAggregate(aggregateId: string): Promise<GameAggregate> {
    const aggregate = new GameAggregate(aggregateId);
    const events = this.eventStore.getEvents(aggregateId);
    aggregate.loadFromHistory(events);
    return aggregate;
  }
}