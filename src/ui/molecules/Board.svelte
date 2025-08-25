<script lang="ts">
  import Cell from '../atoms/Cell.svelte';
  import type { Board } from '$lib/domain/events/GameEvents';
  
  interface Props {
    board?: Board;
    onCellClick?: (position: number) => void;
  }
  
  let { board = $bindable(), onCellClick }: Props = $props();
</script>

<div class="board">
  {#each board as value, position}
    <Cell {value} {position} onclick={onCellClick} />
  {/each}
</div>

<style>
  .board {
    display: grid;
    grid-template-columns: repeat(3, 100px);
    gap: 0;
    margin: 2rem auto;
    border: 1px solid #333;
    width: fit-content;
  }
</style>