import { Tank } from '../types';
import { WORLD_CONFIG } from '../config';
import { TankRespawnManager } from './TankRespawnManager';

export class CombatSystem {
  static handleCollision(tank1: Tank, tank2: Tank, gameMode: 'single' | 'multi'): void {
    if (!tank1.sprite || !tank2.sprite) return;
    if ((tank1.sprite as any).isInvulnerable || (tank2.sprite as any).isInvulnerable) return;

    // Simple collision damage
    tank1.stats.health = Math.max(0, tank1.stats.health - 20);
    tank2.stats.health = Math.max(0, tank2.stats.health - 20);

    // Check for tank destruction
    if (tank1.stats.health <= 0) {
      this.handleTankDestruction(tank1, gameMode);
    }
    if (tank2.stats.health <= 0) {
      this.handleTankDestruction(tank2, gameMode);
    }
  }

  private static handleTankDestruction(tank: Tank, gameMode: 'single' | 'multi'): void {
    if (!tank.sprite) return;

    // Stop movement and disable physics
    const body = tank.sprite.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.enable = false;

    // Make tank semi-transparent
    tank.sprite.setAlpha(0.5);

    // Drop carried tree
    if (tank.stats.hasEnemyTree) {
      tank.stats.hasEnemyTree = false;
    }

    // Respawn tank after delay
    tank.sprite.scene.time.delayedCall(2000, () => {
      TankRespawnManager.respawnTank(tank, gameMode);
    });
  }
}