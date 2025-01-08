import Phaser from 'phaser';
import { Tank } from '../types';

export class TankGraphics {
  static create(scene: Phaser.Scene, tank: Tank): Phaser.GameObjects.Container {
    const container = scene.add.container(0, 0);
    
    // Add physics body
    scene.physics.add.existing(container, false);
    const body = container.body as Phaser.Physics.Arcade.Body;
    
    // Set physics properties
    body.setSize(35, 25);
    body.setOffset(-17.5, -12.5);
    body.collideWorldBounds = true;
    
    // Create tank graphics
    const graphics = scene.add.graphics();
    
    // Main body
    graphics.lineStyle(2, 0x000000);
    graphics.fillStyle(Number(tank.color.replace('#', '0x')));
    graphics.fillRect(-20, -15, 40, 30);
    graphics.strokeRect(-20, -15, 40, 30);
    
    // Tracks
    graphics.fillStyle(0x333333);
    graphics.fillRect(-22, -18, 44, 5);
    graphics.fillRect(-22, 13, 44, 5);
    
    // Turret
    graphics.fillStyle(Number(tank.color.replace('#', '0x')));
    graphics.fillCircle(0, 0, 12);
    graphics.lineStyle(2, 0x000000);
    graphics.strokeCircle(0, 0, 12);
    
    // Cannon
    graphics.fillRect(0, -3, 30, 6);
    graphics.strokeRect(0, -3, 30, 6);

    container.add(graphics);
    
    // Store references for effects
    (container as any).tankGraphics = graphics;
    (container as any).originalColor = tank.color;
    
    return container;
  }

  static flash(container: Phaser.GameObjects.Container) {
    const graphics = (container as any).tankGraphics as Phaser.GameObjects.Graphics;
    const originalColor = (container as any).originalColor;
    if (!graphics || !originalColor) return;

    // Clear and redraw with white color
    graphics.clear();
    
    // Redraw with white color
    graphics.lineStyle(2, 0x000000);
    graphics.fillStyle(0xffffff);
    
    // Main body
    graphics.fillRect(-20, -15, 40, 30);
    graphics.strokeRect(-20, -15, 40, 30);
    
    // Tracks
    graphics.fillStyle(0x333333);
    graphics.fillRect(-22, -18, 44, 5);
    graphics.fillRect(-22, 13, 44, 5);
    
    // Turret
    graphics.fillStyle(0xffffff);
    graphics.fillCircle(0, 0, 12);
    graphics.lineStyle(2, 0x000000);
    graphics.strokeCircle(0, 0, 12);
    
    // Cannon
    graphics.fillRect(0, -3, 30, 6);
    graphics.strokeRect(0, -3, 30, 6);

    // Reset after delay
    container.scene.time.delayedCall(100, () => {
      graphics.clear();
      
      // Redraw with original color
      graphics.lineStyle(2, 0x000000);
      graphics.fillStyle(Number(originalColor.replace('#', '0x')));
      
      // Main body
      graphics.fillRect(-20, -15, 40, 30);
      graphics.strokeRect(-20, -15, 40, 30);
      
      // Tracks
      graphics.fillStyle(0x333333);
      graphics.fillRect(-22, -18, 44, 5);
      graphics.fillRect(-22, 13, 44, 5);
      
      // Turret
      graphics.fillStyle(Number(originalColor.replace('#', '0x')));
      graphics.fillCircle(0, 0, 12);
      graphics.lineStyle(2, 0x000000);
      graphics.strokeCircle(0, 0, 12);
      
      // Cannon
      graphics.fillRect(0, -3, 30, 6);
      graphics.strokeRect(0, -3, 30, 6);
    });
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

    // Make tank invulnerable
    (container as any).isInvulnerable = true;
    container.scene.time.delayedCall(2000, () => {
      (container as any).isInvulnerable = false;
    });
  }
}