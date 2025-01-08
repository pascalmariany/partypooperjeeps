import Phaser from 'phaser';

export class AmmoCrateGraphics {
  static create(scene: Phaser.Scene): Phaser.GameObjects.Container {
    const container = scene.add.container(0, 0);
    
    // Add emoji text with larger size
    const text = scene.add.text(0, 0, '📦', {
      fontSize: '32px' // Doubled size
    }).setOrigin(0.5);
    
    container.add(text);
    return container;
  }
}