import Phaser from 'phaser';
import { Vehicle } from '../types';
import { SpeedBoostGraphics } from '../graphics/SpeedBoostGraphics';
import { SpeedBoostSystem } from '../systems/SpeedBoostSystem';
import { AudioManager } from '../audio/AudioManager';

export class SpeedBoost {
  public sprite: Phaser.GameObjects.Container;
  private scene: Phaser.Scene;
  public isCollected: boolean = false;
  private audioManager?: AudioManager;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.sprite = SpeedBoostGraphics.create(scene);
    this.sprite.setPosition(x, y);
    this.audioManager = AudioManager.getInstance();
    
    scene.physics.add.existing(this.sprite, false);
    this.addFloatingAnimation();
  }

  private addFloatingAnimation() {
    this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y - 5,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  collect(collector: Vehicle) {
    if (!this.isCollected) {
      this.isCollected = true;
      SpeedBoostSystem.applyBoost(collector);

      // Play boost sound
      this.audioManager?.playBoostSound();

      // Visual and audio feedback
      this.scene.tweens.add({
        targets: this.sprite,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 300,
        onComplete: () => this.sprite.destroy()
      });

      const boostText = this.scene.add.text(
        this.sprite.x,
        this.sprite.y - 20,
        'SPEED BOOST!',
        {
          fontSize: '20px',
          color: '#00ffff',
          stroke: '#000000',
          strokeThickness: 4
        }
      ).setOrigin(0.5);

      this.scene.tweens.add({
        targets: boostText,
        y: boostText.y - 30,
        alpha: 0,
        duration: 1000,
        onComplete: () => boostText.destroy()
      });
    }
  }
}