import Phaser from 'phaser';
import { Tank } from '../types';
import { FuelStationGraphics } from '../graphics/FuelStationGraphics';
import { FuelSystem } from '../systems/FuelSystem';

export class FuelStation {
  private scene: Phaser.Scene;
  public sprite: Phaser.GameObjects.Container;
  private lastRefuelTime: Map<string, number> = new Map();
  private readonly REFUEL_COOLDOWN = 1000;
  private notification?: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.sprite = FuelStationGraphics.create(scene);
    this.sprite.setPosition(x, y);
    
    scene.physics.add.existing(this.sprite, false);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setSize(40, 50);
    
    this.addGlowEffect();
  }

  private addGlowEffect() {
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.7,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }

  refuel(tank: Tank) {
    const now = Date.now();
    const lastRefuel = this.lastRefuelTime.get(tank.id) || 0;
    
    if (now - lastRefuel < this.REFUEL_COOLDOWN) return;
    
    if (tank.stats.fuel < 100) {
      FuelSystem.refuel(tank);
      this.lastRefuelTime.set(tank.id, now);
      this.showRefuelNotification(tank);
    }
  }

  private showRefuelNotification(tank: Tank) {
    if (this.notification) this.notification.destroy();

    this.notification = this.scene.add.text(
      this.sprite.x,
      this.sprite.y - 40,
      'REFUELING!',
      {
        fontSize: '16px',
        color: '#00ff00',
        stroke: '#000',
        strokeThickness: 4
      }
    ).setOrigin(0.5);

    this.scene.tweens.add({
      targets: this.notification,
      y: this.notification.y - 20,
      alpha: 0,
      duration: 1000,
      onComplete: () => this.notification?.destroy()
    });
  }
}