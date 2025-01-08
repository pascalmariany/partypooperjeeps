import Phaser from 'phaser';
import { Vehicle } from '../types';
import { WORLD_CONFIG } from '../config';

export class RetroUI {
  private scene: Phaser.Scene;
  private vehicles: Vehicle[] = [];
  private gameMode: 'single' | 'multi' = 'single';
  private readonly GAP_WIDTH = 4;
  private statsTexts: Map<string, Phaser.GameObjects.Text[]> = new Map();
  private player1Name: string = 'PLAYER 1';
  private player2Name: string = 'CPU';

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setGameMode(mode: 'single' | 'multi') {
    this.gameMode = mode;
  }

  setPlayerNames(player1Name: string, player2Name: string) {
    this.player1Name = player1Name || 'PLAYER 1';
    this.player2Name = this.gameMode === 'multi' ? (player2Name || 'PLAYER 2') : 'CPU';
  }

  setVehicles(vehicles: Vehicle[]) {
    this.vehicles = vehicles;
  }

  updateStats(vehicle: Vehicle, side: 'left' | 'right') {
    if (!vehicle) return;

    // Clear existing stats for this vehicle
    this.statsTexts.get(vehicle.id)?.forEach(text => text.destroy());

    const enemyVehicle = this.vehicles.find(v => v.id !== vehicle.id);
    const enemyHasOurTree = enemyVehicle?.stats.hasEnemyTree;

    // Calculate base position based on viewport
    const baseX = side === 'left' ? 10 : WORLD_CONFIG.VIEWPORT_WIDTH / 2 + 10;
    const y = 10;

    const teamColor = vehicle.id === 'player1' ? '🔴' : '🔵';
    const playerName = vehicle.id === 'player1' ? this.player1Name : this.player2Name;

    const stats = [
      `${teamColor} ${playerName}`,
      `FUEL: ${Math.floor(vehicle.stats.fuel).toString().padStart(3, '0')}`,
      `SPEED: ${Math.floor(vehicle.stats.speed)}${vehicle.stats.boostActive ? ' 🚀' : ''}`,
      `SCORE: ${vehicle.stats.score}`,
      `PRESENTS: ${vehicle.stats.presents}`,
      vehicle.stats.hasEnemyTree ? `${teamColor} HAS ENEMY TREE! 🎄` : '',
      enemyHasOurTree ? `⚠️ ENEMY HAS YOUR TREE! ⚠️` : ''
    ].filter(Boolean);

    const texts = stats.map((text, index) => {
      const statText = this.scene.add.text(
        baseX,
        y + (index * 20),
        text,
        {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: '#00ff00',
          stroke: '#003300',
          strokeThickness: 2
        }
      );

      statText.setScrollFactor(0).setDepth(1002);

      // Handle split screen visibility
      if (this.gameMode === 'multi') {
        const camera1 = this.scene.cameras.main;
        const camera2 = this.scene.cameras.getCamera(1);
        
        if (side === 'left') {
          // Only show in left viewport
          if (camera2) camera2.ignore(statText);
        } else {
          // Only show in right viewport
          camera1.ignore(statText);
        }
      }

      return statText;
    });

    this.statsTexts.set(vehicle.id, texts);
  }
}