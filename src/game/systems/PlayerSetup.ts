import Phaser from 'phaser';
import { Vehicle } from '../types';
import { GameRules } from '../rules/GameRules';
import { JeepGraphics } from '../graphics/JeepGraphics';
import { BaseGraphics } from '../graphics/BaseGraphics';
import { ChristmasTree } from '../entities/ChristmasTree';
import { WORLD_CONFIG } from '../config';
import { PLAYER2_KEYS } from '../controls/KeyBindings';
import { ControlsManager } from '../controls/ControlsManager';
import { CameraManager } from '../camera/CameraManager';
import { MultiplayerManager } from './MultiplayerManager';

export class PlayerSetup {
  static setupSinglePlayer(scene: Phaser.Scene, params: {
    player1: Vehicle,
    controlsManager: ControlsManager,
    cameraManager: CameraManager,
    trees: ChristmasTree[]
  }): Vehicle {
    const { player1, cameraManager, trees } = params;
    
    // Create AI vehicle (player 2)
    const { player2 } = MultiplayerManager.setupPlayers('single');
    
    this.createPlayerBase(scene, player2, trees);
    
    // Setup camera for single player
    if (player1.sprite) {
      cameraManager.setupSinglePlayerCamera(player1.sprite);
    }

    return player2;
  }

  static setupMultiPlayer(scene: Phaser.Scene, params: {
    player1: Vehicle,
    controlsManager: ControlsManager,
    cameraManager: CameraManager,
    trees: ChristmasTree[]
  }): Vehicle {
    const { player1, controlsManager, cameraManager, trees } = params;
    
    // Create human player 2 (Blue Jeep)
    const { player2 } = MultiplayerManager.setupPlayers('multi');
    
    this.createPlayerBase(scene, player2, trees);
    
    // Setup player 2 controls
    controlsManager.setupTankControls(player2, PLAYER2_KEYS);

    // Setup split screen if both players exist
    if (player1.sprite && player2.sprite) {
      cameraManager.setupSplitScreen(player1.sprite, player2.sprite);
    }

    return player2;
  }

  private static createPlayerBase(scene: Phaser.Scene, player: Vehicle, trees: ChristmasTree[]) {
    // Create player's base and jeep
    BaseGraphics.create(
      scene, 
      WORLD_CONFIG.WORLD_WIDTH - 100, 
      WORLD_CONFIG.WORLD_HEIGHT / 2, 
      player.color
    );
    
    player.sprite = JeepGraphics.create(scene, player);
    player.sprite.setPosition(
      WORLD_CONFIG.WORLD_WIDTH - 100, 
      WORLD_CONFIG.WORLD_HEIGHT / 2
    );
    player.sprite.rotation = Math.PI; // Face left

    // Create Christmas tree for player
    const tree = new ChristmasTree(
      scene, 
      WORLD_CONFIG.WORLD_WIDTH - 100, 
      WORLD_CONFIG.WORLD_HEIGHT / 2, 
      player.id
    );
    trees.push(tree);
  }
}