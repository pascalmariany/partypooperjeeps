import Phaser from 'phaser';
import { Tank } from '../types';
import { PresentGraphics } from '../graphics/PresentGraphics';
import { ScoreRules } from '../rules/ScoreRules';
import { AudioManager } from '../audio/AudioManager';

export class Present {
  public sprite: Phaser.GameObjects.Container;
  private scene: Phaser.Scene;
  public isCollected: boolean = false;
  private audioManager?: AudioManager;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.sprite = PresentGraphics.create(scene);
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

  collect(collector: Tank) {
    if (!this.isCollected) {
      this.isCollected = true;
      collector.stats.presents++;
      ScoreRules.handlePresentCollect(collector);

      // Play pickup sound
      this.audioManager?.playPickupSound();

      this.scene.tweens.add({
        targets: this.sprite,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 500,
        onComplete: () => this.sprite.destroy()
      });

      const scoreText = this.scene.add.text(
        this.sprite.x,
        this.sprite.y - 20,
        '+100',
        {
          fontSize: '20px',
          color: '#ffff00',
          stroke: '#000000',
          strokeThickness: 4
        }
      ).setOrigin(0.5);

      this.scene.tweens.add({
        targets: scoreText,
        y: scoreText.y - 30,
        alpha: 0,
        duration: 1000,
        onComplete: () => scoreText.destroy()
      });
    }
  }
}