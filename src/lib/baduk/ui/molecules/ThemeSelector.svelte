<script lang="ts">
  import { Check, Palette, Sparkles } from 'lucide-svelte';
  import { boardTheme, setTheme, type BoardTheme } from '../stores/themeStore';
  
  let currentTheme = $state('modern' as BoardTheme);
  
  boardTheme.subscribe(theme => {
    currentTheme = theme;
  });
  
  const themes = [
    {
      id: 'modern' as BoardTheme,
      name: 'Modern',
      description: 'Clean & minimal design',
      preview: 'linear-gradient(135deg, #E6D4B7 0%, #D4B896 50%, #C4A373 100%)',
      icon: Palette
    },
    {
      id: 'baekje' as BoardTheme,
      name: 'Baekje Classic',
      description: 'Traditional rosewood style',
      preview: 'linear-gradient(135deg, #8B4513 0%, #A0522D 25%, #654321 50%, #5D4E37 75%, #4A2C17 100%)',
      icon: Sparkles
    }
  ];
</script>

<div class="theme-selector">
  <div class="theme-options">
    {#each themes as theme}
      <button
        class="theme-option"
        class:active={currentTheme === theme.id}
        onclick={() => setTheme(theme.id)}
      >
        <div class="theme-preview-container">
          <div class="theme-preview" style="background: {theme.preview}">
            <div class="preview-grid">
              <div class="preview-line horizontal"></div>
              <div class="preview-line vertical"></div>
              <div class="preview-stone black"></div>
              <div class="preview-stone white"></div>
            </div>
          </div>
          {#if currentTheme === theme.id}
            <div class="selected-indicator">
              <Check size={14} />
            </div>
          {/if}
        </div>
        
        <div class="theme-info">
          <div class="theme-header">
            <svelte:component this={theme.icon} size={16} />
            <span class="theme-name">{theme.name}</span>
          </div>
          <p class="theme-description">{theme.description}</p>
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .theme-selector {
    width: 100%;
  }
  
  .theme-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .theme-option {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border: 1px solid #e1e5e9;
    border-radius: 12px;
    background: #ffffff;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
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
  
  .theme-preview {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    position: relative;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .preview-grid {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .preview-line {
    position: absolute;
    background: rgba(0, 0, 0, 0.3);
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
  
  .preview-stone {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  
  .preview-stone.black {
    background: #1c1c1e;
    top: 8px;
    left: 8px;
  }
  
  .preview-stone.white {
    background: #ffffff;
    border: 1px solid #d1d1d6;
    top: 8px;
    right: 8px;
  }
  
  .selected-indicator {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 20px;
    height: 20px;
    background: #007aff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border: 2px solid #ffffff;
  }
  
  .theme-info {
    flex: 1;
    text-align: left;
  }
  
  .theme-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }
  
  .theme-name {
    font-size: 15px;
    font-weight: 600;
    color: #1c1c1e;
  }
  
  .theme-description {
    margin: 0;
    font-size: 13px;
    color: #8e8e93;
    line-height: 1.3;
  }
  
  .theme-option.active .theme-name {
    color: #007aff;
  }
  
  @media (max-width: 768px) {
    .theme-option {
      padding: 12px;
      gap: 12px;
    }
    
    .theme-preview {
      width: 40px;
      height: 40px;
    }
    
    .preview-stone {
      width: 6px;
      height: 6px;
    }
    
    .preview-stone.black {
      top: 6px;
      left: 6px;
    }
    
    .preview-stone.white {
      top: 6px;
      right: 6px;
    }
  }
</style>