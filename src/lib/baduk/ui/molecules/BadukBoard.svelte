<script lang="ts">
  import Stone from '../atoms/Stone.svelte';
  import type { Board, Position, BoardSize } from '$lib/baduk/domain/events/BadukEvents';
  import { boardTheme, type BoardTheme } from '../stores/themeStore';
  
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
  
  let currentTheme = $state('modern' as BoardTheme);
  
  boardTheme.subscribe(theme => {
    currentTheme = theme;
  });
  
  // Throttle helper function
  const throttle = (func: Function, delay: number) => {
    let timeoutId: number | undefined;
    let lastExecTime = 0;
    return (...args: any[]) => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  };
  
  // 컨테이너 크기에 맞춰 동적으로 셀 크기 계산 (최대 크기)
  let boardContainer = $state<HTMLDivElement>();
  let cellSize = $state(30);
  
  $effect(() => {
    if (typeof window !== 'undefined') {
      const updateCellSize = () => {
        let availableWidth;
        // 화면 크기에 따라 패널 크기 조정
        if (window.innerWidth <= 768) {
          availableWidth = window.innerWidth - 120; // 모바일: 축소된 패널
        } else if (window.innerWidth <= 1200) {
          availableWidth = window.innerWidth - 600; // 태블릿
        } else {
          availableWidth = window.innerWidth - 660; // 데스크탑
        }
        
        // Calculate header height dynamically
        const headerHeight = document.querySelector('.baduk-nav')?.getBoundingClientRect().height || 80;
        const availableHeight = window.innerHeight - headerHeight - 40; // 40px for padding
        
        const maxBoardSize = Math.min(availableWidth, availableHeight);
        const newCellSize = Math.floor(maxBoardSize / boardSize);
        // 최소/최대 크기 제한
        const clampedCellSize = Math.max(18, Math.min(newCellSize, 45));
        
        // Only update if there's a significant change to avoid unnecessary re-renders
        if (Math.abs(clampedCellSize - cellSize) > 1) {
          cellSize = clampedCellSize;
        }
      };
      
      // Throttled resize handler to improve performance
      const throttledUpdateCellSize = throttle(updateCellSize, 100);
      
      updateCellSize();
      window.addEventListener('resize', throttledUpdateCellSize);
      
      return () => {
        window.removeEventListener('resize', throttledUpdateCellSize);
      };
    }
  });
  
  const isLastMove = (x: number, y: number): boolean => {
    return lastMovePosition ? lastMovePosition.x === x && lastMovePosition.y === y : false;
  };
  
  // Memoized territory map for O(1) lookup instead of O(n*m)
  let territoryMap = $derived.by(() => {
    const map = new Map<string, string>();
    for (const territory of territories) {
      for (const pos of territory.positions) {
        map.set(`${pos.x},${pos.y}`, territory.owner);
      }
    }
    return map;
  });
  
  const getTerritoryOwner = (x: number, y: number): string | null => {
    return territoryMap.get(`${x},${y}`) || null;
  };
  
  // Memoized star points for better performance
  let starPoints = $derived.by(() => {
    const points = new Set<string>();
    if (boardSize === 19) {
      [3, 9, 15].forEach(x => [3, 9, 15].forEach(y => points.add(`${x},${y}`)));
    } else if (boardSize === 13) {
      [3, 6, 9].forEach(x => [3, 6, 9].forEach(y => points.add(`${x},${y}`)));
    } else if (boardSize === 9) {
      [2, 4, 6].forEach(x => [2, 4, 6].forEach(y => points.add(`${x},${y}`)));
    }
    return points;
  });
  
  const isStarPoint = (x: number, y: number): boolean => {
    return starPoints.has(`${x},${y}`);
  };
</script>

{#if currentTheme === 'baekje'}
  <!-- 백제 테마 -->
  <div class="baekje-board-container">
    <div class="traditional-frame">
      <div class="frame-corner top-left"></div>
      <div class="frame-corner top-right"></div>
      <div class="frame-corner bottom-left"></div>
      <div class="frame-corner bottom-right"></div>
      
      <div 
        bind:this={boardContainer}
        class="mokwha-jadan-board" 
        style="
          --board-size: {boardSize}; 
          --cell-size: {cellSize}px;
          --board-width: {boardSize * cellSize}px;
        "
      >
        <div class="wood-grain-bg"></div>
        
        <div class="traditional-grid">
          {#each Array(boardSize) as _, i}
            <div 
              class="grid-line horizontal"
              style="
                top: {(i + 0.5) * cellSize}px;
                left: {0.5 * cellSize}px;
                width: {(boardSize - 1) * cellSize}px;
              "
            ></div>
          {/each}
          
          {#each Array(boardSize) as _, i}
            <div 
              class="grid-line vertical"
              style="
                left: {(i + 0.5) * cellSize}px;
                top: {0.5 * cellSize}px;
                height: {(boardSize - 1) * cellSize}px;
              "
            ></div>
          {/each}
        </div>
        
        <div class="star-points">
          {#each Array(boardSize) as _, y}
            {#each Array(boardSize) as _, x}
              {#if isStarPoint(x, y)}
                <div 
                  class="traditional-star-point"
                  style="
                    left: {(x + 0.5) * cellSize}px;
                    top: {(y + 0.5) * cellSize}px;
                  "
                ></div>
              {/if}
            {/each}
          {/each}
        </div>
        
        <div class="intersections-grid">
          {#each Array(boardSize) as _, y}
            {#each Array(boardSize) as _, x}
              {@const stone = board[y][x]}
              {@const territoryOwner = getTerritoryOwner(x, y)}
              {@const isLast = isLastMove(x, y)}
              <div 
                class="intersection-cell"
                class:territory-black={territoryOwner === 'black'}
                class:territory-white={territoryOwner === 'white'}
                class:territory-neutral={territoryOwner === 'neutral'}
                style="
                  grid-column: {x + 1};
                  grid-row: {y + 1};
                "
              >
                <Stone 
                  stone={stone}
                  position={{ x, y }}
                  onClick={onIntersectionClick}
                  isLastMove={isLast}
                  boardSize={boardSize}
                  theme={currentTheme}
                />
              </div>
            {/each}
          {/each}
        </div>
      </div>
    </div>
  </div>
{:else}
  <!-- 현대적 테마 -->
  <div class="modern-board-container">
    <div 
      bind:this={boardContainer}
      class="modern-board" 
      style="
        --board-size: {boardSize}; 
        --cell-size: {cellSize}px;
        --board-width: {boardSize * cellSize}px;
      "
    >
      <div class="modern-grid">
        {#each Array(boardSize) as _, i}
          <div 
            class="modern-grid-line horizontal"
            style="
              top: {(i + 0.5) * cellSize}px;
              left: {0.5 * cellSize}px;
              width: {(boardSize - 1) * cellSize}px;
            "
          ></div>
        {/each}
        
        {#each Array(boardSize) as _, i}
          <div 
            class="modern-grid-line vertical"
            style="
              left: {(i + 0.5) * cellSize}px;
              top: {0.5 * cellSize}px;
              height: {(boardSize - 1) * cellSize}px;
            "
          ></div>
        {/each}
      </div>
      
      <div class="modern-star-points">
        {#each Array(boardSize) as _, y}
          {#each Array(boardSize) as _, x}
            {#if isStarPoint(x, y)}
              <div 
                class="modern-star-point"
                style="
                  left: {(x + 0.5) * cellSize}px;
                  top: {(y + 0.5) * cellSize}px;
                "
              ></div>
            {/if}
          {/each}
        {/each}
      </div>
      
      <div class="intersections-grid">
        {#each Array(boardSize) as _, y}
          {#each Array(boardSize) as _, x}
            {@const stone = board[y][x]}
            {@const territoryOwner = getTerritoryOwner(x, y)}
            {@const isLast = isLastMove(x, y)}
            <div 
              class="intersection-cell"
              class:territory-black={territoryOwner === 'black'}
              class:territory-white={territoryOwner === 'white'}
              class:territory-neutral={territoryOwner === 'neutral'}
              style="
                grid-column: {x + 1};
                grid-row: {y + 1};
              "
            >
              <Stone 
                stone={stone}
                position={{ x, y }}
                onClick={onIntersectionClick}
                isLastMove={isLast}
                boardSize={boardSize}
                theme={currentTheme}
              />
            </div>
          {/each}
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  /* 백제 테마 스타일 */
  .baekje-board-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background: radial-gradient(ellipse at center, #2D1810 0%, #1A0F0A 70%);
    width: 100%;
    height: 100%;
  }
  
  .traditional-frame {
    position: relative;
    padding: 1rem;
    background: linear-gradient(145deg, #4A2C17 0%, #3B1F0F 50%, #2D1810 100%);
    border-radius: 2px;
    box-shadow: 
      0 0 0 4px #6B4226,
      0 0 0 8px #2D1810,
      inset 0 4px 12px rgba(255, 215, 0, 0.1),
      0 20px 60px rgba(0, 0, 0, 0.6);
  }
  
  .frame-corner {
    position: absolute;
    width: 20px;
    height: 20px;
    background: linear-gradient(45deg, #B8860B, #DAA520);
    border: 1px solid #8B4513;
  }
  
  .frame-corner.top-left {
    top: -2px;
    left: -2px;
    border-radius: 0 0 8px 0;
  }
  
  .frame-corner.top-right {
    top: -2px;
    right: -2px;
    border-radius: 0 0 0 8px;
  }
  
  .frame-corner.bottom-left {
    bottom: -2px;
    left: -2px;
    border-radius: 0 8px 0 0;
  }
  
  .frame-corner.bottom-right {
    bottom: -2px;
    right: -2px;
    border-radius: 8px 0 0 0;
  }
  
  .mokwha-jadan-board {
    position: relative;
    width: var(--board-width);
    height: var(--board-width);
    background: 
      linear-gradient(135deg, #8B4513 0%, #A0522D 25%, #654321 50%, #5D4E37 75%, #4A2C17 100%);
    padding: calc(var(--cell-size) * 0.5);
    border-radius: 3px;
    overflow: hidden;
    border: 2px solid #2F1B14;
    box-shadow: 
      inset 0 4px 8px rgba(0, 0, 0, 0.3),
      inset 0 -2px 4px rgba(255, 215, 0, 0.1);
  }
  
  .wood-grain-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 3px,
        rgba(45, 24, 16, 0.3) 3px,
        rgba(45, 24, 16, 0.3) 6px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 1px,
        rgba(107, 66, 38, 0.1) 1px,
        rgba(107, 66, 38, 0.1) 2px
      ),
      radial-gradient(ellipse 200% 100% at 50% 90%, rgba(139, 69, 19, 0.2) 0%, transparent 50%);
    pointer-events: none;
    opacity: 0.7;
  }
  
  .traditional-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }
  
  .grid-line {
    position: absolute;
    background: linear-gradient(90deg, #2F1B14 0%, #1A0F0A 50%, #2F1B14 100%);
    box-shadow: 
      0 0 1px rgba(255, 215, 0, 0.3),
      inset 0 1px 1px rgba(255, 255, 255, 0.1);
    z-index: 1;
  }
  
  .grid-line.horizontal {
    height: 2px;
  }
  
  .grid-line.vertical {
    width: 2px;
  }
  
  .traditional-star-point {
    position: absolute;
    width: 8px;
    height: 8px;
    background: radial-gradient(circle, #B8860B 0%, #8B4513 70%);
    border: 1px solid #2F1B14;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.4),
      inset 0 1px 2px rgba(255, 215, 0, 0.3);
  }
  
  /* 현대적 테마 스타일 */
  .modern-board-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    width: 100%;
    height: 100%;
  }
  
  .modern-board {
    position: relative;
    width: var(--board-width);
    height: var(--board-width);
    background: linear-gradient(135deg, #E6D4B7 0%, #D4B896 50%, #C4A373 100%);
    border-radius: 12px;
    padding: calc(var(--cell-size) * 0.5);
    box-shadow: 
      0 0 0 3px #8B4513,
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 2px 4px rgba(255, 255, 255, 0.4),
      inset 0 -1px 2px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .modern-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }
  
  .modern-grid-line {
    position: absolute;
    background-color: #654321;
    z-index: 1;
  }
  
  .modern-grid-line.horizontal {
    height: 1px;
  }
  
  .modern-grid-line.vertical {
    width: 1px;
  }
  
  .modern-star-point {
    position: absolute;
    width: 5px;
    height: 5px;
    background-color: #654321;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
  
  /* 공통 스타일 */
  .star-points,
  .modern-star-points {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
  }
  
  .intersections-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(var(--board-size), var(--cell-size));
    grid-template-rows: repeat(var(--board-size), var(--cell-size));
    z-index: 3;
  }
  
  .intersection-cell {
    position: relative;
    transition: background-color 0.3s ease;
  }
  
  .intersection-cell.territory-black {
    background: radial-gradient(circle, rgba(0, 0, 0, 0.15) 0%, transparent 70%);
    border-radius: 3px;
  }
  
  .intersection-cell.territory-white {
    background: radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, transparent 70%);
    border-radius: 3px;
  }
  
  .intersection-cell.territory-neutral {
    background: radial-gradient(circle, rgba(128, 128, 128, 0.1) 0%, transparent 70%);
    border-radius: 3px;
  }
  
  /* 백제시대 금장식 효과 */
  .traditional-frame::before {
    content: '';
    position: absolute;
    top: 1rem;
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    border: 1px solid rgba(184, 134, 11, 0.3);
    border-radius: 2px;
    pointer-events: none;
  }
  
  .traditional-frame::after {
    content: '';
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    right: 0.5rem;
    bottom: 0.5rem;
    border: 1px solid rgba(218, 165, 32, 0.2);
    border-radius: 1px;
    pointer-events: none;
  }
  
  /* 현대적 나무 질감 */
  .modern-board::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 2px,
        rgba(139, 69, 19, 0.03) 2px,
        rgba(139, 69, 19, 0.03) 4px
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 8px,
        rgba(139, 69, 19, 0.02) 8px,
        rgba(139, 69, 19, 0.02) 16px
      );
    pointer-events: none;
    border-radius: 12px;
  }
  
  /* 반응형 디자인 */
  @media (max-width: 768px) {
    .baekje-board-container {
      padding: 1.5rem;
    }
    
    .traditional-frame {
      padding: 1rem;
    }
    
    .modern-board-container {
      padding: 1rem;
    }
    
    .mokwha-jadan-board,
    .modern-board {
      padding: calc(var(--cell-size) * 0.4);
    }
  }
</style>