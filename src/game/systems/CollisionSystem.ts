import Phaser from 'phaser';
import { Vehicle } from '../types';
import { Present } from '../entities/Present';
import { SpeedBoost } from '../entities/SpeedBoost';
import { ChristmasTree } from '../entities/ChristmasTree';
import { FuelStation } from '../entities/FuelStation';
import { WaterSystem } from './WaterSystem';

export class CollisionSystem {
  static setupCollisions(params: {
    scene: Phaser.Scene;
    vehicles: Vehicle[];
    presents: Present[];
    speedBoosts: SpeedBoost[];
    trees: ChristmasTree[];
    fuelStations: FuelStation[];
    buildings: Phaser.GameObjects.Container[];
    waterPools: Phaser.GameObjects.Container[];
  }) {
    const { scene, vehicles, presents, speedBoosts, trees, fuelStations, buildings, waterPools } = params;

    // Setup vehicle-to-vehicle collisions
    for (let i = 0; i < vehicles.length; i++) {
      for (let j = i + 1; j < vehicles.length; j++) {
        if (vehicles[i].sprite && vehicles[j].sprite) {
          scene.physics.add.collider(vehicles[i].sprite, vehicles[j].sprite);
        }
      }
    }

    // Setup collectible collisions
    vehicles.forEach(vehicle => {
      if (!vehicle.sprite) return;

      // Building collisions - using the physics rectangle inside the container
      buildings.forEach(building => {
        const physicsRect = building.getAt(1) as Phaser.GameObjects.Rectangle;
        scene.physics.add.collider(vehicle.sprite!, physicsRect);
      });

      // Other collisions...
      presents.forEach(present => {
        scene.physics.add.overlap(
          vehicle.sprite!,
          present.sprite,
          () => present.collect(vehicle)
        );
      });

      speedBoosts.forEach(boost => {
        scene.physics.add.overlap(
          vehicle.sprite!,
          boost.sprite,
          () => boost.collect(vehicle)
        );
      });

      trees.forEach(tree => {
        scene.physics.add.overlap(
          vehicle.sprite!,
          tree.sprite,
          () => tree.collect(vehicle)
        );
      });

      fuelStations.forEach(station => {
        scene.physics.add.overlap(
          vehicle.sprite!,
          station.sprite,
          () => station.refuel(vehicle)
        );
      });
    });

    // Setup water pool effects
    WaterSystem.setupOverlap(scene, waterPools, vehicles);
  }
}