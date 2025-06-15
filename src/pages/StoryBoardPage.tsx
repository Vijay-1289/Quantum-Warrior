
import React from 'react';
import { StoryBoard } from '@/components/StoryBoard';
import { useAuth } from '@/hooks/useAuth';
import { useUserProgress } from '@/hooks/useUserProgress';
import { AuthPage } from '@/components/AuthPage';
import { useNavigate } from 'react-router-dom';

const StoryBoardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { progress, loading: progressLoading, updateProgress } = useUserProgress();
  const navigate = useNavigate();

  if (authLoading || progressLoading) {
    return (
      <div className="min-h-screen max-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your quantum journey...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={() => navigate('/')} />;
  }

  const handleLevelComplete = (levelId: number, stars: number) => {
    updateProgress(levelId, stars);
  };

  return (
    <div className="min-h-screen max-h-screen overflow-hidden">
      <StoryBoard 
        playerProgress={progress}
        onLevelComplete={handleLevelComplete}
      />
    </div>
  );
};

export default StoryBoardPage;
