import Phaser from 'phaser';
import { BuildingGraphics } from '../graphics/BuildingGraphics';
import { WORLD_CONFIG } from '../config';

export class BuildingSystem {
  static createBuildings(scene: Phaser.Scene): Phaser.GameObjects.Container[] {
    const buildings: Phaser.GameObjects.Container[] = [];
    const buildingCount = 12;
    const margin = 150; // Keep away from edges

    for (let i = 0; i < buildingCount; i++) {
      let x, y, isValidPosition;
      do {
        x = Phaser.Math.Between(margin, WORLD_CONFIG.WORLD_WIDTH - margin);
        y = Phaser.Math.Between(margin, WORLD_CONFIG.WORLD_HEIGHT - margin);
        isValidPosition = this.isValidBuildingPosition(x, y, buildings);
      } while (!isValidPosition);

      const building = BuildingGraphics.create(scene);
      building.setPosition(x, y);
      buildings.push(building);
    }

    return buildings;
  }

  private static isValidBuildingPosition(x: number, y: number, buildings: Phaser.GameObjects.Container[]): boolean {
    // Keep away from bases
    const distanceFromLeftBase = Phaser.Math.Distance.Between(x, y, 100, WORLD_CONFIG.WORLD_HEIGHT / 2);
    const distanceFromRightBase = Phaser.Math.Distance.Between(x, y, WORLD_CONFIG.WORLD_WIDTH - 100, WORLD_CONFIG.WORLD_HEIGHT / 2);
    if (distanceFromLeftBase < 200 || distanceFromRightBase < 200) return false;

    // Keep away from other buildings
    for (const building of buildings) {
      const distance = Phaser.Math.Distance.Between(x, y, building.x, building.y);
      if (distance < 150) return false;
    }

    return true;
  }
}