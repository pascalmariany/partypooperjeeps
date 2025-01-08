import Phaser from 'phaser';
import { WaterGraphics } from '../graphics/WaterGraphics';
import { WORLD_CONFIG } from '../config';
import { Vehicle } from '../types';

export class WaterSystem {
  private static vehiclesInWater: Map<string, boolean> = new Map();
  private static originalSpeeds: Map<string, number> = new Map();
  private static readonly SPEED_REDUCTION = 0.4; // 60% speed reduction

  static createWaterPools(scene: Phaser.Scene): Phaser.GameObjects.Container[] {
    const pools: Phaser.GameObjects.Container[] = [];
    const poolCount = Phaser.Math.Between(6, 10);
    const margin = 150;

    for (let i = 0; i < poolCount; i++) {
      let x, y, isValidPosition;
      do {
        x = Phaser.Math.Between(margin, WORLD_CONFIG.WORLD_WIDTH - margin);
        y = Phaser.Math.Between(margin, WORLD_CONFIG.WORLD_HEIGHT - margin);
        isValidPosition = this.isValidPoolPosition(x, y, pools);
      } while (!isValidPosition);

      const pool = WaterGraphics.create(scene);
      pool.setPosition(x, y);
      pools.push(pool);
    }

    return pools;
  }

  static setupOverlap(scene: Phaser.Scene, pools: Phaser.GameObjects.Container[], vehicles: Vehicle[]): void {
    vehicles.forEach(vehicle => {
      if (!vehicle.sprite) return;

      pools.forEach(pool => {
        scene.physics.add.overlap(
          vehicle.sprite!,
          pool,
          () => this.handleWaterEntry(vehicle),
          undefined,
          this
        );
      });

      // Check if vehicle has left all pools
      scene.events.on('update', () => {
        if (this.vehiclesInWater.get(vehicle.id)) {
          let inAnyPool = false;
          pools.forEach(pool => {
            if (scene.physics.overlap(vehicle.sprite!, pool)) {
              inAnyPool = true;
            }
          });
          if (!inAnyPool) {
            this.handleWaterExit(vehicle);
          }
        }
      });
    });
  }

  private static handleWaterEntry(vehicle: Vehicle): void {
    if (!this.vehiclesInWater.get(vehicle.id)) {
      this.vehiclesInWater.set(vehicle.id, true);
      this.originalSpeeds.set(vehicle.id, vehicle.stats.speed);
      vehicle.stats.speed *= this.SPEED_REDUCTION;
      
      // Visual feedback
      if (vehicle.sprite) {
        vehicle.sprite.alpha = 0.8;
      }
    }
  }

  private static handleWaterExit(vehicle: Vehicle): void {
    this.vehiclesInWater.set(vehicle.id, false);
    const originalSpeed = this.originalSpeeds.get(vehicle.id);
    if (originalSpeed) {
      vehicle.stats.speed = originalSpeed;
    }
    
    // Reset visual feedback
    if (vehicle.sprite) {
      vehicle.sprite.alpha = 1;
    }
  }

  private static isValidPoolPosition(x: number, y: number, pools: Phaser.GameObjects.Container[]): boolean {
    // Keep away from bases
    const distanceFromLeftBase = Phaser.Math.Distance.Between(x, y, 100, WORLD_CONFIG.WORLD_HEIGHT / 2);
    const distanceFromRightBase = Phaser.Math.Distance.Between(x, y, WORLD_CONFIG.WORLD_WIDTH - 100, WORLD_CONFIG.WORLD_HEIGHT / 2);
    if (distanceFromLeftBase < 200 || distanceFromRightBase < 200) return false;

    // Keep away from other pools
    for (const pool of pools) {
      const minDistance = Phaser.Math.Between(150, 200);
      const distance = Phaser.Math.Distance.Between(x, y, pool.x, pool.y);
      if (distance < minDistance) return false;
    }

    return true;
  }
}