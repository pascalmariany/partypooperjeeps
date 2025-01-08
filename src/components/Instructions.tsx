import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const Instructions = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      <div className="bg-black border-2 border-green-500 p-8 max-w-2xl w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-green-500 hover:text-green-400"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="sr-only">Close</span>
        </button>

        <h2 className="text-3xl font-bold text-green-500 mb-6">HOW TO PLAY</h2>

        <div className="space-y-6 text-green-400">
          <section>
            <h3 className="text-xl font-bold mb-2">OBJECTIVE</h3>
            <p>Race to steal the enemy's Christmas tree and return it to your base!</p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-2">CONTROLS</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold mb-1">PLAYER 1</h4>
                <ul className="space-y-1">
                  <li>↑ / ↓ - Drive</li>
                  <li>← / → - Steer</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-1">PLAYER 2</h4>
                <ul className="space-y-1">
                  <li>W / S - Drive</li>
                  <li>A / D - Steer</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-2">GAME CONTROLS</h3>
            <ul className="space-y-1">
              <li>Q - Quit Game</li>
              <li>P - Pause Game</li>
              <li>M - Mute Music</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-2">POWER-UPS</h3>
            <ul className="space-y-1">
              <li>🎁 Presents - Extra points</li>
              <li>⚡ Speed Boost - 30% faster for 5 seconds</li>
              <li>⛽ Fuel Stations - Refuel your jeep</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-2">TIPS</h3>
            <ul className="space-y-1">
              <li>• Watch your fuel level</li>
              <li>• Use speed boosts strategically</li>
              <li>• Collect presents for bonus points</li>
              <li>• Return the tree to your base to win!</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};