import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const title = this.add.text(
      this.cameras.main.centerX,
      100,
      'PARTY POOPER JEEPS',
      {
        fontSize: '48px',
        fontFamily: 'monospace',
        color: '#00ff00',
      }
    );
    title.setOrigin(0.5);

    const singlePlayerText = this.add.text(
      this.cameras.main.centerX,
      250,
      '1. Single Player',
      {
        fontSize: '32px',
        fontFamily: 'monospace',
        color: '#00ff00',
      }
    );
    singlePlayerText.setOrigin(0.5);

    const multiPlayerText = this.add.text(
      this.cameras.main.centerX,
      350,
      '2. Multiplayer',
      {
        fontSize: '32px',
        fontFamily: 'monospace',
        color: '#00ff00',
      }
    );
    multiPlayerText.setOrigin(0.5);

    // Handle number key inputs
    this.input.keyboard.once('keydown-ONE', () => {
      this.scene.start('NameInputScene', { mode: 'single' });
    });

    this.input.keyboard.once('keydown-TWO', () => {
      this.scene.start('NameInputScene', { mode: 'multi' });
    });
  }
}