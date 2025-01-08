import Phaser from 'phaser';
import { ProjectileGraphics } from '../graphics/ProjectileGraphics';
import { TankGraphics } from '../graphics/TankGraphics';

export class CombatEffects {
  static createHitEffect(scene: Phaser.Scene, x: number, y: number) {
    ProjectileGraphics.createExplosion(scene, x, y);
  }

  static createDestructionEffect(scene: Phaser.Scene, x: number, y: number) {
    // Create larger explosion for tank destruction
    const particles = scene.add.particles(x, y, 'explosion', {
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      lifespan: 800,
      quantity: 30,
      gravityY: 0
    });

    scene.time.delayedCall(800, () => particles.destroy());
  }

  static flashTank(tank: Phaser.GameObjects.Container) {
    TankGraphics.flash(tank);
  }
}