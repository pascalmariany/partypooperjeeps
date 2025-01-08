import { Vehicle } from '../types';
import { GAME_CONFIG } from '../constants';
import { JeepGraphics } from '../graphics/JeepGraphics';
import { AudioManager } from '../audio/AudioManager';

export class SpeedBoostSystem {
  private static boostedVehicles: Map<string, number> = new Map();
  private static audioManager?: AudioManager;

  static applyBoost(vehicle: Vehicle): void {
    if (!vehicle.sprite) return;

    // Initialize audio manager if needed
    if (!this.audioManager) {
      this.audioManager = AudioManager.getInstance();
    }

    // Don't stack boosts, just refresh duration
    const originalSpeed = this.boostedVehicles.get(vehicle.id) || vehicle.stats.speed;
    
    // Apply boost
    vehicle.stats.speed = originalSpeed * GAME_CONFIG.BOOST_MULTIPLIER;
    vehicle.stats.boostActive = true;
    vehicle.stats.boostEndTime = Date.now() + GAME_CONFIG.BOOST_DURATION;
    
    // Store original speed
    this.boostedVehicles.set(vehicle.id, originalSpeed);

    // Add visual boost effect
    const particles = JeepGraphics.addBoostEffect(vehicle.sprite);

    // Remove boost after duration
    vehicle.sprite.scene.time.delayedCall(GAME_CONFIG.BOOST_DURATION, () => {
      this.removeBoost(vehicle);
      particles.destroy();
    });
  }

  private static removeBoost(vehicle: Vehicle): void {
    const originalSpeed = this.boostedVehicles.get(vehicle.id);
    if (originalSpeed) {
      vehicle.stats.speed = originalSpeed;
      vehicle.stats.boostActive = false;
      vehicle.stats.boostEndTime = undefined;
      this.boostedVehicles.delete(vehicle.id);
    }
  }

  static update(vehicle: Vehicle): void {
    if (vehicle.stats.boostEndTime && Date.now() >= vehicle.stats.boostEndTime) {
      this.removeBoost(vehicle);
    }
  }
}