<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    Plus, 
    Save, 
    Trash2, 
    Palette, 
    Circle, 
    Square, 
    Diamond, 
    Hexagon, 
    Star,
    Download,
    Upload
  } from 'lucide-svelte';
  
  import {
    customStones,
    selectedCustomBlackStone,
    selectedCustomWhiteStone,
    addCustomStone,
    removeCustomStone,
    selectCustomBlackStone,
    selectCustomWhiteStone,
    generateStoneId,
    type CustomStoneConfig
  } from '$lib/baduk/ui/stores/customStoneStore';
  
  import type { StoneStyle } from '$lib/baduk/ui/stores/themeStore';

  // Stone designer state
  let designerMode: 'create' | 'select' = $state('create');
  let editingStone: CustomStoneConfig | null = $state(null);
  let stoneColor: 'black' | 'white' = $state('black');
  
  // Stone configuration
  let stoneName = $state('My Custom Stone');
  let stoneDescription = $state('Custom designed stone');
  let stoneShape: 'circle' | 'square' | 'diamond' | 'hexagon' | 'custom' = $state('circle');
  let auraColor = $state('#FFD700');
  
  // Black stone config
  let blackBackground = $state('radial-gradient(circle at 35% 35%, #333 0%, #111 50%, #000 100%)');
  let blackBorder = $state('2px solid #FFD700');
  let blackBoxShadow = $state('0 4px 12px rgba(255, 215, 0, 0.6), 0 2px 6px rgba(0, 0, 0, 0.8)');
  let blackImage = $state('');
  
  // White stone config
  let whiteBackground = $state('radial-gradient(circle at 35% 35%, #FFF 0%, #F5F5F5 50%, #E0E0E0 100%)');
  let whiteBorder = $state('2px solid #FFD700');
  let whiteBoxShadow = $state('0 4px 12px rgba(255, 215, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3), inset 0 2px 6px rgba(255, 255, 255, 0.9)');
  let whiteImage = $state('');
  
  // Last move marker config
  let markerBackground = $state('#FF4444');
  let markerSize = $state('6px');
  let markerBorder = $state('1px solid #FFFFFF');
  let markerBoxShadow = $state('0 2px 4px rgba(0, 0, 0, 0.4)');
  
  // Store subscriptions
  let currentCustomStones = $state<CustomStoneConfig[]>([]);
  let currentSelectedCustomBlackStone = $state<CustomStoneConfig | null>(null);
  let currentSelectedCustomWhiteStone = $state<CustomStoneConfig | null>(null);
  
  customStones.subscribe(stones => currentCustomStones = stones);
  selectedCustomBlackStone.subscribe(stone => currentSelectedCustomBlackStone = stone);
  selectedCustomWhiteStone.subscribe(stone => currentSelectedCustomWhiteStone = stone);

  // Derived values for current stone configuration
  let currentBackground = $derived.by(() => stoneColor === 'black' ? blackBackground : whiteBackground);
  let currentBorder = $derived.by(() => stoneColor === 'black' ? blackBorder : whiteBorder);
  let currentBoxShadow = $derived.by(() => stoneColor === 'black' ? blackBoxShadow : whiteBoxShadow);
  let currentImage = $derived.by(() => stoneColor === 'black' ? blackImage : whiteImage);

  // Functions to update current stone properties
  function updateBackground(value: string) {
    if (stoneColor === 'black') {
      blackBackground = value;
    } else {
      whiteBackground = value;
    }
  }

  function updateBorder(value: string) {
    if (stoneColor === 'black') {
      blackBorder = value;
    } else {
      whiteBorder = value;
    }
  }

  function updateBoxShadow(value: string) {
    if (stoneColor === 'black') {
      blackBoxShadow = value;
    } else {
      whiteBoxShadow = value;
    }
  }

  function updateImage(value: string) {
    if (stoneColor === 'black') {
      blackImage = value;
    } else {
      whiteImage = value;
    }
  }

  // Preset gradient options
  const backgroundPresets = [
    { name: 'Classic Black', value: 'radial-gradient(circle at 35% 35%, #333 0%, #111 50%, #000 100%)', type: 'black' },
    { name: 'Classic White', value: 'radial-gradient(circle at 35% 35%, #FFF 0%, #F5F5F5 50%, #E0E0E0 100%)', type: 'white' },
    { name: 'Gold Black', value: 'radial-gradient(circle at 35% 35%, #2F2F2F 0%, #1A1A1A 40%, #000000 85%)', type: 'black' },
    { name: 'Gold White', value: 'radial-gradient(circle at 35% 35%, #FFFACD 0%, #F5DEB3 40%, #DEB887 85%)', type: 'white' },
    { name: 'Neon Black', value: 'radial-gradient(circle at 30% 30%, #333333 0%, #000000 40%, #000000 85%)', type: 'black' },
    { name: 'Neon White', value: 'radial-gradient(circle at 30% 30%, #FFFFFF 0%, #E0E1DD 40%, #778DA9 85%)', type: 'white' },
    { name: 'Organic Black', value: 'linear-gradient(145deg, #220011 0%, #440022 50%, #663300 100%)', type: 'black' },
    { name: 'Organic White', value: 'linear-gradient(145deg, #66CC66 0%, #44AA44 50%, #228822 100%)', type: 'white' },
  ];

  function createStone() {
    const id = generateStoneId();
    
    const newStone: Omit<CustomStoneConfig, 'isCustom' | 'createdAt'> = {
      id: id as StoneStyle,
      name: stoneName,
      description: stoneDescription,
      black: {
        background: blackBackground,
        border: blackBorder,
        boxShadow: blackBoxShadow,
        shape: stoneShape,
        image: blackImage || undefined
      },
      white: {
        background: whiteBackground,
        border: whiteBorder,
        boxShadow: whiteBoxShadow,
        shape: stoneShape,
        image: whiteImage || undefined
      },
      lastMoveMarker: {
        background: markerBackground,
        size: markerSize,
        border: markerBorder,
        boxShadow: markerBoxShadow
      },
      auraColor
    };
    
    const customStone = addCustomStone(newStone);
    alert(`Stone "${stoneName}" created successfully!`);
    resetForm();
  }

  function resetForm() {
    stoneName = 'My Custom Stone';
    stoneDescription = 'Custom designed stone';
    stoneShape = 'circle';
    auraColor = '#FFD700';
    blackBackground = 'radial-gradient(circle at 35% 35%, #333 0%, #111 50%, #000 100%)';
    blackBorder = '2px solid #FFD700';
    blackBoxShadow = '0 4px 12px rgba(255, 215, 0, 0.6), 0 2px 6px rgba(0, 0, 0, 0.8)';
    blackImage = '';
    whiteBackground = 'radial-gradient(circle at 35% 35%, #FFF 0%, #F5F5F5 50%, #E0E0E0 100%)';
    whiteBorder = '2px solid #FFD700';
    whiteBoxShadow = '0 4px 12px rgba(255, 215, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3), inset 0 2px 6px rgba(255, 255, 255, 0.9)';
    whiteImage = '';
    markerBackground = '#FF4444';
    markerSize = '6px';
    markerBorder = '1px solid #FFFFFF';
    markerBoxShadow = '0 2px 4px rgba(0, 0, 0, 0.4)';
    editingStone = null;
  }

  function editStone(stone: CustomStoneConfig) {
    editingStone = stone;
    stoneName = stone.name;
    stoneDescription = stone.description;
    stoneShape = stone.black.shape || 'circle';
    auraColor = stone.auraColor || '#FFD700';
    blackBackground = stone.black.background;
    blackBorder = stone.black.border;
    blackBoxShadow = stone.black.boxShadow;
    blackImage = stone.black.image || '';
    whiteBackground = stone.white.background;
    whiteBorder = stone.white.border;
    whiteBoxShadow = stone.white.boxShadow;
    whiteImage = stone.white.image || '';
    markerBackground = stone.lastMoveMarker.background;
    markerSize = stone.lastMoveMarker.size;
    markerBorder = stone.lastMoveMarker.border || '';
    markerBoxShadow = stone.lastMoveMarker.boxShadow || '';
    designerMode = 'create';
  }

  function updateStone() {
    if (!editingStone) return;
    
    removeCustomStone(editingStone.id);
    createStone();
  }

  function deleteStone(stone: CustomStoneConfig) {
    if (confirm(`Are you sure you want to delete "${stone.name}"?`)) {
      removeCustomStone(stone.id);
    }
  }

  function selectStoneForColor(stone: CustomStoneConfig, color: 'black' | 'white') {
    if (color === 'black') {
      selectCustomBlackStone(stone);
    } else {
      selectCustomWhiteStone(stone);
    }
  }

  function applyBackgroundPreset(preset: typeof backgroundPresets[0]) {
    updateBackground(preset.value);
  }

  function getShapeIcon(shape: string) {
    switch (shape) {
      case 'circle': return Circle;
      case 'square': return Square;
      case 'diamond': return Diamond;
      case 'hexagon': return Hexagon;
      case 'custom': return Star;
      default: return Circle;
    }
  }
</script>

<div class="designer-page">
  <div class="page-header">
    <div class="header-content">
      <h1>🎨 Stone Designer</h1>
      <p>Create and customize your own unique stone designs</p>
    </div>
  </div>

  <div class="designer-content">
    <div class="designer-tabs">
      <button
        class="tab-button"
        class:active={designerMode === 'create'}
        onclick={() => designerMode = 'create'}
      >
        <Plus size={18} />
        Create Stone
      </button>
      <button
        class="tab-button"
        class:active={designerMode === 'select'}
        onclick={() => designerMode = 'select'}
      >
        <Palette size={18} />
        My Stones ({currentCustomStones.length})
      </button>
    </div>

    {#if designerMode === 'create'}
      <div class="create-section">
        <div class="form-container">
          <div class="form-section">
            <h3>Basic Information</h3>
            <div class="form-group">
              <label for="stone-name">Stone Name</label>
              <input
                id="stone-name"
                type="text"
                bind:value={stoneName}
                placeholder="Enter stone name"
              />
            </div>
            <div class="form-group">
              <label for="stone-description">Description</label>
              <input
                id="stone-description"
                type="text"
                bind:value={stoneDescription}
                placeholder="Describe your stone"
              />
            </div>
            <div class="form-group">
              <label for="stone-shape">Shape</label>
              <select id="stone-shape" bind:value={stoneShape}>
                <option value="circle">Circle</option>
                <option value="square">Square</option>
                <option value="diamond">Diamond</option>
                <option value="hexagon">Hexagon</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div class="form-group">
              <label for="aura-color">Aura Color (Outer Border)</label>
              <div class="color-input-group">
                <input
                  id="aura-color"
                  type="color"
                  bind:value={auraColor}
                />
                <input
                  type="text"
                  bind:value={auraColor}
                  placeholder="#FFD700"
                />
              </div>
            </div>
          </div>

          <div class="stone-config-tabs">
            <button
              class="config-tab"
              class:active={stoneColor === 'black'}
              onclick={() => stoneColor = 'black'}
            >
              <Circle size={16} fill="#000" stroke="#000" />
              Black Stone
            </button>
            <button
              class="config-tab"
              class:active={stoneColor === 'white'}
              onclick={() => stoneColor = 'white'}
            >
              <Circle size={16} fill="#fff" stroke="#888" />
              White Stone
            </button>
          </div>

          <div class="form-section">
            <h3>{stoneColor === 'black' ? 'Black' : 'White'} Stone Configuration</h3>
            
            <div class="form-group">
              <label>Background Presets</label>
              <div class="preset-grid">
                {#each backgroundPresets.filter(p => p.type === stoneColor) as preset}
                  <button
                    class="preset-button"
                    onclick={() => applyBackgroundPreset(preset)}
                    style="background: {preset.value}"
                  >
                    {preset.name}
                  </button>
                {/each}
              </div>
            </div>
            
            <div class="form-group">
              <label for="background">Background (CSS Gradient/Color)</label>
              <textarea
                id="background"
                value={currentBackground}
                oninput={(e) => updateBackground(e.target.value)}
                placeholder="radial-gradient(...) or #color"
                rows="3"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="border">Border</label>
              <input
                id="border"
                type="text"
                value={currentBorder}
                oninput={(e) => updateBorder(e.target.value)}
                placeholder="2px solid #FFD700"
              />
            </div>
            
            <div class="form-group">
              <label for="box-shadow">Box Shadow</label>
              <textarea
                id="box-shadow"
                value={currentBoxShadow}
                oninput={(e) => updateBoxShadow(e.target.value)}
                placeholder="0 4px 12px rgba(...), ..."
                rows="3"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="image">Stone Image URL (Optional)</label>
              <input
                id="image"
                type="url"
                value={currentImage}
                oninput={(e) => updateImage(e.target.value)}
                placeholder="https://example.com/stone.png"
              />
            </div>
          </div>

          <div class="form-section">
            <h3>Last Move Marker</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="marker-bg">Background</label>
                <input
                  id="marker-bg"
                  type="text"
                  bind:value={markerBackground}
                  placeholder="#FF4444"
                />
              </div>
              <div class="form-group">
                <label for="marker-size">Size</label>
                <input
                  id="marker-size"
                  type="text"
                  bind:value={markerSize}
                  placeholder="6px"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="marker-border">Border</label>
                <input
                  id="marker-border"
                  type="text"
                  bind:value={markerBorder}
                  placeholder="1px solid #FFFFFF"
                />
              </div>
              <div class="form-group">
                <label for="marker-shadow">Box Shadow</label>
                <input
                  id="marker-shadow"
                  type="text"
                  bind:value={markerBoxShadow}
                  placeholder="0 2px 4px rgba(0, 0, 0, 0.4)"
                />
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="action-button secondary" onclick={resetForm}>
              <Trash2 size={16} />
              Reset
            </button>
            <button 
              class="action-button primary" 
              onclick={editingStone ? updateStone : createStone}
            >
              <Save size={16} />
              {editingStone ? 'Update Stone' : 'Create Stone'}
            </button>
          </div>
        </div>

        <div class="preview-container">
          <div class="preview-section">
            <h3>Preview</h3>
            <div class="stone-preview-grid">
              <div class="preview-board">
                <div class="preview-grid-lines"></div>
                
                <!-- Black stone preview -->
                <div 
                  class="preview-stone black"
                  class:shape-circle={stoneShape === 'circle'}
                  class:shape-square={stoneShape === 'square'}
                  class:shape-diamond={stoneShape === 'diamond'}
                  class:shape-hexagon={stoneShape === 'hexagon'}
                  class:shape-custom={stoneShape === 'custom'}
                  style="
                    background: {blackImage ? 'rgba(0, 0, 0, 0.1)' : blackBackground};
                    border: {blackBorder};
                    box-shadow: {blackBoxShadow};
                    --aura-color: {auraColor};
                  "
                >
                  {#if blackImage}
                    <img src={blackImage} alt="Black stone" />
                  {/if}
                  <div class="aura-ring"></div>
                </div>
                
                <!-- White stone preview -->
                <div 
                  class="preview-stone white"
                  class:shape-circle={stoneShape === 'circle'}
                  class:shape-square={stoneShape === 'square'}
                  class:shape-diamond={stoneShape === 'diamond'}
                  class:shape-hexagon={stoneShape === 'hexagon'}
                  class:shape-custom={stoneShape === 'custom'}
                  style="
                    background: {whiteImage ? 'rgba(255, 255, 255, 0.1)' : whiteBackground};
                    border: {whiteBorder};
                    box-shadow: {whiteBoxShadow};
                    --aura-color: {auraColor};
                  "
                >
                  {#if whiteImage}
                    <img src={whiteImage} alt="White stone" />
                  {/if}
                  <div class="aura-ring"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}

    {#if designerMode === 'select'}
      <div class="selection-section">
        {#if currentCustomStones.length === 0}
          <div class="empty-state">
            <Palette size={48} />
            <h3>No Custom Stones Yet</h3>
            <p>Create your first custom stone design!</p>
            <button
              class="action-button primary"
              onclick={() => designerMode = 'create'}
            >
              <Plus size={16} />
              Create Stone
            </button>
          </div>
        {:else}
          <div class="stones-grid">
            {#each currentCustomStones as stone}
              <div class="stone-card">
                <div class="stone-card-preview">
                  <div class="card-preview-stones">
                    <div 
                      class="card-stone black"
                      class:shape-circle={!stone.black.shape || stone.black.shape === 'circle'}
                      class:shape-square={stone.black.shape === 'square'}
                      class:shape-diamond={stone.black.shape === 'diamond'}
                      class:shape-hexagon={stone.black.shape === 'hexagon'}
                      class:shape-custom={stone.black.shape === 'custom'}
                      style="
                        background: {stone.black.image ? 'rgba(0, 0, 0, 0.1)' : stone.black.background};
                        border: {stone.black.border};
                        box-shadow: {stone.black.boxShadow};
                        --aura-color: {stone.auraColor || '#FFD700'};
                      "
                    >
                      {#if stone.black.image}
                        <img src={stone.black.image} alt="Black {stone.name}" />
                      {/if}
                      <div class="aura-ring"></div>
                    </div>
                    <div 
                      class="card-stone white"
                      class:shape-circle={!stone.white.shape || stone.white.shape === 'circle'}
                      class:shape-square={stone.white.shape === 'square'}
                      class:shape-diamond={stone.white.shape === 'diamond'}
                      class:shape-hexagon={stone.white.shape === 'hexagon'}
                      class:shape-custom={stone.white.shape === 'custom'}
                      style="
                        background: {stone.white.image ? 'rgba(255, 255, 255, 0.1)' : stone.white.background};
                        border: {stone.white.border};
                        box-shadow: {stone.white.boxShadow};
                        --aura-color: {stone.auraColor || '#FFD700'};
                      "
                    >
                      {#if stone.white.image}
                        <img src={stone.white.image} alt="White {stone.name}" />
                      {/if}
                      <div class="aura-ring"></div>
                    </div>
                  </div>
                </div>
                
                <div class="stone-card-info">
                  <div class="stone-card-header">
                    <h4>{stone.name}</h4>
                    <div class="stone-card-actions">
                      <button
                        class="icon-button"
                        onclick={() => editStone(stone)}
                        title="Edit stone"
                      >
                        <Palette size={14} />
                      </button>
                      <button
                        class="icon-button danger"
                        onclick={() => deleteStone(stone)}
                        title="Delete stone"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p class="stone-description">{stone.description}</p>
                  
                  <div class="selection-buttons">
                    <button
                      class="select-button black"
                      class:selected={currentSelectedCustomBlackStone?.id === stone.id}
                      onclick={() => selectStoneForColor(stone, 'black')}
                    >
                      <Circle size={12} fill="#000" stroke="#000" />
                      Black
                    </button>
                    <button
                      class="select-button white"
                      class:selected={currentSelectedCustomWhiteStone?.id === stone.id}
                      onclick={() => selectStoneForColor(stone, 'white')}
                    >
                      <Circle size={12} fill="#fff" stroke="#888" />
                      White
                    </button>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .designer-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    overflow: hidden;
  }
  
  .page-header {
    background: linear-gradient(135deg, #8B4513 0%, #D2B48C 100%);
    padding: 2rem 0;
    text-align: center;
    box-shadow: 0 2px 10px rgba(139, 69, 19, 0.2);
  }
  
  .header-content h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .header-content p {
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
  }
  
  .designer-content {
    flex: 1;
    padding: 2rem;
    overflow: auto;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }
  
  .designer-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid #e5e5e5;
  }
  
  .tab-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    color: #666;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
  }
  
  .tab-button:hover {
    color: #8B4513;
  }
  
  .tab-button.active {
    color: #8B4513;
    border-bottom-color: #8B4513;
  }
  
  .create-section {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
  }
  
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .form-section {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .form-section h3 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 0.5rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .form-group label {
    font-weight: 500;
    color: #555;
  }
  
  .form-group input,
  .form-group textarea,
  .form-group select {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
    transition: border-color 0.2s;
  }
  
  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    outline: none;
    border-color: #8B4513;
    box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.1);
  }
  
  .color-input-group {
    display: flex;
    gap: 0.5rem;
  }
  
  .color-input-group input[type="color"] {
    width: 60px;
    height: 45px;
    padding: 0;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .color-input-group input[type="text"] {
    flex: 1;
  }
  
  .stone-config-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .config-tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 6px;
    font-size: 0.9rem;
    transition: all 0.2s;
  }
  
  .config-tab:hover {
    border-color: #8B4513;
  }
  
  .config-tab.active {
    border-color: #8B4513;
    background: rgba(139, 69, 19, 0.1);
    color: #8B4513;
  }
  
  .preset-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .preset-button {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 500;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    transition: transform 0.2s;
  }
  
  .preset-button:hover {
    transform: scale(1.02);
  }
  
  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
  }
  
  .action-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .action-button.primary {
    background: #8B4513;
    color: white;
  }
  
  .action-button.primary:hover {
    background: #704010;
  }
  
  .action-button.secondary {
    background: #f5f5f5;
    color: #666;
    border: 1px solid #ddd;
  }
  
  .action-button.secondary:hover {
    background: #eeeeee;
  }
  
  .preview-container {
    position: sticky;
    top: 2rem;
    height: fit-content;
  }
  
  .preview-section {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .preview-section h3 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    color: #333;
    text-align: center;
  }
  
  .stone-preview-grid {
    display: flex;
    justify-content: center;
  }
  
  .preview-board {
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, #E6D4B7 0%, #D4B896 50%, #C4A373 100%);
    border-radius: 12px;
    position: relative;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .preview-grid-lines {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(to right, transparent 49%, #654321 49%, #654321 51%, transparent 51%),
      linear-gradient(to bottom, transparent 49%, #654321 49%, #654321 51%, transparent 51%);
  }
  
  .preview-stone {
    position: absolute;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }
  
  .preview-stone img {
    width: 80%;
    height: 80%;
    object-fit: contain;
  }
  
  .preview-stone.black {
    top: 30px;
    right: 30px;
  }
  
  .preview-stone.white {
    bottom: 30px;
    left: 30px;
  }
  
  .aura-ring {
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border: 2px solid var(--aura-color, #FFD700);
    border-radius: inherit;
    opacity: 0.6;
    z-index: -1;
  }
  
  /* Shape variations */
  .preview-stone.shape-circle,
  .card-stone.shape-circle {
    border-radius: 50%;
  }
  
  .preview-stone.shape-square,
  .card-stone.shape-square {
    border-radius: 15%;
  }
  
  .preview-stone.shape-diamond,
  .card-stone.shape-diamond {
    border-radius: 20%;
    transform: rotate(45deg);
  }
  
  .preview-stone.shape-hexagon,
  .card-stone.shape-hexagon {
    border-radius: 10%;
    clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
  }
  
  .preview-stone.shape-custom,
  .card-stone.shape-custom {
    border-radius: 30%;
    clip-path: ellipse(45% 40% at 50% 50%);
  }
  
  .selection-section {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #666;
  }
  
  .empty-state h3 {
    margin: 1rem 0 0.5rem 0;
    font-size: 1.5rem;
  }
  
  .stones-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .stone-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.2s;
  }
  
  .stone-card:hover {
    transform: translateY(-2px);
  }
  
  .stone-card-preview {
    padding: 1.5rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border-bottom: 1px solid #f0f0f0;
  }
  
  .card-preview-stones {
    display: flex;
    justify-content: center;
    gap: 2rem;
    align-items: center;
  }
  
  .card-stone {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .card-stone img {
    width: 80%;
    height: 80%;
    object-fit: contain;
  }
  
  .stone-card-info {
    padding: 1.5rem;
  }
  
  .stone-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .stone-card-header h4 {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
  }
  
  .stone-card-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .icon-button:hover {
    border-color: #8B4513;
    color: #8B4513;
  }
  
  .icon-button.danger:hover {
    border-color: #dc3545;
    color: #dc3545;
  }
  
  .stone-description {
    margin: 0 0 1rem 0;
    font-size: 0.9rem;
    color: #666;
  }
  
  .selection-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .select-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;
    flex: 1;
    justify-content: center;
  }
  
  .select-button:hover {
    border-color: #8B4513;
  }
  
  .select-button.selected {
    border-color: #8B4513;
    background: rgba(139, 69, 19, 0.1);
    color: #8B4513;
    font-weight: 500;
  }
  
  @media (max-width: 1024px) {
    .create-section {
      grid-template-columns: 1fr;
    }
    
    .preview-container {
      position: static;
    }
  }
  
  @media (max-width: 768px) {
    .designer-content {
      padding: 1rem;
    }
    
    .stones-grid {
      grid-template-columns: 1fr;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .preview-board {
      width: 150px;
      height: 150px;
    }
    
    .preview-stone {
      width: 35px;
      height: 35px;
    }
  }
</style>