<script lang="ts">
  import type { BoardSize, Player } from '$lib/baduk/domain/events/BadukEvents';
  import type { GameStatus } from '$lib/baduk/domain/aggregates/BadukAggregate';
  
  interface Props {
    onStartGame?: (config: { boardSize: BoardSize; handicap: number; komi: number }) => void;
    onPass?: () => void;
    onResign?: () => void;
    onNewGame?: () => void;
    status: GameStatus;
    currentPlayer?: Player;
  }
  
  let { 
    onStartGame, 
    onPass, 
    onResign, 
    onNewGame, 
    status, 
    currentPlayer 
  }: Props = $props();
  
  let showConfig = $state(false);
  let boardSize = $state<BoardSize>(19);
  let handicap = $state(0);
  let komi = $state(6.5);
  
  const handleStartGame = () => {
    onStartGame?.({ boardSize, handicap, komi });
    showConfig = false;
  };
  
  const handleShowConfig = () => {
    showConfig = true;
  };
  
  const handleCancelConfig = () => {
    showConfig = false;
  };
</script>

<div class="game-controls">
  {#if status === 'waiting'}
    <button class="primary-button" onclick={handleShowConfig}>
      🎯 Start New Game
    </button>
  {:else if status === 'playing'}
    <div class="playing-controls">
      <button class="action-button pass" onclick={onPass}>
        ⏭️ Pass
      </button>
      <button class="action-button resign" onclick={onResign}>
        🏳️ Resign
      </button>
    </div>
  {:else if status === 'finished'}
    <button class="primary-button" onclick={onNewGame}>
      🔄 New Game
    </button>
  {/if}
  
  <!-- Game Configuration Modal -->
  {#if showConfig}
    <div class="config-modal">
      <div class="modal-backdrop" onclick={handleCancelConfig}></div>
      <div class="modal-content">
        <h3>⚫⚪ Game Configuration</h3>
        
        <div class="config-section">
          <label>Board Size:</label>
          <div class="board-size-options">
            <label class="radio-option">
              <input type="radio" bind:group={boardSize} value={9} />
              <span>9×9 (Quick)</span>
            </label>
            <label class="radio-option">
              <input type="radio" bind:group={boardSize} value={13} />
              <span>13×13 (Medium)</span>
            </label>
            <label class="radio-option">
              <input type="radio" bind:group={boardSize} value={19} />
              <span>19×19 (Full)</span>
            </label>
          </div>
        </div>
        
        <div class="config-section">
          <label for="handicap">Handicap Stones:</label>
          <input 
            id="handicap"
            type="number" 
            bind:value={handicap} 
            min="0" 
            max="9"
            class="number-input"
          />
          <small>Extra stones for Black player (0-9)</small>
        </div>
        
        <div class="config-section">
          <label for="komi">Komi (White bonus):</label>
          <input 
            id="komi"
            type="number" 
            bind:value={komi} 
            min="0" 
            max="10" 
            step="0.5"
            class="number-input"
          />
          <small>Compensation points for White player</small>
        </div>
        
        <div class="modal-actions">
          <button class="secondary-button" onclick={handleCancelConfig}>
            Cancel
          </button>
          <button class="primary-button" onclick={handleStartGame}>
            Start Game
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .game-controls {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
  }
  
  .primary-button {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 0.75rem;
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  .primary-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
  }
  
  .playing-controls {
    display: flex;
    gap: 1rem;
  }
  
  .action-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .action-button.pass {
    background: #f59e0b;
    color: white;
  }
  
  .action-button.pass:hover {
    background: #d97706;
    transform: translateY(-1px);
  }
  
  .action-button.resign {
    background: #dc2626;
    color: white;
  }
  
  .action-button.resign:hover {
    background: #b91c1c;
    transform: translateY(-1px);
  }
  
  .config-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    position: relative;
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal-content h3 {
    margin: 0 0 1.5rem 0;
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .config-section {
    margin-bottom: 1.5rem;
  }
  
  .config-section label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #374151;
  }
  
  .board-size-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .radio-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .radio-option:has(input:checked) {
    border-color: #3b82f6;
    background: #eff6ff;
  }
  
  .radio-option input {
    margin: 0;
  }
  
  .number-input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.2s;
  }
  
  .number-input:focus {
    outline: none;
    border-color: #3b82f6;
  }
  
  .config-section small {
    display: block;
    margin-top: 0.25rem;
    color: #6b7280;
    font-size: 0.875rem;
  }
  
  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
  }
  
  .secondary-button {
    background: #6b7280;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .secondary-button:hover {
    background: #4b5563;
  }
  
  @media (max-width: 768px) {
    .playing-controls {
      flex-direction: column;
      align-items: center;
    }
    
    .modal-content {
      margin: 1rem;
      padding: 1.5rem;
    }
    
    .modal-actions {
      flex-direction: column;
    }
  }
</style>