import Phaser from 'phaser';

export class NameInputScene extends Phaser.Scene {
  private player1Name: string = '';
  private player2Name: string = '';
  private gameMode: 'single' | 'multi' = 'single';
  private currentInput: 'player1' | 'player2' = 'player1';
  private nameText?: Phaser.GameObjects.Text;
  private instructionText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'NameInputScene' });
  }

  init(data: { mode: 'single' | 'multi' }) {
    this.gameMode = data.mode;
    this.player1Name = '';
    this.player2Name = '';
    this.currentInput = 'player1';
  }

  create() {
    // Add background
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000)
      .setOrigin(0)
      .setDepth(-1);

    // Title
    this.add.text(
      this.cameras.main.centerX,
      100,
      'ENTER YOUR NAME',
      {
        fontSize: '32px',
        color: '#00ff00',
        fontFamily: 'monospace'
      }
    ).setOrigin(0.5);

    // Name input display
    this.nameText = this.add.text(
      this.cameras.main.centerX,
      200,
      '_',
      {
        fontSize: '48px',
        color: '#00ff00',
        fontFamily: 'monospace'
      }
    ).setOrigin(0.5);

    // Instructions
    this.instructionText = this.add.text(
      this.cameras.main.centerX,
      300,
      'PLAYER 1\nType your name and press ENTER',
      {
        fontSize: '24px',
        color: '#00ff00',
        fontFamily: 'monospace',
        align: 'center'
      }
    ).setOrigin(0.5);

    // Setup keyboard input
    this.input.keyboard.on('keydown', this.handleKeyPress, this);
  }

  private handleKeyPress(event: KeyboardEvent) {
    // Handle backspace
    if (event.key === 'Backspace') {
      if (this.currentInput === 'player1') {
        this.player1Name = this.player1Name.slice(0, -1);
      } else {
        this.player2Name = this.player2Name.slice(0, -1);
      }
    }
    // Handle enter
    else if (event.key === 'Enter') {
      if (this.currentInput === 'player1' && this.player1Name.length > 0) {
        if (this.gameMode === 'multi') {
          this.currentInput = 'player2';
          this.player2Name = '';
          if (this.instructionText) {
            this.instructionText.setText('PLAYER 2\nType your name and press ENTER');
          }
        } else {
          this.startGame();
        }
      } else if (this.currentInput === 'player2' && this.player2Name.length > 0) {
        this.startGame();
      }
    }
    // Handle regular input
    else if (event.key.length === 1 && /[a-zA-Z0-9]/.test(event.key)) {
      const currentName = this.currentInput === 'player1' ? this.player1Name : this.player2Name;
      if (currentName.length < 10) {
        if (this.currentInput === 'player1') {
          this.player1Name += event.key.toUpperCase();
        } else {
          this.player2Name += event.key.toUpperCase();
        }
      }
    }

    // Update display
    if (this.nameText) {
      const currentName = this.currentInput === 'player1' ? this.player1Name : this.player2Name;
      this.nameText.setText(currentName + '_');
    }
  }

  private startGame() {
    // Clean up keyboard listeners
    this.input.keyboard.removeAllListeners();

    // Start the game scene
    this.scene.start('GameScene', {
      mode: this.gameMode,
      player1Name: this.player1Name || 'PLAYER 1',
      player2Name: this.gameMode === 'multi' ? (this.player2Name || 'PLAYER 2') : 'CPU'
    });
  }

  shutdown() {
    // Clean up
    this.input.keyboard.removeAllListeners();
  }
}