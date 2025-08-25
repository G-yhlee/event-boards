<script lang="ts">
  import type { Stone } from '$lib/baduk/domain/events/BadukEvents';
  
  interface Props {
    stone?: Stone | null;
    position: { x: number; y: number };
    onClick?: (position: { x: number; y: number }) => void;
    showCoordinates?: boolean;
    isLastMove?: boolean;
    size?: number;
  }
  
  let { 
    stone = null, 
    position, 
    onClick, 
    showCoordinates = false, 
    isLastMove = false,
    size = 20 
  }: Props = $props();
  
  const handleClick = () => {
    if (!stone && onClick) {
      onClick(position);
    }
  };
  
  const coordinateLabels = 'ABCDEFGHJKLMNOPQRST'; // Note: no 'I'
  const getCoordinateLabel = (x: number, y: number) => {
    return `${coordinateLabels[x]}${19 - y}`;
  };
</script>

<div class="intersection" onclick={handleClick} style="--stone-size: {size}px">
  <!-- Board lines -->
  <div class="line horizontal"></div>
  <div class="line vertical"></div>
  
  <!-- Star points (for 19x19 board) -->
  {#if (position.x === 3 || position.x === 9 || position.x === 15) && 
       (position.y === 3 || position.y === 9 || position.y === 15)}
    <div class="star-point"></div>
  {/if}
  
  <!-- Stone -->
  {#if stone}
    <div 
      class="stone" 
      class:black={stone === 'black'}
      class:white={stone === 'white'}
      class:last-move={isLastMove}
    >
      {#if isLastMove}
        <div class="last-move-marker"></div>
      {/if}
    </div>
  {:else}
    <div class="hover-indicator"></div>
  {/if}
  
  <!-- Coordinate labels -->
  {#if showCoordinates && (position.x === 0 || position.y === 18)}
    <div class="coordinate">
      {getCoordinateLabel(position.x, position.y)}
    </div>
  {/if}
</div>

<style>
  .intersection {
    position: relative;
    width: var(--stone-size);
    height: var(--stone-size);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .line {
    position: absolute;
    background-color: #8B4513;
  }
  
  .line.horizontal {
    width: 100%;
    height: 1px;
    left: 0;
    top: 50%;
  }
  
  .line.vertical {
    height: 100%;
    width: 1px;
    top: 0;
    left: 50%;
  }
  
  .star-point {
    position: absolute;
    width: 4px;
    height: 4px;
    background-color: #8B4513;
    border-radius: 50%;
    z-index: 1;
  }
  
  .stone {
    position: relative;
    width: calc(var(--stone-size) * 0.9);
    height: calc(var(--stone-size) * 0.9);
    border-radius: 50%;
    z-index: 2;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: all 0.2s ease;
  }
  
  .stone.black {
    background: radial-gradient(circle at 30% 30%, #555, #000);
    border: 1px solid #333;
  }
  
  .stone.white {
    background: radial-gradient(circle at 30% 30%, #fff, #ddd);
    border: 1px solid #ccc;
  }
  
  .stone.last-move {
    animation: pulse 1s ease-in-out;
  }
  
  .last-move-marker {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background-color: red;
    border-radius: 50%;
  }
  
  .hover-indicator {
    position: absolute;
    width: calc(var(--stone-size) * 0.7);
    height: calc(var(--stone-size) * 0.7);
    border: 2px dashed transparent;
    border-radius: 50%;
    z-index: 1;
    transition: all 0.2s ease;
  }
  
  .intersection:hover .hover-indicator {
    border-color: rgba(0, 0, 0, 0.3);
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  .coordinate {
    position: absolute;
    font-size: 10px;
    font-weight: bold;
    color: #8B4513;
    pointer-events: none;
  }
  
  @keyframes pulse {
    0%, 100% { 
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); 
    }
    50% { 
      box-shadow: 0 4px 8px rgba(255, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3); 
    }
  }
</style>