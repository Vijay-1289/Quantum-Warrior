
import React from 'react';
import { StoryBoard } from '@/components/StoryBoard';
import { useUserProgress } from '@/hooks/useUserProgress';

const StoryBoardPage = () => {
  const { progress, loading: progressLoading, updateProgress, canAccessLevel } = useUserProgress();

  if (progressLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your quantum journey...</div>
      </div>
    );
  }

  const handleLevelComplete = (levelId: number, stars: number) => {
    updateProgress(levelId, stars);
  };

  return (
    <div className="min-h-screen">
      <StoryBoard 
        playerProgress={progress}
        onLevelComplete={handleLevelComplete}
        canAccessLevel={canAccessLevel}
      />
    </div>
  );
};

export default StoryBoardPage;
