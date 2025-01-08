import Phaser from 'phaser';
import { ChristmasTreeGraphics } from '../graphics/ChristmasTreeGraphics';
import { Vehicle } from '../types';
import { WORLD_CONFIG } from '../config';
import { ScoreRules } from '../rules/ScoreRules';
import { AudioManager } from '../audio/AudioManager';

export class ChristmasTree {
  public sprite: Phaser.GameObjects.Container;
  private scene: Phaser.Scene;
  public isCollected: boolean = false;
  public ownerId: string;
  private audioManager?: AudioManager;

  constructor(scene: Phaser.Scene, baseX: number, baseY: number, ownerId: string) {
    this.scene = scene;
    this.ownerId = ownerId;
    this.sprite = ChristmasTreeGraphics.create(scene);
    this.audioManager = AudioManager.getInstance();
    
    // Position the tree slightly behind the base
    const offset = ownerId === 'player1' ? -50 : 50;
    const x = baseX + offset;
    const y = baseY;
    
    this.sprite.setPosition(x, y);
    this.sprite.setScale(1.5); // Make tree bigger
    
    scene.physics.add.existing(this.sprite, false);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setSize(40, 60); // Larger collision box
    
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

  collect(vehicle: Vehicle) {
    if (!this.isCollected && vehicle.id !== this.ownerId) {
      this.isCollected = true;
      vehicle.stats.hasEnemyTree = true;
      ScoreRules.handleTreeCapture(vehicle);
      
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

      // Show floating score text
      const scoreText = this.scene.add.text(
        this.sprite.x,
        this.sprite.y - 20,
        'TREE CAPTURED!',
        {
          fontSize: '24px',
          color: '#ffff00',
          stroke: '#000000',
          strokeThickness: 4
        }
      ).setOrigin(0.5);

      this.scene.tweens.add({
        targets: scoreText,
        y: scoreText.y - 40,
        alpha: 0,
        duration: 1000,
        onComplete: () => scoreText.destroy()
      });
    }
  }
}