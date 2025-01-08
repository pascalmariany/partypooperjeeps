import React from 'react';
import { Vehicle } from '../game/types';
import { VehicleStats } from './VehicleStats';

interface VehicleStatsDisplayProps {
  player1: Vehicle;
  player2: Vehicle;
  player3?: Vehicle;
  gameMode: 'single' | 'multi';
}

export const VehicleStatsDisplay = ({ player1, player2, player3, gameMode }: VehicleStatsDisplayProps) => {
  return (
    <div className="fixed top-4 right-4 space-y-4 w-64 z-50">
      <VehicleStats vehicle={player1} title="Red Jeep Stats" />
      {gameMode === 'multi' && (
        <>
          <VehicleStats vehicle={player2} title="Blue Jeep Stats" />
          {player3 && <VehicleStats vehicle={player3} title="Player 3 Stats" />}
        </>
      )}
    </div>
  );
};
