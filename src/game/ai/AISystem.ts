import Phaser from 'phaser';
import { Tank } from '../types';
import { WORLD_CONFIG } from '../config';
import { FuelSystem } from '../systems/FuelSystem';

export class AISystem {
  private scene: Phaser.Scene;
  private aiTank: Tank;
  private playerTank: Tank;
  private currentState: 'GET_TREE' | 'RETURN_TREE' | 'ATTACK' | 'RETREAT' | 'GET_FUEL' = 'GET_TREE';
  private lastStateChange: number = 0;
  private readonly STATE_CHANGE_COOLDOWN = 500;
  private readonly ATTACK_RANGE = 200;
  private readonly SAFE_DISTANCE = 300;
  private readonly MOVEMENT_SPEED = 4;
  private active: boolean = true;

  constructor(scene: Phaser.Scene, aiTank: Tank, playerTank: Tank) {
    this.scene = scene;
    this.aiTank = aiTank;
    this.playerTank = playerTank;
    this.active = true;
  }

  isActive(): boolean {
    return this.active;
  }

  deactivate() {
    this.active = false;
  }

  update() {
    if (!this.active || !this.aiTank.sprite?.body || !this.playerTank.sprite?.body) return;
    if (!this.aiTank.sprite.body.enable || !FuelSystem.hasFuel(this.aiTank)) return;

    const now = Date.now();
    if (now - this.lastStateChange >= this.STATE_CHANGE_COOLDOWN) {
      this.updateAIState();
      this.lastStateChange = now;
    }

    switch (this.currentState) {
      case 'GET_TREE':
        this.moveToEnemyTree();
        break;
      case 'RETURN_TREE':
        this.returnToBase();
        break;
      case 'ATTACK':
        this.attackPlayer();
        break;
      case 'RETREAT':
        this.retreat();
        break;
      case 'GET_FUEL':
        this.seekFuel();
        break;
    }
  }

  private updateAIState() {
    if (!this.aiTank.sprite || !this.playerTank.sprite) return;

    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.aiTank.sprite.x,
      this.aiTank.sprite.y,
      this.playerTank.sprite.x,
      this.playerTank.sprite.y
    );

    // Critical fuel level? Get fuel
    if (this.aiTank.stats.fuel < 20) {
      this.currentState = 'GET_FUEL';
      return;
    }

    // Has enemy tree? Return to base
    if (this.aiTank.stats.hasEnemyTree) {
      this.currentState = 'RETURN_TREE';
      return;
    }

    // Player too close and we don't have the tree? Attack or retreat
    if (distanceToPlayer < this.ATTACK_RANGE && !this.aiTank.stats.hasEnemyTree) {
      if (this.aiTank.stats.fuel > 30) {
        this.currentState = 'ATTACK';
      } else {
        this.currentState = 'RETREAT';
      }
      return;
    }

    // Default: Go for the tree
    this.currentState = 'GET_TREE';
  }

  private moveToEnemyTree() {
    if (!this.aiTank.sprite?.body) return;

    const targetX = 100;
    const targetY = WORLD_CONFIG.WORLD_HEIGHT / 2;

    const angle = Phaser.Math.Angle.Between(
      this.aiTank.sprite.x,
      this.aiTank.sprite.y,
      targetX,
      targetY
    );

    this.aiTank.sprite.rotation = angle;

    const speed = this.aiTank.stats.speed * this.MOVEMENT_SPEED;
    this.scene.physics.velocityFromRotation(
      angle,
      speed,
      this.aiTank.sprite.body.velocity
    );
  }

  private returnToBase() {
    if (!this.aiTank.sprite?.body) return;

    const baseX = WORLD_CONFIG.WORLD_WIDTH - 100;
    const baseY = WORLD_CONFIG.WORLD_HEIGHT / 2;

    const angle = Phaser.Math.Angle.Between(
      this.aiTank.sprite.x,
      this.aiTank.sprite.y,
      baseX,
      baseY
    );

    this.aiTank.sprite.rotation = angle;

    const speed = this.aiTank.stats.speed * this.MOVEMENT_SPEED;
    this.scene.physics.velocityFromRotation(
      angle,
      speed,
      this.aiTank.sprite.body.velocity
    );
  }

  private attackPlayer() {
    if (!this.aiTank.sprite?.body || !this.playerTank.sprite) return;

    const angle = Phaser.Math.Angle.Between(
      this.aiTank.sprite.x,
      this.aiTank.sprite.y,
      this.playerTank.sprite.x,
      this.playerTank.sprite.y
    );

    this.aiTank.sprite.rotation = angle;

    const speed = this.aiTank.stats.speed * (this.MOVEMENT_SPEED / 2);
    this.scene.physics.velocityFromRotation(
      angle,
      speed,
      this.aiTank.sprite.body.velocity
    );
  }

  private retreat() {
    if (!this.aiTank.sprite?.body || !this.playerTank.sprite) return;

    const angle = Phaser.Math.Angle.Between(
      this.playerTank.sprite.x,
      this.playerTank.sprite.y,
      this.aiTank.sprite.x,
      this.aiTank.sprite.y
    );

    this.aiTank.sprite.rotation = angle;

    const speed = this.aiTank.stats.speed * this.MOVEMENT_SPEED;
    this.scene.physics.velocityFromRotation(
      angle,
      speed,
      this.aiTank.sprite.body.velocity
    );
  }

  private seekFuel() {
    if (!this.aiTank.sprite?.body) return;

    const baseX = WORLD_CONFIG.WORLD_WIDTH - 100;
    const baseY = WORLD_CONFIG.WORLD_HEIGHT / 2;

    const angle = Phaser.Math.Angle.Between(
      this.aiTank.sprite.x,
      this.aiTank.sprite.y,
      baseX,
      baseY
    );

    this.aiTank.sprite.rotation = angle;

    const speed = this.aiTank.stats.speed * (this.MOVEMENT_SPEED / 1.5);
    this.scene.physics.velocityFromRotation(
      angle,
      speed,
      this.aiTank.sprite.body.velocity
    );
  }
}