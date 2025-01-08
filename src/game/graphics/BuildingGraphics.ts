import Phaser from 'phaser';

export class BuildingGraphics {
  static create(scene: Phaser.Scene): Phaser.GameObjects.Container {
    const container = scene.add.container(0, 0);
    const graphics = scene.add.graphics();

    // Main building structure
    graphics.lineStyle(2, 0x333333);
    graphics.fillStyle(0x666666);
    graphics.fillRect(-30, -30, 60, 60);
    graphics.strokeRect(-30, -30, 60, 60);

    // Add details
    graphics.lineStyle(1, 0x333333);
    graphics.fillStyle(0x444444);
    // Windows
    graphics.fillRect(-20, -20, 10, 10);
    graphics.fillRect(10, -20, 10, 10);
    graphics.fillRect(-20, 10, 10, 10);
    graphics.fillRect(10, 10, 10, 10);
    
    container.add(graphics);

    // Add physics body as a static rectangle
    const physicsRect = scene.add.rectangle(0, 0, 60, 60);
    scene.physics.add.existing(physicsRect, true); // true makes it static
    container.add(physicsRect);
    
    return container;
  }
}