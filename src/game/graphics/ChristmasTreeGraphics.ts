import Phaser from 'phaser';

export class ChristmasTreeGraphics {
  static create(scene: Phaser.Scene): Phaser.GameObjects.Container {
    const container = scene.add.container(0, 0);
    const graphics = scene.add.graphics();

    // Draw tree trunk (thicker)
    graphics.fillStyle(0x8B4513);
    graphics.fillRect(-8, 15, 16, 15);
    graphics.lineStyle(2, 0x000000);
    graphics.strokeRect(-8, 15, 16, 15);

    // Draw tree layers with darker green and black outline
    const treeColor = 0x006400; // Darker green
    graphics.fillStyle(treeColor);
    graphics.lineStyle(2, 0x000000);
    
    // Bottom layer
    graphics.beginPath();
    graphics.moveTo(-25, 15);
    graphics.lineTo(0, -20);
    graphics.lineTo(25, 15);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();

    // Middle layer
    graphics.beginPath();
    graphics.moveTo(-20, -5);
    graphics.lineTo(0, -35);
    graphics.lineTo(20, -5);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();

    // Top layer
    graphics.beginPath();
    graphics.moveTo(-15, -25);
    graphics.lineTo(0, -50);
    graphics.lineTo(15, -25);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();

    // Add decorations (ornaments)
    const ornamentColors = [0xff0000, 0xffff00, 0xff00ff, 0x00ffff];
    for (let i = 0; i < 8; i++) {
      const decoration = scene.add.graphics();
      const color = ornamentColors[i % ornamentColors.length];
      decoration.fillStyle(color);
      decoration.lineStyle(1, 0x000000);
      
      const x = Phaser.Math.Between(-20, 20);
      const y = Phaser.Math.Between(-45, 10);
      decoration.fillCircle(x, y, 4);
      decoration.strokeCircle(x, y, 4);
      
      container.add(decoration);
    }

    // Draw star on top
    const star = scene.add.graphics();
    star.fillStyle(0xffd700);
    star.lineStyle(1, 0x000000);
    
    const starPoints = 5;
    const outerRadius = 8;
    const innerRadius = 4;
    const centerX = 0;
    const centerY = -55;
    
    star.beginPath();
    for (let i = 0; i < starPoints * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / starPoints;
      const x = centerX + radius * Math.sin(angle);
      const y = centerY + radius * Math.cos(angle);
      
      if (i === 0) {
        star.moveTo(x, y);
      } else {
        star.lineTo(x, y);
      }
    }
    star.closePath();
    star.fillPath();
    star.strokePath();

    container.add([graphics, star]);

    // Add glow effect
    const glow = scene.add.graphics();
    glow.lineStyle(16, 0xffff00, 0.1);
    glow.strokeCircle(0, -15, 40);
    container.add(glow);

    return container;
  }
}