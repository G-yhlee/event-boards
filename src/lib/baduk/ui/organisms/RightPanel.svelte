<script lang="ts">
  import { BarChart3, GitBranch, History, ChevronLeft, ChevronRight, Circle, Square, Target, Clock, TrendingUp } from 'lucide-svelte';
  import GameStatus from '../molecules/GameStatus.svelte';
  import EventList from '../molecules/EventList.svelte';
  import TimelineSelector from '$lib/tictactoe/ui/organisms/TimelineSelector.svelte';
  import TimeTravel from '$lib/tictactoe/ui/organisms/TimeTravel.svelte';
  import type { DomainEvent } from '$lib/baduk/domain/events/base';
  import type { Timeline } from '$lib/shared/infrastructure/event-store/BranchingEventStore';
  import type { Player } from '$lib/baduk/domain/events/BadukEvents';
  
  interface Props {
    currentPlayer: Player;
    status: string;
    winner?: Player;
    consecutivePasses: number;
    capturedStones: { black: number; white: number };
    komi: number;
    boardSize: number;
    events: DomainEvent[];
    currentEventIndex: number;
    onEventClick: (eventIndex: number) => Promise<void>;
    branches: { index: number; count: number }[];
    currentBranchPoint?: number;
    timelines: Timeline[];
    currentTimelineId: string;
    onSelectTimeline: (timelineId: string) => void;
    onReplayToEvent: (eventIndex: number) => Promise<void>;
    isReplaying: boolean;
  }
  
  let { 
    currentPlayer,
    status,
    winner,
    consecutivePasses,
    capturedStones,
    komi,
    boardSize,
    events,
    currentEventIndex,
    onEventClick,
    branches,
    currentBranchPoint,
    timelines,
    currentTimelineId,
    onSelectTimeline,
    onReplayToEvent,
    isReplaying
  }: Props = $props();
  
  let isPanelExpanded = $state(true);
  let activeTab = $state<'status' | 'timeline' | 'history'>('status');
  let quickActionMode = $state<'status' | 'history' | null>(null);
  
  const togglePanel = () => {
    isPanelExpanded = !isPanelExpanded;
    if (isPanelExpanded) {
      quickActionMode = null;
    }
  };
  
  const setActiveTab = (tab: 'status' | 'timeline' | 'history') => {
    activeTab = tab;
  };
  
  const handleQuickAction = (mode: 'status' | 'history') => {
    if (quickActionMode === mode) {
      quickActionMode = null;
    } else {
      quickActionMode = mode;
    }
  };
</script>

<div class="right-panel" class:expanded={isPanelExpanded} class:collapsed={!isPanelExpanded}>
  <div class="panel-header">
    {#if isPanelExpanded}
      <div class="tabs">
        <button 
          class="tab" 
          class:active={activeTab === 'status'}
          onclick={() => setActiveTab('status')}
        >
          <BarChart3 size={16} />
          <span>Stats</span>
        </button>
        <button 
          class="tab" 
          class:active={activeTab === 'timeline'}
          onclick={() => setActiveTab('timeline')}
        >
          <GitBranch size={16} />
          <span>Timeline</span>
        </button>
        <button 
          class="tab" 
          class:active={activeTab === 'history'}
          onclick={() => setActiveTab('history')}
        >
          <History size={16} />
          <span>History</span>
        </button>
      </div>
    {/if}
    <button class="toggle-btn" onclick={togglePanel}>
      {#if isPanelExpanded}
        <ChevronRight size={20} />
      {:else}
        <ChevronLeft size={20} />
      {/if}
    </button>
  </div>
  
  {#if isPanelExpanded}
    <div class="panel-content">
      {#if activeTab === 'status'}
        <div class="tab-content">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <Target size={20} />
              </div>
              <div class="stat-info">
                <span class="stat-value">{events.length}</span>
                <span class="stat-label">Total Moves</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">
                <Clock size={20} />
              </div>
              <div class="stat-info">
                <span class="stat-value">{currentEventIndex + 1}</span>
                <span class="stat-label">Current Move</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">
                <GitBranch size={20} />
              </div>
              <div class="stat-info">
                <span class="stat-value">{timelines.length}</span>
                <span class="stat-label">Timelines</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">
                <TrendingUp size={20} />
              </div>
              <div class="stat-info">
                <span class="stat-value">{branches.length}</span>
                <span class="stat-label">Branches</span>
              </div>
            </div>
          </div>
          
          <div class="game-state-card">
            <GameStatus
              {currentPlayer}
              {status}
              {winner}
              {consecutivePasses}
              {capturedStones}
              {komi}
              {boardSize}
            />
          </div>
          
          <div class="captures-card">
            <h4>Captured Stones</h4>
            <div class="captures-grid">
              <div class="capture-item">
                <div class="stone-preview black"></div>
                <span class="capture-count">{capturedStones.black}</span>
              </div>
              <div class="capture-item">
                <div class="stone-preview white"></div>
                <span class="capture-count">{capturedStones.white}</span>
              </div>
            </div>
          </div>
        </div>
      {:else if activeTab === 'timeline'}
        <div class="tab-content">
          <div class="timeline-section">
            <h4>Timeline Management</h4>
            <TimelineSelector
              {timelines}
              {currentTimelineId}
              {onSelectTimeline}
            />
          </div>
          
          <div class="time-travel-section">
            <h4>Time Travel</h4>
            <TimeTravel 
              {events}
              bind:currentEventIndex
              {onReplayToEvent}
              {isReplaying}
            />
          </div>
        </div>
      {:else if activeTab === 'history'}
        <div class="tab-content">
          <div class="history-section">
            <h4>Game History</h4>
            <EventList 
              {events}
              {currentEventIndex}
              onEventClick={onEventClick}
              {branches}
              {currentBranchPoint}
            />
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <!-- Collapsed state with quick info -->
    <div class="collapsed-content">
      <div class="quick-info">
        <button 
          class="quick-info-btn" 
          class:active={quickActionMode === 'status'}
          onclick={() => handleQuickAction('status')}
          title="Game Stats"
        >
          <BarChart3 size={20} />
          <div class="quick-stat">{events.length}</div>
        </button>
        
        <button 
          class="quick-info-btn" 
          class:active={quickActionMode === 'history'}
          onclick={() => handleQuickAction('history')}
          title="Move History"
        >
          <History size={20} />
          <div class="quick-stat">{currentEventIndex + 1}</div>
        </button>
        
        <div class="quick-captures">
          <div class="mini-capture-item">
            <div class="mini-stone black"></div>
            <span class="mini-count">{capturedStones.black}</span>
          </div>
          <div class="mini-capture-item">
            <div class="mini-stone white"></div>
            <span class="mini-count">{capturedStones.white}</span>
          </div>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Quick action popups -->
  {#if !isPanelExpanded && quickActionMode}
    <div class="right-quick-popup" class:show={quickActionMode}>
      {#if quickActionMode === 'status'}
        <div class="popup-content">
          <h4><BarChart3 size={16} /> Game Stats</h4>
          <div class="mini-stats">
            <div class="mini-stat">
              <Target size={16} />
              <span>{events.length} Moves</span>
            </div>
            <div class="mini-stat">
              <Clock size={16} />
              <span>Move {currentEventIndex + 1}</span>
            </div>
            <div class="mini-stat">
              <GitBranch size={16} />
              <span>{timelines.length} Timelines</span>
            </div>
          </div>
          <div class="mini-captures-display">
            <h5>Captured</h5>
            <div class="mini-captures-grid">
              <div class="mini-capture">
                <div class="stone-preview black"></div>
                <span>{capturedStones.black}</span>
              </div>
              <div class="mini-capture">
                <div class="stone-preview white"></div>
                <span>{capturedStones.white}</span>
              </div>
            </div>
          </div>
        </div>
      {:else if quickActionMode === 'history'}
        <div class="popup-content">
          <h4><History size={16} /> Recent Moves</h4>
          <div class="mini-history">
            {#each events.slice(-5).reverse() as event, index}
              {@const realIndex = events.length - index - 1}
              <button 
                class="mini-event" 
                class:current={realIndex === currentEventIndex}
                onclick={() => onEventClick(realIndex)}
              >
                <span class="mini-event-number">{realIndex + 1}</span>
                <span class="mini-event-desc">
                  {#if event.eventType === 'StonePlaced'}
                    {@const player = (event.payload as any).player}
                    {@const pos = (event.payload as any).position}
                    {player === 'black' ? '⚫' : '⚪'} ({pos.x + 1}, {pos.y + 1})
                  {:else}
                    {event.eventType}
                  {/if}
                </span>
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .right-panel {
    background: #ffffff;
    border-left: 1px solid #e1e5e9;
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: var(--header-height, 80px);
    right: 0;
    height: calc(100vh - var(--header-height, 80px));
    z-index: 100;
    overflow: hidden;
  }
  
  .right-panel.expanded {
    width: 360px;
  }
  
  .right-panel.collapsed {
    width: 64px;
  }
  
  .panel-header {
    padding: 20px;
    border-bottom: 1px solid #e1e5e9;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 64px;
  }
  
  .tabs {
    display: flex;
    gap: 4px;
    flex: 1;
    background: #f7f7f8;
    padding: 4px;
    border-radius: 10px;
  }
  
  .tab {
    background: transparent;
    border: none;
    border-radius: 8px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: #8e8e93;
    transition: all 0.2s ease;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  
  .tab:hover {
    background: rgba(0, 0, 0, 0.04);
    color: #1c1c1e;
  }
  
  .tab.active {
    background: #ffffff;
    color: #1c1c1e;
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
    margin-left: 12px;
  }
  
  .toggle-btn:hover {
    background: #f7f7f8;
    border-color: #d1d1d6;
    color: #1c1c1e;
  }
  
  .panel-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }
  
  .tab-content h4 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1c1c1e;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 24px;
  }
  
  .stat-card {
    background: #f7f7f8;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .stat-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8e8e93;
  }
  
  .stat-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .stat-value {
    font-size: 18px;
    font-weight: 700;
    color: #1c1c1e;
  }
  
  .stat-label {
    font-size: 12px;
    color: #8e8e93;
    font-weight: 500;
  }
  
  .game-state-card {
    background: #f7f7f8;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
  }
  
  .captures-card {
    background: #f7f7f8;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
  }
  
  .captures-grid {
    display: flex;
    gap: 16px;
  }
  
  .capture-item {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    background: #ffffff;
    padding: 12px;
    border-radius: 8px;
  }
  
  .stone-preview {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  
  .stone-preview.black {
    background: #1c1c1e;
  }
  
  .stone-preview.white {
    background: #ffffff;
    border: 2px solid #e1e5e9;
  }
  
  .capture-count {
    font-size: 16px;
    font-weight: 600;
    color: #1c1c1e;
  }
  
  .timeline-section,
  .time-travel-section,
  .history-section {
    background: #f7f7f8;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
  }
  
  /* Right panel collapsed styles */
  .collapsed-content {
    flex: 1;
    padding: 16px 8px;
  }
  
  .quick-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
  
  .quick-info-btn {
    width: 44px;
    height: 44px;
    background: #f7f7f8;
    border: 1px solid #e1e5e9;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #8e8e93;
    transition: all 0.2s ease;
    position: relative;
  }
  
  .quick-info-btn:hover {
    background: #e8e8ed;
    color: #1c1c1e;
    transform: scale(1.05);
  }
  
  .quick-info-btn.active {
    background: #007aff;
    color: white;
    border-color: #007aff;
  }
  
  .quick-stat {
    position: absolute;
    bottom: 2px;
    right: 2px;
    background: #ff3b30;
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 4px;
    border-radius: 6px;
    min-width: 16px;
    text-align: center;
  }
  
  /* Enhanced Captures Display */
  .captures-summary {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 12px 8px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid rgba(139, 69, 19, 0.1);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(139, 69, 19, 0.05);
    width: 100%;
    max-width: 48px;
  }
  
  .captures-title {
    font-size: 9px;
    font-weight: 600;
    color: #8B4513;
    text-align: center;
    opacity: 0.8;
  }
  
  .captures-display {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
  
  .capture-item-enhanced {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .enhanced-stone {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    transition: all 0.2s ease;
  }
  
  .enhanced-stone.black {
    background: radial-gradient(circle at 30% 30%, #4a4a4a 0%, #2a2a2a 40%, #0a0a0a 85%);
    border: 1px solid #1a1a1a;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .enhanced-stone.white {
    background: radial-gradient(circle at 30% 30%, #ffffff 0%, #f5f5dc 40%, #e6e6e6 85%);
    border: 1px solid #d4b896;
    box-shadow: 0 2px 4px rgba(139, 69, 19, 0.2);
  }
  
  .capture-number {
    font-size: 12px;
    font-weight: 700;
    color: #2c3e50;
    min-width: 16px;
    text-align: center;
  }
  
  /* Game Progress Display */
  .game-progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px 8px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid rgba(139, 69, 19, 0.1);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(139, 69, 19, 0.05);
    width: 100%;
    max-width: 48px;
  }
  
  .progress-title {
    font-size: 9px;
    font-weight: 600;
    color: #8B4513;
    text-align: center;
    opacity: 0.8;
  }
  
  .progress-indicator {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    width: 100%;
  }
  
  .progress-bar {
    width: 30px;
    height: 4px;
    background: rgba(139, 69, 19, 0.1);
    border-radius: 2px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #8B4513 0%, #D2B48C 100%);
    border-radius: 2px;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    font-size: 8px;
    font-weight: 700;
    color: #2c3e50;
    text-align: center;
  }
  
  .quick-captures {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
  }
  
  .mini-capture-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .mini-stone {
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }
  
  .mini-stone.black {
    background: #1c1c1e;
  }
  
  .mini-stone.white {
    background: #ffffff;
    border: 2px solid #e1e5e9;
  }
  
  .mini-count {
    font-size: 12px;
    font-weight: 600;
    color: #1c1c1e;
    min-width: 12px;
    text-align: center;
  }
  
  /* Right popup styles */
  .right-quick-popup {
    position: fixed;
    right: 76px;
    top: var(--header-height, 80px);
    background: linear-gradient(135deg, #ffffff 0%, #fefefe 100%);
    border: 1px solid rgba(139, 69, 19, 0.15);
    border-radius: 16px;
    box-shadow: 
      0 20px 40px rgba(139, 69, 19, 0.08),
      0 8px 16px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    z-index: 150;
    min-width: 320px;
    max-height: calc(100vh - var(--header-height, 80px) - 40px);
    overflow: hidden;
    opacity: 0;
    transform: translateX(10px) translateY(-10px);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: none;
    backdrop-filter: blur(10px);
  }
  
  .right-quick-popup.show {
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
    max-height: calc(100vh - var(--header-height, 80px) - 80px);
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
  
  .mini-stats {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .mini-stat {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 18px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid rgba(139, 69, 19, 0.08);
    border-radius: 12px;
    font-size: 15px;
    color: #2c3e50;
    font-weight: 500;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  
  .mini-stat::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: linear-gradient(135deg, #8B4513, #D2B48C);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .mini-stat:hover::before {
    opacity: 1;
  }
  
  .mini-stat:hover {
    transform: translateX(2px);
    box-shadow: 0 4px 12px rgba(139, 69, 19, 0.15);
  }
  
  .mini-captures-display h5 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    text-align: center;
    position: relative;
  }
  
  .mini-captures-display h5::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 2px;
    background: linear-gradient(135deg, #8B4513, #D2B48C);
    border-radius: 1px;
  }
  
  .mini-captures-grid {
    display: flex;
    gap: 16px;
    justify-content: center;
  }
  
  .mini-capture {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 20px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid rgba(139, 69, 19, 0.1);
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    color: #2c3e50;
    min-width: 80px;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  
  .mini-capture::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #8B4513, #D2B48C);
  }
  
  .mini-capture:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 69, 19, 0.15);
  }
  
  .mini-history {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 240px;
    overflow-y: auto;
    padding-right: 8px;
  }
  
  .mini-event {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid rgba(139, 69, 19, 0.06);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  
  .mini-event::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(135deg, #8B4513, #D2B48C);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .mini-event:hover {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(139, 69, 19, 0.1);
  }
  
  .mini-event:hover::before {
    opacity: 1;
  }
  
  .mini-event.current {
    background: linear-gradient(135deg, #e8f4fd 0%, #d1ecf1 100%);
    border-color: rgba(0, 122, 255, 0.3);
    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.15);
  }
  
  .mini-event.current::before {
    opacity: 1;
    background: linear-gradient(135deg, #007aff, #5ac8fa);
  }
  
  .mini-event-number {
    font-weight: 700;
    color: #8e8e93;
    min-width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    background: linear-gradient(135deg, #ffffff 0%, #f1f3f4 100%);
    border: 1px solid rgba(139, 69, 19, 0.1);
    border-radius: 8px;
    transition: all 0.2s ease;
  }
  
  .mini-event.current .mini-event-number {
    background: linear-gradient(135deg, #007aff 0%, #5ac8fa 100%);
    color: white;
    border-color: rgba(0, 122, 255, 0.3);
  }
  
  .mini-event-desc {
    flex: 1;
    font-size: 14px;
    color: #2c3e50;
    font-weight: 500;
    line-height: 1.4;
  }
  
  /* Custom scrollbar for mini-history */
  .mini-history::-webkit-scrollbar {
    width: 6px;
  }
  
  .mini-history::-webkit-scrollbar-track {
    background: rgba(139, 69, 19, 0.05);
    border-radius: 3px;
  }
  
  .mini-history::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #8B4513, #D2B48C);
    border-radius: 3px;
  }
  
  .mini-history::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #654321, #8B4513);
  }
  
  @media (max-width: 768px) {
    .right-panel.expanded {
      width: 320px;
    }
    
    .right-panel.collapsed {
      width: 56px;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 8px;
    }
    
    .tabs {
      flex-direction: column;
      gap: 2px;
    }
    
    .tab {
      justify-content: flex-start;
      padding: 8px 12px;
    }
    
    .right-quick-popup {
      right: 68px;
      min-width: 260px;
    }
    
    .quick-info-btn {
      width: 40px;
      height: 40px;
    }
  }
</style>