import Phaser from 'phaser';

export class CountdownUI {
  private scene: Phaser.Scene;
  private countdownTexts: Phaser.GameObjects.Text[] = [];
  private onComplete: () => void;
  private gameMode: 'single' | 'multi';

  constructor(scene: Phaser.Scene, onComplete: () => void) {
    this.scene = scene;
    this.onComplete = onComplete;
    this.gameMode = this.scene.data.get('gameMode') || 'single';
  }

  startCountdown() {
    let count = 3;
    
    if (this.gameMode === 'multi') {
      // Get camera dimensions for precise positioning
      const camera1 = this.scene.cameras.main;
      const camera2 = this.scene.cameras.getCamera(1);
      
      // Create countdown for left viewport
      this.createCountdownText(
        camera1.centerX,
        camera1.centerY,
        count,
        'left'
      );
      
      // Create countdown for right viewport
      if (camera2) {
        this.createCountdownText(
          camera2.centerX + camera1.width,
          camera2.centerY,
          count,
          'right'
        );
      }
    } else {
      // Single player centered countdown
      this.createCountdownText(
        this.scene.cameras.main.centerX,
        this.scene.cameras.main.centerY,
        count,
        'center'
      );
    }

    // Create countdown timer
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        count--;
        if (count > 0) {
          this.updateCountdownTexts(count.toString());
        } else {
          this.showGoText();
        }
      },
      repeat: 2
    });
  }

  private createCountdownText(x: number, y: number, initialCount: number, viewport: 'left' | 'right' | 'center') {
    // Create background for better visibility
    const bg = this.scene.add.rectangle(x, y, 160, 160, 0x000000, 0.5)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(999);

    const text = this.scene.add.text(
      x,
      y,
      initialCount.toString(),
      {
        fontSize: '128px',
        color: '#00ff00',
        fontFamily: 'monospace',
        stroke: '#003300',
        strokeThickness: 8,
        align: 'center'
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(1000);

    // Handle split screen visibility
    if (this.gameMode === 'multi') {
      const camera1 = this.scene.cameras.main;
      const camera2 = this.scene.cameras.getCamera(1);
      
      if (viewport === 'left') {
        camera2?.ignore([text, bg]);
      } else if (viewport === 'right') {
        camera1.ignore([text, bg]);
      }
    }

    this.countdownTexts.push(text);

    // Add glow effect
    const glow = this.scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(998);
    glow.lineStyle(16, 0x00ff00, 0.2);
    glow.strokeCircle(x, y, 80);

    // Handle glow visibility in split screen
    if (this.gameMode === 'multi') {
      if (viewport === 'left') {
        this.scene.cameras.getCamera(1)?.ignore(glow);
      } else if (viewport === 'right') {
        this.scene.cameras.main.ignore(glow);
      }
    }

    // Animate glow
    this.scene.tweens.add({
      targets: glow,
      alpha: { from: 0.2, to: 0.4 },
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    // Clean up both text and background
    this.scene.time.delayedCall(4000, () => {
      glow.destroy();
      bg.destroy();
    });

    // Add scale animation on creation
    text.setScale(0);
    this.scene.tweens.add({
      targets: text,
      scale: { from: 0, to: 1 },
      duration: 400,
      ease: 'Back.easeOut'
    });
  }

  private updateCountdownTexts(value: string) {
    this.countdownTexts.forEach(text => {
      text.setText(value);
      // Add scale effect
      this.scene.tweens.add({
        targets: text,
        scale: { from: 1.5, to: 1 },
        duration: 400,
        ease: 'Back.easeOut'
      });
    });
  }

  private showGoText() {
    this.countdownTexts.forEach(text => {
      text.setText('GO!');
      text.setColor('#ffff00');
      
      // Add final effect
      this.scene.tweens.add({
        targets: text,
        scale: { from: 1.5, to: 0 },
        alpha: { from: 1, to: 0 },
        duration: 500,
        ease: 'Back.easeIn',
        onComplete: () => {
          text.destroy();
        }
      });
    });

    // Call onComplete after the last animation
    this.scene.time.delayedCall(500, this.onComplete);
  }
}