<script lang="ts">
  import Stone from '../atoms/Stone.svelte';
  import type { Board, Position, BoardSize } from '$lib/baduk/domain/events/BadukEvents';
  import { 
    blackStoneStyle,
    whiteStoneStyle, 
    currentBoardBackground, 
    getStoneConfig, 
    getBoardConfig,
    type StoneStyle,
    type BoardBackground 
  } from '../stores/themeStore';
  
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
  
  let selectedBlackStoneStyle = $state<StoneStyle>('japanese');
  let selectedWhiteStoneStyle = $state<StoneStyle>('korean');
  let selectedBoardBackground = $state<BoardBackground>('classic');
  
  let blackStoneConfig = $derived(getStoneConfig(selectedBlackStoneStyle));
  let whiteStoneConfig = $derived(getStoneConfig(selectedWhiteStoneStyle));
  let boardConfig = $derived(getBoardConfig(selectedBoardBackground));
  
  blackStoneStyle.subscribe(style => {
    selectedBlackStoneStyle = style;
  });
  
  whiteStoneStyle.subscribe(style => {
    selectedWhiteStoneStyle = style;
  });
  
  currentBoardBackground.subscribe(background => {
    selectedBoardBackground = background;
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

<div class="board-container">
  <div 
    class="board" 
    style="
      --board-size: {boardSize}; 
      --cell-size: {cellSize}px;
      --board-width: {boardSize * cellSize}px;
      --board-bg: {boardConfig.background};
      --board-border: {boardConfig.border};
      --board-border-radius: {boardConfig.borderRadius};
      --board-box-shadow: {boardConfig.boxShadow};
      --grid-color: {boardConfig.gridColor};
      --star-point-color: {boardConfig.starPointColor};
      --star-point-size: {boardConfig.starPointSize};
      --board-texture: {boardConfig.texture || 'none'};
    "
  >
    <!-- Board texture overlay -->
    {#if boardConfig.texture}
      <div class="board-texture"></div>
    {/if}
    
    <!-- Grid lines -->
    <div class="grid">
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
    
    <!-- Star points -->
    <div class="star-points">
      {#each Array(boardSize) as _, y}
        {#each Array(boardSize) as _, x}
          {#if isStarPoint(x, y)}
            <div 
              class="star-point"
              style="
                left: {(x + 0.5) * cellSize}px;
                top: {(y + 0.5) * cellSize}px;
              "
            ></div>
          {/if}
        {/each}
      {/each}
    </div>
    
    <!-- Intersections -->
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
              blackStoneConfig={blackStoneConfig}
              whiteStoneConfig={whiteStoneConfig}
            />
          </div>
        {/each}
      {/each}
    </div>
  </div>
</div>

<style>
  .board-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    width: 100%;
    height: 100%;
  }
  
  .board {
    position: relative;
    width: var(--board-width);
    height: var(--board-width);
    background: var(--board-bg);
    border-radius: var(--board-border-radius);
    padding: calc(var(--cell-size) * 0.5);
    box-shadow: var(--board-box-shadow);
    overflow: hidden;
  }
  
  .board-texture {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--board-texture);
    pointer-events: none;
    border-radius: var(--board-border-radius);
  }
  
  .grid {
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
    background-color: var(--grid-color);
    z-index: 1;
  }
  
  .grid-line.horizontal {
    height: 1px;
  }
  
  .grid-line.vertical {
    width: 1px;
  }
  
  .star-points {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
  }
  
  .star-point {
    position: absolute;
    width: var(--star-point-size);
    height: var(--star-point-size);
    background-color: var(--star-point-color);
    border-radius: 50%;
    transform: translate(-50%, -50%);
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
  
  /* 반응형 디자인 */
  @media (max-width: 768px) {
    .board-container {
      padding: 1rem;
    }
    
    .board {
      padding: calc(var(--cell-size) * 0.4);
    }
  }
</style>