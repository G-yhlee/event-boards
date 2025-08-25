<script lang="ts">
  import { currentBadukRoute, navigateToBaduk } from './BadukRouter.svelte';
  import { navigateTo } from '$lib/shared/ui/atoms/Router.svelte';
  
  let route = $state('game');
  
  currentBadukRoute.subscribe(value => {
    route = value;
  });
</script>

<nav class="baduk-nav">
  <div class="nav-content">
    <button class="logo" onclick={() => navigateTo('home')}>
      🎲 Event Games
    </button>
    
    <div class="game-title">
      <h1>⚫⚪ Baduk (Go)</h1>
    </div>
    
    <div class="nav-links">
      <button 
        class="nav-link"
        class:active={route === 'game'}
        onclick={() => navigateToBaduk('game')}
      >
        🎮 Play
      </button>
      
      <button 
        class="nav-link"
        class:active={route === 'rules'}
        onclick={() => navigateToBaduk('rules')}
      >
        📋 Rules
      </button>
      
      <button 
        class="nav-link"
        class:active={route === 'analysis'}
        onclick={() => navigateToBaduk('analysis')}
      >
        📊 Analysis
      </button>
    </div>
  </div>
</nav>

<style>
  .baduk-nav {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(139, 69, 19, 0.2);
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 200;
    box-shadow: 0 2px 10px rgba(139, 69, 19, 0.1);
  }
  
  .nav-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    font-size: 1.25rem;
    font-weight: bold;
    background: none;
    border: none;
    cursor: pointer;
    color: #1f2937;
    transition: color 0.2s;
  }
  
  .logo:hover {
    color: #8B4513;
  }
  
  .game-title h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #8B4513, #D2B48C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .nav-links {
    display: flex;
    gap: 1rem;
  }
  
  .nav-link {
    background: none;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    transition: all 0.2s;
  }
  
  .nav-link:hover {
    color: #8B4513;
    background: rgba(139, 69, 19, 0.1);
  }
  
  .nav-link.active {
    color: #8B4513;
    background: rgba(139, 69, 19, 0.15);
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    .nav-content {
      flex-direction: column;
      gap: 1rem;
      padding: 0 1rem;
    }
    
    .game-title h1 {
      font-size: 1.25rem;
    }
    
    .nav-links {
      gap: 0.5rem;
    }
    
    .nav-link {
      font-size: 0.75rem;
      padding: 0.375rem 0.75rem;
    }
  }
</style>