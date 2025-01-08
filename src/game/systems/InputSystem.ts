import Phaser from 'phaser';
import { Vehicle } from '../types';

export class InputSystem {
  static setupControls(params: {
    scene: Phaser.Scene,
    player1: Vehicle,
    player2?: Vehicle,
    gameMode: 'single' | 'multi'
  }) {
    const { scene, player1, player2, gameMode } = params;

    // Setup keyboard controls for player 1
    scene.input.keyboard.on('keydown-SPACE', () => {
      // No weapon firing in this game mode
    });

    // Setup keyboard controls for player 2 (multiplayer only)
    if (player2 && gameMode === 'multi') {
      scene.input.keyboard.on('keydown-SHIFT', () => {
        // No weapon firing in this game mode
      });
    }
  }
}