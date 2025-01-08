import Phaser from 'phaser';
import { Vehicle } from '../types';

export class JeepGraphics {
  static create(scene: Phaser.Scene, vehicle: Vehicle): Phaser.GameObjects.Container {
    const container = scene.add.container(0, 0);
    
    // Add physics body with adjusted size and offset
    scene.physics.add.existing(container, false);
    const body = container.body as Phaser.Physics.Arcade.Body;
    body.setSize(40, 30); // Reduced from 60x40 to match visual size better
    body.setOffset(-20, -15); // Centered offset based on new size
    body.collideWorldBounds = true;
    
    // Create jeep graphics
    const graphics = scene.add.graphics();
    const color = Number(vehicle.color.replace('#', '0x'));
    
    // Draw the jeep
    this.drawVehicle(graphics, color);

    container.add(graphics);
    
    // Store reference for effects
    (container as any).vehicleGraphics = graphics;
    (container as any).originalColor = vehicle.color;
    
    return container;
  }

  private static drawVehicle(graphics: Phaser.GameObjects.Graphics, color: number) {
    // Main body (rotated 90 degrees)
    graphics.lineStyle(2, 0x000000);
    graphics.fillStyle(color);
    graphics.fillRect(-30, -20, 60, 40);
    graphics.strokeRect(-30, -20, 60, 40);

    // Hood (now on right)
    graphics.fillStyle(color);
    graphics.fillRect(15, -15, 15, 30);
    graphics.strokeRect(15, -15, 15, 30);

    // Trunk (now on left)
    graphics.fillRect(-30, -15, 15, 30);
    graphics.strokeRect(-30, -15, 15, 30);

    // Roof (center)
    graphics.fillStyle(0x333333);
    graphics.fillRect(-10, -15, 20, 30);
    graphics.strokeRect(-10, -15, 20, 30);

    // Windows
    graphics.fillStyle(0x88ccff);
    // Front window (right)
    graphics.fillRect(8, -12, 4, 24);
    // Back window (left)
    graphics.fillRect(-12, -12, 4, 24);
    // Side windows
    graphics.fillRect(-8, -17, 16, 4);
    graphics.fillRect(-8, 13, 16, 4);

    // Wheels (black circles)
    graphics.fillStyle(0x000000);
    // Front right
    graphics.fillCircle(20, -22, 5);
    // Front left
    graphics.fillCircle(20, 22, 5);
    // Back right
    graphics.fillCircle(-20, -22, 5);
    // Back left
    graphics.fillCircle(-20, 22, 5);

    // Wheel rims (silver)
    graphics.fillStyle(0xcccccc);
    graphics.fillCircle(20, -22, 2);
    graphics.fillCircle(20, 22, 2);
    graphics.fillCircle(-20, -22, 2);
    graphics.fillCircle(-20, 22, 2);
  }

  static addBoostEffect(container: Phaser.GameObjects.Container) {
    const particles = container.scene.add.particles(0, 0, 'speedTrail', {
      follow: container,
      frequency: 50,
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.6, end: 0 },
      tint: 0x00ffff,
      lifespan: 500,
      emitZone: {
        source: new Phaser.Geom.Line(-30, -20, -30, 20),
        type: 'edge',
        quantity: 2
      },
      speed: { min: 50, max: 100 },
      angle: { min: 170, max: 190 }
    });
    
    return particles;
  }

  static flash(container: Phaser.GameObjects.Container) {
    const graphics = (container as any).vehicleGraphics;
    const originalColor = (container as any).originalColor;
    if (!graphics || !originalColor) return;

    // Flash white
    graphics.clear();
    this.drawVehicle(graphics, 0xffffff);

    // Reset after delay
    container.scene.time.delayedCall(100, () => {
      graphics.clear();
      this.drawVehicle(graphics, Number(originalColor.replace('#', '0x')));
    });
  }

  static addSpawnProtection(container: Phaser.GameObjects.Container) {
    // Add shield effect
    const shield = container.scene.add.graphics();
    shield.lineStyle(2, 0x00ff00, 0.8);
    shield.strokeCircle(0, 0, 40);
    container.add(shield);

    // Add pulsing animation
    container.scene.tweens.add({
      targets: shield,
      alpha: 0,
      duration: 200,
      yoyo: true,
      repeat: 5,
      onComplete: () => shield.destroy()
    });

    // Make vehicle invulnerable
    (container as any).isInvulnerable = true;
    container.scene.time.delayedCall(2000, () => {
      (container as any).isInvulnerable = false;
    });
  }
}