<script lang="ts">
  import type { Player } from '$lib/domain/events/GameEvents';
  
  interface Props {
    value?: Player | null;
    position: number;
    onclick?: (position: number) => void;
  }
  
  let { value = $bindable(), position, onclick }: Props = $props();
  
  const handleClick = () => {
    if (!value && onclick) {
      onclick(position);
    }
  };
</script>

<button
  class="cell"
  class:x={value === 'X'}
  class:o={value === 'O'}
  onclick={handleClick}
  disabled={!!value}
>
  {value || ''}
</button>

<style>
  .cell {
    width: 100px;
    height: 100px;
    font-size: 2rem;
    font-weight: bold;
    border: 1px solid #333;
    background: #fff;
    cursor: pointer;
    transition: all 0.2s;
    margin: -1px 0 0 -1px;
  }
  
  .cell:hover:not(:disabled) {
    background: #f0f0f0;
  }
  
  .cell:disabled {
    cursor: not-allowed;
  }
  
  .cell.x {
    color: #2563eb;
  }
  
  .cell.o {
    color: #dc2626;
  }
</style>