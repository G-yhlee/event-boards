<script module lang="ts">
  import { writable } from 'svelte/store';

  export type TicTacToeRoute = 'game' | 'rules' | 'history';
  export const currentTicTacToeRoute = writable<TicTacToeRoute>('game');

  export function navigateToTicTacToe(route: TicTacToeRoute) {
    currentTicTacToeRoute.set(route);
    window.history.pushState({}, '', `#tictactoe/${route}`);
  }
</script>

<script lang="ts">
  import GamePage from './GamePage.svelte';
  import RulesPage from './RulesPage.svelte';
  import HistoryPage from './HistoryPage.svelte';
  import TicTacToeNavigation from './TicTacToeNavigation.svelte';
  
  let route = $state<TicTacToeRoute>('game');
  
  currentTicTacToeRoute.subscribe(value => {
    route = value;
  });
</script>

<div class="tictactoe-app">
  <TicTacToeNavigation />
  
  <main class="content">
    {#if route === 'game'}
      <GamePage />
    {:else if route === 'rules'}
      <RulesPage />
    {:else if route === 'history'}
      <HistoryPage />
    {:else}
      <GamePage />
    {/if}
  </main>
</div>

<style>
  .tictactoe-app {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .content {
    min-height: calc(100vh - 80px);
  }
</style>