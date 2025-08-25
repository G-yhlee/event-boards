import { AggregateRoot } from './AggregateRoot';
import { 
  GameStarted, 
  MoveMade, 
  GameWon, 
  GameDrawn, 
  GameReset,
  type Player,
  type Board,
  type WinningLine,
  type GameEvent
} from '../events/GameEvents';

export type GameStatus = 'waiting' | 'playing' | 'finished';

export interface GameState {
  id: string;
  board: Board;
  currentPlayer: Player | null;
  winner: Player | null;
  isDraw: boolean;
  playerX: Player | null;
  playerO: Player | null;
  status: GameStatus;
  version: number;
}

export class GameAggregate extends AggregateRoot {
  private board: Board = Array(9).fill(null);
  private currentPlayer: Player | null = null;
  private winner: Player | null = null;
  private isDraw: boolean = false;
  private playerX: Player | null = null;
  private playerO: Player | null = null;
  private status: GameStatus = 'waiting';

  constructor(id: string) {
    super(id);
  }

  startGame(playerX: Player, playerO: Player): void {
    if (this.status !== 'waiting' && this.status !== 'finished') {
      throw new Error('Game already started');
    }
    
    const event = new GameStarted(this.id, playerX, playerO);
    this.raiseEvent(event);
  }

  makeMove(player: Player, position: number): void {
    if (this.status !== 'playing') {
      throw new Error('Game is not in progress');
    }
    
    if (player !== this.currentPlayer) {
      throw new Error('Not your turn');
    }
    
    if (position < 0 || position > 8) {
      throw new Error('Invalid position');
    }
    
    if (this.board[position] !== null) {
      throw new Error('Position already taken');
    }

    const newBoard = [...this.board] as Board;
    newBoard[position] = player;
    
    const event = new MoveMade(this.id, player, position, newBoard);
    this.raiseEvent(event);

    const winningLine = this.checkWinner(newBoard);
    if (winningLine) {
      const winEvent = new GameWon(this.id, player, winningLine);
      this.raiseEvent(winEvent);
    } else if (this.isBoardFull(newBoard)) {
      const drawEvent = new GameDrawn(this.id);
      this.raiseEvent(drawEvent);
    }
  }

  reset(): void {
    const event = new GameReset(this.id);
    this.raiseEvent(event);
  }

  private onGameStarted(event: GameStarted): void {
    this.board = event.payload.board;
    this.currentPlayer = event.payload.currentPlayer;
    this.playerX = event.payload.playerX;
    this.playerO = event.payload.playerO;
    this.status = 'playing';
    this.winner = null;
    this.isDraw = false;
  }

  private onMoveMade(event: MoveMade): void {
    this.board = event.payload.board;
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  private onGameWon(event: GameWon): void {
    this.winner = event.payload.winner;
    this.status = 'finished';
  }

  private onGameDrawn(event: GameDrawn): void {
    this.isDraw = true;
    this.status = 'finished';
  }

  private onGameReset(event: GameReset): void {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.isDraw = false;
    this.status = 'playing';
  }

  private checkWinner(board: Board): WinningLine | null {
    const lines: WinningLine[] = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return line;
      }
    }
    return null;
  }

  private isBoardFull(board: Board): boolean {
    return board.every(cell => cell !== null);
  }

  getState(): GameState {
    return {
      id: this.id,
      board: [...this.board],
      currentPlayer: this.currentPlayer,
      winner: this.winner,
      isDraw: this.isDraw,
      playerX: this.playerX,
      playerO: this.playerO,
      status: this.status,
      version: this.version
    };
  }
}