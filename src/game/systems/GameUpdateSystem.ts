import { Vehicle } from '../types';
import { ControlsManager } from '../controls/ControlsManager';
import { RetroUI } from '../ui/RetroUI';
import { FuelSystem } from './FuelSystem';
import { ScoreRules } from '../rules/ScoreRules';
import { AISystem } from '../ai/AISystem';
import { MultiplayerManager } from './MultiplayerManager';

export class GameUpdateSystem {
  private static aiSystem?: AISystem;

  static cleanup() {
    if (this.aiSystem) {
      this.aiSystem.deactivate();
      this.aiSystem = undefined;
    }
  }

  static async update(params: {
    scene: Phaser.Scene,
    controlsManager: ControlsManager,
    player1: Vehicle,
    player2?: Vehicle,
    retroUI: RetroUI,
    gameMode: 'single' | 'multi',
    player1Name: string,
    player2Name: string
  }): Promise<{ winner: string, data: any } | null> {
    const { controlsManager, player1, player2, retroUI, gameMode, scene, player1Name, player2Name } = params;

    // Update player 1
    if (player1.stats.fuel > 0) {
      controlsManager.updateTankMovement(player1);
    }
    FuelSystem.consumeFuel(player1);
    retroUI.updateStats(player1, 'left');

    // Update player 2 if exists
    if (player2) {
      if (gameMode === 'multi') {
        if (player2.stats.fuel > 0) {
          controlsManager.updateTankMovement(player2);
        }
        MultiplayerManager.updatePlayerStats(player1, player2);
      } else {
        // Initialize or update AI system
        if (!this.aiSystem || !this.aiSystem.isActive()) {
          this.aiSystem = new AISystem(scene, player2, player1);
        }
        this.aiSystem.update();
      }
      FuelSystem.consumeFuel(player2);
      retroUI.updateStats(player2, 'right');
    }

    // Check victory conditions
    const player1Victory = await ScoreRules.handleTreeReturn(player1);
    if (player1Victory) {
      this.cleanup(); // Clean up AI when game ends
      return {
        winner: 'PLAYER 1',
        data: {
          winner: 'PLAYER 1',
          player1Name,
          player2Name,
          player1Score: player1.stats.score,
          player2Score: player2?.stats.score || 0,
          player1Presents: player1.stats.presents,
          player2Presents: player2?.stats.presents || 0,
          gameMode
        }
      };
    }

    if (player2) {
      const player2Victory = await ScoreRules.handleTreeReturn(player2);
      if (player2Victory) {
        this.cleanup(); // Clean up AI when game ends
        return {
          winner: 'PLAYER 2',
          data: {
            winner: 'PLAYER 2',
            player1Name,
            player2Name,
            player1Score: player1.stats.score,
            player2Score: player2.stats.score,
            player1Presents: player1.stats.presents,
            player2Presents: player2.stats.presents,
            gameMode
          }
        };
      }
    }

    return null;
  }
}