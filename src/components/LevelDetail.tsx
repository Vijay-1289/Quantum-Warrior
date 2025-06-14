
import React, { useState } from 'react';
import { type QuantumLevel } from '@/data/quantumLevels';
import { QuantumMiniGame } from '@/components/QuantumMiniGame';
import { LevelIntro } from '@/components/LevelIntro';
import { StoryBook } from '@/components/StoryBook';

interface LevelDetailProps {
  level: QuantumLevel;
  isCompleted: boolean;
  stars: number;
  onComplete: (stars: number) => void;
}

export const LevelDetail: React.FC<LevelDetailProps> = ({ level, isCompleted, stars, onComplete }) => {
  const [currentView, setCurrentView] = useState<'intro' | 'story' | 'game'>('intro');

  if (currentView === 'story') {
    return (
      <StoryBook
        level={level}
        onComplete={() => setCurrentView('game')}
      />
    );
  }

  if (currentView === 'game') {
    return (
      <QuantumMiniGame
        level={level}
        onComplete={(earnedStars) => {
          onComplete(earnedStars);
          setCurrentView('intro');
        }}
        onBack={() => setCurrentView('intro')}
      />
    );
  }

  return (
    <LevelIntro
      level={level}
      isCompleted={isCompleted}
      stars={stars}
      onStartLevel={() => setCurrentView('story')}
    />
  );
};
