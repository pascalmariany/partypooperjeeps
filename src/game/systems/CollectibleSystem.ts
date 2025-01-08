import Phaser from 'phaser';
import { Present } from '../entities/Present';
import { SpeedBoost } from '../entities/SpeedBoost';
import { PositionGenerator } from '../utils/PositionGenerator';

export class CollectibleSystem {
  private static readonly PRESENT_COUNT = 10;
  private static readonly SPEED_BOOST_COUNT = 8;

  static createCollectibles(scene: Phaser.Scene) {
    // Reset position generator
    PositionGenerator.reset();

    const presents = this.createPresents(scene);
    const speedBoosts = this.createSpeedBoosts(scene);
    return { presents, speedBoosts };
  }

  private static createPresents(scene: Phaser.Scene): Present[] {
    const presents: Present[] = [];
    
    for (let i = 0; i < this.PRESENT_COUNT; i++) {
      const position = PositionGenerator.generateSafePosition();
      presents.push(new Present(scene, position.x, position.y));
    }

    return presents;
  }

  private static createSpeedBoosts(scene: Phaser.Scene): SpeedBoost[] {
    const speedBoosts: SpeedBoost[] = [];
    
    for (let i = 0; i < this.SPEED_BOOST_COUNT; i++) {
      const position = PositionGenerator.generateSafePosition();
      speedBoosts.push(new SpeedBoost(scene, position.x, position.y));
    }

    return speedBoosts;
  }
}