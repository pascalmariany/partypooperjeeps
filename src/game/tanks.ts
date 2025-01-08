import { Tank } from './types';
import { COLORS } from './constants';

const BASE_TANK_STATS = {
  speed: 40,
  armor: 30,
  ammo: 100,
  health: 5,
  maxHealth: 5,
  fuel: 100,
  lives: 5,
  presents: 0,
  score: 0,
  hasEnemyTree: false
};

export const TANKS: Record<string, Tank> = {
  scorpion: {
    id: 'scorpion',
    color: COLORS.RED,
    stats: { ...BASE_TANK_STATS }
  },
  marc: {
    id: 'marc',
    color: COLORS.BLUE,
    stats: { ...BASE_TANK_STATS }
  }
};