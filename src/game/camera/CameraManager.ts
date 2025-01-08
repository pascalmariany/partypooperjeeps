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
    // Clear any existing separators
    this.clearSeparators();

    // Setup main camera (left side - Player 1)
    const mainCamera = this.scene.cameras.main;
    mainCamera.setViewport(0, 0, WORLD_CONFIG.VIEWPORT_WIDTH / 2 - 2, WORLD_CONFIG.VIEWPORT_HEIGHT);
    mainCamera.setBounds(0, 0, WORLD_CONFIG.WORLD_WIDTH, WORLD_CONFIG.WORLD_HEIGHT);
    mainCamera.startFollow(player1, true, 0.09, 0.09);

    // Setup second camera (right side - Player 2)
    const camera2 = this.scene.cameras.add(
      WORLD_CONFIG.VIEWPORT_WIDTH / 2 + 2,
      0,
      WORLD_CONFIG.VIEWPORT_WIDTH / 2 - 2,
      WORLD_CONFIG.VIEWPORT_HEIGHT
    );
    camera2.setBounds(0, 0, WORLD_CONFIG.WORLD_WIDTH, WORLD_CONFIG.WORLD_HEIGHT);
    camera2.startFollow(player2, true, 0.09, 0.09);

    // Add separator with glow effect
    this.addSeparator(WORLD_CONFIG.VIEWPORT_WIDTH / 2);
  }

  private addSeparator(x: number) {
    // Create main separator background
    const background = this.scene.add.graphics();
    background.fillStyle(0x000000, 1);
    background.fillRect(x - 4, 0, 8, WORLD_CONFIG.VIEWPORT_HEIGHT);
    background.setScrollFactor(0);
    background.setDepth(999);
    this.separators.push(background);

    // Create glow effect
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

    // Add solid lines on both sides
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
    this.separators.forEach(separator => separator.destroy());
    this.separators = [];
  }
}