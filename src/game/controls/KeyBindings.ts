import { TankControls } from '../types';

export const PLAYER1_KEYS: TankControls = {
  up: 'UP',
  down: 'DOWN',
  left: 'LEFT',
  right: 'RIGHT',
  fire: 'SPACE'
} as const;

export const PLAYER2_KEYS: TankControls = {
  up: 'W',
  down: 'S',
  left: 'A',
  right: 'D',
  fire: 'SHIFT'
} as const;