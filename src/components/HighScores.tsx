import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HighScore {
  player_name: string;
  score: number;
  presents_collected: number;
  created_at: string;
}

export const HighScores = ({ onClose }: { onClose: () => void }) => {
  const [scores, setScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      const { data, error } = await supabase
        .from('highscores')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

      if (!error) {
        setScores(data);
      }
      setLoading(false);
    };

    fetchScores();
  }, []);

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

        <h2 className="text-3xl font-bold text-green-500 mb-6">HIGH SCORES</h2>

        {loading ? (
          <p className="text-green-400 text-center">Loading scores...</p>
        ) : scores.length === 0 ? (
          <p className="text-green-400 text-center">No high scores yet. Be the first to play!</p>
        ) : (
          <div className="space-y-4">
            {scores.map((score, index) => (
              <div 
                key={index}
                className="flex items-center justify-between border-b border-green-500/30 pb-2"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-green-500">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-bold text-green-400">{score.player_name}</h3>
                    <p className="text-sm text-green-500/70">
                      {new Date(score.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">{score.score} pts</p>
                  <p className="text-sm text-green-500/70">
                    {score.presents_collected} presents
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};