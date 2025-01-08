import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';
import { WORLD_CONFIG } from '../config';

export class QuitMenu {
  private static instance: QuitMenu | null = null;
  private scene: Phaser.Scene;
  private container?: Phaser.GameObjects.Container;
  private isVisible: boolean = false;
  private gameMode: 'single' | 'multi';
  private audioManager?: AudioManager;

  private constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.gameMode = 'single';
    this.audioManager = AudioManager.getInstance();
    this.setupKeyboardListeners();
  }

  static getInstance(scene: Phaser.Scene): QuitMenu {
    if (!QuitMenu.instance || QuitMenu.instance.scene !== scene) {
      QuitMenu.instance?.destroy();
      QuitMenu.instance = new QuitMenu(scene);
    }
    return QuitMenu.instance;
  }

  setGameMode(mode: 'single' | 'multi') {
    this.gameMode = mode;
  }

  private show() {
    if (this.isVisible) return;
    this.isVisible = true;
    this.scene.physics.pause();

    // Create container for menu elements
    this.container = this.scene.add.container(0, 0);
    this.container.setDepth(2000);
    this.container.setScrollFactor(0);

    // Create semi-transparent background
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x000000, 0.8);
    bg.fillRect(0, 0, WORLD_CONFIG.VIEWPORT_WIDTH, WORLD_CONFIG.VIEWPORT_HEIGHT);
    this.container.add(bg);

    if (this.gameMode === 'multi') {
      // Calculate viewport centers
      const leftCenter = WORLD_CONFIG.VIEWPORT_WIDTH / 4; // Center of left viewport
      const rightCenter = (WORLD_CONFIG.VIEWPORT_WIDTH * 3) / 4; // Center of right viewport
      
      // Create menu for left viewport
      this.createMenuElements(leftCenter, 'left');
      // Create menu for right viewport
      this.createMenuElements(rightCenter, 'right');
    } else {
      // Single player centered menu
      this.createMenuElements(WORLD_CONFIG.VIEWPORT_WIDTH / 2, 'center');
    }
  }

  private createMenuElements(x: number, viewport: 'left' | 'right' | 'center') {
    if (!this.container) return;

    // Create menu background
    const menuBg = this.scene.add.rectangle(x, 300, 240, 160, 0x000000)
      .setStrokeStyle(2, 0x00ff00)
      .setOrigin(0.5);

    // Create menu text
    const title = this.scene.add.text(x, 260, 'QUIT TO MENU?', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#00ff00',
      stroke: '#003300',
      strokeThickness: 4
    }).setOrigin(0.5);

    const options = this.scene.add.text(x, 320, '[Y] YES   [N] NO', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#00ff00',
      stroke: '#003300',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Add glow effect
    const glow = this.scene.add.graphics();
    glow.lineStyle(16, 0x00ff00, 0.2);
    glow.strokeRect(x - 120, 220, 240, 160);

    // Add elements to container
    this.container.add([menuBg, glow, title, options]);

    // Handle split screen visibility
    if (this.gameMode === 'multi') {
      const elements = [menuBg, glow, title, options];
      if (viewport === 'left') {
        elements.forEach(element => this.scene.cameras.getCamera(1)?.ignore(element));
      } else if (viewport === 'right') {
        elements.forEach(element => this.scene.cameras.main.ignore(element));
      }
    }

    // Add pulsing animation to options text
    this.scene.tweens.add({
      targets: options,
      alpha: 0.5,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
  }

  private hide() {
    if (this.container) {
      this.container.destroy();
      this.container = undefined;
    }
    this.isVisible = false;
    this.scene.physics.resume();
  }

  private setupKeyboardListeners() {
    // Create key objects
    const qKey = this.scene.input.keyboard.addKey('Q');
    const yKey = this.scene.input.keyboard.addKey('Y');
    const nKey = this.scene.input.keyboard.addKey('N');

    // Add listeners
    qKey.on('down', () => {
      if (!this.isVisible) {
        this.show();
      }
    });

    yKey.on('down', () => {
      if (this.isVisible) {
        this.audioManager?.stopBackgroundMusic();
        this.scene.sound.stopAll();
        this.hide();
        this.scene.scene.stop();
        this.scene.scene.start('MenuScene');
      }
    });

    nKey.on('down', () => {
      if (this.isVisible) {
        this.hide();
      }
    });
  }

  destroy() {
    this.hide();
    // Clean up key listeners
    this.scene.input.keyboard.removeKey('Q');
    this.scene.input.keyboard.removeKey('Y');
    this.scene.input.keyboard.removeKey('N');
    QuitMenu.instance = null;
  }
}