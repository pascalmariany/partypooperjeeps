import Phaser from 'phaser';
import { Vehicle } from '../game/types';
import { GAME_CONFIG } from '../game/constants';

export class HUDScene extends Phaser.Scene {
  private player1?: Vehicle;
  private player2?: Vehicle;
  private player3?: Vehicle;
  private gameMode: 'single' | 'multi';

  constructor() {
    super({ key: 'HUDScene' });
  }

  create(data: { player1: Vehicle; player2: Vehicle; player3?: Vehicle; gameMode: 'single' | 'multi' }) {
    this.player1 = data.player1;
    this.player2 = data.player2;
    this.player3 = data.player3;
    this.gameMode = data.gameMode;
    this.createHUD();
  }

  private createHUD() {
    if (!this.player1 || !this.player2) return;

    this.displayStats(this.player1, 10, 'Red Jeep Stats');
    this.displayStats(this.player2, 200, 'Blue Jeep Stats');

    if (this.gameMode === 'multi' && this.player3) {
      this.displayStats(this.player3, 400, 'Player 3 Stats');
    }
  }

  private displayStats(player: Vehicle, xOffset: number, title: string) {
    const { stats } = player;

    this.add.text(xOffset, GAME_CONFIG.VIEWPORT_HEIGHT + 10, title, {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'monospace'
    });

    const statsText = [
      `SPEED: ${stats.speed.toString().padStart(2, '0')}`,
      `FUEL: ${stats.fuel.toFixed(2)}`,
      `SCORE: ${stats.score.toString().padStart(3, '0')}`
    ];

    statsText.forEach((text, index) => {
      this.add.text(xOffset, GAME_CONFIG.VIEWPORT_HEIGHT + 40 + (index * 20), text, {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'monospace'
      });
    });
  }

  update() {
    this.createHUD();  // Refresh the stats on every frame
  }
}
