import { writable } from 'svelte/store';

// Stone Styles (Races/Cultures)
export type StoneStyle = 'korean' | 'japanese' | 'chinese' | 'western' | 'modern' | 'neon' | 'royal' | 'protoss' | 'zerg' | 'terran';

// Board Backgrounds (Environments)
export type BoardBackground = 'classic' | 'modern' | 'neon' | 'vintage' | 'marble' | 'wood' | 'paper';

export interface StoneConfig {
  id: StoneStyle;
  name: string;
  description: string;
  black: {
    background: string;
    border: string;
    boxShadow: string;
    shape?: 'circle' | 'square' | 'diamond' | 'hexagon' | 'custom';
    customShape?: string; // SVG path or CSS for custom shapes
    image?: string; // URL to stone image
  };
  white: {
    background: string;
    border: string;
    boxShadow: string;
    shape?: 'circle' | 'square' | 'diamond' | 'hexagon' | 'custom';
    customShape?: string; // SVG path or CSS for custom shapes
    image?: string; // URL to stone image
  };
  lastMoveMarker: {
    background: string;
    size: string;
    border?: string;
    boxShadow?: string;
  };
  texture?: string; // Optional texture overlay for stones
}

export interface BoardConfig {
  id: BoardBackground;
  name: string;
  description: string;
  preview: string;
  background: string;
  border: string;
  borderRadius: string;
  boxShadow: string;
  gridColor: string;
  starPointColor: string;
  starPointSize: string;
  texture?: string; // Optional board texture
}

// Stone Style Configurations
export const stoneStyles: Record<StoneStyle, StoneConfig> = {
  korean: {
    id: 'korean',
    name: 'Korean Traditional',
    description: 'Joseon Dynasty style stones',
    black: {
      background: 'radial-gradient(ellipse at 30% 30%, #1C1C1C 0%, #0A0A0A 50%, #000000 100%)',
      border: '2px solid #8B4513',
      boxShadow: '0 4px 12px rgba(139, 69, 19, 0.6), 0 2px 6px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255, 215, 0, 0.1)'
    },
    white: {
      background: 'radial-gradient(ellipse at 30% 30%, #FFFFF0 0%, #F8F8FF 50%, #F0F8FF 100%)',
      border: '2px solid #DAA520',
      boxShadow: '0 4px 12px rgba(218, 165, 32, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3), inset 0 3px 8px rgba(255, 255, 255, 0.9), inset 0 -2px 4px rgba(139, 69, 19, 0.2)'
    },
    lastMoveMarker: {
      background: 'radial-gradient(circle, #FFD700 0%, #DAA520 100%)',
      size: '9px',
      border: '1px solid #8B4513',
      boxShadow: '0 0 15px rgba(255, 215, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.4)'
    }
  },
  japanese: {
    id: 'japanese',
    name: 'Japanese Zen',
    description: 'Minimalist Nihon style',
    black: {
      background: 'radial-gradient(ellipse at 35% 35%, #2C2C2C 0%, #1A1A1A 45%, #000000 90%)',
      border: '1px solid #5D4E37',
      boxShadow: '0 3px 8px rgba(0, 0, 0, 0.6), 0 1px 3px rgba(0, 0, 0, 0.4)'
    },
    white: {
      background: 'radial-gradient(ellipse at 35% 35%, #FFFFFE 0%, #F8F8FF 45%, #F0F0F0 90%)',
      border: '1px solid #DDD8C0',
      boxShadow: '0 3px 8px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.8)'
    },
    lastMoveMarker: {
      background: '#DC143C',
      size: '4px',
      border: '1px solid #8B0000',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
    }
  },
  chinese: {
    id: 'chinese',
    name: 'Chinese Imperial',
    description: 'Tang Dynasty grandeur',
    black: {
      background: 'radial-gradient(ellipse at 25% 25%, #333333 0%, #1A1A1A 35%, #000000 80%)',
      border: '3px solid #FF4500',
      boxShadow: '0 6px 18px rgba(255, 69, 0, 0.8), 0 3px 9px rgba(0, 0, 0, 0.9), inset 0 3px 6px rgba(255, 215, 0, 0.1)'
    },
    white: {
      background: 'radial-gradient(ellipse at 25% 25%, #FFFFF0 0%, #FFF8DC 35%, #F5DEB3 80%)',
      border: '3px solid #FFD700',
      boxShadow: '0 6px 18px rgba(255, 215, 0, 0.6), 0 3px 9px rgba(0, 0, 0, 0.5), inset 0 4px 10px rgba(255, 255, 255, 0.9), inset 0 -2px 5px rgba(255, 69, 0, 0.2)'
    },
    lastMoveMarker: {
      background: 'radial-gradient(circle, #FFFF00 0%, #FFD700 50%, #FF4500 100%)',
      size: '12px',
      border: '2px solid #DC143C',
      boxShadow: '0 0 25px rgba(255, 255, 0, 0.9), 0 4px 8px rgba(0, 0, 0, 0.6)'
    }
  },
  western: {
    id: 'western',
    name: 'Western Classic',
    description: 'European elegance',
    black: {
      background: 'radial-gradient(ellipse at 30% 30%, #2F2F2F 0%, #1C1C1C 40%, #000000 85%)',
      border: '2px solid #654321',
      boxShadow: '0 4px 10px rgba(101, 67, 33, 0.4), 0 2px 5px rgba(0, 0, 0, 0.6)'
    },
    white: {
      background: 'radial-gradient(ellipse at 30% 30%, #FFFEF7 0%, #F5F5DC 40%, #E6E6FA 85%)',
      border: '2px solid #32CD32',
      boxShadow: '0 4px 10px rgba(50, 205, 50, 0.3), 0 2px 5px rgba(0, 0, 0, 0.2), inset 0 2px 6px rgba(255, 255, 255, 0.9)'
    },
    lastMoveMarker: {
      background: '#DC143C',
      size: '7px',
      border: '1px solid #8B0000',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
    }
  },
  modern: {
    id: 'modern',
    name: 'Modern Minimalist',
    description: 'Clean contemporary look',
    black: {
      background: 'radial-gradient(ellipse at 35% 35%, #2C2C2C 0%, #1A1A1A 50%, #000000 100%)',
      border: '1px solid #666666',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.15)'
    },
    white: {
      background: 'radial-gradient(ellipse at 35% 35%, #FFFFFF 0%, #FAFAFA 50%, #F0F0F0 100%)',
      border: '1px solid #DDDDDD',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.9)'
    },
    lastMoveMarker: {
      background: '#FF6B6B',
      size: '5px',
      border: 'none',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
    }
  },
  neon: {
    id: 'neon',
    name: 'Cyberpunk Neon',
    description: 'Futuristic glow effects',
    black: {
      background: 'radial-gradient(ellipse at 30% 30%, #333333 0%, #000000 40%, #000000 85%)',
      border: '2px solid #00FFFF',
      boxShadow: '0 4px 12px rgba(0, 255, 255, 0.5), 0 2px 6px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(0, 255, 255, 0.2)'
    },
    white: {
      background: 'radial-gradient(ellipse at 30% 30%, #FFFFFF 0%, #E0E1DD 40%, #778DA9 85%)',
      border: '2px solid #FF00FF',
      boxShadow: '0 4px 12px rgba(255, 0, 255, 0.5), 0 2px 6px rgba(0, 0, 0, 0.6), inset 0 2px 6px rgba(255, 255, 255, 0.9), inset 0 -1px 2px rgba(255, 0, 255, 0.3)'
    },
    lastMoveMarker: {
      background: 'radial-gradient(circle, #00FFFF 0%, #FF00FF 100%)',
      size: '8px',
      border: '1px solid #FFFFFF',
      boxShadow: '0 0 12px rgba(0, 255, 255, 0.8), 0 0 6px rgba(255, 0, 255, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.5)'
    }
  },
  royal: {
    id: 'royal',
    name: 'Royal Luxury',
    description: 'Gold and precious stones',
    black: {
      background: 'radial-gradient(ellipse at 25% 25%, #2F2F2F 0%, #1A1A1A 40%, #000000 85%)',
      border: '3px solid #DAA520',
      boxShadow: '0 5px 15px rgba(218, 165, 32, 0.7), 0 3px 8px rgba(0, 0, 0, 0.9), inset 0 2px 4px rgba(255, 215, 0, 0.2)'
    },
    white: {
      background: 'radial-gradient(ellipse at 25% 25%, #FFFACD 0%, #F5DEB3 40%, #DEB887 85%)',
      border: '3px solid #B8860B',
      boxShadow: '0 5px 15px rgba(184, 134, 11, 0.5), 0 3px 8px rgba(0, 0, 0, 0.4), inset 0 2px 6px rgba(255, 255, 255, 0.8), inset 0 -1px 3px rgba(218, 165, 32, 0.4)'
    },
    lastMoveMarker: {
      background: 'radial-gradient(circle, #FFD700 0%, #FFA500 100%)',
      size: '10px',
      border: '2px solid #8B4513',
      boxShadow: '0 0 20px rgba(255, 215, 0, 0.9), 0 3px 6px rgba(0, 0, 0, 0.5)'
    }
  },
  protoss: {
    id: 'protoss',
    name: 'Protoss',
    description: 'For Aiur! Psionic technology',
    black: {
      background: 'linear-gradient(145deg, #001122 0%, #003366 50%, #0066CC 100%)',
      border: '2px solid #00AAFF',
      boxShadow: '0 4px 16px rgba(0, 170, 255, 0.6), 0 2px 8px rgba(0, 51, 102, 0.8), inset 0 2px 4px rgba(102, 204, 255, 0.3)',
      shape: 'hexagon',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDJMNiAxMFYyMkwyNiAyMlYxMEwxNiAyWiIgZmlsbD0iIzAwQUFGRiIgc3Ryb2tlPSIjMDBGRkZGIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iNCIgZmlsbD0iIzAwRkZGRiIvPgo8L3N2Zz4K'
    },
    white: {
      background: 'linear-gradient(145deg, #FFD700 0%, #FFAA00 50%, #FF6600 100%)',
      border: '2px solid #FFCC00',
      boxShadow: '0 4px 16px rgba(255, 204, 0, 0.6), 0 2px 8px rgba(255, 102, 0, 0.8), inset 0 2px 4px rgba(255, 255, 102, 0.4)',
      shape: 'hexagon',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDJMNiAxMFYyMkwyNiAyMlYxMEwxNiAyWiIgZmlsbD0iIzAwQUFGRiIgc3Ryb2tlPSIjMDBGRkZGIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iNCIgZmlsbD0iIzAwRkZGRiIvPgo8L3N2Zz4K'
    },
    lastMoveMarker: {
      background: 'radial-gradient(circle, #00FFFF 0%, #0088FF 100%)',
      size: '8px',
      border: '1px solid #FFFFFF',
      boxShadow: '0 0 15px rgba(0, 255, 255, 0.9), 0 2px 4px rgba(0, 0, 0, 0.4)'
    }
  },
  zerg: {
    id: 'zerg',
    name: 'Zerg',
    description: 'Evolution complete. Organic swarm',
    black: {
      background: 'linear-gradient(145deg, #220011 0%, #440022 50%, #663300 100%)',
      border: '2px solid #AA4400',
      boxShadow: '0 4px 16px rgba(170, 68, 0, 0.6), 0 2px 8px rgba(68, 0, 34, 0.8), inset 0 2px 4px rgba(255, 102, 0, 0.2)',
      shape: 'custom',
      customShape: 'organic',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDNDMjAgNCAyNSA3IDI4IDEyQzMwIDE2IDI4IDIyIDI0IDI2QzIwIDI5IDE2IDMwIDEyIDI5QzggMjggNCAyNCAyIDE5QzEgMTQgMyAxMCA3IDdDMTAgNSAxMyAzIDE2IDNaIiBmaWxsPSIjQUE0NDAwIiBzdHJva2U9IiNGRjY2MDAiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIzIiBmaWxsPSIjRkY0NDAwIi8+CjxwYXRoIGQ9Ik0xMSAxMUwxNiA5TDIxIDExTDE5IDE2TDE2IDE5TDEzIDE2TDExIDExWiIgZmlsbD0iIzhBRkY4OCIvPgo8L3N2Zz4K'
    },
    white: {
      background: 'linear-gradient(145deg, #66CC66 0%, #44AA44 50%, #228822 100%)',
      border: '2px solid #88FF88',
      boxShadow: '0 4px 16px rgba(136, 255, 136, 0.6), 0 2px 8px rgba(34, 136, 34, 0.8), inset 0 2px 4px rgba(204, 255, 204, 0.3)',
      shape: 'custom',
      customShape: 'organic',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDNDMjAgNCAyNSA3IDI4IDEyQzMwIDE2IDI4IDIyIDI0IDI2QzIwIDI5IDE2IDMwIDEyIDI5QzggMjggNCAyNCAyIDE5QzEgMTQgMyAxMCA3IDdDMTAgNSAxMyAzIDE2IDNaIiBmaWxsPSIjQUE0NDAwIiBzdHJva2U9IiNGRjY2MDAiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIzIiBmaWxsPSIjRkY0NDAwIi8+CjxwYXRoIGQ9Ik0xMSAxMUwxNiA5TDIxIDExTDE5IDE2TDE2IDE5TDEzIDE2TDExIDExWiIgZmlsbD0iIzhBRkY4OCIvPgo8L3N2Zz4K'
    },
    lastMoveMarker: {
      background: 'radial-gradient(circle, #FF4400 0%, #AA2200 100%)',
      size: '9px',
      border: '1px solid #FFAA44',
      boxShadow: '0 0 18px rgba(255, 68, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.5)'
    }
  },
  terran: {
    id: 'terran',
    name: 'Terran',
    description: 'Lock and load! Human technology',
    black: {
      background: 'linear-gradient(145deg, #333333 0%, #555555 50%, #777777 100%)',
      border: '2px solid #999999',
      boxShadow: '0 4px 16px rgba(153, 153, 153, 0.6), 0 2px 8px rgba(51, 51, 51, 0.8), inset 0 2px 4px rgba(187, 187, 187, 0.3)',
      shape: 'square',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iNCIgeT0iOCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjE2IiBmaWxsPSIjOTk5OTk5IiBzdHJva2U9IiNCQkJCQkIiIHN0cm9rZS13aWR0aD0iMiIgcng9IjIiLz4KPHJlY3QgeD0iNiIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMiIgZmlsbD0iI0NDQ0NDQyIgcng9IjEiLz4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxNiIgcj0iMiIgZmlsbD0iIzc3Nzc3NyIvPgo8Y2lyY2xlIGN4PSIyMiIgY3k9IjE2IiByPSIyIiBmaWxsPSIjNzc3Nzc3Ii8+CjxyZWN0IHg9IjE0IiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI4IiBmaWxsPSIjNTU1NTU1IiBzdHJva2U9IiM3Nzc3NzciIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4K'
    },
    white: {
      background: 'linear-gradient(145deg, #CCCCCC 0%, #AAAAAA 50%, #888888 100%)',
      border: '2px solid #BBBBBB',
      boxShadow: '0 4px 16px rgba(187, 187, 187, 0.6), 0 2px 8px rgba(136, 136, 136, 0.8), inset 0 2px 4px rgba(238, 238, 238, 0.4)',
      shape: 'square',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iNCIgeT0iOCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjE2IiBmaWxsPSIjOTk5OTk5IiBzdHJva2U9IiNCQkJCQkIiIHN0cm9rZS13aWR0aD0iMiIgcng9IjIiLz4KPHJlY3QgeD0iNiIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMiIgZmlsbD0iI0NDQ0NDQyIgcng9IjEiLz4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxNiIgcj0iMiIgZmlsbD0iIzc3Nzc3NyIvPgo8Y2lyY2xlIGN4PSIyMiIgY3k9IjE2IiByPSIyIiBmaWxsPSIjNzc3Nzc3Ii8+CjxyZWN0IHg9IjE0IiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI4IiBmaWxsPSIjNTU1NTU1IiBzdHJva2U9IiM3Nzc3NzciIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4K'
    },
    lastMoveMarker: {
      background: 'radial-gradient(circle, #FFFF00 0%, #FFAA00 100%)',
      size: '7px',
      border: '1px solid #FFFFFF',
      boxShadow: '0 0 12px rgba(255, 255, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.4)'
    }
  }
};

// Board Background Configurations
export const boardBackgrounds: Record<BoardBackground, BoardConfig> = {
  classic: {
    id: 'classic',
    name: 'Classic Wood',
    description: 'Traditional wooden board',
    preview: 'linear-gradient(135deg, #E6D4B7 0%, #D4B896 50%, #C4A373 100%)',
    background: 'linear-gradient(135deg, #E6D4B7 0%, #D4B896 50%, #C4A373 100%)',
    border: '0 0 0 3px #8B4513',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -1px 2px rgba(0, 0, 0, 0.1)',
    gridColor: '#654321',
    starPointColor: '#654321',
    starPointSize: '5px',
    texture: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139, 69, 19, 0.03) 2px, rgba(139, 69, 19, 0.03) 4px), repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(139, 69, 19, 0.02) 8px, rgba(139, 69, 19, 0.02) 16px)'
  },
  modern: {
    id: 'modern',
    name: 'Modern Clean',
    description: 'Ultra-minimal design',
    preview: 'linear-gradient(135deg, #FEFEFE 0%, #F5F5F5 50%, #EEEEEE 100%)',
    background: 'linear-gradient(135deg, #FEFEFE 0%, #F5F5F5 50%, #EEEEEE 100%)',
    border: '0 0 0 1px #E0E0E0',
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
    gridColor: '#CCCCCC',
    starPointColor: '#999999',
    starPointSize: '4px',
    texture: 'repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(204, 204, 204, 0.01) 6px, rgba(204, 204, 204, 0.01) 12px)'
  },
  neon: {
    id: 'neon',
    name: 'Cyberpunk Neon',
    description: 'Futuristic glow board',
    preview: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 25%, #415A77 50%, #778DA9 75%, #E0E1DD 100%)',
    background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 50%, #415A77 100%)',
    border: '0 0 0 3px #00FFFF',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 255, 255, 0.3), 0 0 20px rgba(0, 255, 255, 0.2), inset 0 2px 4px rgba(0, 255, 255, 0.1)',
    gridColor: '#00FFFF',
    starPointColor: '#FF00FF',
    starPointSize: '6px',
    texture: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0, 255, 255, 0.03) 4px, rgba(0, 255, 255, 0.03) 8px), repeating-linear-gradient(0deg, transparent, transparent 16px, rgba(255, 0, 255, 0.02) 16px, rgba(255, 0, 255, 0.02) 32px)'
  },
  vintage: {
    id: 'vintage',
    name: 'Vintage Rosewood',
    description: 'Deep rosewood finish',
    preview: 'linear-gradient(135deg, #8B4513 0%, #A0522D 25%, #654321 50%, #5D4E37 75%, #4A2C17 100%)',
    background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 25%, #654321 50%, #5D4E37 75%, #4A2C17 100%)',
    border: '0 0 0 3px #2F1B14',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -1px 2px rgba(0, 0, 0, 0.2)',
    gridColor: '#2F1B14',
    starPointColor: '#2F1B14',
    starPointSize: '5px',
    texture: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(47, 27, 20, 0.05) 2px, rgba(47, 27, 20, 0.05) 4px), repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(47, 27, 20, 0.03) 8px, rgba(47, 27, 20, 0.03) 16px)'
  },
  marble: {
    id: 'marble',
    name: 'Marble Stone',
    description: 'Elegant marble surface',
    preview: 'linear-gradient(135deg, #2F4F4F 0%, #708090 25%, #C0C0C0 50%, #DCDCDC 75%, #F8F8FF 100%)',
    background: 'linear-gradient(135deg, #2F4F4F 0%, #708090 25%, #C0C0C0 50%, #DCDCDC 75%, #F8F8FF 100%)',
    border: '0 0 0 2px #708090',
    borderRadius: '12px',
    boxShadow: '0 6px 24px rgba(47, 79, 79, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 1px rgba(0, 0, 0, 0.2)',
    gridColor: '#2F4F4F',
    starPointColor: '#000000',
    starPointSize: '5px',
    texture: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(47, 79, 79, 0.015) 2px, rgba(47, 79, 79, 0.015) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(112, 128, 144, 0.01) 2px, rgba(112, 128, 144, 0.01) 4px)'
  },
  wood: {
    id: 'wood',
    name: 'Natural Wood',
    description: 'Raw wood texture',
    preview: 'linear-gradient(135deg, #DAA520 0%, #B8860B 25%, #CD853F 50%, #D2691E 75%, #A0522D 100%)',
    background: 'linear-gradient(135deg, #DAA520 0%, #B8860B 25%, #CD853F 50%, #D2691E 75%, #A0522D 100%)',
    border: '0 0 0 3px #8B4513',
    borderRadius: '15px',
    boxShadow: '0 10px 40px rgba(218, 165, 32, 0.4), 0 0 20px rgba(184, 134, 11, 0.3), inset 0 3px 6px rgba(255, 215, 0, 0.2)',
    gridColor: '#654321',
    starPointColor: '#8B4513',
    starPointSize: '7px',
    texture: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(218, 165, 32, 0.03) 8px, rgba(218, 165, 32, 0.03) 16px)'
  },
  paper: {
    id: 'paper',
    name: 'Paper Scroll',
    description: 'Ancient parchment style',
    preview: 'linear-gradient(135deg, #F5F5DC 0%, #DDD8C0 25%, #C8B99C 50%, #B8A082 75%, #A0895A 100%)',
    background: 'linear-gradient(135deg, #F5F5DC 0%, #DDD8C0 25%, #C8B99C 50%, #B8A082 75%, #A0895A 100%)',
    border: '0 0 0 2px #8B4513',
    borderRadius: '6px',
    boxShadow: '0 6px 24px rgba(139, 69, 19, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.5), inset 0 -1px 2px rgba(0, 0, 0, 0.1)',
    gridColor: '#5D4E37',
    starPointColor: '#8B0000',
    starPointSize: '5px',
    texture: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(93, 78, 55, 0.015) 3px, rgba(93, 78, 55, 0.015) 6px)'
  }
};

// Combined theme state - separate styles for each player
export const blackStoneStyle = writable<StoneStyle>('japanese');
export const whiteStoneStyle = writable<StoneStyle>('korean');
export const currentBoardBackground = writable<BoardBackground>('classic');

export function setBlackStoneStyle(style: StoneStyle) {
  blackStoneStyle.set(style);
}

export function setWhiteStoneStyle(style: StoneStyle) {
  whiteStoneStyle.set(style);
}

export function setBoardBackground(background: BoardBackground) {
  currentBoardBackground.set(background);
}

export function getStoneConfig(style: StoneStyle): StoneConfig {
  return stoneStyles[style];
}

export function getBoardConfig(background: BoardBackground): BoardConfig {
  return boardBackgrounds[background];
}

// Cycle through stone styles for black player
export function toggleBlackStoneStyle() {
  const styleOrder: StoneStyle[] = ['korean', 'japanese', 'chinese', 'western', 'modern', 'neon', 'royal', 'protoss', 'zerg', 'terran'];
  
  blackStoneStyle.update(current => {
    const currentIndex = styleOrder.indexOf(current);
    const nextIndex = (currentIndex + 1) % styleOrder.length;
    return styleOrder[nextIndex];
  });
}

// Cycle through stone styles for white player
export function toggleWhiteStoneStyle() {
  const styleOrder: StoneStyle[] = ['korean', 'japanese', 'chinese', 'western', 'modern', 'neon', 'royal', 'protoss', 'zerg', 'terran'];
  
  whiteStoneStyle.update(current => {
    const currentIndex = styleOrder.indexOf(current);
    const nextIndex = (currentIndex + 1) % styleOrder.length;
    return styleOrder[nextIndex];
  });
}

// Cycle through board backgrounds
export function toggleBoardBackground() {
  const backgroundOrder: BoardBackground[] = ['classic', 'modern', 'neon', 'vintage', 'marble', 'wood', 'paper'];
  
  currentBoardBackground.update(current => {
    const currentIndex = backgroundOrder.indexOf(current);
    const nextIndex = (currentIndex + 1) % backgroundOrder.length;
    return backgroundOrder[nextIndex];
  });
}