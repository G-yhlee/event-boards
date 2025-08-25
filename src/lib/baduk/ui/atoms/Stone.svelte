<script lang="ts">
  import type { Stone } from '$lib/baduk/domain/events/BadukEvents';
  
  interface Props {
    stone?: Stone | null;
    position: { x: number; y: number };
    onClick?: (position: { x: number; y: number }) => void;
    isLastMove?: boolean;
    boardSize?: number;
    theme?: 'modern' | 'baekje';
  }
  
  let { 
    stone = null, 
    position, 
    onClick, 
    isLastMove = false,
    boardSize = 19,
    theme = 'modern'
  }: Props = $props();
  
  const handleClick = () => {
    if (!stone && onClick) {
      onClick(position);
    }
  };
</script>

<div 
  class="intersection" 
  class:traditional={theme === 'baekje'}
  class:modern={theme === 'modern'}
  class:has-stone={!!stone}
  onclick={handleClick}
  role="button"
  tabindex="0"
  onkeydown={(e) => e.key === 'Enter' && handleClick()}
>
  <!-- 바둑돌 -->
  {#if stone}
    <div 
      class="stone" 
      class:traditional={theme === 'baekje'}
      class:modern={theme === 'modern'}
      class:black={stone === 'black'}
      class:white={stone === 'white'}
      class:last-move={isLastMove}
    >
      <!-- 돌의 텍스처 -->
      <div class="stone-texture" class:traditional-texture={theme === 'baekje'}></div>
      
      {#if isLastMove}
        <div 
          class="last-move-marker" 
          class:traditional-marker={theme === 'baekje'}
          class:modern-marker={theme === 'modern'}
        ></div>
      {/if}
    </div>
  {/if}
  
  <!-- 호버 효과 -->
  {#if !stone}
    <div 
      class="hover-preview" 
      class:traditional-hover={theme === 'baekje'}
      class:modern-hover={theme === 'modern'}
    ></div>
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
    border-radius: 50%;
    z-index: 3;
    transition: all 0.3s ease;
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.3),
      0 1px 2px rgba(0, 0, 0, 0.2);
  }
  
  /* 현대적 테마 - 흑돌 */
  .stone.modern.black {
    background: radial-gradient(circle at 35% 35%, #555 0%, #222 30%, #000 70%);
    border: 1px solid #333;
  }
  
  /* 현대적 테마 - 백돌 */
  .stone.modern.white {
    background: radial-gradient(circle at 35% 35%, #fff 0%, #f0f0f0 30%, #ddd 70%);
    border: 1px solid #ccc;
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.2),
      0 1px 2px rgba(0, 0, 0, 0.1),
      inset 0 1px 1px rgba(255, 255, 255, 0.8);
  }
  
  /* 백제 테마 - 흑돌 */
  .stone.traditional.black {
    background: 
      radial-gradient(ellipse at 30% 30%, #4A4A4A 0%, #2A2A2A 40%, #0A0A0A 85%);
    border: 2px solid #1A0F0A;
    box-shadow: 
      0 3px 8px rgba(0, 0, 0, 0.6),
      0 1px 3px rgba(0, 0, 0, 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.1);
  }
  
  /* 백제 테마 - 백돌 */
  .stone.traditional.white {
    background: 
      radial-gradient(ellipse at 30% 30%, #FFFFFF 0%, #F5F5DC 40%, #E6E6E6 85%);
    border: 2px solid #D4B896;
    box-shadow: 
      0 3px 8px rgba(139, 69, 19, 0.3),
      0 1px 3px rgba(0, 0, 0, 0.2),
      inset 0 2px 6px rgba(255, 255, 255, 0.9),
      inset 0 -1px 2px rgba(139, 69, 19, 0.2);
  }
  
  .stone-texture {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    pointer-events: none;
  }
  
  .stone-texture.traditional-texture {
    background: 
      repeating-conic-gradient(
        from 0deg at 50% 50%,
        transparent 0deg,
        rgba(255, 255, 255, 0.05) 30deg,
        transparent 60deg
      ),
      radial-gradient(circle at 60% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  }
  
  /* 마지막 수 표시 */
  .last-move-marker {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    z-index: 4;
  }
  
  .last-move-marker.modern-marker {
    width: 6px;
    height: 6px;
    background-color: #ff4444;
  }
  
  .last-move-marker.traditional-marker {
    width: 8px;
    height: 8px;
    background: radial-gradient(circle, #B8860B 0%, #DAA520 100%);
    border: 1px solid #8B4513;
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.4),
      inset 0 1px 2px rgba(255, 215, 0, 0.6);
  }
  
  /* 호버 효과 */
  .hover-preview {
    position: absolute;
    width: 75%;
    height: 75%;
    border-radius: 50%;
    opacity: 0;
    transition: all 0.2s ease;
    z-index: 2;
    pointer-events: none;
  }
  
  /* 현대적 호버 */
  .intersection:hover .hover-preview.modern-hover {
    opacity: 0.4;
    background: radial-gradient(circle at 35% 35%, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 70%);
    transform: scale(1.05);
  }
  
  .intersection:active .hover-preview.modern-hover {
    opacity: 0.6;
    transform: scale(0.95);
  }
  
  /* 백제 호버 */
  .intersection:hover .hover-preview.traditional-hover {
    opacity: 0.6;
    background: 
      radial-gradient(
        circle at 35% 35%, 
        rgba(184, 134, 11, 0.4) 0%, 
        rgba(139, 69, 19, 0.2) 50%,
        transparent 80%
      );
    border: 2px solid rgba(184, 134, 11, 0.5);
    transform: scale(1.05);
    box-shadow: 
      0 0 8px rgba(184, 134, 11, 0.3),
      inset 0 2px 4px rgba(255, 215, 0, 0.2);
  }
  
  .intersection:active .hover-preview.traditional-hover {
    opacity: 0.8;
    transform: scale(0.95);
    background: 
      radial-gradient(
        circle at 35% 35%, 
        rgba(218, 165, 32, 0.5) 0%, 
        rgba(184, 134, 11, 0.3) 50%,
        transparent 80%
      );
  }
  
  /* 애니메이션 */
  .stone.last-move.modern {
    animation: pulse-stone 0.8s ease-out;
  }
  
  .stone.last-move.traditional {
    animation: baekje-pulse 1.2s ease-out;
  }
  
  .stone {
    animation: stone-place 0.4s ease-out;
  }
  
  @keyframes pulse-stone {
    0% { transform: scale(1); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2); }
    50% { transform: scale(1.1); box-shadow: 0 4px 8px rgba(255, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3); }
    100% { transform: scale(1); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2); }
  }
  
  @keyframes baekje-pulse {
    0% { 
      transform: scale(1); 
      box-shadow: 
        0 3px 8px rgba(0, 0, 0, 0.6),
        0 1px 3px rgba(0, 0, 0, 0.4);
    }
    30% { 
      transform: scale(1.1); 
      box-shadow: 
        0 6px 16px rgba(184, 134, 11, 0.4),
        0 3px 8px rgba(0, 0, 0, 0.6),
        0 0 12px rgba(218, 165, 32, 0.3);
    }
    60% {
      transform: scale(1.05);
      box-shadow: 
        0 4px 12px rgba(184, 134, 11, 0.3),
        0 2px 6px rgba(0, 0, 0, 0.5);
    }
    100% { 
      transform: scale(1); 
      box-shadow: 
        0 3px 8px rgba(0, 0, 0, 0.6),
        0 1px 3px rgba(0, 0, 0, 0.4);
    }
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