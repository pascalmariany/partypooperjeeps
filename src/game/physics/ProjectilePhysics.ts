import Phaser from 'phaser';
import { Projectile } from '../combat/weapons/Projectile';

export class ProjectilePhysics {
  private static readonly GRAVITY = 100;    // Gravity strength
  private static readonly DRAG = 0.99;      // Air resistance
  private static readonly MAX_SPEED = 800;  // Maximum projectile speed

  static updateProjectile(projectile: Projectile, delta: number): void {
    if (!projectile.body) return;

    // Apply gravity
    projectile.body.velocity.y += this.GRAVITY * delta;

    // Apply drag
    projectile.body.velocity.scale(this.DRAG);

    // Limit speed
    const speed = projectile.body.velocity.length();
    if (speed > this.MAX_SPEED) {
      projectile.body.velocity.normalize().scale(this.MAX_SPEED);
    }

    // Update rotation to match velocity
    projectile.rotation = Math.atan2(
      projectile.body.velocity.y,
      projectile.body.velocity.x
    );
  }

  static handleBounce(projectile: Projectile, surface: Phaser.GameObjects.GameObject): void {
    if (!projectile.body) return;

    // Calculate reflection angle
    const normal = new Phaser.Math.Vector2(0, -1); // Assuming flat surface
    const velocity = new Phaser.Math.Vector2(
      projectile.body.velocity.x,
      projectile.body.velocity.y
    );

    // Reflect velocity around normal
    const dot = velocity.dot(normal);
    velocity.subtract(normal.scale(2 * dot));

    // Apply reflected velocity with energy loss
    projectile.body.velocity.x = velocity.x * 0.8;
    projectile.body.velocity.y = velocity.y * 0.8;
  }
}