import Phaser from 'phaser';
import { AudioManager } from '../game/audio/AudioManager';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    const title = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 100,
      'PARTY POOPER JEEPS',
      {
        fontSize: '64px',
        fontFamily: 'monospace',
        color: '#00ff00',
      }
    );
    title.setOrigin(0.5);

    const startText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 100,
      'Click or press any key to start\n\nM - Toggle Music',
      {
        fontSize: '24px',
        fontFamily: 'monospace',
        color: '#00ff00',
        align: 'center'
      }
    );
    startText.setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      yoyo: true,
      repeat: -1
    });

    // Initialize audio manager
    const audioManager = new AudioManager(this);

    // Handle input to start game
    const startGame = () => {
      // Resume audio context if suspended
      if (this.sound.locked) {
        this.sound.unlock();
      }
      
      // Initialize audio after user interaction
      audioManager.initializeAudio();
      
      this.scene.start('MenuScene');
    };

    // Setup input handlers
    this.input.keyboard.once('keydown', startGame);
    this.input.once('pointerdown', startGame);
  }
}