import { Tank } from '../types';
import { WORLD_CONFIG } from '../config';
import { TankGraphics } from '../graphics/TankGraphics';

export class TankRespawnManager {
  static respawnTank(tank: Tank, gameMode: 'single' | 'multi'): void {
    if (!tank.sprite?.body) return;

    // Reset stats
    tank.stats.health = 1;
    tank.stats.fuel = 100;
    tank.stats.ammo = 100;
    tank.stats.hasEnemyTree = false;

    // Reset position to base
    const baseX = tank.id === 'scorpion' ? 100 : WORLD_CONFIG.WORLD_WIDTH - 100;
    const baseY = WORLD_CONFIG.WORLD_HEIGHT / 2;
    tank.sprite.setPosition(baseX, baseY);
    tank.sprite.rotation = tank.id === 'scorpion' ? 0 : Math.PI;

    // Re-enable physics and make fully visible
    tank.sprite.body.enable = true;
    tank.sprite.body.setVelocity(0, 0);
    tank.sprite.setAlpha(1);

    // Add spawn protection
    TankGraphics.addSpawnProtection(tank.sprite);
  }
}