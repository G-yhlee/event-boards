<script lang="ts" context="module">
  import { writable } from 'svelte/store';

  export type Route = 'home' | 'tictactoe' | 'baduk';

  export const currentRoute = writable<Route>('home');

  export function navigateTo(route: Route) {
    currentRoute.set(route);
    // Update URL without page reload
    window.history.pushState({}, '', `#${route}`);
  }
</script>

<script lang="ts">

  // Handle browser back/forward
  function handlePopState() {
    const hash = window.location.hash.slice(1) as Route;
    if (['home', 'tictactoe', 'baduk'].includes(hash)) {
      currentRoute.set(hash);
    } else {
      currentRoute.set('home');
    }
  }

  // Initialize route from URL
  if (typeof window !== 'undefined') {
    handlePopState();
    window.addEventListener('popstate', handlePopState);
  }
</script>

<slot />