<script module lang="ts">
  import { writable } from 'svelte/store';

  export type BadukRoute = 'game' | 'rules' | 'analysis' | 'designer';
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
  import DesignerPage from './DesignerPage.svelte';
  import BadukNavigation from './BadukNavigation.svelte';
  
  let route = $state<BadukRoute>('game');
  
  currentBadukRoute.subscribe(value => {
    route = value;
  });

  // Handle sub-routes from URL hash
  if (typeof window !== 'undefined') {
    const handleBadukRouteChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith('baduk/')) {
        const subRoute = hash.split('/')[1] as BadukRoute;
        if (['game', 'rules', 'analysis', 'designer'].includes(subRoute)) {
          currentBadukRoute.set(subRoute);
        }
      }
    };
    
    handleBadukRouteChange();
    window.addEventListener('hashchange', handleBadukRouteChange);
  }
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
    {:else if route === 'designer'}
      <DesignerPage />
    {:else}
      <GamePage />
    {/if}
  </main>
</div>

<style>
  .baduk-app {
    height: 100vh;
    background: linear-gradient(135deg, #8B4513 0%, #D2B48C 50%, #F5DEB3 100%);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .content {
    flex: 1;
    height: 100%;
    overflow: hidden;
  }
</style>