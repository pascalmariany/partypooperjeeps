import Phaser from 'phaser';
import { Tank, TankControls } from '../types';
import { AudioManager } from '../audio/AudioManager';

export class ControlsManager {
  private scene: Phaser.Scene;
  private controls: Map<string, Phaser.Types.Input.Keyboard.CursorKeys> = new Map();
  private audioManager?: AudioManager;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.audioManager = AudioManager.getInstance();
  }

  setupTankControls(tank: Tank, keys: TankControls) {
    const controls = this.scene.input.keyboard.addKeys(keys) as Phaser.Types.Input.Keyboard.CursorKeys;
    this.controls.set(tank.id, controls);
  }

  updateTankMovement(tank: Tank) {
    const controls = this.controls.get(tank.id);
    if (!controls || !tank.sprite?.body) return;

    const speed = tank.stats.speed * 5;
    const body = tank.sprite.body as Phaser.Physics.Arcade.Body;
    const rotationSpeed = 0.1;

    // Reset velocity
    body.setVelocity(0);

    // Handle rotation
    if (controls.left.isDown) {
      tank.sprite.rotation -= rotationSpeed;
    } else if (controls.right.isDown) {
      tank.sprite.rotation += rotationSpeed;
    }

    // Handle movement and sound
    if (controls.up.isDown || controls.down.isDown) {
      if (controls.up.isDown) {
        this.scene.physics.velocityFromRotation(
          tank.sprite.rotation,
          speed,
          body.velocity
        );
      } else {
        this.scene.physics.velocityFromRotation(
          tank.sprite.rotation,
          -speed,
          body.velocity
        );
      }
      // Play driving sound based on boost status
      this.audioManager?.playDrivingSound(tank.stats.boostActive);
    } else {
      // Stop driving sound when not moving
      this.audioManager?.stopDrivingSound();
    }
  }
}