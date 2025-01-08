import Phaser from 'phaser';
import { WORLD_CONFIG } from '../config';

export class PositionGenerator {
  private static readonly MARGIN = 100;
  private static readonly MIN_DISTANCE = 80;
  private static usedPositions: Array<{x: number, y: number}> = [];

  static reset() {
    this.usedPositions = [];
  }

  static generateSafePosition(): {x: number, y: number} {
    let attempts = 0;
    const maxAttempts = 50;
    
    while (attempts < maxAttempts) {
      const x = Phaser.Math.Between(
        this.MARGIN, 
        WORLD_CONFIG.WORLD_WIDTH - this.MARGIN
      );
      
      const y = Phaser.Math.Between(
        this.MARGIN, 
        WORLD_CONFIG.WORLD_HEIGHT - this.MARGIN
      );

      // Check distance from bases
      const distanceFromLeftBase = Phaser.Math.Distance.Between(x, y, 100, WORLD_CONFIG.WORLD_HEIGHT / 2);
      const distanceFromRightBase = Phaser.Math.Distance.Between(x, y, WORLD_CONFIG.WORLD_WIDTH - 100, WORLD_CONFIG.WORLD_HEIGHT / 2);
      
      if (distanceFromLeftBase < 150 || distanceFromRightBase < 150) {
        attempts++;
        continue;
      }

      // Check distance from other items
      if (this.isPositionSafe(x, y)) {
        const position = {x, y};
        this.usedPositions.push(position);
        return position;
      }

      attempts++;
    }

    // If we couldn't find a safe position after max attempts,
    // return a position with increased minimum distance
    return this.generateFallbackPosition();
  }

  private static isPositionSafe(x: number, y: number): boolean {
    return !this.usedPositions.some(pos => 
      Phaser.Math.Distance.Between(x, y, pos.x, pos.y) < this.MIN_DISTANCE
    );
  }

  private static generateFallbackPosition(): {x: number, y: number} {
    const x = Phaser.Math.Between(
      this.MARGIN, 
      WORLD_CONFIG.WORLD_WIDTH - this.MARGIN
    );
    
    const y = Phaser.Math.Between(
      this.MARGIN, 
      WORLD_CONFIG.WORLD_HEIGHT - this.MARGIN
    );

    const position = {x, y};
    this.usedPositions.push(position);
    return position;
  }
}