import { Vehicle } from '../types';

export class StatisticsManager {
  private static instance: StatisticsManager;
  private vehicleStats: Map<string, VehicleStatistics> = new Map();

  static getInstance(): StatisticsManager {
    if (!StatisticsManager.instance) {
      StatisticsManager.instance = new StatisticsManager();
    }
    return StatisticsManager.instance;
  }

  updateStats(vehicle: Vehicle) {
    let stats = this.vehicleStats.get(vehicle.id) || this.createNewStats();
    
    // Update max speed
    if (vehicle.stats.speed > stats.maxSpeedReached) {
      stats.maxSpeedReached = vehicle.stats.speed;
    }

    // Update boost usage
    if (vehicle.stats.boostActive && !stats.isBoostTracked) {
      stats.boostUsageCount++;
      stats.isBoostTracked = true;
    } else if (!vehicle.stats.boostActive) {
      stats.isBoostTracked = false;
    }

    // Update distance traveled
    if (vehicle.sprite?.body) {
      const velocity = vehicle.sprite.body.velocity;
      const distance = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y) / 60;
      stats.distanceTraveled += distance;
    }

    this.vehicleStats.set(vehicle.id, stats);
  }

  getStats(vehicleId: string): VehicleStatistics {
    return this.vehicleStats.get(vehicleId) || this.createNewStats();
  }

  private createNewStats(): VehicleStatistics {
    return {
      maxSpeedReached: 0,
      boostUsageCount: 0,
      distanceTraveled: 0,
      isBoostTracked: false
    };
  }
}

interface VehicleStatistics {
  maxSpeedReached: number;
  boostUsageCount: number;
  distanceTraveled: number;
  isBoostTracked: boolean;
}