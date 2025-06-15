
import React, { useState, useEffect } from 'react';
import { StoryBoard } from '@/components/StoryBoard';

const StoryBoardPage = () => {
  const [playerProgress, setPlayerProgress] = useState({
    completedLevels: [] as number[],
    currentLevel: 1,
    totalStars: 0,
    levelStars: {} as Record<number, number> // Track stars per level
  });

  useEffect(() => {
    const savedProgress = localStorage.getItem('quantumStoryProgress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      // Ensure levelStars exists for backward compatibility
      if (!parsed.levelStars) {
        parsed.levelStars = {};
      }
      setPlayerProgress(parsed);
    }
  }, []);

  const saveProgress = (progress: typeof playerProgress) => {
    localStorage.setItem('quantumStoryProgress', JSON.stringify(progress));
    setPlayerProgress(progress);
  };

  const handleLevelComplete = (levelId: number, stars: number) => {
    const wasAlreadyCompleted = playerProgress.completedLevels.includes(levelId);
    const previousStars = playerProgress.levelStars[levelId] || 0;
    
    // Only add stars if this is a new completion or if more stars were earned
    const starDifference = Math.max(0, stars - previousStars);
    
    const newProgress = {
      ...playerProgress,
      completedLevels: wasAlreadyCompleted 
        ? playerProgress.completedLevels 
        : [...playerProgress.completedLevels, levelId],
      currentLevel: Math.max(playerProgress.currentLevel, levelId + 1),
      totalStars: playerProgress.totalStars + starDifference,
      levelStars: {
        ...playerProgress.levelStars,
        [levelId]: Math.max(previousStars, stars) // Keep the best score
      }
    };
    
    console.log(`Level ${levelId} completed with ${stars} stars. Total stars: ${newProgress.totalStars}`);
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
