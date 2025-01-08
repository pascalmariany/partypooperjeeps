import Phaser from 'phaser';

export class SpeedBoostGraphics {
  static create(scene: Phaser.Scene): Phaser.GameObjects.Container {
    const container = scene.add.container(0, 0);
    
    // Add lightning bolt emoji with glow effect
    const text = scene.add.text(0, 0, '⚡', {
      fontSize: '32px'
    }).setOrigin(0.5);
    
    // Add glow effect
    const glow = scene.add.graphics();
    glow.lineStyle(8, 0x00ffff, 0.3);
    glow.strokeCircle(0, 0, 20);
    
    container.add([glow, text]);
    
    // Add pulsing animation
    scene.tweens.add({
      targets: glow,
      alpha: 0.1,
      duration: 800,
      yoyo: true,
      repeat: -1
    });
    
    return container;
  }
}