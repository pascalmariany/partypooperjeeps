import { Tank } from '../types';

export class FuelSystem {
  private static readonly FUEL_CONSUMPTION_RATE = 0.05;  // Reduced from 0.1
  private static readonly MAX_FUEL = 100;
  private static readonly MIN_SPEED_FOR_CONSUMPTION = 0.1;

  static consumeFuel(tank: Tank): void {
    if (!tank.sprite?.body) return;
    
    const velocity = tank.sprite.body.velocity;
    const isMoving = Math.abs(velocity.x) > this.MIN_SPEED_FOR_CONSUMPTION || 
                    Math.abs(velocity.y) > this.MIN_SPEED_FOR_CONSUMPTION;
    
    if (isMoving && tank.stats.fuel > 0) {
      tank.stats.fuel = Math.max(0, tank.stats.fuel - this.FUEL_CONSUMPTION_RATE);
      
      // Stop tank if out of fuel
      if (tank.stats.fuel <= 0) {
        tank.sprite.body.setVelocity(0, 0);
      }
    }
  }

  static refuel(tank: Tank, amount: number = 25): void {
    tank.stats.fuel = Math.min(this.MAX_FUEL, tank.stats.fuel + amount);
  }

  static initializeFuel(tank: Tank): void {
    tank.stats.fuel = this.MAX_FUEL;
  }

  static hasFuel(tank: Tank): boolean {
    return tank.stats.fuel > 0;
  }
}