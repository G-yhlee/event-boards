<script lang="ts">
  import BadukGameTemplate from '$lib/baduk/ui/templates/BadukGameTemplate.svelte';
</script>

<div class="game-page">
  <BadukGameTemplate />
</div>

<style>
  .game-page {
    background: rgba(255, 255, 255, 0.95);
    margin: 2rem;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(139, 69, 19, 0.2);
    overflow: hidden;
  }
  
  @media (max-width: 768px) {
    .game-page {
      margin: 1rem;
    }
  }
</style>