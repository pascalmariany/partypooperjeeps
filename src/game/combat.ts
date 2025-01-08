import Phaser from 'phaser';
import { Tank, Bullet } from './types';
import { COMBAT_CONFIG } from './constants';

export class CombatSystem {
  private scene: Phaser.Scene;
  private bullets: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.bullets = scene.physics.add.group();
  }

  fireBullet(tank: Tank) {
    if (!tank.sprite || tank.stats.ammo <= 0) return;

    const bullet = this.bullets.create(
      tank.sprite.x,
      tank.sprite.y,
      'bullet'
    ) as Bullet;

    bullet.damage = COMBAT_CONFIG.BULLET_DAMAGE;
    bullet.ownerId = tank.id;

    // Calculate bullet velocity based on tank rotation
    const angle = tank.sprite.rotation;
    this.scene.physics.velocityFromRotation(
      angle,
      COMBAT_CONFIG.BULLET_SPEED,
      bullet.body.velocity
    );

    // Reduce ammo
    tank.stats.ammo--;

    // Destroy bullet after 1 second
    this.scene.time.delayedCall(1000, () => bullet.destroy());
  }

  handleHit(bullet: Bullet, targetTank: Tank) {
    if (!targetTank.sprite || bullet.ownerId === targetTank.id) return;

    // Apply damage reduced by armor
    const damage = bullet.damage * (1 - targetTank.stats.armor / 100);
    targetTank.stats.health = Math.max(0, targetTank.stats.health - damage);

    // Destroy bullet
    bullet.destroy();

    // Flash tank red when hit
    targetTank.sprite.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => targetTank.sprite?.clearTint());
  }

  setupCollisions(tanks: Tank[]) {
    tanks.forEach(tank => {
      if (tank.sprite) {
        this.scene.physics.add.overlap(
          this.bullets,
          tank.sprite,
          (bullet, tankSprite) => {
            this.handleHit(bullet as Bullet, tank);
          }
        );
      }
    });
  }
}