import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { gameConfig } from '../game/config';

export const GameContainer = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config = {
      ...gameConfig,
      parent: 'game-container',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: gameConfig.width,
        height: gameConfig.height
      }
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center w-full">
      <div 
        id="game-container" 
        className="aspect-[4/3] bg-black relative overflow-hidden rounded border-2 border-green-500/30"
        style={{ 
          width: '800px',
          height: '600px'
        }}
      />
    </div>
  );
}