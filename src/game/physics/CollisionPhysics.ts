import Phaser from 'phaser';
import { Tank } from '../types';

export class CollisionPhysics {
  private static readonly RESTITUTION = 0.5; // Bounciness
  private static readonly FRICTION = 0.8;    // Surface friction
  private static readonly MASS = 1;          // Mass of projectiles

  static handleProjectileCollision(
    projectile: Phaser.Physics.Arcade.Sprite,
    tank: Phaser.GameObjects.Container,
    onCollision: () => void
  ): void {
    // Get velocities
    const projectileVel = new Phaser.Math.Vector2(
      projectile.body.velocity.x,
      projectile.body.velocity.y
    );
    
    const tankVel = new Phaser.Math.Vector2(
      (tank.body as Phaser.Physics.Arcade.Body).velocity.x,
      (tank.body as Phaser.Physics.Arcade.Body).velocity.y
    );

    // Calculate collision normal
    const normal = new Phaser.Math.Vector2(
      tank.x - projectile.x,
      tank.y - projectile.y
    ).normalize();

    // Calculate relative velocity
    const relativeVel = projectileVel.subtract(tankVel);

    // Calculate impulse
    const impulse = -((1 + this.RESTITUTION) * relativeVel.dot(normal)) / 
                    (1/this.MASS + 1/this.MASS);

    // Apply impulse
    const impulseVector = normal.scale(impulse);
    projectile.body.velocity.x = projectileVel.x + (impulseVector.x / this.MASS);
    projectile.body.velocity.y = projectileVel.y + (impulseVector.y / this.MASS);

    // Apply friction
    projectile.body.velocity.scale(this.FRICTION);

    // Trigger collision callback
    onCollision();
  }

  static preventOverlap(
    tank1: Tank,
    tank2: Tank
  ): void {
    if (!tank1.sprite?.body || !tank2.sprite?.body) return;

    const body1 = tank1.sprite.body as Phaser.Physics.Arcade.Body;
    const body2 = tank2.sprite.body as Phaser.Physics.Arcade.Body;

    // Calculate overlap
    const dx = tank2.sprite.x - tank1.sprite.x;
    const dy = tank2.sprite.y - tank1.sprite.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const minDistance = (body1.width + body2.width) / 2;
    
    if (distance < minDistance) {
      // Calculate separation vector
      const separation = minDistance - distance;
      const angle = Math.atan2(dy, dx);
      
      // Move tanks apart
      const moveX = Math.cos(angle) * separation / 2;
      const moveY = Math.sin(angle) * separation / 2;
      
      tank1.sprite.x -= moveX;
      tank1.sprite.y -= moveY;
      tank2.sprite.x += moveX;
      tank2.sprite.y += moveY;
      
      // Adjust velocities for bounce effect
      const v1x = body1.velocity.x;
      const v1y = body1.velocity.y;
      const v2x = body2.velocity.x;
      const v2y = body2.velocity.y;
      
      body1.velocity.x = v2x * this.RESTITUTION;
      body1.velocity.y = v2y * this.RESTITUTION;
      body2.velocity.x = v1x * this.RESTITUTION;
      body2.velocity.y = v1y * this.RESTITUTION;
    }
  }
}