<script lang="ts">
  import type { Player } from '$lib/tictactoe/domain/events/GameEvents';
  import type { GameStatus } from '$lib/tictactoe/domain/aggregates/GameAggregate';
  
  interface Props {
    currentPlayer: Player | null;
    winner: Player | null;
    isDraw: boolean;
    status: GameStatus;
  }
  
  let { currentPlayer, winner, isDraw, status }: Props = $props();
  
  let message = $derived(
    status === 'waiting' ? 'Click "Start Game" to begin' :
    winner ? `Player ${winner} wins!` :
    isDraw ? "It's a draw!" :
    status === 'playing' ? `Player ${currentPlayer}'s turn` :
    ''
  );
</script>

<div class="status" class:winner={!!winner} class:draw={isDraw}>
  {message}
</div>

<style>
  .status {
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
    margin: 1rem 0;
    padding: 1rem;
    border-radius: 0.5rem;
    background: #f3f4f6;
  }
  
  .status.winner {
    background: #10b981;
    color: white;
  }
  
  .status.draw {
    background: #f59e0b;
    color: white;
  }
</style>