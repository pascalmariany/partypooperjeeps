import Phaser from 'phaser';
import { Vehicle } from '../types';

export class VehicleGraphics {
  static create(scene: Phaser.Scene, vehicle: Vehicle): Phaser.GameObjects.Container {
    const container = scene.add.container(0, 0);
    
    // Add physics body
    scene.physics.add.existing(container, false);
    const body = container.body as Phaser.Physics.Arcade.Body;
    body.setSize(40, 25);
    body.setOffset(-20, -12.5);
    body.collideWorldBounds = true;
    
    // Create jeep graphics
    const graphics = scene.add.graphics();
    const color = Number(vehicle.color.replace('#', '0x'));
    
    // Jeep body
    graphics.lineStyle(2, 0x000000);
    graphics.fillStyle(color);
    
    // Main body shape
    graphics.beginPath();
    graphics.moveTo(-20, -12);
    graphics.lineTo(20, -12);
    graphics.lineTo(20, 0);
    graphics.lineTo(15, 12);
    graphics.lineTo(-15, 12);
    graphics.lineTo(-20, 0);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
    
    // Wheels
    graphics.fillStyle(0x333333);
    graphics.fillCircle(-15, 12, 6);
    graphics.fillCircle(15, 12, 6);
    graphics.lineStyle(1, 0x000000);
    graphics.strokeCircle(-15, 12, 6);
    graphics.strokeCircle(15, 12, 6);
    
    // Windshield
    graphics.lineStyle(2, 0x000000);
    graphics.beginPath();
    graphics.moveTo(-10, -8);
    graphics.lineTo(10, -8);
    graphics.lineTo(10, -2);
    graphics.lineTo(-10, -2);
    graphics.closePath();
    graphics.fillStyle(0x88ccff);
    graphics.fillPath();
    graphics.strokePath();

    container.add(graphics);
    
    // Store reference for effects
    (container as any).vehicleGraphics = graphics;
    (container as any).originalColor = vehicle.color;
    
    return container;
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

  private static drawVehicle(graphics: Phaser.GameObjects.Graphics, color: number) {
    // Jeep body
    graphics.lineStyle(2, 0x000000);
    graphics.fillStyle(color);
    
    // Main body shape
    graphics.beginPath();
    graphics.moveTo(-20, -12);
    graphics.lineTo(20, -12);
    graphics.lineTo(20, 0);
    graphics.lineTo(15, 12);
    graphics.lineTo(-15, 12);
    graphics.lineTo(-20, 0);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
    
    // Wheels
    graphics.fillStyle(0x333333);
    graphics.fillCircle(-15, 12, 6);
    graphics.fillCircle(15, 12, 6);
    graphics.lineStyle(1, 0x000000);
    graphics.strokeCircle(-15, 12, 6);
    graphics.strokeCircle(15, 12, 6);
    
    // Windshield
    graphics.lineStyle(2, 0x000000);
    graphics.beginPath();
    graphics.moveTo(-10, -8);
    graphics.lineTo(10, -8);
    graphics.lineTo(10, -2);
    graphics.lineTo(-10, -2);
    graphics.closePath();
    graphics.fillStyle(0x88ccff);
    graphics.fillPath();
    graphics.strokePath();
  }

  static addSpawnProtection(container: Phaser.GameObjects.Container) {
    // Add shield effect
    const shield = container.scene.add.graphics();
    shield.lineStyle(2, 0x00ff00, 0.8);
    shield.strokeCircle(0, 0, 30);
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