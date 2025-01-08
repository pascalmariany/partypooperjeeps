import Phaser from 'phaser';
import { Tank } from '../types';
import { WORLD_CONFIG } from '../config';

export class RespawnCameraManager {
  static focusOnRespawnPoint(scene: Phaser.Scene, tank: Tank, gameMode: 'single' | 'multi'): void {
    if (!tank.sprite) return;

    const camera = this.getRelevantCamera(scene, tank, gameMode);
    if (!camera) return;

    // Smoothly pan to respawn position
    camera.pan(
      tank.sprite.x,
      tank.sprite.y,
      1000, // Duration in ms
      'Sine.easeInOut',
      false,
      (camera: Phaser.Cameras.Scene2D.Camera) => {
        // Resume following the tank after pan completes
        camera.startFollow(tank.sprite!, true, 0.09, 0.09);
      }
    );
  }

  private static getRelevantCamera(
    scene: Phaser.Scene, 
    tank: Tank, 
    gameMode: 'single' | 'multi'
  ): Phaser.Cameras.Scene2D.Camera | null {
    if (gameMode === 'single') {
      return scene.cameras.main;
    }

    // For multiplayer, get the correct split-screen camera
    const isPlayer1 = tank.id === 'scorpion';
    return isPlayer1 ? scene.cameras.main : scene.cameras.getCamera(1);
  }
}