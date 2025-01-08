import Phaser from 'phaser';
import { Tank } from '../types';
import { CollisionPhysics } from './CollisionPhysics';
import { ProjectilePhysics } from './ProjectilePhysics';
import { Projectile } from '../combat/weapons/Projectile';

export class PhysicsManager {
  private scene: Phaser.Scene;
  private projectiles: Phaser.Physics.Arcade.Group;
  private tanks: Tank[];

  constructor(scene: Phaser.Scene, tanks: Tank[]) {
    this.scene = scene;
    this.tanks = tanks;
    this.projectiles = scene.physics.add.group({
      classType: Projectile,
      maxSize: 20,
      collideWorldBounds: true,
      bounceX: 0.8,
      bounceY: 0.8
    });

    this.setupCollisions();
  }

  update(delta: number): void {
    // Update projectile physics
    this.projectiles.getChildren().forEach(projectile => {
      ProjectilePhysics.updateProjectile(projectile as Projectile, delta);
    });

    // Handle tank collisions
    for (let i = 0; i < this.tanks.length; i++) {
      for (let j = i + 1; j < this.tanks.length; j++) {
        CollisionPhysics.preventOverlap(this.tanks[i], this.tanks[j]);
      }
    }
  }

  private setupCollisions(): void {
    // Setup tank-projectile collisions
    this.tanks.forEach(tank => {
      if (!tank.sprite) return;

      this.scene.physics.add.overlap(
        this.projectiles,
        tank.sprite,
        (projectileObj, tankObj) => {
          CollisionPhysics.handleProjectileCollision(
            projectileObj as Phaser.Physics.Arcade.Sprite,
            tankObj as Phaser.GameObjects.Container,
            () => this.handleProjectileHit(projectileObj as Projectile, tank)
          );
        }
      );
    });
  }

  private handleProjectileHit(projectile: Projectile, tank: Tank): void {
    if (projectile.ownerId === tank.id) return;
    if ((tank.sprite as any)?.isInvulnerable) return;

    // Create hit effect
    const particles = this.scene.add.particles(projectile.x, projectile.y, 'explosion', {
      speed: { min: 50, max: 150 },
      scale: { start: 0.5, end: 0 },
      lifespan: 300,
      quantity: 10
    });

    this.scene.time.delayedCall(300, () => particles.destroy());

    // Destroy projectile
    projectile.destroy();
  }

  addProjectile(x: number, y: number, velocity: Phaser.Math.Vector2, ownerId: string): Projectile {
    const projectile = this.projectiles.create(x, y) as Projectile;
    projectile.ownerId = ownerId;
    projectile.body.velocity.copy(velocity);
    return projectile;
  }
}