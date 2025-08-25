import { AggregateRoot } from './AggregateRoot';
import {
  GameStarted,
  StonePlaced,
  PassPlayed,
  GameEnded,
  PlayerResigned,
  ScoreCalculated,
  type Stone,
  type Player,
  type BoardSize,
  type Position,
  type Board,
  type Territory,
  type CapturedGroup
} from '../events/BadukEvents';

export type GameStatus = 'waiting' | 'playing' | 'scoring' | 'finished';

export interface GameState {
  id: string;
  boardSize: BoardSize;
  board: Board;
  currentPlayer: Player;
  playerBlack: string;
  playerWhite: string;
  handicap: number;
  komi: number;
  status: GameStatus;
  consecutivePasses: number;
  capturedStones: {
    black: number; // stones captured by black
    white: number; // stones captured by white
  };
  koPosition?: Position;
  territories?: Territory[];
  winner?: Player;
  version: number;
}

export class BadukAggregate extends AggregateRoot {
  private boardSize: BoardSize = 19;
  private board: Board = [];
  private currentPlayer: Player = 'black';
  private playerBlack: string = '';
  private playerWhite: string = '';
  private handicap: number = 0;
  private komi: number = 6.5;
  private status: GameStatus = 'waiting';
  private consecutivePasses: number = 0;
  private capturedStones = { black: 0, white: 0 };
  private koPosition?: Position;
  private territories?: Territory[];
  private winner?: Player;

  constructor(id: string) {
    super(id);
  }

  startGame(
    boardSize: BoardSize,
    playerBlack: string,
    playerWhite: string,
    handicap: number = 0,
    komi: number = 6.5
  ): void {
    if (this.status !== 'waiting') {
      throw new Error('Game already started');
    }

    const event = new GameStarted(this.id, boardSize, playerBlack, playerWhite, handicap, komi);
    this.raiseEvent(event);
  }

  placeStone(player: Player, position: Position): void {
    if (this.status !== 'playing') {
      throw new Error('Game is not in progress');
    }

    if (player !== this.currentPlayer) {
      throw new Error('Not your turn');
    }

    if (!this.isValidPosition(position)) {
      throw new Error('Invalid position');
    }

    if (this.board[position.y][position.x] !== null) {
      throw new Error('Position already occupied');
    }

    // Check Ko rule
    if (this.koPosition && this.koPosition.x === position.x && this.koPosition.y === position.y) {
      throw new Error('Ko rule violation - cannot play here');
    }

    // Create new board with the stone placed
    const newBoard = this.board.map(row => [...row]);
    newBoard[position.y][position.x] = player;

    // Check for captures
    const capturedGroups = this.checkCaptures(newBoard, position, player);
    
    // Remove captured stones from board
    capturedGroups.forEach(group => {
      group.stones.forEach(pos => {
        newBoard[pos.y][pos.x] = null;
      });
    });

    // Check for suicide (illegal move)
    if (capturedGroups.length === 0 && !this.hasLiberties(newBoard, position)) {
      throw new Error('Suicide move is not allowed');
    }

    // Determine new Ko position (if any)
    let newKoPosition: Position | undefined;
    if (capturedGroups.length === 1 && capturedGroups[0].stones.length === 1) {
      // Single stone capture might create Ko situation
      const capturedPos = capturedGroups[0].stones[0];
      if (this.wouldCreateKo(newBoard, capturedPos, this.getOpponent(player))) {
        newKoPosition = capturedPos;
      }
    }

    const event = new StonePlaced(
      this.id,
      player,
      position,
      newBoard,
      capturedGroups.length > 0 ? capturedGroups : undefined,
      newKoPosition
    );
    this.raiseEvent(event);
  }

  pass(player: Player): void {
    if (this.status !== 'playing') {
      throw new Error('Game is not in progress');
    }

    if (player !== this.currentPlayer) {
      throw new Error('Not your turn');
    }

    const newConsecutivePasses = this.consecutivePasses + 1;
    const event = new PassPlayed(this.id, player, newConsecutivePasses);
    this.raiseEvent(event);

    // End game if both players pass
    if (newConsecutivePasses >= 2) {
      this.endGameByDoublePass();
    }
  }

  resign(player: Player): void {
    if (this.status !== 'playing') {
      throw new Error('Game is not in progress');
    }

    const winner = this.getOpponent(player);
    const resignEvent = new PlayerResigned(this.id, player, winner);
    this.raiseEvent(resignEvent);

    const endEvent = new GameEnded(this.id, 'resignation', winner);
    this.raiseEvent(endEvent);
  }

  private endGameByDoublePass(): void {
    // Calculate territories and score
    const territories = this.calculateTerritories();
    const { blackScore, whiteScore, winner } = this.calculateScore(territories);

    const scoreEvent = new ScoreCalculated(this.id, territories, blackScore, whiteScore, winner);
    this.raiseEvent(scoreEvent);

    const endEvent = new GameEnded(
      this.id,
      'double_pass',
      winner,
      {
        black: blackScore,
        white: whiteScore
      },
      territories
    );
    this.raiseEvent(endEvent);
  }

  // Event handlers
  private onGameStarted(event: GameStarted): void {
    this.boardSize = event.payload.boardSize;
    this.board = Array(this.boardSize).fill(null).map(() => Array(this.boardSize).fill(null));
    this.playerBlack = event.payload.playerBlack;
    this.playerWhite = event.payload.playerWhite;
    this.handicap = event.payload.handicap;
    this.komi = event.payload.komi;
    this.currentPlayer = event.payload.currentPlayer;
    this.status = 'playing';
    this.consecutivePasses = 0;
    this.capturedStones = { black: 0, white: 0 };
  }

  private onStonePlaced(event: StonePlaced): void {
    this.board = event.payload.board;
    this.currentPlayer = this.getOpponent(event.payload.player);
    this.consecutivePasses = 0; // Reset pass count when stone is placed
    this.koPosition = event.payload.koPosition;

    // Update captured stone counts
    if (event.payload.capturedGroups) {
      event.payload.capturedGroups.forEach(group => {
        if (group.capturedPlayer === 'black') {
          this.capturedStones.white += group.stones.length;
        } else {
          this.capturedStones.black += group.stones.length;
        }
      });
    }
  }

  private onPassPlayed(event: PassPlayed): void {
    this.currentPlayer = this.getOpponent(event.payload.player);
    this.consecutivePasses = event.payload.consecutivePasses;
    this.koPosition = undefined; // Clear Ko position after pass
  }

  private onPlayerResigned(event: PlayerResigned): void {
    this.winner = event.payload.winner;
  }

  private onGameEnded(event: GameEnded): void {
    this.status = 'finished';
    this.winner = event.payload.winner;
    if (event.payload.territories) {
      this.territories = event.payload.territories;
    }
  }

  private onScoreCalculated(event: ScoreCalculated): void {
    this.territories = event.payload.territories;
    this.winner = event.payload.winner;
  }

  // Game logic helper methods
  private isValidPosition(pos: Position): boolean {
    return pos.x >= 0 && pos.x < this.boardSize && pos.y >= 0 && pos.y < this.boardSize;
  }

  private getOpponent(player: Player): Player {
    return player === 'black' ? 'white' : 'black';
  }

  private getNeighbors(pos: Position): Position[] {
    const neighbors: Position[] = [];
    const directions = [
      { x: 0, y: -1 }, // up
      { x: 1, y: 0 },  // right
      { x: 0, y: 1 },  // down
      { x: -1, y: 0 }  // left
    ];

    directions.forEach(dir => {
      const newPos = { x: pos.x + dir.x, y: pos.y + dir.y };
      if (this.isValidPosition(newPos)) {
        neighbors.push(newPos);
      }
    });

    return neighbors;
  }

  private getGroup(board: Board, pos: Position): Position[] {
    const stone = board[pos.y][pos.x];
    if (stone === null) return [];

    const group: Position[] = [];
    const visited = new Set<string>();
    const stack = [pos];

    while (stack.length > 0) {
      const current = stack.pop()!;
      const key = `${current.x},${current.y}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      if (board[current.y][current.x] === stone) {
        group.push(current);
        
        this.getNeighbors(current).forEach(neighbor => {
          const neighborKey = `${neighbor.x},${neighbor.y}`;
          if (!visited.has(neighborKey)) {
            stack.push(neighbor);
          }
        });
      }
    }

    return group;
  }

  private hasLiberties(board: Board, pos: Position): boolean {
    const group = this.getGroup(board, pos);
    
    for (const groupPos of group) {
      const neighbors = this.getNeighbors(groupPos);
      for (const neighbor of neighbors) {
        if (board[neighbor.y][neighbor.x] === null) {
          return true; // Found a liberty
        }
      }
    }
    
    return false; // No liberties found
  }

  private checkCaptures(board: Board, lastMove: Position, player: Player): CapturedGroup[] {
    const opponent = this.getOpponent(player);
    const capturedGroups: CapturedGroup[] = [];
    
    const neighbors = this.getNeighbors(lastMove);
    const checkedGroups = new Set<string>();
    
    for (const neighbor of neighbors) {
      if (board[neighbor.y][neighbor.x] === opponent) {
        const groupKey = this.getGroup(board, neighbor).map(p => `${p.x},${p.y}`).sort().join('|');
        
        if (!checkedGroups.has(groupKey) && !this.hasLiberties(board, neighbor)) {
          const capturedGroup = this.getGroup(board, neighbor);
          capturedGroups.push({
            stones: capturedGroup,
            capturedPlayer: opponent,
            capturedBy: player
          });
          checkedGroups.add(groupKey);
        }
      }
    }
    
    return capturedGroups;
  }

  private wouldCreateKo(board: Board, pos: Position, player: Player): boolean {
    // Simplified Ko detection - in a real implementation, you'd check the full board state
    const neighbors = this.getNeighbors(pos);
    const opponentNeighbors = neighbors.filter(n => board[n.y][n.x] === this.getOpponent(player));
    const emptyNeighbors = neighbors.filter(n => board[n.y][n.x] === null);
    
    // Ko situation: single stone surrounded by opponent stones with one liberty
    return opponentNeighbors.length === neighbors.length - 1 && emptyNeighbors.length === 1;
  }

  private calculateTerritories(): Territory[] {
    // Simplified territory calculation
    const territories: Territory[] = [];
    const visited = new Set<string>();
    
    for (let y = 0; y < this.boardSize; y++) {
      for (let x = 0; x < this.boardSize; x++) {
        const pos = { x, y };
        const key = `${x},${y}`;
        
        if (!visited.has(key) && this.board[y][x] === null) {
          const territory = this.floodFillTerritory(pos, visited);
          if (territory.positions.length > 0) {
            territories.push(territory);
          }
        }
      }
    }
    
    return territories;
  }

  private floodFillTerritory(startPos: Position, visited: Set<string>): Territory {
    const positions: Position[] = [];
    const borderStones = new Set<Stone>();
    const stack = [startPos];
    
    while (stack.length > 0) {
      const pos = stack.pop()!;
      const key = `${pos.x},${pos.y}`;
      
      if (visited.has(key) || !this.isValidPosition(pos)) continue;
      
      const stone = this.board[pos.y][pos.x];
      if (stone !== null) {
        borderStones.add(stone);
        continue;
      }
      
      visited.add(key);
      positions.push(pos);
      
      this.getNeighbors(pos).forEach(neighbor => {
        stack.push(neighbor);
      });
    }
    
    let owner: Stone | 'neutral';
    if (borderStones.size === 1) {
      owner = Array.from(borderStones)[0];
    } else {
      owner = 'neutral';
    }
    
    return {
      positions,
      owner,
      points: owner !== 'neutral' ? positions.length : 0
    };
  }

  private calculateScore(territories: Territory[]) {
    const blackTerritory = territories.filter(t => t.owner === 'black').reduce((sum, t) => sum + t.points, 0);
    const whiteTerritory = territories.filter(t => t.owner === 'white').reduce((sum, t) => sum + t.points, 0);
    
    const blackScore = {
      territory: blackTerritory,
      prisoners: this.capturedStones.black,
      total: blackTerritory + this.capturedStones.black
    };
    
    const whiteScore = {
      territory: whiteTerritory,
      prisoners: this.capturedStones.white,
      komi: this.komi,
      total: whiteTerritory + this.capturedStones.white + this.komi
    };
    
    const winner: Player = blackScore.total > whiteScore.total ? 'black' : 'white';
    
    return { blackScore, whiteScore, winner };
  }

  getState(): GameState {
    return {
      id: this.id,
      boardSize: this.boardSize,
      board: this.board.map(row => [...row]),
      currentPlayer: this.currentPlayer,
      playerBlack: this.playerBlack,
      playerWhite: this.playerWhite,
      handicap: this.handicap,
      komi: this.komi,
      status: this.status,
      consecutivePasses: this.consecutivePasses,
      capturedStones: { ...this.capturedStones },
      koPosition: this.koPosition,
      territories: this.territories,
      winner: this.winner,
      version: this.version
    };
  }
}