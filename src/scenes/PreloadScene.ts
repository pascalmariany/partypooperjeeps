import Phaser from 'phaser';
import { AudioManager } from '../game/audio/AudioManager';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Show loading text
    const loadingText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'Loading...',
      {
        fontSize: '32px',
        color: '#00ff00',
        fontFamily: 'monospace'
      }
    ).setOrigin(0.5);

    // Create loading bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.lineStyle(2, 0x00ff00);
    progressBox.strokeRect(240, 270, 320, 50);

    // Loading progress callback
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    // Loading complete callback
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      this.createStartButton();
    });

    // Load game assets
    this.loadGameAssets();
  }

  private createStartButton() {
    const startButton = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'START GAME',
      {
        fontSize: '32px',
        color: '#00ff00',
        fontFamily: 'monospace',
        backgroundColor: '#000000',
        padding: { x: 20, y: 10 }
      }
    )
    .setOrigin(0.5)
    .setInteractive();

    // Add hover effect
    startButton.on('pointerover', () => {
      startButton.setStyle({ color: '#ffffff' });
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ color: '#00ff00' });
    });

    // Handle click with audio initialization
    startButton.on('pointerdown', () => {
      if (this.sound.context.state === 'suspended') {
        this.sound.context.resume();
      }
      const audioManager = AudioManager.getInstance();
      if (audioManager) {
        audioManager.initializeAudio();
      }
      this.scene.start('TitleScene');
    });
  }

  private loadGameAssets() {
    // Load audio assets
    this.load.audio('bgMusic', 'https://onderwijsorakel.nl/wp-content/uploads/2025/01/dreamy-synth-sequence-146568.mp3');
    this.load.audio('normalDriving', 'https://onderwijsorakel.nl/wp-content/uploads/2025/01/engine-6000.mp3');
    this.load.audio('boostDriving', 'https://onderwijsorakel.nl/wp-content/uploads/2025/01/engine-47745.mp3');
    this.load.audio('engineStart', 'https://onderwijsorakel.nl/wp-content/uploads/2025/01/car-engine-start-44357.mp3');
    this.load.audio('pickupSound', 'https://onderwijsorakel.nl/wp-content/uploads/2025/01/8-bit-powerup-6768.mp3');
    this.load.audio('boostSound', 'https://onderwijsorakel.nl/wp-content/uploads/2025/01/boost-100537.mp3');
    this.load.audio('victorySound', 'https://onderwijsorakel.nl/wp-content/uploads/2025/01/victorymale-version-230553.mp3');

    // Create particle effects
    const particles = this.add.graphics();
    particles.fillStyle(0x00ffff);
    particles.fillCircle(4, 4, 4);
    particles.generateTexture('speedTrail', 8, 8);
    particles.destroy();

    // Create explosion effect
    const explosion = this.add.graphics();
    explosion.fillStyle(0xff0000);
    explosion.fillCircle(4, 4, 4);
    explosion.generateTexture('explosion', 8, 8);
    explosion.destroy();
  }
}