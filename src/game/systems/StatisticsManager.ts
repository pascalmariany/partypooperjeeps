import { Vehicle } from '../types';

export class StatisticsManager {
  private static instance: StatisticsManager;
  private vehicleStats: Map<string, VehicleStatistics> = new Map();
  private lastUpdateTime: Map<string, number> = new Map();
  private readonly UPDATE_INTERVAL = 100; // Minimum time between updates in ms

  private constructor() {} // Private constructor for singleton

  static getInstance(): StatisticsManager {
    if (!StatisticsManager.instance) {
      StatisticsManager.instance = new StatisticsManager();
    }
    return StatisticsManager.instance;
  }

  updateStats(vehicle: Vehicle) {
    if (!vehicle.id) return;

    const now = Date.now();
    const lastUpdate = this.lastUpdateTime.get(vehicle.id) || 0;
    
    // Throttle updates to prevent double tracking
    if (now - lastUpdate < this.UPDATE_INTERVAL) {
      return;
    }
    
    let stats = this.vehicleStats.get(vehicle.id);
    if (!stats) {
      stats = this.createNewStats();
      this.vehicleStats.set(vehicle.id, stats);
    }
    
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

    this.lastUpdateTime.set(vehicle.id, now);
  }

  getStats(vehicleId: string): VehicleStatistics {
    return this.vehicleStats.get(vehicleId) || this.createNewStats();
  }

  clearStats(vehicleId: string) {
    this.vehicleStats.delete(vehicleId);
    this.lastUpdateTime.delete(vehicleId);
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