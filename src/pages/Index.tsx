
import React, { useState, useEffect } from 'react';
import { GameHero } from '@/components/GameHero';
import { QuantumRoadmap } from '@/components/QuantumRoadmap';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [playerProgress, setPlayerProgress] = useState({
    completedLevels: [] as number[],
    currentLevel: 1,
    totalStars: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Load player progress from localStorage
    const savedProgress = localStorage.getItem('quantumStoryProgress');
    if (savedProgress) {
      setPlayerProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Calculate player stats from progress
  const playerStats = {
    quantumKnowledge: playerProgress.completedLevels.length * 20,
    imageProcessing: Math.floor(playerProgress.totalStars * 10),
    totalScore: playerProgress.totalStars
  };

  const handleStartJourney = () => {
    setShowRoadmap(false);
    navigate('/story-board');
  };

  const handleShowRoadmap = () => {
    setShowRoadmap(true);
  };

  const handleCloseRoadmap = () => {
    setShowRoadmap(false);
  };

  return (
    <div className="min-h-screen">
      <GameHero 
        playerStats={playerStats}
        onStartStory={handleShowRoadmap}
      />
      
      {showRoadmap && (
        <QuantumRoadmap
          onStartJourney={handleStartJourney}
          onClose={handleCloseRoadmap}
          playerProgress={playerProgress}
        />
      )}
    </div>
  );
};

export default Index;
