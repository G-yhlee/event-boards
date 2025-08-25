<script lang="ts">
  import GameTemplate from '$lib/tictactoe/ui/templates/GameTemplate.svelte';
</script>

<div class="game-page">
  <GameTemplate />
</div>

<style>
  .game-page {
    background: rgba(255, 255, 255, 0.95);
    margin: 2rem;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  
  @media (max-width: 768px) {
    .game-page {
      margin: 1rem;
    }
  }
</style>