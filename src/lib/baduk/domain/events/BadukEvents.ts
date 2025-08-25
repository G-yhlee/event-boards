import { DomainEvent } from './base';

export type Stone = 'black' | 'white';
export type Player = Stone;
export type BoardSize = 9 | 13 | 19;

// Position on the board (0-based indexing)
export interface Position {
  x: number;
  y: number;
}

// Board representation: null = empty, 'black' | 'white' = stone
export type Board = (Stone | null)[][];

// Territory information for scoring
export interface Territory {
  positions: Position[];
  owner: Stone | 'neutral';
  points: number;
}

// Captured stone group
export interface CapturedGroup {
  stones: Position[];
  capturedPlayer: Stone;
  capturedBy: Stone;
}

export interface GameStartedPayload {
  boardSize: BoardSize;
  playerBlack: string;
  playerWhite: string;
  handicap: number;
  komi: number; // Compensation points for white
  currentPlayer: Player;
}

export interface StonePlacedPayload {
  player: Player;
  position: Position;
  board: Board;
  capturedGroups?: CapturedGroup[];
  koPosition?: Position; // Position that cannot be played due to Ko rule
}

export interface PassPlayedPayload {
  player: Player;
  consecutivePasses: number;
}

export interface GameEndedPayload {
  reason: 'double_pass' | 'resignation' | 'timeout';
  winner?: Player;
  finalScore?: {
    black: {
      territory: number;
      prisoners: number;
      total: number;
    };
    white: {
      territory: number;
      prisoners: number;
      komi: number;
      total: number;
    };
  };
  territories?: Territory[];
}

export interface ResignationPayload {
  resigningPlayer: Player;
  winner: Player;
}

export interface ScoreCalculatedPayload {
  territories: Territory[];
  blackScore: {
    territory: number;
    prisoners: number;
    total: number;
  };
  whiteScore: {
    territory: number;
    prisoners: number;
    komi: number;
    total: number;
  };
  winner: Player;
}

export class GameStarted extends DomainEvent<GameStartedPayload> {
  constructor(
    gameId: string,
    boardSize: BoardSize,
    playerBlack: string,
    playerWhite: string,
    handicap: number = 0,
    komi: number = 6.5
  ) {
    super(gameId, 'GameStarted', {
      boardSize,
      playerBlack,
      playerWhite,
      handicap,
      komi,
      currentPlayer: handicap > 0 ? 'white' : 'black' // White plays first with handicap
    });
  }
}

export class StonePlaced extends DomainEvent<StonePlacedPayload> {
  constructor(
    gameId: string,
    player: Player,
    position: Position,
    board: Board,
    capturedGroups?: CapturedGroup[],
    koPosition?: Position
  ) {
    super(gameId, 'StonePlaced', {
      player,
      position,
      board: board.map(row => [...row]), // Deep copy
      capturedGroups,
      koPosition
    });
  }
}

export class PassPlayed extends DomainEvent<PassPlayedPayload> {
  constructor(gameId: string, player: Player, consecutivePasses: number) {
    super(gameId, 'PassPlayed', {
      player,
      consecutivePasses
    });
  }
}

export class GameEnded extends DomainEvent<GameEndedPayload> {
  constructor(
    gameId: string,
    reason: 'double_pass' | 'resignation' | 'timeout',
    winner?: Player,
    finalScore?: GameEndedPayload['finalScore'],
    territories?: Territory[]
  ) {
    super(gameId, 'GameEnded', {
      reason,
      winner,
      finalScore,
      territories
    });
  }
}

export class PlayerResigned extends DomainEvent<ResignationPayload> {
  constructor(gameId: string, resigningPlayer: Player, winner: Player) {
    super(gameId, 'PlayerResigned', {
      resigningPlayer,
      winner
    });
  }
}

export class ScoreCalculated extends DomainEvent<ScoreCalculatedPayload> {
  constructor(
    gameId: string,
    territories: Territory[],
    blackScore: ScoreCalculatedPayload['blackScore'],
    whiteScore: ScoreCalculatedPayload['whiteScore'],
    winner: Player
  ) {
    super(gameId, 'ScoreCalculated', {
      territories,
      blackScore,
      whiteScore,
      winner
    });
  }
}

export type BadukEvent = 
  | GameStarted 
  | StonePlaced 
  | PassPlayed 
  | GameEnded 
  | PlayerResigned 
  | ScoreCalculated;