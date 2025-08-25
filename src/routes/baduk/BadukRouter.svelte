<script module lang="ts">
  import { writable } from 'svelte/store';

  export type BadukRoute = 'game' | 'rules' | 'analysis';
  export const currentBadukRoute = writable<BadukRoute>('game');

  export function navigateToBaduk(route: BadukRoute) {
    currentBadukRoute.set(route);
    window.history.pushState({}, '', `#baduk/${route}`);
  }
</script>

<script lang="ts">
  import GamePage from './GamePage.svelte';
  import RulesPage from './RulesPage.svelte';
  import AnalysisPage from './AnalysisPage.svelte';
  import BadukNavigation from './BadukNavigation.svelte';
  
  let route = $state<BadukRoute>('game');
  
  currentBadukRoute.subscribe(value => {
    route = value;
  });
</script>

<div class="baduk-app">
  <BadukNavigation />
  
  <main class="content">
    {#if route === 'game'}
      <GamePage />
    {:else if route === 'rules'}
      <RulesPage />
    {:else if route === 'analysis'}
      <AnalysisPage />
    {:else}
      <GamePage />
    {/if}
  </main>
</div>

<style>
  .baduk-app {
    min-height: 100vh;
    background: linear-gradient(135deg, #8B4513 0%, #D2B48C 50%, #F5DEB3 100%);
  }
  
  .content {
    min-height: calc(100vh - 80px);
  }
</style>