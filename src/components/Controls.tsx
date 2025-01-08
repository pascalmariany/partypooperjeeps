import React from 'react';

export const Controls = () => {
  return (
    <div className="border border-green-500/30 rounded p-4">
      <h3 className="text-lg font-bold mb-2">CONTROLS</h3>
      <ul className="space-y-2">
        <li>↑ / W - Accelerate</li>
        <li>↓ / S - Reverse</li>
        <li>← / A - Turn Left</li>
        <li>→ / D - Turn Right</li>
        <li>⚡ - Collect speed boosts!</li>
      </ul>
    </div>
  );
};