
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UserProgress {
  completedLevels: number[];
  currentLevel: number;
  totalStars: number;
  levelStars: Record<number, number>;
}

export const useUserProgress = () => {
  const { toast } = useToast();
  const [progress, setProgress] = useState<UserProgress>({
    completedLevels: [],
    currentLevel: 1,
    totalStars: 0,
    levelStars: {},
  });
  const [loading, setLoading] = useState(true);

  // Load progress from localStorage when component mounts
  useEffect(() => {
    loadProgressFromLocalStorage();
  }, []);

  const loadProgressFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('quantumStoryProgress');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProgress({
          completedLevels: parsed.completedLevels || [],
          currentLevel: parsed.currentLevel || 1,
          totalStars: parsed.totalStars || 0,
          levelStars: parsed.levelStars || {},
        });
      }
    } catch (error) {
      console.error('Error loading progress from localStorage:', error);
      // If there's an error, just use default values
    } finally {
      setLoading(false);
    }
  };

  const saveProgressToLocalStorage = (newProgress: UserProgress) => {
    try {
      localStorage.setItem('quantumStoryProgress', JSON.stringify(newProgress));
    } catch (error) {
      console.error('Error saving progress to localStorage:', error);
      toast({
        title: "Save Error",
        description: "Failed to save your progress locally.",
        variant: "destructive",
      });
    }
  };

  // Check if user can access a level based on star requirements
  const canAccessLevel = (levelId: number): boolean => {
    // Level 1 is always accessible
    if (levelId === 1) return true;
    
    // For subsequent levels, check if previous level has at least 2 stars
    const previousLevelStars = progress.levelStars[levelId - 1] || 0;
    const hasRequiredStarsForPrevious = previousLevelStars >= 2;
    
    // For chapter transitions (every 10 levels), check total stars
    const isChapterTransition = levelId % 10 === 1 && levelId > 1;
    const hasRequiredTotalStars = isChapterTransition ? progress.totalStars >= 20 : true;
    
    return hasRequiredStarsForPrevious && hasRequiredTotalStars;
  };

  const updateProgress = (levelId: number, stars: number) => {
    const wasAlreadyCompleted = progress.completedLevels.includes(levelId);
    const previousStars = progress.levelStars[levelId] || 0;
    const starDifference = Math.max(0, stars - previousStars);

    // Calculate the next accessible level
    let nextLevel = progress.currentLevel;
    if (!wasAlreadyCompleted && stars >= 2) {
      // Only advance if they got at least 2 stars
      nextLevel = Math.max(progress.currentLevel, levelId + 1);
    } else if (!wasAlreadyCompleted && stars < 2) {
      // Show message about needing 2 stars to advance
      toast({
        title: "Level Complete!",
        description: `You need at least 2 stars to unlock the next level. Current: ${stars} stars`,
        variant: "destructive"
      });
    }

    const newProgress = {
      ...progress,
      completedLevels: wasAlreadyCompleted 
        ? progress.completedLevels 
        : [...progress.completedLevels, levelId],
      currentLevel: nextLevel,
      totalStars: progress.totalStars + starDifference,
      levelStars: {
        ...progress.levelStars,
        [levelId]: Math.max(previousStars, stars),
      },
    };

    setProgress(newProgress);
    saveProgressToLocalStorage(newProgress);

    console.log(`Level ${levelId} completed with ${stars} stars. Total stars: ${newProgress.totalStars}`);
    
    if (stars >= 2) {
      toast({
        title: "Great Progress!",
        description: `Level ${levelId} completed with ${stars} stars. Next level unlocked!`,
      });
    }
  };

  return {
    progress,
    loading,
    updateProgress,
    canAccessLevel,
  };
};
