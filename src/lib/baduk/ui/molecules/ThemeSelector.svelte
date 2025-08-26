<script lang="ts">
  import { Check, Palette, Sparkles, Crown, Zap, Minimize2, Star, Shield, Mountain, Flame, TreePine, Layers, Circle, Hexagon, Bug, Cpu } from 'lucide-svelte';
  import { 
    blackStoneStyle,
    whiteStoneStyle, 
    currentBoardBackground, 
    setBlackStoneStyle,
    setWhiteStoneStyle, 
    setBoardBackground, 
    stoneStyles, 
    boardBackgrounds,
    type StoneStyle,
    type BoardBackground 
  } from '../stores/themeStore';
  
  let selectedBlackStoneStyle = $state<StoneStyle>('japanese');
  let selectedWhiteStoneStyle = $state<StoneStyle>('korean');
  let selectedBoardBackground = $state<BoardBackground>('classic');
  
  blackStoneStyle.subscribe(style => {
    selectedBlackStoneStyle = style;
  });
  
  whiteStoneStyle.subscribe(style => {
    selectedWhiteStoneStyle = style;
  });
  
  currentBoardBackground.subscribe(background => {
    selectedBoardBackground = background;
  });
  
  const stoneStylesList = [
    {
      ...stoneStyles.korean,
      icon: Star
    },
    {
      ...stoneStyles.japanese,
      icon: Mountain
    },
    {
      ...stoneStyles.chinese,
      icon: Flame
    },
    {
      ...stoneStyles.western,
      icon: TreePine
    },
    {
      ...stoneStyles.modern,
      icon: Palette
    },
    {
      ...stoneStyles.neon,
      icon: Zap
    },
    {
      ...stoneStyles.royal,
      icon: Crown
    },
    {
      ...stoneStyles.protoss,
      icon: Hexagon
    },
    {
      ...stoneStyles.zerg,
      icon: Bug
    },
    {
      ...stoneStyles.terran,
      icon: Cpu
    }
  ];
  
  const boardBackgroundsList = [
    {
      ...boardBackgrounds.classic,
      icon: TreePine
    },
    {
      ...boardBackgrounds.modern,
      icon: Minimize2
    },
    {
      ...boardBackgrounds.neon,
      icon: Zap
    },
    {
      ...boardBackgrounds.vintage,
      icon: Sparkles
    },
    {
      ...boardBackgrounds.marble,
      icon: Shield
    },
    {
      ...boardBackgrounds.wood,
      icon: TreePine
    },
    {
      ...boardBackgrounds.paper,
      icon: Palette
    }
  ];
</script>

<div class="theme-selector">
  <!-- Black Stone Style Section -->
  <div class="theme-section">
    <div class="section-header">
      <Circle size={18} fill="#000" stroke="#000" />
      <h4>Black Stone Style</h4>
      <span class="section-subtitle">흑돌 스타일</span>
    </div>
    
    <div class="theme-options stone-styles">
      {#each stoneStylesList as stoneStyle}
        <button
          class="theme-option compact"
          class:active={selectedBlackStoneStyle === stoneStyle.id}
          onclick={() => setBlackStoneStyle(stoneStyle.id)}
        >
          <div class="theme-preview-container">
            <div class="stone-preview">
              <!-- Preview black stone with selected style -->
              <div class="preview-stones">
                <div 
                  class="preview-stone black"
                  class:shape-circle={!stoneStyle.black.shape || stoneStyle.black.shape === 'circle'}
                  class:shape-square={stoneStyle.black.shape === 'square'}
                  class:shape-diamond={stoneStyle.black.shape === 'diamond'}
                  class:shape-hexagon={stoneStyle.black.shape === 'hexagon'}
                  class:shape-custom={stoneStyle.black.shape === 'custom'}
                  style="
                    background: {stoneStyle.black.image ? 'rgba(0, 0, 0, 0.1)' : stoneStyle.black.background};
                    border: {stoneStyle.black.border};
                    box-shadow: {stoneStyle.black.boxShadow};
                  "
                >
                  {#if stoneStyle.black.image}
                    <img 
                      src={stoneStyle.black.image} 
                      alt="{stoneStyle.name} black"
                      class="preview-stone-image"
                      onerror={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target) target.style.display = 'none';
                      }}
                    />
                  {/if}
                </div>
              </div>
            </div>
            {#if selectedBlackStoneStyle === stoneStyle.id}
              <div class="selected-indicator">
                <Check size={12} />
              </div>
            {/if}
          </div>
          
          <div class="theme-info">
            <div class="theme-header">
              {#each [stoneStyle.icon] as IconComponent}
                <IconComponent size={14} />
              {/each}
              <span class="theme-name">{stoneStyle.name}</span>
            </div>
            <p class="theme-description">{stoneStyle.description}</p>
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- White Stone Style Section -->
  <div class="theme-section">
    <div class="section-header">
      <Circle size={18} fill="#fff" stroke="#888" />
      <h4>White Stone Style</h4>
      <span class="section-subtitle">백돌 스타일</span>
    </div>
    
    <div class="theme-options stone-styles">
      {#each stoneStylesList as stoneStyle}
        <button
          class="theme-option compact"
          class:active={selectedWhiteStoneStyle === stoneStyle.id}
          onclick={() => setWhiteStoneStyle(stoneStyle.id)}
        >
          <div class="theme-preview-container">
            <div class="stone-preview">
              <!-- Preview white stone with selected style -->
              <div class="preview-stones">
                <div 
                  class="preview-stone white"
                  class:shape-circle={!stoneStyle.white.shape || stoneStyle.white.shape === 'circle'}
                  class:shape-square={stoneStyle.white.shape === 'square'}
                  class:shape-diamond={stoneStyle.white.shape === 'diamond'}
                  class:shape-hexagon={stoneStyle.white.shape === 'hexagon'}
                  class:shape-custom={stoneStyle.white.shape === 'custom'}
                  style="
                    background: {stoneStyle.white.image ? 'rgba(255, 255, 255, 0.1)' : stoneStyle.white.background};
                    border: {stoneStyle.white.border};
                    box-shadow: {stoneStyle.white.boxShadow};
                  "
                >
                  {#if stoneStyle.white.image}
                    <img 
                      src={stoneStyle.white.image} 
                      alt="{stoneStyle.name} white"
                      class="preview-stone-image"
                      onerror={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target) target.style.display = 'none';
                      }}
                    />
                  {/if}
                </div>
              </div>
            </div>
            {#if selectedWhiteStoneStyle === stoneStyle.id}
              <div class="selected-indicator">
                <Check size={12} />
              </div>
            {/if}
          </div>
          
          <div class="theme-info">
            <div class="theme-header">
              {#each [stoneStyle.icon] as IconComponent}
                <IconComponent size={14} />
              {/each}
              <span class="theme-name">{stoneStyle.name}</span>
            </div>
            <p class="theme-description">{stoneStyle.description}</p>
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Board Backgrounds Section -->
  <div class="theme-section">
    <div class="section-header">
      <Layers size={18} />
      <h4>Board Background</h4>
      <span class="section-subtitle">바둑판 배경</span>
    </div>
    
    <div class="theme-options board-backgrounds">
      {#each boardBackgroundsList as boardBg}
        <button
          class="theme-option compact"
          class:active={selectedBoardBackground === boardBg.id}
          onclick={() => setBoardBackground(boardBg.id)}
        >
          <div class="theme-preview-container">
            <div class="board-preview" style="background: {boardBg.preview}">
              <div class="preview-grid">
                <div class="preview-line horizontal" style="background: {boardBg.gridColor}"></div>
                <div class="preview-line vertical" style="background: {boardBg.gridColor}"></div>
                <div class="preview-star-point" style="background: {boardBg.starPointColor}"></div>
              </div>
            </div>
            {#if selectedBoardBackground === boardBg.id}
              <div class="selected-indicator">
                <Check size={12} />
              </div>
            {/if}
          </div>
          
          <div class="theme-info">
            <div class="theme-header">
              {#each [boardBg.icon] as IconComponent}
                <IconComponent size={14} />
              {/each}
              <span class="theme-name">{boardBg.name}</span>
            </div>
            <p class="theme-description">{boardBg.description}</p>
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Combined Preview Section -->
  <div class="combined-preview-section">
    <div class="section-header">
      <Palette size={18} />
      <h4>Combined Preview</h4>
      <span class="section-subtitle">조합 미리보기</span>
    </div>
    
    <div class="combined-preview">
      <div 
        class="preview-board" 
        style="
          background: {boardBackgrounds[selectedBoardBackground].background};
          border-radius: {boardBackgrounds[selectedBoardBackground].borderRadius};
          box-shadow: {boardBackgrounds[selectedBoardBackground].boxShadow};
        "
      >
        <div class="preview-grid-lines">
          <div 
            class="grid-line h" 
            style="background: {boardBackgrounds[selectedBoardBackground].gridColor}"
          ></div>
          <div 
            class="grid-line v" 
            style="background: {boardBackgrounds[selectedBoardBackground].gridColor}"
          ></div>
        </div>
        <div 
          class="star-point" 
          style="background: {boardBackgrounds[selectedBoardBackground].starPointColor}"
        ></div>
        
        <!-- Show both black and white stones with their selected styles -->
        <div 
          class="combined-stone black"
          class:shape-circle={!stoneStyles[selectedBlackStoneStyle].black.shape || stoneStyles[selectedBlackStoneStyle].black.shape === 'circle'}
          class:shape-square={stoneStyles[selectedBlackStoneStyle].black.shape === 'square'}
          class:shape-diamond={stoneStyles[selectedBlackStoneStyle].black.shape === 'diamond'}
          class:shape-hexagon={stoneStyles[selectedBlackStoneStyle].black.shape === 'hexagon'}
          class:shape-custom={stoneStyles[selectedBlackStoneStyle].black.shape === 'custom'}
          style="
            background: {stoneStyles[selectedBlackStoneStyle].black.image ? 'rgba(0, 0, 0, 0.1)' : stoneStyles[selectedBlackStoneStyle].black.background};
            border: {stoneStyles[selectedBlackStoneStyle].black.border};
            box-shadow: {stoneStyles[selectedBlackStoneStyle].black.boxShadow};
          "
        >
          {#if stoneStyles[selectedBlackStoneStyle].black.image}
            <img 
              src={stoneStyles[selectedBlackStoneStyle].black.image} 
              alt="{stoneStyles[selectedBlackStoneStyle].name} black"
              class="combined-stone-image"
              onerror={(e) => {
                const target = e.target as HTMLImageElement;
                if (target) target.style.display = 'none';
              }}
            />
          {:else}
            <span class="stone-label">B</span>
          {/if}
        </div>
        <div 
          class="combined-stone white"
          class:shape-circle={!stoneStyles[selectedWhiteStoneStyle].white.shape || stoneStyles[selectedWhiteStoneStyle].white.shape === 'circle'}
          class:shape-square={stoneStyles[selectedWhiteStoneStyle].white.shape === 'square'}
          class:shape-diamond={stoneStyles[selectedWhiteStoneStyle].white.shape === 'diamond'}
          class:shape-hexagon={stoneStyles[selectedWhiteStoneStyle].white.shape === 'hexagon'}
          class:shape-custom={stoneStyles[selectedWhiteStoneStyle].white.shape === 'custom'}
          style="
            background: {stoneStyles[selectedWhiteStoneStyle].white.image ? 'rgba(255, 255, 255, 0.1)' : stoneStyles[selectedWhiteStoneStyle].white.background};
            border: {stoneStyles[selectedWhiteStoneStyle].white.border};
            box-shadow: {stoneStyles[selectedWhiteStoneStyle].white.boxShadow};
          "
        >
          {#if stoneStyles[selectedWhiteStoneStyle].white.image}
            <img 
              src={stoneStyles[selectedWhiteStoneStyle].white.image} 
              alt="{stoneStyles[selectedWhiteStoneStyle].name} white"
              class="combined-stone-image"
              onerror={(e) => {
                const target = e.target as HTMLImageElement;
                if (target) target.style.display = 'none';
              }}
            />
          {:else}
            <span class="stone-label">W</span>
          {/if}
        </div>
      </div>
      
      <div class="preview-legend">
        <div class="legend-item">
          <Circle size={12} fill="#000" stroke="#000" />
          <span>{stoneStyles[selectedBlackStoneStyle].name}</span>
        </div>
        <div class="legend-item">
          <Circle size={12} fill="#fff" stroke="#888" />
          <span>{stoneStyles[selectedWhiteStoneStyle].name}</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .theme-selector {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .theme-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f2f2f7;
  }
  
  .section-header h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: #1c1c1e;
  }
  
  .section-subtitle {
    font-size: 12px;
    color: #8e8e93;
    margin-left: auto;
  }
  
  .theme-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .theme-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    background: #ffffff;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
  }
  
  .theme-option.compact {
    padding: 10px 12px;
  }
  
  .theme-option:hover {
    border-color: #007aff;
    box-shadow: 0 2px 8px rgba(0, 122, 255, 0.1);
  }
  
  .theme-option.active {
    border-color: #007aff;
    background: #f0f8ff;
    box-shadow: 0 2px 12px rgba(0, 122, 255, 0.15);
  }
  
  .theme-preview-container {
    position: relative;
    flex-shrink: 0;
  }
  
  .stone-preview,
  .board-preview {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    position: relative;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }
  
  .stone-preview {
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .preview-stones {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .preview-stone {
    width: 20px;
    height: 20px;
  }
  
  .preview-stone.black {
    width: 20px;
    height: 20px;
  }
  
  .preview-stone.white {
    width: 20px;
    height: 20px;
  }
  
  /* Shape variations for preview stones */
  .preview-stone.shape-circle,
  .combined-stone.shape-circle {
    border-radius: 50%;
  }
  
  .preview-stone.shape-square,
  .combined-stone.shape-square {
    border-radius: 15%;
  }
  
  .preview-stone.shape-diamond,
  .combined-stone.shape-diamond {
    border-radius: 20%;
    transform: rotate(45deg);
  }
  
  .preview-stone.shape-hexagon,
  .combined-stone.shape-hexagon {
    border-radius: 10%;
    clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
  }
  
  .preview-stone.shape-custom,
  .combined-stone.shape-custom {
    border-radius: 30%;
    clip-path: ellipse(45% 40% at 50% 50%);
  }
  
  /* Stone image styles */
  .preview-stone-image,
  .combined-stone-image {
    width: 70%;
    height: 70%;
    object-fit: contain;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    transition: all 0.3s ease;
  }
  
  .preview-stone,
  .combined-stone {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  
  .preview-grid {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .preview-line {
    position: absolute;
  }
  
  .preview-line.horizontal {
    width: 100%;
    height: 1px;
    top: 50%;
    left: 0;
  }
  
  .preview-line.vertical {
    width: 1px;
    height: 100%;
    top: 0;
    left: 50%;
  }
  
  .preview-star-point {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    top: 25%;
    left: 25%;
    transform: translate(-50%, -50%);
  }
  
  .selected-indicator {
    position: absolute;
    top: -3px;
    right: -3px;
    width: 18px;
    height: 18px;
    background: #007aff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border: 2px solid #ffffff;
    font-size: 10px;
  }
  
  .theme-info {
    flex: 1;
    text-align: left;
  }
  
  .theme-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 2px;
  }
  
  .theme-name {
    font-size: 13px;
    font-weight: 600;
    color: #1c1c1e;
  }
  
  .theme-description {
    margin: 0;
    font-size: 11px;
    color: #8e8e93;
    line-height: 1.3;
  }
  
  .theme-option.active .theme-name {
    color: #007aff;
  }
  
  /* Combined Preview Section */
  .combined-preview-section {
    padding: 16px;
    background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
    border: 1px solid rgba(139, 69, 19, 0.1);
    border-radius: 12px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }
  
  .combined-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-top: 12px;
  }
  
  .preview-board {
    width: 100px;
    height: 100px;
    position: relative;
    padding: 8px;
  }
  
  .preview-grid-lines {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  
  .grid-line {
    position: absolute;
  }
  
  .grid-line.h {
    width: 100%;
    height: 1px;
    top: 50%;
    left: 0;
  }
  
  .grid-line.v {
    width: 1px;
    height: 100%;
    top: 0;
    left: 50%;
  }
  
  .star-point {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    top: 25%;
    left: 25%;
    transform: translate(-50%, -50%);
  }
  
  .combined-stone {
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .combined-stone.black {
    top: 25%;
    left: 70%;
    transform: translate(-50%, -50%);
  }
  
  .combined-stone.white {
    top: 70%;
    left: 30%;
    transform: translate(-50%, -50%);
  }
  
  .stone-label {
    font-size: 10px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.8);
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  }
  
  .combined-stone.white .stone-label {
    color: rgba(0, 0, 0, 0.6);
    text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  }
  
  .preview-legend {
    display: flex;
    gap: 20px;
    align-items: center;
    font-size: 12px;
    color: #666;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  @media (max-width: 768px) {
    .theme-selector {
      gap: 20px;
    }
    
    .theme-option {
      padding: 10px;
      gap: 10px;
    }
    
    .stone-preview,
    .board-preview {
      width: 32px;
      height: 32px;
    }
    
    .preview-stone {
      width: 16px;
      height: 16px;
    }
    
    .combined-preview-section {
      padding: 12px;
    }
    
    .preview-board {
      width: 80px;
      height: 80px;
      padding: 6px;
    }
    
    .combined-stone {
      width: 18px;
      height: 18px;
    }
    
    .stone-label {
      font-size: 8px;
    }
  }
</style>