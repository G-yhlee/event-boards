<script lang="ts">
  import type { Snippet } from 'svelte';
  
  interface Props {
    onclick?: () => void;
    variant?: 'primary' | 'secondary';
    children: Snippet;
  }
  
  let { onclick, variant = 'primary', children }: Props = $props();
</script>

<button
  class="button"
  class:primary={variant === 'primary'}
  class:secondary={variant === 'secondary'}
  {onclick}
>
  {@render children()}
</button>

<style>
  .button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .button.primary {
    background: #2563eb;
    color: white;
  }
  
  .button.primary:hover {
    background: #1d4ed8;
  }
  
  .button.secondary {
    background: #6b7280;
    color: white;
  }
  
  .button.secondary:hover {
    background: #4b5563;
  }
</style>