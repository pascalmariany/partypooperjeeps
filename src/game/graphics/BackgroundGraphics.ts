import Phaser from 'phaser';
import { WORLD_CONFIG } from '../config';

export class BackgroundGraphics {
  static create(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0x333333, 0.3);

    // Draw vertical lines
    for (let x = 0; x <= WORLD_CONFIG.WORLD_WIDTH; x += 64) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, WORLD_CONFIG.WORLD_HEIGHT);
    }

    // Draw horizontal lines
    for (let y = 0; y <= WORLD_CONFIG.WORLD_HEIGHT; y += 64) {
      graphics.moveTo(0, y);
      graphics.lineTo(WORLD_CONFIG.WORLD_WIDTH, y);
    }

    graphics.strokePath();
    return graphics;
  }
}