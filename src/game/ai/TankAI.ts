import Phaser from 'phaser';
import { Tank } from '../types';

export class TankAI {
  private scene: Phaser.Scene;
  private tank: Tank;
  private target: Tank;
  private state: 'chase' | 'attack' | 'retreat' = 'chase';
  private lastStateChange: number = 0;
  private stateChangeCooldown: number = 1000;
  
  constructor(scene: Phaser.Scene, aiTank: Tank, playerTank: Tank) {
    this.scene = scene;
    this.tank = aiTank;
    this.target = playerTank;
  }

  update() {
    if (!this.tank.sprite?.body || !this.target.sprite) return;

    const now = Date.now();
    if (now - this.lastStateChange > this.stateChangeCooldown) {
      this.updateState();
      this.lastStateChange = now;
    }

    switch (this.state) {
      case 'chase':
        this.chaseTarget();
        break;
      case 'attack':
        this.attackTarget();
        break;
      case 'retreat':
        this.retreatToBase();
        break;
    }
  }

  private updateState() {
    if (!this.tank.sprite || !this.target.sprite) return;

    const distanceToTarget = Phaser.Math.Distance.Between(
      this.tank.sprite.x,
      this.tank.sprite.y,
      this.target.sprite.x,
      this.target.sprite.y
    );

    // Low health or fuel? Retreat
    if (this.tank.stats.health < 30 || this.tank.stats.fuel < 20) {
      this.state = 'retreat';
      return;
    }

    // Close enough? Attack
    if (distanceToTarget < 200) {
      this.state = 'attack';
      return;
    }

    // Otherwise chase
    this.state = 'chase';
  }

  private chaseTarget() {
    if (!this.tank.sprite?.body || !this.target.sprite) return;

    const angle = Phaser.Math.Angle.Between(
      this.tank.sprite.x,
      this.tank.sprite.y,
      this.target.sprite.x,
      this.target.sprite.y
    );

    // Set tank rotation
    this.tank.sprite.rotation = angle;

    // Move towards target
    const speed = this.tank.stats.speed * 5;
    this.scene.physics.velocityFromRotation(
      angle,
      speed,
      this.tank.sprite.body.velocity
    );
  }

  private attackTarget() {
    if (!this.tank.sprite?.body || !this.target.sprite) return;

    // Face target
    const angle = Phaser.Math.Angle.Between(
      this.tank.sprite.x,
      this.tank.sprite.y,
      this.target.sprite.x,
      this.target.sprite.y
    );
    this.tank.sprite.rotation = angle;

    // Stop moving
    this.tank.sprite.body.setVelocity(0, 0);

    // Fire if we have ammo
    if (this.tank.stats.ammo > 0) {
      this.scene.events.emit('aiTankFire', this.tank);
    }
  }

  private retreatToBase() {
    if (!this.tank.sprite?.body) return;

    const baseX = this.tank.id === 'scorpion' ? 100 : 700;
    const baseY = 300;

    const angle = Phaser.Math.Angle.Between(
      this.tank.sprite.x,
      this.tank.sprite.y,
      baseX,
      baseY
    );

    // Set tank rotation
    this.tank.sprite.rotation = angle;

    // Move towards base
    const speed = this.tank.stats.speed * 5;
    this.scene.physics.velocityFromRotation(
      angle,
      speed,
      this.tank.sprite.body.velocity
    );
  }
}