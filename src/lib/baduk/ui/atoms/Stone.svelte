<script lang="ts">
  import type { Stone } from '$lib/baduk/domain/events/BadukEvents';
  import type { StoneConfig } from '../stores/themeStore';
  
  interface Props {
    stone?: Stone | null;
    position: { x: number; y: number };
    onClick?: (position: { x: number; y: number }) => void;
    isLastMove?: boolean;
    blackStoneConfig?: StoneConfig;
    whiteStoneConfig?: StoneConfig;
  }
  
  let { 
    stone = null, 
    position, 
    onClick, 
    isLastMove = false,
    blackStoneConfig,
    whiteStoneConfig
  }: Props = $props();
  
  // Select the appropriate config based on stone color
  let stoneConfig = $derived(
    stone === 'black' ? blackStoneConfig : 
    stone === 'white' ? whiteStoneConfig : 
    null
  );
  
  // Get shape configuration
  let stoneShapeConfig = $derived(
    stone === 'black' ? blackStoneConfig?.black : 
    stone === 'white' ? whiteStoneConfig?.white : 
    null
  );
  
  // Determine the shape style
  let shapeClass = $derived(() => {
    if (!stoneShapeConfig?.shape) return 'circle';
    return stoneShapeConfig.shape;
  });
  
  let currentShape = $derived(shapeClass());
  
  const handleClick = () => {
    if (!stone && onClick) {
      onClick(position);
    }
  };
</script>

<div 
  class="intersection" 
  class:has-stone={!!stone}
  onclick={handleClick}
  role="button"
  tabindex="0"
  onkeydown={(e) => e.key === 'Enter' && handleClick()}
  style="
    --stone-black-bg: {stoneConfig?.black.background || 'radial-gradient(circle at 35% 35%, #555 0%, #222 30%, #000 70%)'};
    --stone-black-border: {stoneConfig?.black.border || '1px solid #333'};
    --stone-black-shadow: {stoneConfig?.black.boxShadow || '0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)'};
    --stone-white-bg: {stoneConfig?.white.background || 'radial-gradient(circle at 35% 35%, #fff 0%, #f0f0f0 30%, #ddd 70%)'};
    --stone-white-border: {stoneConfig?.white.border || '1px solid #ccc'};
    --stone-white-shadow: {stoneConfig?.white.boxShadow || '0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.8)'};
    --marker-bg: {stoneConfig?.lastMoveMarker.background || '#ff4444'};
    --marker-size: {stoneConfig?.lastMoveMarker.size || '6px'};
    --marker-border: {stoneConfig?.lastMoveMarker.border || 'none'};
    --marker-shadow: {stoneConfig?.lastMoveMarker.boxShadow || 'none'};
  "
>
  <!-- 바둑돌 -->
  {#if stone}
    <div 
      class="stone" 
      class:black={stone === 'black'}
      class:white={stone === 'white'}
      class:last-move={isLastMove}
      class:shape-circle={currentShape === 'circle'}
      class:shape-square={currentShape === 'square'}
      class:shape-diamond={currentShape === 'diamond'}
      class:shape-hexagon={currentShape === 'hexagon'}
      class:shape-custom={currentShape === 'custom'}
    >
      <!-- 돌의 이미지 -->
      {#if stoneShapeConfig?.image}
        <div class="stone-image">
          <img 
            src={stoneShapeConfig.image} 
            alt="{stoneConfig?.name || 'Stone'} {stone}"
            loading="lazy"
            onerror={(e) => {
              // 이미지 로드 실패시 숨기기
              const target = e.target as HTMLImageElement;
              if (target) target.style.display = 'none';
            }}
          />
        </div>
      {/if}
      
      <!-- 돌의 텍스처 -->
      {#if stoneConfig?.texture}
        <div class="stone-texture" style="background: {stoneConfig.texture}"></div>
      {/if}
      
      {#if isLastMove}
        <div class="last-move-marker"></div>
      {/if}
      
      <!-- Custom shape SVG for organic Zerg style -->
      {#if currentShape === 'custom' && stoneShapeConfig?.customShape === 'organic' && !stoneShapeConfig?.image}
        <svg class="custom-shape-overlay" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M50,10 C60,15 75,20 85,35 C90,50 85,70 70,80 C50,90 30,85 15,70 C5,50 10,30 25,20 C35,12 45,8 50,10 Z" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                opacity="0.3"/>
        </svg>
      {/if}
    </div>
  {/if}
  
  <!-- 호버 효과 -->
  {#if !stone}
    <div class="hover-preview"></div>
  {/if}
</div>

<style>
  .intersection {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .intersection.has-stone {
    cursor: default;
  }
  
  .stone {
    position: relative;
    width: 85%;
    height: 85%;
    z-index: 3;
    transition: all 0.3s ease;
    animation: stone-place 0.4s ease-out;
  }
  
  /* Shape variations */
  .stone.shape-circle {
    border-radius: 50%;
  }
  
  .stone.shape-square {
    border-radius: 8%;
  }
  
  .stone.shape-diamond {
    border-radius: 15%;
    transform: rotate(45deg);
  }
  
  .stone.shape-hexagon {
    border-radius: 15%;
    clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
  }
  
  .stone.shape-custom {
    border-radius: 35%;
    clip-path: ellipse(45% 40% at 50% 50%);
  }
  
  .stone.black {
    background: var(--stone-black-bg);
    border: var(--stone-black-border);
    box-shadow: var(--stone-black-shadow);
  }
  
  .stone.white {
    background: var(--stone-white-bg);
    border: var(--stone-white-border);
    box-shadow: var(--stone-white-shadow);
  }
  
  .stone-image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    clip-path: inherit;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }
  
  .stone-image img {
    width: 80%;
    height: 80%;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    transition: all 0.3s ease;
  }
  
  /* 이미지가 있는 경우 배경 투명도 조정 */
  .stone:has(.stone-image) {
    background: rgba(0, 0, 0, 0.1);
  }
  
  .stone-texture {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    border-radius: inherit;
    clip-path: inherit;
  }
  
  .custom-shape-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    color: currentColor;
    opacity: 0.5;
  }
  
  .last-move-marker {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: var(--marker-size);
    height: var(--marker-size);
    background: var(--marker-bg);
    border: var(--marker-border);
    border-radius: 50%;
    box-shadow: var(--marker-shadow);
    z-index: 4;
  }
  
  .hover-preview {
    position: absolute;
    width: 75%;
    height: 75%;
    border-radius: 50%;
    opacity: 0;
    transition: all 0.2s ease;
    z-index: 2;
    pointer-events: none;
    background: radial-gradient(circle at 35% 35%, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 70%);
  }
  
  .intersection:hover .hover-preview {
    opacity: 0.4;
    transform: scale(1.05);
  }
  
  .intersection:active .hover-preview {
    opacity: 0.6;
    transform: scale(0.95);
  }
  
  /* 마지막 수 애니메이션 */
  .stone.last-move {
    animation: pulse-stone 0.8s ease-out;
  }
  
  @keyframes pulse-stone {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  @keyframes stone-place {
    0% {
      transform: scale(0.3) rotate(180deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.1) rotate(90deg);
      opacity: 0.8;
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }
  
  /* 접근성 */
  .intersection:focus {
    outline: 2px solid rgba(52, 152, 219, 0.6);
    outline-offset: 2px;
  }
</style>