import Phaser from 'phaser';
import { WORLD_CONFIG } from '../config';

export class CameraManager {
  private scene: Phaser.Scene;
  private separators: Phaser.GameObjects.Graphics[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setupSinglePlayerCamera(target: Phaser.GameObjects.Container) {
    const mainCamera = this.scene.cameras.main;
    mainCamera.setBounds(0, 0, WORLD_CONFIG.WORLD_WIDTH, WORLD_CONFIG.WORLD_HEIGHT);
    mainCamera.startFollow(target, true, 0.09, 0.09);
    mainCamera.setZoom(1);
  }

  setupSplitScreen(player1: Phaser.GameObjects.Container, player2: Phaser.GameObjects.Container) {
    this.clearSeparators();

    // Left camera for Player 1
    const mainCamera = this.scene.cameras.main;
    mainCamera.setViewport(0, 0, WORLD_CONFIG.VIEWPORT_WIDTH / 2 - 2, WORLD_CONFIG.VIEWPORT_HEIGHT);
    mainCamera.setBounds(0, 0, WORLD_CONFIG.WORLD_WIDTH, WORLD_CONFIG.WORLD_HEIGHT);
    mainCamera.startFollow(player1, true, 0.09, 0.09);
    mainCamera.ignore([]);  // Reset ignore filters

    // Right camera for Player 2
    const camera2 = this.scene.cameras.add(
      WORLD_CONFIG.VIEWPORT_WIDTH / 2 + 2,
      0,
      WORLD_CONFIG.VIEWPORT_WIDTH / 2 - 2,
      WORLD_CONFIG.VIEWPORT_HEIGHT
    );
    camera2.setBounds(0, 0, WORLD_CONFIG.WORLD_WIDTH, WORLD_CONFIG.WORLD_HEIGHT);
    camera2.startFollow(player2, true, 0.09, 0.09);
    camera2.setName('camera2');
    camera2.ignore([]);  // Reset ignore filters

    // Add a glowing separator in the middle
    this.addSeparator(WORLD_CONFIG.VIEWPORT_WIDTH / 2);
  }

  private addSeparator(x: number) {
    this.clearSeparators();

    // Main black background separator
    const background = this.scene.add.graphics();
    background.fillStyle(0x000000, 1);
    background.fillRect(x - 4, 0, 8, WORLD_CONFIG.VIEWPORT_HEIGHT);
    background.setScrollFactor(0);
    background.setDepth(999);
    this.separators.push(background);

    // Create glowing effect with diminishing intensity
    const glowWidth = 4;
    const glowIntensity = 0.3;

    for (let i = 0; i < 3; i++) {
      const separator = this.scene.add.graphics();
      separator.lineStyle(glowWidth + i * 2, 0x00ff00, glowIntensity / (i + 1));
      separator.beginPath();
      separator.moveTo(x, 0);
      separator.lineTo(x, WORLD_CONFIG.VIEWPORT_HEIGHT);
      separator.strokePath();
      separator.setScrollFactor(0);
      separator.setDepth(1000 + i);
      this.separators.push(separator);
    }

    // Solid green lines on both sides of the separator
    const lines = this.scene.add.graphics();
    lines.lineStyle(2, 0x00ff00, 1);
    lines.beginPath();
    lines.moveTo(x - 4, 0);
    lines.lineTo(x - 4, WORLD_CONFIG.VIEWPORT_HEIGHT);
    lines.moveTo(x + 4, 0);
    lines.lineTo(x + 4, WORLD_CONFIG.VIEWPORT_HEIGHT);
    lines.strokePath();
    lines.setScrollFactor(0);
    lines.setDepth(1010);
    this.separators.push(lines);
  }

  private clearSeparators() {
    this.separators.forEach(separator => {
      if (separator) separator.destroy();
    });
    this.separators = [];
  }

  // Extra utility to fetch cameras safely
  getCameraByName(name: string): Phaser.Cameras.Scene2D.Camera | null {
    return this.scene.cameras.getCamera(name) || null;
  }
}
