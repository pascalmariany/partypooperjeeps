import Phaser from 'phaser';
import { Tank } from '../types';
import { WORLD_CONFIG } from '../config';

export class HealthDisplay {
  private scene: Phaser.Scene;
  private hearts: Map<string, Phaser.GameObjects.Text[]> = new Map();
  private readonly HEART_FULL = '❤️';
  private readonly HEART_EMPTY = '🖤';

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  updateHealth(tank: Tank, x: number, y: number, side: 'left' | 'right'): void {
    // Clear existing hearts for this tank
    this.hearts.get(tank.id)?.forEach(heart => heart.destroy());
    
    const tankHearts: Phaser.GameObjects.Text[] = [];
    const totalHearts = tank.stats.maxHealth;
    const currentHealth = tank.stats.health;

    for (let i = 0; i < totalHearts; i++) {
      const heart = this.scene.add.text(
        x + (i * 25), 
        y,
        i < currentHealth ? this.HEART_FULL : this.HEART_EMPTY,
        { fontSize: '20px' }
      );

      heart.setScrollFactor(0);
      heart.setDepth(1000);

      // Handle split screen camera visibility
      if (this.scene.cameras.getCamera(1)) {
        if (side === 'left') {
          this.scene.cameras.getCamera(1)?.ignore(heart);
        } else {
          this.scene.cameras.main.ignore(heart);
        }
      }

      tankHearts.push(heart);
    }

    this.hearts.set(tank.id, tankHearts);
  }
}