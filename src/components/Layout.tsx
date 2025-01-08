import React, { useState } from 'react';
import { TankLogo } from './TankLogo';
import { Instructions } from './Instructions';
import { HighScores } from './HighScores';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showHighScores, setShowHighScores] = useState(false);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono">
      <header className="border-b border-green-500/30 p-4">
        <div className="container mx-auto flex items-center">
          <div className="flex-1 flex items-center justify-start">
            <TankLogo />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-2xl font-bold tracking-wider">PARTY POOPER JEEPS</h1>
          </div>
          <div className="flex-1 flex items-center justify-end space-x-6">
            <button 
              onClick={() => setShowInstructions(true)}
              className="hover:text-green-400 transition-colors"
            >
              Instructions
            </button>
            <button
              onClick={() => setShowHighScores(true)}
              className="hover:text-green-400 transition-colors"
            >
              High Scores
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        {children}
      </main>

      <footer className="border-t border-green-500/30 p-4 mt-auto">
        <div className="container mx-auto flex items-center">
          <div className="flex-1 flex items-center justify-start">
            <TankLogo />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <a 
              href="https://www.pascalmariany.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
            >
              Pascal Mariany
            </a>
          </div>
          <div className="flex-1 flex items-center justify-end">
            <a 
              href="https://www.linkedin.com/in/pascalmariany/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>

      <div className="fixed inset-0 pointer-events-none">
        <div className="w-full h-full opacity-10 bg-[linear-gradient(transparent_50%,_rgba(0,_255,_0,_0.1)_50%)]" style={{ backgroundSize: '100% 4px' }} />
      </div>

      {showInstructions && (
        <Instructions onClose={() => setShowInstructions(false)} />
      )}

      {showHighScores && (
        <HighScores onClose={() => setShowHighScores(false)} />
      )}
    </div>
  );
};