import type { Board, Stone, Position, BoardSize } from '$lib/baduk/domain/events/BadukEvents';
import type { StoneConfig } from '$lib/baduk/ui/stores/themeStore';

export interface InfluencePoint {
  x: number;
  y: number;
  blackInfluence: number;
  whiteInfluence: number;
  netInfluence: number; // positive = black, negative = white
  owner: 'black' | 'white' | 'neutral';
}

export type InfluenceMap = InfluencePoint[][];

// Calculate influence/aura for the entire board
export function calculateInfluenceMap(board: Board, boardSize: BoardSize): InfluenceMap {
  const influenceMap: InfluenceMap = [];
  
  // Initialize influence map
  for (let y = 0; y < boardSize; y++) {
    influenceMap[y] = [];
    for (let x = 0; x < boardSize; x++) {
      influenceMap[y][x] = {
        x,
        y,
        blackInfluence: 0,
        whiteInfluence: 0,
        netInfluence: 0,
        owner: 'neutral'
      };
    }
  }
  
  // Calculate influence from each stone
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const stone = board[y][x];
      if (stone) {
        propagateInfluence(influenceMap, x, y, stone, boardSize);
      }
    }
  }
  
  // Calculate net influence and determine ownership
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const point = influenceMap[y][x];
      point.netInfluence = point.blackInfluence - point.whiteInfluence;
      
      // Determine owner based on influence threshold
      if (point.netInfluence > 0.2) {
        point.owner = 'black';
      } else if (point.netInfluence < -0.2) {
        point.owner = 'white';
      } else {
        point.owner = 'neutral';
      }
    }
  }
  
  return influenceMap;
}

// Propagate influence from a single stone
function propagateInfluence(
  influenceMap: InfluenceMap, 
  stoneX: number, 
  stoneY: number, 
  stoneColor: Stone,
  boardSize: BoardSize
) {
  const maxDistance = 6; // Maximum influence distance
  const baseInfluence = 1.0;
  
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const distance = Math.sqrt(Math.pow(x - stoneX, 2) + Math.pow(y - stoneY, 2));
      
      if (distance <= maxDistance) {
        // Influence decreases with distance (inverse square law with modifications)
        const influence = baseInfluence / (1 + distance * 0.5);
        
        if (stoneColor === 'black') {
          influenceMap[y][x].blackInfluence += influence;
        } else {
          influenceMap[y][x].whiteInfluence += influence;
        }
      }
    }
  }
}

// Get influence strength as a normalized value (0-1)
export function getInfluenceStrength(influence: number): number {
  // Normalize influence to 0-1 range
  const maxInfluence = 3.0; // Adjust based on testing
  return Math.min(Math.abs(influence) / maxInfluence, 1);
}

// Calculate connected territories (groups of same-owner points)
export function calculateTerritories(influenceMap: InfluenceMap, boardSize: BoardSize) {
  const visited: boolean[][] = Array(boardSize).fill(null).map(() => Array(boardSize).fill(false));
  const territories: Array<{
    owner: 'black' | 'white' | 'neutral';
    positions: Position[];
    totalInfluence: number;
  }> = [];
  
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      if (!visited[y][x] && influenceMap[y][x].owner !== 'neutral') {
        const territory = floodFillTerritory(influenceMap, visited, x, y, boardSize);
        if (territory.positions.length > 0) {
          territories.push(territory);
        }
      }
    }
  }
  
  return territories;
}

// Flood fill to find connected territory
function floodFillTerritory(
  influenceMap: InfluenceMap,
  visited: boolean[][],
  startX: number,
  startY: number,
  boardSize: BoardSize
) {
  const owner = influenceMap[startY][startX].owner;
  const positions: Position[] = [];
  let totalInfluence = 0;
  
  const queue: Position[] = [{ x: startX, y: startY }];
  visited[startY][startX] = true;
  
  while (queue.length > 0) {
    const pos = queue.shift()!;
    const point = influenceMap[pos.y][pos.x];
    
    if (point.owner === owner) {
      positions.push(pos);
      totalInfluence += Math.abs(point.netInfluence);
      
      // Check neighbors
      const neighbors = [
        { x: pos.x + 1, y: pos.y },
        { x: pos.x - 1, y: pos.y },
        { x: pos.x, y: pos.y + 1 },
        { x: pos.x, y: pos.y - 1 }
      ];
      
      for (const neighbor of neighbors) {
        if (
          neighbor.x >= 0 && neighbor.x < boardSize &&
          neighbor.y >= 0 && neighbor.y < boardSize &&
          !visited[neighbor.y][neighbor.x] &&
          influenceMap[neighbor.y][neighbor.x].owner === owner
        ) {
          visited[neighbor.y][neighbor.x] = true;
          queue.push(neighbor);
        }
      }
    }
  }
  
  return { owner, positions, totalInfluence };
}

// Get gradient parameters for aura visualization using stone theme colors
export function getAuraGradient(
  point: InfluencePoint, 
  blackStoneConfig?: StoneConfig,
  whiteStoneConfig?: StoneConfig
): {
  gradient: string;
  opacity: number;
  blur: number;
  glow: string;
} {
  const strength = getInfluenceStrength(point.netInfluence);
  const isBlack = point.owner === 'black';
  
  // Extract border color from stone configuration for aura
  let baseColor: string;
  let glowColor: string;
  
  if (isBlack && blackStoneConfig) {
    // Extract color from the black stone's border - handle both hex colors and named colors
    const border = blackStoneConfig.black.border;
    const hexMatch = border.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/);
    
    if (hexMatch) {
      baseColor = hexMatch[0];
      glowColor = hexMatch[0];
    } else {
      // Handle common named colors or fallback
      baseColor = '#8B4513'; // Saddle brown
      glowColor = '#8B4513';
    }
  } else if (!isBlack && whiteStoneConfig) {
    // Extract color from the white stone's border - handle both hex colors and named colors
    const border = whiteStoneConfig.white.border;
    const hexMatch = border.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/);
    
    if (hexMatch) {
      baseColor = hexMatch[0];
      glowColor = hexMatch[0];
    } else {
      // Handle common named colors or fallback
      baseColor = '#DAA520'; // Golden rod
      glowColor = '#DAA520';
    }
  } else {
    // Fallback colors
    baseColor = isBlack ? '#8B4513' : '#DAA520';
    glowColor = isBlack ? '#8B4513' : '#DAA520';
  }
  
  // Convert hex to rgba for transparency
  const hexToRgba = (hex: string, alpha: number) => {
    // Handle 3-digit hex colors by expanding them
    let fullHex = hex;
    if (hex.length === 4) {
      fullHex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    
    const r = parseInt(fullHex.slice(1, 3), 16);
    const g = parseInt(fullHex.slice(3, 5), 16);
    const b = parseInt(fullHex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  const gradient = `radial-gradient(circle at center, 
      ${hexToRgba(baseColor, 0.6 * strength)} 0%, 
      ${hexToRgba(baseColor, 0.4 * strength)} 40%, 
      ${hexToRgba(baseColor, 0.2 * strength)} 70%, 
      transparent 100%
    )`;
  
  return {
    gradient,
    opacity: strength * 0.7,
    blur: 6 + (strength * 12), // 6-18px blur based on strength
    glow: hexToRgba(glowColor, 0.5 * strength)
  };
}