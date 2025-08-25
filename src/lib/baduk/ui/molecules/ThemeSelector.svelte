<script lang="ts">
  import { boardTheme, setTheme, type BoardTheme } from '../stores/themeStore';
  
  let currentTheme = $state('modern' as BoardTheme);
  
  boardTheme.subscribe(theme => {
    currentTheme = theme;
  });
  
  const themes = [
    {
      id: 'modern' as BoardTheme,
      name: '현대적 스타일',
      description: '깔끔한 현대적 디자인',
      icon: '🎯',
      preview: 'linear-gradient(135deg, #E6D4B7 0%, #D4B896 50%, #C4A373 100%)'
    },
    {
      id: 'baekje' as BoardTheme,
      name: '백제 목화자단기국',
      description: '전통 자단목 궁궐 스타일',
      icon: '🏛️',
      preview: 'linear-gradient(135deg, #8B4513 0%, #A0522D 25%, #654321 50%, #5D4E37 75%, #4A2C17 100%)'
    }
  ];
</script>

<div class="theme-selector">
  <h3>🎨 바둑판 테마 선택</h3>
  <div class="theme-options">
    {#each themes as theme}
      <button
        class="theme-option"
        class:active={currentTheme === theme.id}
        onclick={() => setTheme(theme.id)}
      >
        <div class="theme-preview" style="background: {theme.preview}"></div>
        <div class="theme-info">
          <div class="theme-header">
            <span class="theme-icon">{theme.icon}</span>
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
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
  }
  
  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: #2c3e50;
    text-align: center;
  }
  
  .theme-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }
  
  .theme-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid transparent;
    border-radius: 10px;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  .theme-option:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    border-color: rgba(52, 152, 219, 0.3);
  }
  
  .theme-option.active {
    border-color: #3498db;
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(52, 152, 219, 0.2);
  }
  
  .theme-preview {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    border: 3px solid #ddd;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
  }
  
  .theme-option.active .theme-preview {
    border-color: #3498db;
    transform: scale(1.05);
  }
  
  .theme-info {
    flex: 1;
  }
  
  .theme-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }
  
  .theme-icon {
    font-size: 1.5rem;
  }
  
  .theme-name {
    font-size: 1rem;
    font-weight: 600;
    color: #2c3e50;
  }
  
  .theme-description {
    margin: 0;
    font-size: 0.875rem;
    color: #6c757d;
    line-height: 1.4;
  }
  
  .theme-option.active .theme-name {
    color: #3498db;
  }
  
  .theme-option.active .theme-description {
    color: #495057;
  }
  
  @media (max-width: 768px) {
    .theme-selector {
      padding: 1rem;
      margin-bottom: 1rem;
    }
    
    .theme-options {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    
    .theme-option {
      padding: 0.75rem;
    }
    
    .theme-preview {
      width: 50px;
      height: 50px;
    }
    
    h3 {
      font-size: 1.1rem;
    }
  }
</style>