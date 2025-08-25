import { DomainEvent } from './base';

export type Player = 'X' | 'O';
export type Board = (Player | null)[];
export type WinningLine = number[];

export interface GameStartedPayload {
  playerX: Player;
  playerO: Player;
  board: Board;
  currentPlayer: Player;
}

export interface MoveMadePayload {
  player: Player;
  position: number;
  board: Board;
}

export interface GameWonPayload {
  winner: Player;
  winningLine: WinningLine;
}

export interface GameDrawnPayload {}

export interface GameResetPayload {}

export class GameStarted extends DomainEvent<GameStartedPayload> {
  constructor(gameId: string, playerX: Player, playerO: Player) {
    super(gameId, 'GameStarted', {
      playerX,
      playerO,
      board: Array(9).fill(null),
      currentPlayer: 'X'
    });
  }
}

export class MoveMade extends DomainEvent<MoveMadePayload> {
  constructor(gameId: string, player: Player, position: number, board: Board) {
    super(gameId, 'MoveMade', {
      player,
      position,
      board: [...board]
    });
  }
}

export class GameWon extends DomainEvent<GameWonPayload> {
  constructor(gameId: string, winner: Player, winningLine: WinningLine) {
    super(gameId, 'GameWon', {
      winner,
      winningLine
    });
  }
}

export class GameDrawn extends DomainEvent<GameDrawnPayload> {
  constructor(gameId: string) {
    super(gameId, 'GameDrawn', {});
  }
}

export class GameReset extends DomainEvent<GameResetPayload> {
  constructor(gameId: string) {
    super(gameId, 'GameReset', {});
  }
}

export type GameEvent = GameStarted | MoveMade | GameWon | GameDrawn | GameReset;