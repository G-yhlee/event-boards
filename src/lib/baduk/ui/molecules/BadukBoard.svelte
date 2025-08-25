<script lang="ts">
  import Stone from '../atoms/Stone.svelte';
  import type { Board, Position, BoardSize } from '$lib/baduk/domain/events/BadukEvents';
  
  interface Props {
    board: Board;
    boardSize: BoardSize;
    onIntersectionClick?: (position: Position) => void;
    lastMovePosition?: Position;
    territories?: Array<{ positions: Position[]; owner: string }>;
  }
  
  let { 
    board, 
    boardSize, 
    onIntersectionClick, 
    lastMovePosition,
    territories = []
  }: Props = $props();
  
  const stoneSize = boardSize === 19 ? 22 : boardSize === 13 ? 30 : 40;
  
  const isLastMove = (x: number, y: number): boolean => {
    return lastMovePosition ? lastMovePosition.x === x && lastMovePosition.y === y : false;
  };
  
  const getTerritoryOwner = (x: number, y: number): string | null => {
    for (const territory of territories) {
      if (territory.positions.some(pos => pos.x === x && pos.y === y)) {
        return territory.owner;
      }
    }
    return null;
  };
</script>

<div class="baduk-board" style="--board-size: {boardSize}; --stone-size: {stoneSize}px">
  <div class="board-background">
    <!-- Board grid -->
    <div class="board-grid">
      {#each Array(boardSize) as _, y}
        {#each Array(boardSize) as _, x}
          {@const territoryOwner = getTerritoryOwner(x, y)}
          <div 
            class="intersection-container"
            class:territory-black={territoryOwner === 'black'}
            class:territory-white={territoryOwner === 'white'}
            class:territory-neutral={territoryOwner === 'neutral'}
          >
            <Stone 
              stone={board[y][x]}
              position={{ x, y }}
              onClick={onIntersectionClick}
              showCoordinates={x === 0 || y === boardSize - 1}
              isLastMove={isLastMove(x, y)}
              size={stoneSize}
            />
          </div>
        {/each}
      {/each}
    </div>
  </div>
  
  <!-- Board border -->
  <div class="board-border"></div>
</div>

<style>
  .baduk-board {
    position: relative;
    background: linear-gradient(45deg, #DEB887, #D2B48C);
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    margin: 2rem auto;
    width: fit-content;
  }
  
  .board-background {
    background: 
      linear-gradient(90deg, #8B4513 1px, transparent 1px),
      linear-gradient(180deg, #8B4513 1px, transparent 1px),
      #DEB887;
    background-size: var(--stone-size) var(--stone-size);
    border-radius: 4px;
  }
  
  .board-grid {
    display: grid;
    grid-template-columns: repeat(var(--board-size), var(--stone-size));
    grid-template-rows: repeat(var(--board-size), var(--stone-size));
    gap: 0;
  }
  
  .intersection-container {
    position: relative;
    transition: background-color 0.3s ease;
  }
  
  .intersection-container.territory-black {
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  .intersection-container.territory-white {
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  .intersection-container.territory-neutral {
    background-color: rgba(128, 128, 128, 0.1);
  }
  
  .board-border {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 3px solid #8B4513;
    border-radius: 8px;
    pointer-events: none;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .baduk-board {
      padding: 10px;
      margin: 1rem auto;
    }
  }
</style>