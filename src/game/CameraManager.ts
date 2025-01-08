import Phaser from 'phaser';
import { GAME_CONFIG } from './constants';

export class CameraManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setupSplitScreen(player1: Phaser.GameObjects.Sprite, player2: Phaser.GameObjects.Sprite) {
    // Left viewport (Player 1)
    const mainCamera = this.scene.cameras.main;
    mainCamera.setViewport(
      0, 
      0, 
      GAME_CONFIG.VIEWPORT_WIDTH, 
      GAME_CONFIG.VIEWPORT_HEIGHT
    );
    mainCamera.startFollow(player1);
    mainCamera.setZoom(0.8);

    // Right viewport (Player 2)
    const camera2 = this.scene.cameras.add(
      GAME_CONFIG.VIEWPORT_WIDTH,
      0,
      GAME_CONFIG.VIEWPORT_WIDTH,
      GAME_CONFIG.VIEWPORT_HEIGHT
    );
    camera2.startFollow(player2);
    camera2.setZoom(0.8);

    // Add boundaries to prevent cameras from following tanks out of bounds
    mainCamera.setBounds(0, 0, GAME_CONFIG.VIEWPORT_WIDTH * 2, GAME_CONFIG.VIEWPORT_HEIGHT);
    camera2.setBounds(0, 0, GAME_CONFIG.VIEWPORT_WIDTH * 2, GAME_CONFIG.VIEWPORT_HEIGHT);
  }
}