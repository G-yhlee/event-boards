import { writable } from 'svelte/store';
import type { StoneConfig } from './themeStore';

export interface CustomStoneConfig extends StoneConfig {
  isCustom: true;
  createdAt: number;
  auraColor?: string; // Color for the outer aura/border region
}

// Store for custom user-created stones
export const customStones = writable<CustomStoneConfig[]>([]);

// Currently selected custom stones for black and white
export const selectedCustomBlackStone = writable<CustomStoneConfig | null>(null);
export const selectedCustomWhiteStone = writable<CustomStoneConfig | null>(null);

// Store key for localStorage
const CUSTOM_STONES_KEY = 'baduk_custom_stones';
const SELECTED_CUSTOM_STONES_KEY = 'baduk_selected_custom_stones';

// Load custom stones from localStorage
export function loadCustomStones() {
  try {
    const saved = localStorage.getItem(CUSTOM_STONES_KEY);
    if (saved) {
      const stones = JSON.parse(saved) as CustomStoneConfig[];
      customStones.set(stones);
    }
    
    const selectedSaved = localStorage.getItem(SELECTED_CUSTOM_STONES_KEY);
    if (selectedSaved) {
      const selected = JSON.parse(selectedSaved);
      if (selected.black) {
        selectedCustomBlackStone.set(selected.black);
      }
      if (selected.white) {
        selectedCustomWhiteStone.set(selected.white);
      }
    }
  } catch (error) {
    console.warn('Failed to load custom stones from localStorage:', error);
  }
}

// Save custom stones to localStorage
export function saveCustomStones() {
  try {
    customStones.subscribe(stones => {
      localStorage.setItem(CUSTOM_STONES_KEY, JSON.stringify(stones));
    })();
  } catch (error) {
    console.warn('Failed to save custom stones to localStorage:', error);
  }
}

// Save selected custom stones to localStorage
export function saveSelectedCustomStones() {
  try {
    let blackStone: CustomStoneConfig | null = null;
    let whiteStone: CustomStoneConfig | null = null;
    
    selectedCustomBlackStone.subscribe(stone => blackStone = stone)();
    selectedCustomWhiteStone.subscribe(stone => whiteStone = stone)();
    
    localStorage.setItem(SELECTED_CUSTOM_STONES_KEY, JSON.stringify({
      black: blackStone,
      white: whiteStone
    }));
  } catch (error) {
    console.warn('Failed to save selected custom stones to localStorage:', error);
  }
}

// Add a new custom stone
export function addCustomStone(stone: Omit<CustomStoneConfig, 'isCustom' | 'createdAt'>) {
  const newStone: CustomStoneConfig = {
    ...stone,
    isCustom: true,
    createdAt: Date.now()
  };
  
  customStones.update(stones => {
    const updated = [...stones, newStone];
    // Keep only the most recent 50 stones to avoid storage bloat
    if (updated.length > 50) {
      updated.splice(0, updated.length - 50);
    }
    return updated;
  });
  
  saveCustomStones();
  return newStone;
}

// Remove a custom stone
export function removeCustomStone(stoneId: string) {
  customStones.update(stones => stones.filter(stone => stone.id !== stoneId));
  saveCustomStones();
  
  // Also remove from selection if it was selected
  selectedCustomBlackStone.update(selected => 
    selected?.id === stoneId ? null : selected
  );
  selectedCustomWhiteStone.update(selected => 
    selected?.id === stoneId ? null : selected
  );
  saveSelectedCustomStones();
}

// Select custom stone for black
export function selectCustomBlackStone(stone: CustomStoneConfig | null) {
  selectedCustomBlackStone.set(stone);
  saveSelectedCustomStones();
}

// Select custom stone for white
export function selectCustomWhiteStone(stone: CustomStoneConfig | null) {
  selectedCustomWhiteStone.set(stone);
  saveSelectedCustomStones();
}

// Generate a unique ID for custom stones
export function generateStoneId(): string {
  return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Navigation helper function for opening designer
export function openStoneDesigner() {
  // Simply change the hash - the BadukRouter will handle the route change
  window.location.hash = 'baduk/designer';
}

// Initialize store
loadCustomStones();