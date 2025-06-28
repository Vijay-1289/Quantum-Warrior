
import React, { useState } from 'react';
import { GameHero } from '@/components/GameHero';
import { QuantumRoadmap } from '@/components/QuantumRoadmap';
import { HauntingIntro } from '@/components/HauntingIntro';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useNavigate } from 'react-router-dom';
import ClickSpark from '@/components/ClickSpark';

const Index = () => {
  const { progress, loading: progressLoading } = useUserProgress();
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showHauntingIntro, setShowHauntingIntro] = useState(false);
  const navigate = useNavigate();

  if (progressLoading) {
    return (
      <div className="min-h-screen max-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your quantum journey...</div>
      </div>
    );
  }

  // Calculate player stats from progress
  const playerStats = {
    quantumKnowledge: progress.completedLevels.length * 20,
    imageProcessing: Math.floor(progress.totalStars * 10),
    totalScore: progress.totalStars
  };

  // Check if this is a new user (no previous progress)
  const isNewUser = progress.completedLevels.length === 0 && progress.totalStars === 0;

  const handleStartJourney = () => {
    setShowRoadmap(false);
    navigate('/story-board');
  };

  const handleShowRoadmap = () => {
    if (isNewUser) {
      setShowHauntingIntro(true);
    } else {
      setShowRoadmap(true);
    }
  };

  const handleCloseRoadmap = () => {
    setShowRoadmap(false);
  };

  const handleHauntingComplete = () => {
    setShowHauntingIntro(false);
    navigate('/story-board');
  };

  if (showHauntingIntro) {
    return (
      <ClickSpark
        sparkColor='#a855f7'
        sparkSize={8}
        sparkRadius={20}
        sparkCount={6}
        duration={500}
      >
        <HauntingIntro onComplete={handleHauntingComplete} />
      </ClickSpark>
    );
  }

  return (
    <ClickSpark
      sparkColor='#fff'
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <div className="min-h-screen max-h-screen overflow-hidden">
        <GameHero 
          playerStats={playerStats}
          onStartStory={handleShowRoadmap}
        />
        
        {showRoadmap && (
          <QuantumRoadmap
            onStartJourney={handleStartJourney}
            onClose={handleCloseRoadmap}
            playerProgress={progress}
          />
        )}
      </div>
    </ClickSpark>
  );
};

export default Index;
