
import React, { useState, useEffect } from 'react';
import { StoryBoard } from '@/components/StoryBoard';

const StoryBoardPage = () => {
  const [playerProgress, setPlayerProgress] = useState({
    completedLevels: [] as number[],
    currentLevel: 1,
    totalStars: 0
  });

  useEffect(() => {
    const savedProgress = localStorage.getItem('quantumStoryProgress');
    if (savedProgress) {
      setPlayerProgress(JSON.parse(savedProgress));
    }
  }, []);

  const saveProgress = (progress: typeof playerProgress) => {
    localStorage.setItem('quantumStoryProgress', JSON.stringify(progress));
    setPlayerProgress(progress);
  };

  const handleLevelComplete = (levelId: number, stars: number) => {
    const newProgress = {
      ...playerProgress,
      completedLevels: playerProgress.completedLevels.includes(levelId) 
        ? playerProgress.completedLevels 
        : [...playerProgress.completedLevels, levelId],
      currentLevel: Math.max(playerProgress.currentLevel, levelId + 1),
      totalStars: playerProgress.totalStars + (playerProgress.completedLevels.includes(levelId) ? 0 : stars)
    };
    
    saveProgress(newProgress);
  };

  return (
    <StoryBoard 
      playerProgress={playerProgress}
      onLevelComplete={handleLevelComplete}
    />
  );
};

export default StoryBoardPage;
