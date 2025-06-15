
import React, { useState } from 'react';
import { GameHero } from '@/components/GameHero';
import { QuantumRoadmap } from '@/components/QuantumRoadmap';
import { AuthPage } from '@/components/AuthPage';
import { HauntingIntro } from '@/components/HauntingIntro';
import { useAuth } from '@/hooks/useAuth';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { progress, loading: progressLoading } = useUserProgress();
  const [showAuth, setShowAuth] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showHauntingIntro, setShowHauntingIntro] = useState(false);
  const navigate = useNavigate();

  if (authLoading || progressLoading) {
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

  const handleStartJourney = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setShowRoadmap(false);
    navigate('/story-board');
  };

  const handleShowRoadmap = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setShowRoadmap(true);
  };

  const handleCloseRoadmap = () => {
    setShowRoadmap(false);
  };

  const handleAuthSuccess = (isNewUser: boolean) => {
    setShowAuth(false);
    if (isNewUser) {
      setShowHauntingIntro(true);
    } else {
      setShowRoadmap(true);
    }
  };

  const handleHauntingComplete = () => {
    setShowHauntingIntro(false);
    // Navigate directly to story board for new users after haunting intro
    navigate('/story-board');
  };

  const handleSignOut = async () => {
    await signOut();
    setShowRoadmap(false);
  };

  if (showHauntingIntro) {
    return <HauntingIntro onComplete={handleHauntingComplete} />;
  }

  if (showAuth) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen max-h-screen overflow-hidden">
      {user && (
        <div className="absolute top-4 right-4 z-50">
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="bg-black/20 backdrop-blur-lg border-purple-500/20 text-purple-300 hover:bg-purple-900/20 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      )}
      
      <GameHero 
        playerStats={playerStats}
        onStartStory={handleShowRoadmap}
      />
      
      {showRoadmap && user && (
        <QuantumRoadmap
          onStartJourney={handleStartJourney}
          onClose={handleCloseRoadmap}
          playerProgress={progress}
        />
      )}
    </div>
  );
};

export default Index;
