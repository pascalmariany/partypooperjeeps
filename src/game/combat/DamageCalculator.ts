import { Tank } from '../types';

export class DamageCalculator {
  private static readonly BASE_DAMAGE = 20;  // Increased from 15 to 20
  private static readonly MAX_ARMOR_REDUCTION = 0.3;  // Reduced from 0.4 to 0.3
  private static readonly MIN_DAMAGE = 10;  // Ensure minimum damage

  static calculateDamage(baseDamage: number, targetTank: Tank): number {
    const armorReduction = Math.min(
      (targetTank.stats.armor || 0) / 100,
      this.MAX_ARMOR_REDUCTION
    );

    return Math.max(
      this.MIN_DAMAGE,
      Math.floor(baseDamage * (1 - armorReduction))
    );
  }
}