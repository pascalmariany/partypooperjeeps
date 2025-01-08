import Phaser from 'phaser';

export class WaterGraphics {
  static create(scene: Phaser.Scene): Phaser.GameObjects.Container {
    const container = scene.add.container(0, 0);
    const graphics = scene.add.graphics();

    // Random size for variety
    const radius = Phaser.Math.Between(30, 50);
    
    // Create irregular water shape
    const points = [];
    const segments = 12;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const variance = Phaser.Math.Between(-10, 10);
      const r = radius + variance;
      points.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r
      });
    }

    // Draw irregular water pool
    graphics.fillStyle(0x4444ff, 0.3);
    graphics.lineStyle(2, 0x2222ff, 0.5);
    graphics.beginPath();
    graphics.moveTo(points[0].x, points[0].y);
    points.forEach(point => graphics.lineTo(point.x, point.y));
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();

    container.add(graphics);

    // Add ripple effects
    for (let i = 0; i < 2; i++) {
      const ripple = scene.add.graphics();
      ripple.lineStyle(1, 0x6666ff, 0.2);
      ripple.strokeCircle(0, 0, radius - 5);
      container.add(ripple);

      scene.tweens.add({
        targets: ripple,
        scaleX: 1.2,
        scaleY: 1.2,
        alpha: 0,
        duration: 2000 + i * 1000,
        repeat: -1
      });
    }

    // Add physics
    scene.physics.add.existing(container, true);
    const body = container.body as Phaser.Physics.Arcade.StaticBody;
    body.setCircle(radius);
    
    return container;
  }
}