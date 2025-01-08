import Phaser from 'phaser';

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  ownerId: string;
  damage: number;

  constructor(scene: Phaser.Scene, x: number, y: number, ownerId: string) {
    super(scene, x, y, 'projectile');
    this.ownerId = ownerId;
    this.damage = 20;
  }

  fire(angle: number, speed: number): void {
    this.scene.physics.velocityFromRotation(angle, speed, this.body.velocity);
    this.setRotation(angle);
  }
}