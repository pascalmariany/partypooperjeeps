import { Vehicle } from '../types';
import { WORLD_CONFIG } from '../config';
import { ScoreRules } from './ScoreRules';
import { FuelSystem } from '../systems/FuelSystem';
import { SpeedBoostSystem } from '../systems/SpeedBoostSystem';

export class GameRules {
  static readonly STARTING_HEALTH = 1;
  static readonly BASE_CAPTURE_RADIUS = 100;
  
  static initializeTankStats(vehicle: Vehicle) {
    vehicle.stats = {
      ...vehicle.stats,
      health: this.STARTING_HEALTH,
      maxHealth: this.STARTING_HEALTH,
      presents: 0,
      score: 0,
      hasEnemyTree: false,
      fuel: 100,
      boostActive: false
    };
  }

  static updateTankStats(vehicle: Vehicle) {
    if (!vehicle.sprite?.body) return;

    // Update fuel
    FuelSystem.consumeFuel(vehicle);

    // Update boost status
    SpeedBoostSystem.update(vehicle);

    // Handle tree status
    if (vehicle.stats.hasEnemyTree) {
      this.checkTreeReturn(vehicle);
    }
  }

  private static checkTreeReturn(vehicle: Vehicle): boolean {
    if (!vehicle.sprite) return false;

    const baseX = vehicle.id === 'player1' ? 100 : WORLD_CONFIG.WORLD_WIDTH - 100;
    const baseY = WORLD_CONFIG.WORLD_HEIGHT / 2;
    
    const distanceToBase = Phaser.Math.Distance.Between(
      vehicle.sprite.x,
      vehicle.sprite.y,
      baseX,
      baseY
    );

    if (distanceToBase < this.BASE_CAPTURE_RADIUS) {
      ScoreRules.handleTreeReturn(vehicle);
      return true;
    }

    return false;
  }

  static handleTankHit(vehicle: Vehicle, attacker: Vehicle) {
    if (!vehicle.sprite || (vehicle.sprite as any).isInvulnerable) return;
    vehicle.stats.health = 0;
    this.handleTankDestruction(vehicle);
  }

  static handleTankDestruction(vehicle: Vehicle) {
    if (!vehicle.sprite) return;
    
    if (vehicle.stats.hasEnemyTree) {
      vehicle.stats.hasEnemyTree = false;
    }

    this.respawnTank(vehicle);
  }

  private static respawnTank(vehicle: Vehicle) {
    if (!vehicle.sprite) return;

    // Reset stats
    vehicle.stats.health = this.STARTING_HEALTH;
    vehicle.stats.fuel = 100;
    vehicle.stats.boostActive = false;

    // Reset position to base
    const baseX = vehicle.id === 'player1' ? 100 : WORLD_CONFIG.WORLD_WIDTH - 100;
    const baseY = WORLD_CONFIG.WORLD_HEIGHT / 2;
    vehicle.sprite.setPosition(baseX, baseY);
    vehicle.sprite.rotation = vehicle.id === 'player1' ? 0 : Math.PI;

    // Add spawn protection
    (vehicle.sprite as any).isInvulnerable = true;
    vehicle.sprite.scene.time.delayedCall(2000, () => {
      (vehicle.sprite as any).isInvulnerable = false;
    });
  }
}