<script lang="ts">
  import { Settings, Palette, Play, Square, RotateCcw, Plus, User, Gamepad2, Keyboard, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import ThemeSelector from '../molecules/ThemeSelector.svelte';
  import GameControls from './GameControls.svelte';
  import type { BoardSize, Player } from '$lib/baduk/domain/events/BadukEvents';
  import type { GameStatus } from '$lib/baduk/domain/aggregates/BadukAggregate';
  import { onMount } from 'svelte';
  
  interface Props {
    onStartGame: (config: { boardSize: BoardSize; handicap: number; komi: number }) => Promise<void>;
    onPass: () => Promise<void>;
    onResign: () => Promise<void>;
    onNewGame: () => Promise<void>;
    status: GameStatus;
    currentPlayer: Player;
  }
  
  let { 
    onStartGame, 
    onPass, 
    onResign, 
    onNewGame, 
    status, 
    currentPlayer 
  }: Props = $props();
  
  let isPanelExpanded = $state(true);
  let quickActionMode = $state<'theme' | 'controls' | null>(null);
  
  const togglePanel = () => {
    isPanelExpanded = !isPanelExpanded;
    if (isPanelExpanded) {
      quickActionMode = null;
    }
    updatePanelWidth();
  };
  
  const updatePanelWidth = () => {
    const width = isPanelExpanded ? 300 : 64;
    document.documentElement.style.setProperty('--left-panel-width', `${width}px`);
  };
  
  const handleQuickAction = (mode: 'theme' | 'controls') => {
    if (quickActionMode === mode) {
      quickActionMode = null;
    } else {
      quickActionMode = mode;
    }
  };

  const handleStartGameWithPopupClose = async (config: { boardSize: BoardSize; handicap: number; komi: number }) => {
    await onStartGame(config);
    quickActionMode = null; // Close the popup after starting game
  };
  
  onMount(() => {
    updatePanelWidth();
  });
</script>

<div class="left-panel" class:expanded={isPanelExpanded} class:collapsed={!isPanelExpanded}>
  <div class="panel-header">
    <button class="toggle-btn" onclick={togglePanel}>
      {#if isPanelExpanded}
        <ChevronLeft size={20} />
      {:else}
        <ChevronRight size={20} />
      {/if}
    </button>
    {#if isPanelExpanded}
      <h2>Settings</h2>
    {/if}
  </div>
  
  {#if isPanelExpanded}
    <div class="panel-content">
      <div class="section">
        <div class="section-header">
          <Palette size={18} />
          <h3>Theme</h3>
        </div>
        <ThemeSelector />
      </div>
      
      <div class="section">
        <div class="section-header">
          <Gamepad2 size={18} />
          <h3>Game Controls</h3>
        </div>
        <GameControls
          {onStartGame}
          {onPass}
          {onResign}
          {onNewGame}
          {status}
          {currentPlayer}
        />
      </div>
      
      <div class="section">
        <div class="section-header">
          <User size={18} />
          <h3>Current Turn</h3>
        </div>
        <div class="current-player">
          <div class="player-avatar" class:black={currentPlayer === 'black'} class:white={currentPlayer === 'white'}>
            <div class="stone-icon"></div>
          </div>
          <div class="player-info">
            <span class="player-name">{currentPlayer === 'black' ? 'Black Player' : 'White Player'}</span>
            <span class="turn-indicator">Your turn</span>
          </div>
        </div>
        
        <div class="game-status">
          <div class="status-item">
            <span class="status-label">Status</span>
            <span class="status-value" class:playing={status === 'playing'} class:waiting={status === 'waiting'}>
              {status === 'playing' ? 'In Progress' : 
               status === 'waiting' ? 'Waiting' : 
               status === 'finished' ? 'Finished' : status}
            </span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-header">
          <Keyboard size={18} />
          <h3>Shortcuts</h3>
        </div>
        <div class="shortcuts">
          <div class="shortcut">
            <kbd>Space</kbd>
            <span>Pass</span>
          </div>
          <div class="shortcut">
            <kbd>R</kbd>
            <span>Resign</span>
          </div>
          <div class="shortcut">
            <kbd>N</kbd>
            <span>New Game</span>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <!-- Collapsed state with quick action icons -->
    <div class="collapsed-content">
      <div class="quick-actions">
        <button 
          class="quick-action-btn" 
          class:active={quickActionMode === 'theme'}
          onclick={() => handleQuickAction('theme')}
          title="Theme Settings"
        >
          <Palette size={20} />
        </button>
        
        <button 
          class="quick-action-btn" 
          class:active={quickActionMode === 'controls'}
          onclick={() => handleQuickAction('controls')}
          title="Game Controls"
        >
          <Gamepad2 size={20} />
        </button>
        
        <div class="current-turn-indicator">
          <div class="mini-player-avatar" class:black={currentPlayer === 'black'} class:white={currentPlayer === 'white'}>
            <div class="mini-stone-icon"></div>
          </div>
        </div>
        
        <div class="status-indicator" class:playing={status === 'playing'} class:waiting={status === 'waiting'}>
          <div class="status-dot"></div>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Quick action popups -->
  {#if !isPanelExpanded && quickActionMode}
    <div class="quick-popup" class:show={quickActionMode}>
      {#if quickActionMode === 'theme'}
        <div class="popup-content">
          <h4><Palette size={16} /> Theme</h4>
          <ThemeSelector />
        </div>
      {:else if quickActionMode === 'controls'}
        <div class="popup-content">
          <h4><Gamepad2 size={16} /> Controls</h4>
          <GameControls
            onStartGame={handleStartGameWithPopupClose}
            {onPass}
            {onResign}
            {onNewGame}
            {status}
            {currentPlayer}
          />
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .left-panel {
    background: #ffffff;
    border-right: 1px solid #e1e5e9;
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: var(--header-height, 80px);
    left: 0;
    height: calc(100vh - var(--header-height, 80px));
    z-index: 100;
    overflow: hidden;
  }
  
  .left-panel.expanded {
    width: 300px;
  }
  
  .left-panel.collapsed {
    width: 64px;
  }
  
  .panel-header {
    padding: 20px;
    border-bottom: 1px solid #e1e5e9;
    background: #ffffff;
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 64px;
  }
  
  .toggle-btn {
    background: #ffffff;
    color: #8e8e93;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
  }
  
  .toggle-btn:hover {
    background: #f7f7f8;
    border-color: #d1d1d6;
    color: #1c1c1e;
  }
  
  .panel-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #1c1c1e;
  }
  
  .panel-content {
    flex: 1;
    overflow-y: auto;
  }
  
  .section {
    padding: 20px;
    border-bottom: 1px solid #f2f2f7;
  }
  
  .section:last-child {
    border-bottom: none;
  }
  
  .section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  .section-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #1c1c1e;
  }
  
  .current-player {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #f7f7f8;
    border-radius: 12px;
    margin-bottom: 16px;
  }
  
  .player-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #e1e5e9;
  }
  
  .player-avatar.black {
    background: #1c1c1e;
    border-color: #1c1c1e;
  }
  
  .player-avatar.white {
    background: #ffffff;
    border-color: #e1e5e9;
  }
  
  .stone-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  
  .player-avatar.black .stone-icon {
    background: #ffffff;
  }
  
  .player-avatar.white .stone-icon {
    background: #1c1c1e;
  }
  
  .player-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .player-name {
    font-size: 15px;
    font-weight: 600;
    color: #1c1c1e;
  }
  
  .turn-indicator {
    font-size: 13px;
    color: #8e8e93;
  }
  
  .game-status {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .status-label {
    font-size: 14px;
    color: #8e8e93;
    font-weight: 500;
  }
  
  .status-value {
    font-size: 14px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 6px;
  }
  
  .status-value.playing {
    background: #d1f2eb;
    color: #00c896;
  }
  
  .status-value.waiting {
    background: #fff3cd;
    color: #f39c12;
  }
  
  .shortcuts {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .shortcut {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
  }
  
  .shortcut kbd {
    background: #f7f7f8;
    border: 1px solid #e1e5e9;
    border-radius: 6px;
    padding: 4px 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #1c1c1e;
    min-width: 28px;
    text-align: center;
  }
  
  .shortcut span {
    font-size: 14px;
    color: #1c1c1e;
  }
  
  /* Collapsed state styles */
  .collapsed-content {
    flex: 1;
    padding: 16px 8px;
  }
  
  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
  
  .quick-action-btn {
    width: 44px;
    height: 44px;
    background: #f7f7f8;
    border: 1px solid #e1e5e9;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8e8e93;
    transition: all 0.2s ease;
  }
  
  .quick-action-btn:hover {
    background: #e8e8ed;
    color: #1c1c1e;
    transform: scale(1.05);
  }
  
  .quick-action-btn.active {
    background: #007aff;
    color: white;
    border-color: #007aff;
  }
  
  .current-turn-indicator {
    margin: 8px 0;
  }
  
  .mini-player-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #e1e5e9;
  }
  
  .mini-player-avatar.black {
    background: #1c1c1e;
    border-color: #1c1c1e;
  }
  
  .mini-player-avatar.white {
    background: #ffffff;
    border-color: #e1e5e9;
  }
  
  .mini-stone-icon {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  
  .mini-player-avatar.black .mini-stone-icon {
    background: #ffffff;
  }
  
  .mini-player-avatar.white .mini-stone-icon {
    background: #1c1c1e;
  }
  
  .status-indicator {
    display: flex;
    justify-content: center;
  }
  
  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #8e8e93;
    animation: pulse 2s infinite;
  }
  
  .status-indicator.playing .status-dot {
    background: #34c759;
  }
  
  .status-indicator.waiting .status-dot {
    background: #ff9500;
  }
  
  /* Quick popup styles */
  .quick-popup {
    position: fixed;
    left: 76px;
    top: calc(var(--header-height, 80px) + 20px);
    background: linear-gradient(135deg, #ffffff 0%, #fefefe 100%);
    border: 1px solid rgba(139, 69, 19, 0.15);
    border-radius: 16px;
    box-shadow: 
      0 20px 40px rgba(139, 69, 19, 0.08),
      0 8px 16px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    z-index: 150;
    min-width: 400px;
    width: auto;
    max-width: 500px;
    max-height: calc(100vh - var(--header-height, 80px) - 80px);
    overflow: visible;
    opacity: 0;
    transform: translateX(-10px) translateY(-10px);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: none;
    backdrop-filter: blur(10px);
  }
  
  .quick-popup.show {
    opacity: 1;
    transform: translateX(0) translateY(0);
    pointer-events: all;
  }
  
  .popup-content {
    padding: 24px;
    background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
    border-radius: 16px;
    position: relative;
    overflow-y: auto;
    max-height: calc(100vh - var(--header-height, 80px) - 120px);
    min-width: 350px;
    min-height: fit-content;
  }
  
  .popup-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139, 69, 19, 0.2), transparent);
  }
  
  .popup-content h4 {
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 700;
    background: linear-gradient(135deg, #8B4513, #D2B48C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid rgba(139, 69, 19, 0.1);
    padding-bottom: 12px;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  
  @media (max-width: 768px) {
    .left-panel.expanded {
      width: 280px;
    }
    
    .left-panel.collapsed {
      width: 56px;
    }
    
    .panel-header {
      padding: 16px;
    }
    
    .section {
      padding: 16px;
    }
    
    .quick-popup {
      left: 68px;
      min-width: 320px;
      max-width: calc(100vw - 80px);
      top: calc(var(--header-height, 80px) + 10px);
      max-height: calc(100vh - var(--header-height, 80px) - 60px);
    }
    
    .popup-content {
      min-width: 300px;
      padding: 20px;
      max-height: calc(100vh - var(--header-height, 80px) - 100px);
    }
    
    .quick-action-btn {
      width: 40px;
      height: 40px;
    }
  }
</style>