export const COLORS = {
  RED: '#ff0000',
  GREEN: '#00ff00',
  BLUE: '#0000ff'
} as const;

export const GAME_CONFIG = {
  VIEWPORT_WIDTH: 800,
  VIEWPORT_HEIGHT: 600,
  HUD_HEIGHT: 100,
  BOOST_DURATION: 5000,
  BOOST_MULTIPLIER: 1.3
} as const;

export const VEHICLES = {
  PLAYER1: {
    id: 'player1',
    color: COLORS.RED,
    stats: {
      speed: 40,
      boostActive: false,
      health: 1,
      maxHealth: 1,
      fuel: 100,
      lives: 5,
      presents: 0,
      score: 0,
      hasEnemyTree: false
    }
  },
  PLAYER2: {
    id: 'player2',
    color: COLORS.BLUE,
    stats: {
      speed: 40,
      boostActive: false,
      health: 1,
      maxHealth: 1,
      fuel: 100,
      lives: 5,
      presents: 0,
      score: 0,
      hasEnemyTree: false
    }
  }
} as const;