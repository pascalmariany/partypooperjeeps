import { Vehicle } from '../types';
import { WORLD_CONFIG } from '../config';
import { AudioManager } from '../audio/AudioManager';

export class ScoreRules {
  static readonly POINTS = {
    PRESENT: 100,
    TREE_CAPTURE: 1000,
    TREE_RETURN: 5000  // Points for successfully returning tree
  };

  static readonly BASE_CAPTURE_RADIUS = 100;
  static readonly VICTORY_CELEBRATION_DURATION = 3000;
  static readonly CAMERA_PAUSE_DURATION = 3000;

  private static audioManager?: AudioManager;

  static addPoints(vehicle: Vehicle, points: number) {
    vehicle.stats.score = (vehicle.stats.score || 0) + points;
  }

  static handleTreeCapture(vehicle: Vehicle) {
    vehicle.stats.hasEnemyTree = true;
    // Don't award points for just capturing - must return to base
  }

  static async handleTreeReturn(vehicle: Vehicle): Promise<boolean> {
    if (!vehicle.sprite || !vehicle.stats.hasEnemyTree) return false;

    // Initialize audio manager if needed
    if (!this.audioManager) {
      this.audioManager = AudioManager.getInstance();
    }

    // Check if vehicle is at their own base
    const baseX = vehicle.id === 'player1' ? 100 : WORLD_CONFIG.WORLD_WIDTH - 100;
    const baseY = WORLD_CONFIG.WORLD_HEIGHT / 2;
    
    const distanceToBase = Phaser.Math.Distance.Between(
      vehicle.sprite.x,
      vehicle.sprite.y,
      baseX,
      baseY
    );

    if (distanceToBase < this.BASE_CAPTURE_RADIUS) {
      // Award points for successful tree return
      this.addPoints(vehicle, this.POINTS.TREE_RETURN);
      vehicle.stats.hasEnemyTree = false;

      // Play victory sound
      this.audioManager?.playVictorySound();

      // Create enhanced victory celebration effects
      const scene = vehicle.sprite.scene;
      
      // Pause physics
      scene.physics.pause();

      // Get all cameras
      const cameras = scene.cameras.cameras;
      
      // Store original camera settings
      const originalSettings = cameras.map(camera => ({
        scrollX: camera.scrollX,
        scrollY: camera.scrollY,
        zoom: camera.zoom
      }));

      // Zoom in on the winning vehicle for each camera
      cameras.forEach(camera => {
        camera.stopFollow();
        camera.pan(vehicle.sprite!.x, vehicle.sprite!.y, this.CAMERA_PAUSE_DURATION);
        camera.zoomTo(1.5, this.CAMERA_PAUSE_DURATION);
      });

      // Large "VICTORY!" text
      const victoryText = scene.add.text(
        vehicle.sprite.x,
        vehicle.sprite.y - 40,
        'VICTORY!',
        {
          fontSize: '64px',
          color: '#ffff00',
          stroke: '#000000',
          strokeThickness: 6
        }
      ).setOrigin(0.5);

      // Add multiple celebration effects
      this.createCelebrationEffects(scene, vehicle.sprite.x, vehicle.sprite.y);

      // Animate victory text
      scene.tweens.add({
        targets: victoryText,
        y: victoryText.y - 100,
        alpha: { from: 1, to: 0 },
        duration: this.VICTORY_CELEBRATION_DURATION,
        ease: 'Power2',
        onComplete: () => victoryText.destroy()
      });

      // Return promise that resolves after celebration
      return new Promise(resolve => {
        scene.time.delayedCall(this.CAMERA_PAUSE_DURATION, () => {
          // Reset cameras
          cameras.forEach((camera, index) => {
            const original = originalSettings[index];
            camera.setScroll(original.scrollX, original.scrollY);
            camera.setZoom(original.zoom);
          });
          resolve(true);
        });
      });
    }

    return false;
  }

  private static createCelebrationEffects(scene: Phaser.Scene, x: number, y: number) {
    // Create multiple particle emitters for celebration
    const colors = [0xffff00, 0x00ff00, 0xff00ff, 0x00ffff];
    
    colors.forEach((color, index) => {
      const angle = index * 90; // Spread emitters in different directions
      const particles = scene.add.particles(x, y, 'explosion', {
        speed: { min: 200, max: 400 },
        angle: { min: angle - 45, max: angle + 45 },
        scale: { start: 1, end: 0 },
        blendMode: 'ADD',
        lifespan: 2000,
        quantity: 2,
        tint: color
      });

      // Clean up particles
      scene.time.delayedCall(2000, () => particles.destroy());
    });
  }

  static handlePresentCollect(vehicle: Vehicle) {
    this.addPoints(vehicle, this.POINTS.PRESENT);
  }
}