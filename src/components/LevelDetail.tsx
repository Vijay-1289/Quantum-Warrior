
import React, { useState } from 'react';
import { type QuantumLevel } from '@/data/quantumLevels';
import { QuantumMiniGame } from '@/components/QuantumMiniGame';
import { LevelIntro } from '@/components/LevelIntro';

interface LevelDetailProps {
  level: QuantumLevel;
  isCompleted: boolean;
  stars: number;
  onComplete: (stars: number) => void;
}

export const LevelDetail: React.FC<LevelDetailProps> = ({ level, isCompleted, stars, onComplete }) => {
  const [showGame, setShowGame] = useState(false);

  if (showGame) {
    return (
      <QuantumMiniGame
        level={level}
        onComplete={(earnedStars) => {
          onComplete(earnedStars);
          setShowGame(false);
        }}
        onBack={() => setShowGame(false)}
      />
    );
  }

  return (
    <LevelIntro
      level={level}
      isCompleted={isCompleted}
      stars={stars}
      onStartLevel={() => setShowGame(true)}
    />
  );
};
