import Phaser from 'phaser';
import { PreloadScene } from '../scenes/PreloadScene';
import { TitleScene } from '../scenes/TitleScene';
import { MenuScene } from '../scenes/MenuScene';
import { NameInputScene } from '../scenes/NameInputScene';
import { GameScene } from '../scenes/GameScene';
import { EndScene } from '../scenes/EndScene';

export const WORLD_CONFIG = {
  VIEWPORT_WIDTH: 800,
  VIEWPORT_HEIGHT: 600,
  WORLD_WIDTH: 2400,
  WORLD_HEIGHT: 1800
};

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: WORLD_CONFIG.VIEWPORT_WIDTH,
  height: WORLD_CONFIG.VIEWPORT_HEIGHT,
  backgroundColor: '#000000',
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [
    PreloadScene,
    TitleScene,
    MenuScene,
    NameInputScene,
    GameScene,
    EndScene
  ],
  render: {
    pixelArt: false,
    antialias: true,
    roundPixels: true
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};