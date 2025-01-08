import React from 'react';
import { Layout } from './components/Layout';
import { GameContainer } from './components/GameContainer';
import { Controls } from './components/Controls';
import { Objectives } from './components/Objectives';
import { GameHeader } from './components/GameHeader';

export default function App() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <GameHeader />
        <div className="relative">
          <div className="absolute inset-0 border border-green-500/50 -m-2 rounded blur-sm" />
          <div className="relative border-2 border-green-500 rounded p-2 bg-black/90">
            <GameContainer />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-8 text-sm">
          <Controls />
          <Objectives />
        </div>
      </div>
    </Layout>
  );
}