import { Vehicle } from '../types';
import { VEHICLES } from '../constants';
import { GameRules } from '../rules/GameRules';

export class MultiplayerManager {
  static setupPlayers(mode: 'single' | 'multi'): { player1: Vehicle, player2: Vehicle } {
    // Create player 1 (Red Jeep)
    const player1 = { ...VEHICLES.PLAYER1 };
    player1.id = 'player1';
    GameRules.initializeTankStats(player1);

    // Create player 2 (Blue Jeep) with independent stats
    const player2 = { ...VEHICLES.PLAYER2 };
    player2.id = 'player2';
    GameRules.initializeTankStats(player2);

    return { player1, player2 };
  }

  static updatePlayerStats(player1: Vehicle, player2: Vehicle, cameraView: 'left' | 'right') {
    // Update only the player stats for the respective camera view
    if (cameraView === 'left') {
      GameRules.updateTankStats(player1);
    } else {
      GameRules.updateTankStats(player2);
    }
  }
}