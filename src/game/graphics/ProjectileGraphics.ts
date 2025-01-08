import Phaser from 'phaser';

export class ProjectileGraphics {
  static create(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
    const graphics = scene.add.graphics();
    
    // Draw projectile
    graphics.lineStyle(2, 0xffff00);
    graphics.fillStyle(0xff0000);
    graphics.beginPath();
    graphics.arc(0, 0, 4, 0, Math.PI * 2);
    graphics.closePath();
    graphics.strokePath();
    graphics.fillPath();
    
    // Add glow effect
    const glowGraphics = scene.add.graphics();
    glowGraphics.lineStyle(4, 0xff6600, 0.3);
    glowGraphics.beginPath();
    glowGraphics.arc(0, 0, 6, 0, Math.PI * 2);
    glowGraphics.closePath();
    glowGraphics.strokePath();
    
    return graphics;
  }

  static createExplosion(scene: Phaser.Scene, x: number, y: number) {
    const particles = scene.add.particles(x, y, 'explosion', {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      lifespan: 500,
      quantity: 20,
      gravityY: 0
    });

    scene.time.delayedCall(500, () => particles.destroy());
  }
}