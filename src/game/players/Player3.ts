import { Vehicle } from '../types';
import { VEHICLES } from '../constants';
import { GameRules } from '../rules/GameRules';

export class Player3 {
  static createHumanPlayer(): Vehicle {
    // Create player 3 with a unique VEHICLES.PLAYER3 configuration
    const player3 = { ...VEHICLES.PLAYER3 };
    player3.id = 'player3';
    GameRules.initializeTankStats(player3);
    return player3;
  }

  static updateStats(player3: Vehicle) {
    if (!player3.sprite?.body) return;

    // Track boost status
    if (player3.stats.boostActive && player3.stats.boostEndTime) {
      if (Date.now() >= player3.stats.boostEndTime) {
        player3.stats.boostActive = false;
        player3.stats.boostEndTime = undefined;
        player3.stats.speed = VEHICLES.PLAYER3.stats.speed;
      }
    }

    // Update fuel consumption based on movement
    const velocity = player3.sprite.body.velocity;
    const isMoving = Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1;
    if (isMoving && player3.stats.fuel > 0) {
      player3.stats.fuel = Math.max(0, player3.stats.fuel - 0.05);
    }
  }

  static isHumanPlayer(vehicle: Vehicle): boolean {
    return vehicle.id === 'player3';
  }
}
