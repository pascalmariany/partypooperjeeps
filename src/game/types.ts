export interface Vehicle {
  id: string;
  color: string;
  stats: {
    speed: number;
    boostActive: boolean;
    boostEndTime?: number;
    health: number;
    maxHealth: number;
    fuel: number;
    lives: number;
    presents: number;
    score: number;
    hasEnemyTree: boolean;
  };
  sprite?: Phaser.GameObjects.Container & { body: Phaser.Physics.Arcade.Body };
}

export interface SpeedBoost {
  sprite: Phaser.GameObjects.Container;
  isCollected: boolean;
}