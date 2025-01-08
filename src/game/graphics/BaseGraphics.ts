import Phaser from 'phaser';

export class BaseGraphics {
  static create(scene: Phaser.Scene, x: number, y: number, color: string): Phaser.GameObjects.Container {
    const container = scene.add.container(x, y);
    const graphics = scene.add.graphics();

    // Convert hex color string to number
    const colorValue = typeof color === 'string' ? 
      Number(color.replace('#', '0x')) : 
      0xff0000; // Default to red if color is invalid

    // Draw base
    graphics.lineStyle(2, 0x000000);
    graphics.fillStyle(colorValue, 0.3);
    
    // Main base area
    graphics.fillRect(-50, -50, 100, 100);
    graphics.strokeRect(-50, -50, 100, 100);
    
    // Defensive barriers
    graphics.fillStyle(colorValue, 0.5);
    graphics.fillRect(-60, -10, 20, 20);  // Left barrier
    graphics.fillRect(40, -10, 20, 20);   // Right barrier
    
    // Base markings
    graphics.lineStyle(1, 0x000000);
    graphics.strokeCircle(0, 0, 30);
    graphics.strokeRect(-20, -20, 40, 40);

    container.add(graphics);
    return container;
  }
}