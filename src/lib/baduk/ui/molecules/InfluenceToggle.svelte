<script lang="ts">
  import { Eye, EyeOff, Sparkles } from 'lucide-svelte';
  
  interface Props {
    showInfluence: boolean;
    onToggle: () => void;
  }
  
  let { showInfluence, onToggle }: Props = $props();
</script>

<div class="influence-toggle">
  <button 
    class="toggle-button"
    class:active={showInfluence}
    onclick={onToggle}
    title={showInfluence ? 'Hide territory influence' : 'Show territory influence'}
  >
    <div class="button-content">
      {#if showInfluence}
        <Eye size={18} />
      {:else}
        <EyeOff size={18} />
      {/if}
      <span class="label">Territory Aura</span>
      <Sparkles size={14} class="sparkle-icon" />
    </div>
  </button>
</div>

<style>
  .influence-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .toggle-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #ffffff;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  
  .toggle-button:hover {
    background: #f7f7f8;
    border-color: #d1d1d6;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  .toggle-button.active {
    background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
    border-color: #0051d5;
    color: #ffffff;
    box-shadow: 0 2px 12px rgba(0, 122, 255, 0.3);
  }
  
  .toggle-button.active:hover {
    background: linear-gradient(135deg, #0051d5 0%, #003d9e 100%);
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 4px 16px rgba(0, 122, 255, 0.4);
  }
  
  .button-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .label {
    font-size: 14px;
    font-weight: 500;
  }
  
  .sparkle-icon {
    opacity: 0.6;
    transition: all 0.3s ease;
  }
  
  .toggle-button.active .sparkle-icon {
    opacity: 1;
    animation: sparkle 2s ease-in-out infinite;
  }
  
  @keyframes sparkle {
    0%, 100% {
      transform: rotate(0deg) scale(1);
      opacity: 0.8;
    }
    25% {
      transform: rotate(-10deg) scale(1.1);
      opacity: 1;
    }
    50% {
      transform: rotate(0deg) scale(0.95);
      opacity: 0.9;
    }
    75% {
      transform: rotate(10deg) scale(1.1);
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    .toggle-button {
      padding: 6px 12px;
    }
    
    .label {
      font-size: 13px;
    }
    
    .button-content svg {
      width: 16px;
      height: 16px;
    }
    
    .sparkle-icon {
      width: 12px !important;
      height: 12px !important;
    }
  }
</style>