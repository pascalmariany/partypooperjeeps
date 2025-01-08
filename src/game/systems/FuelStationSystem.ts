import Phaser from 'phaser';
import { FuelStation } from '../entities/FuelStation';
import { WORLD_CONFIG } from '../config';
import { PositionGenerator } from '../utils/PositionGenerator';

export class FuelStationSystem {
  static createStations(scene: Phaser.Scene): FuelStation[] {
    // Reset position generator before creating fuel stations
    PositionGenerator.reset();

    const stationCount = 5;
    const stations: FuelStation[] = [];

    for (let i = 0; i < stationCount; i++) {
      const position = PositionGenerator.generateSafePosition();
      stations.push(new FuelStation(scene, position.x, position.y));
    }

    return stations;
  }
}