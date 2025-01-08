import Phaser from 'phaser';
import { Tank } from '../types';
import { ProjectileGraphics } from '../graphics/ProjectileGraphics';
import { CombatSystem } from './CombatSystem';

export class ProjectileManager {
  private scene: Phaser.Scene;
  projectiles: Phaser.Physics.Arcade.Group;
  private lastFireTime: Map<string, number> = new Map();
  private readonly FIRE_COOLDOWN = 500;
  private readonly PROJECTILE_SPEED = 400;
  private readonly PROJECTILE_DAMAGE = 20;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.projectiles = scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 20,
      collideWorldBounds: true,
      bounceX: 0,
      bounceY: 0
    });
  }

  fire(tank: Tank) {
    // Early return if tank doesn't exist, is destroyed, or has no ammo
    if (!tank.sprite || !tank.sprite.body || tank.stats.health <= 0 || tank.stats.ammo <= 0) return;

    // Check if physics is enabled
    const body = tank.sprite.body as Phaser.Physics.Arcade.Body;
    if (!body.enable) return;

    const now = Date.now();
    const lastFire = this.lastFireTime.get(tank.id) || 0;
    if (now - lastFire < this.FIRE_COOLDOWN) return;
    this.lastFireTime.set(tank.id, now);

    // Calculate spawn position in front of tank
    const spawnDistance = 50;
    const angle = tank.sprite.rotation;
    const spawnX = tank.sprite.x + Math.cos(angle) * spawnDistance;
    const spawnY = tank.sprite.y + Math.sin(angle) * spawnDistance;

    // Create projectile
    const projectile = this.projectiles.create(
      spawnX,
      spawnY,
      'projectile'
    ) as Phaser.Physics.Arcade.Sprite & { ownerId?: string };

    if (!projectile) return;

    // Set projectile properties
    projectile.setRotation(angle);
    projectile.ownerId = tank.id;
    projectile.setData('damage', this.PROJECTILE_DAMAGE);
    
    // Set physics properties
    projectile.body.setSize(8, 8);
    projectile.body.setOffset(4, 4);
    projectile.body.onWorldBounds = true;
    
    // Set velocity
    this.scene.physics.velocityFromRotation(angle, this.PROJECTILE_SPEED, projectile.body.velocity);
    
    // Destroy projectile on world bounds collision
    projectile.body.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body) => {
      if (body.gameObject === projectile) {
        ProjectileGraphics.createExplosion(this.scene, projectile.x, projectile.y);
        projectile.destroy();
      }
    });
    
    // Destroy projectile after timeout
    this.scene.time.delayedCall(1500, () => {
      if (projectile.active) {
        projectile.destroy();
      }
    });
    
    // Reduce ammo
    tank.stats.ammo--;
  }

  setupCollisions(tanks: Tank[]) {
    tanks.forEach(tank => {
      if (!tank.sprite) return;

      this.scene.physics.add.overlap(
        this.projectiles,
        tank.sprite,
        (projectileObj, tankObj) => {
          const projectile = projectileObj as Phaser.Physics.Arcade.Sprite & { ownerId?: string };
          
          // Prevent friendly fire
          if (projectile.ownerId === tank.id) return;
          
          // Check for invulnerability
          if ((tank.sprite as any).isInvulnerable) return;
          
          // Apply damage and destroy projectile
          CombatSystem.handleDamage(tank, this.PROJECTILE_DAMAGE);
          ProjectileGraphics.createExplosion(this.scene, projectile.x, projectile.y);
          projectile.destroy();
        }
      );
    });
  }
}