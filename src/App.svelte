<script lang="ts">
  import Router, { currentRoute } from '$lib/shared/ui/atoms/Router.svelte';
  import Home from './routes/Home.svelte';
  import TicTacToeRouter from './routes/tictactoe/TicTacToeRouter.svelte';
  import BadukRouter from './routes/baduk/BadukRouter.svelte';
  
  let route = $state('home');
  
  currentRoute.subscribe(value => {
    route = value;
  });
  
  // Handle sub-routes from URL
  if (typeof window !== 'undefined') {
    const handleRouteChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith('tictactoe')) {
        currentRoute.set('tictactoe');
      } else if (hash.startsWith('baduk')) {
        currentRoute.set('baduk');
      } else if (hash === 'home' || hash === '') {
        currentRoute.set('home');
      }
    };
    
    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
  }
</script>

<Router>
  <div class="app">
    <main class="main-content">
      {#if route === 'home'}
        <Home />
      {:else if route === 'tictactoe'}
        <TicTacToeRouter />
      {:else if route === 'baduk'}
        <BadukRouter />
      {:else}
        <Home />
      {/if}
    </main>
  </div>
</Router>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f5f5;
    line-height: 1.5;
  }
  
  :global(*) {
    box-sizing: border-box;
  }
  
  .app {
    min-height: 100vh;
  }
  
  .main-content {
    min-height: 100vh;
  }
</style>