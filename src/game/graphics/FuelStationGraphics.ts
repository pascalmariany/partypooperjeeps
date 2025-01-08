import Phaser from 'phaser';

export class FuelStationGraphics {
  static create(scene: Phaser.Scene): Phaser.GameObjects.Container {
    const container = scene.add.container(0, 0);
    
    // Add emoji text with larger size
    const text = scene.add.text(0, 0, '⛽', {
      fontSize: '48px' // Increased from 16px to 48px (3x larger)
    }).setOrigin(0.5);
    
    container.add(text);
    return container;
  }
}