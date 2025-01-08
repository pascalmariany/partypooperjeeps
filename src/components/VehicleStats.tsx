import React from 'react';
import { Vehicle } from '../game/types';

interface VehicleStatsProps {
  vehicle: Vehicle;
  title: string;
}

export const VehicleStats = ({ vehicle, title }: VehicleStatsProps) => {
  return (
    <div className="border border-green-500/30 rounded p-4 bg-black/80">
      <h3 className="text-xl font-bold mb-4 text-center border-b border-green-500/30 pb-2">
        {title}
      </h3>
      
      {/* Performance Stats */}
      <div className="mb-4">
        <h4 className="font-bold mb-2 text-green-400">Performance</h4>
        <ul className="space-y-1">
          <li>Speed: {Math.floor(vehicle.stats.speed)} {vehicle.stats.boostActive && '🚀'}</li>
          <li>Fuel Level: {Math.floor(vehicle.stats.fuel)}%</li>
          <li>Health: {vehicle.stats.health}/{vehicle.stats.maxHealth}</li>
        </ul>
      </div>

      {/* Game Stats */}
      <div className="mb-4">
        <h4 className="font-bold mb-2 text-green-400">Game Stats</h4>
        <ul className="space-y-1">
          <li>Score: {vehicle.stats.score}</li>
          <li>Presents: {vehicle.stats.presents}</li>
          <li>Lives: {vehicle.stats.lives}</li>
        </ul>
      </div>

      {/* Status Indicators */}
      <div>
        <h4 className="font-bold mb-2 text-green-400">Status</h4>
        <ul className="space-y-1">
          <li>
            Tree Status: {vehicle.stats.hasEnemyTree ? 
              '🎄 Carrying Enemy Tree!' : 
              '🔍 Searching for Tree'}
          </li>
          <li>
            Boost: {vehicle.stats.boostActive ? 
              '⚡ Active' : 
              '⏳ Ready'}
          </li>
          <li>
            Fuel Status: {vehicle.stats.fuel > 30 ? 
              '✅ Good' : 
              vehicle.stats.fuel > 10 ? 
                '⚠️ Low' : 
                '❌ Critical'}
          </li>
        </ul>
      </div>
    </div>
  );
};