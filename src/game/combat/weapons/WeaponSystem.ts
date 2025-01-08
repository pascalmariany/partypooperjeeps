import Phaser from 'phaser';
import { Tank } from '../../types';
import { Projectile } from './Projectile';
import { TankGraphics } from '../../graphics/TankGraphics';
import { GameRules } from '../../rules/GameRules';

export class WeaponSystem {
  private scene: Phaser.Scene;
  private projectiles: Phaser.Physics.Arcade.Group;
  private lastFireTime: Map<string, number> = new Map();
  private readonly FIRE_COOLDOWN = 500;
  private readonly PROJECTILE_SPEED = 400;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.projectiles = scene.physics.add.group({
      classType: Projectile,
      maxSize: 20
    });

    scene.physics.world.on('worldbounds', this.handleWorldBoundsCollision, this);
  }

  fire(tank: Tank): void {
    if (!tank.sprite?.body || tank.stats.ammo <= 0) return;
    if ((tank.sprite as any).isInvulnerable) return;
    if (!tank.sprite.body.enable) return;

    const now = Date.now();
    const lastFire = this.lastFireTime.get(tank.id) || 0;
    if (now - lastFire < this.FIRE_COOLDOWN) return;

    // Update last fire time
    this.lastFireTime.set(tank.id, now);

    // Calculate spawn position
    const angle = tank.sprite.rotation;
    const distance = 40;
    const x = tank.sprite.x + Math.cos(angle) * distance;
    const y = tank.sprite.y + Math.sin(angle) * distance;

    // Create projectile
    const projectile = this.projectiles.create(x, y) as Projectile;
    if (!projectile) return;

    projectile.ownerId = tank.id;
    projectile.fire(angle, this.PROJECTILE_SPEED);

    // Reduce ammo
    tank.stats.ammo--;
  }

  setupCollisions(tanks: Tank[]): void {
    tanks.forEach(tank => {
      if (!tank.sprite) return;

      this.scene.physics.add.overlap(
        this.projectiles,
        tank.sprite,
        (projectileObj, tankObj) => this.handleHit(projectileObj as Projectile, tank)
      );
    });
  }

  private handleHit(projectile: Projectile, tank: Tank): void {
    if (!tank.sprite?.body || projectile.ownerId === tank.id) return;
    if ((tank.sprite as any).isInvulnerable) return;
    if (!tank.sprite.body.enable) return;

    // Find attacker tank
    const attacker = this.findAttackerTank(projectile.ownerId);
    if (!attacker) return;

    // Destroy projectile
    projectile.destroy();

    // Create hit effect
    this.createHitEffect(projectile.x, projectile.y);

    // Handle tank damage and potential destruction
    GameRules.handleTankHit(tank, attacker);
  }

  private findAttackerTank(attackerId: string): Tank | undefined {
    return this.scene.data.get('tanks')?.find((t: Tank) => t.id === attackerId);
  }

  private handleWorldBoundsCollision(body: Phaser.Physics.Arcade.Body): void {
    if (body.gameObject instanceof Projectile) {
      this.createHitEffect(body.gameObject.x, body.gameObject.y);
      body.gameObject.destroy();
    }
  }

  private createHitEffect(x: number, y: number): void {
    const particles = this.scene.add.particles(x, y, 'explosion', {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      lifespan: 300,
      quantity: 10
    });

    this.scene.time.delayedCall(300, () => particles.destroy());
  }
}