import Phaser from 'phaser';
import { Tank } from '../types';
import { AmmoCrateGraphics } from '../graphics/AmmoCrateGraphics';

export class AmmoCrate {
  public sprite: Phaser.GameObjects.Container;
  private scene: Phaser.Scene;
  public isCollected: boolean = false;
  private readonly AMMO_AMOUNT = 25;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.sprite = AmmoCrateGraphics.create(scene);
    this.sprite.setPosition(x, y);
    
    scene.physics.add.existing(this.sprite, false);
    this.addFloatingAnimation();
  }

  private addFloatingAnimation() {
    this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y - 3,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  collect(collector: Tank) {
    if (!this.isCollected) {
      this.isCollected = true;
      collector.stats.ammo += this.AMMO_AMOUNT;

      this.scene.tweens.add({
        targets: this.sprite,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 500,
        onComplete: () => this.sprite.destroy()
      });

      const ammoText = this.scene.add.text(
        this.sprite.x,
        this.sprite.y - 20,
        `+${this.AMMO_AMOUNT}`,
        {
          fontSize: '20px',
          color: '#ffff00',
          stroke: '#000000',
          strokeThickness: 4
        }
      ).setOrigin(0.5);

      this.scene.tweens.add({
        targets: ammoText,
        y: ammoText.y - 30,
        alpha: 0,
        duration: 1000,
        onComplete: () => ammoText.destroy()
      });
    }
  }
}