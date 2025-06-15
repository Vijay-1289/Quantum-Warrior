
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

  const updateProgress = (levelId: number, stars: number) => {
    const wasAlreadyCompleted = progress.completedLevels.includes(levelId);
    const previousStars = progress.levelStars[levelId] || 0;
    const starDifference = Math.max(0, stars - previousStars);

    const newProgress = {
      ...progress,
      completedLevels: wasAlreadyCompleted 
        ? progress.completedLevels 
        : [...progress.completedLevels, levelId],
      currentLevel: Math.max(progress.currentLevel, levelId + 1),
      totalStars: progress.totalStars + starDifference,
      levelStars: {
        ...progress.levelStars,
        [levelId]: Math.max(previousStars, stars),
      },
    };

    setProgress(newProgress);
    saveProgressToLocalStorage(newProgress);

    console.log(`Level ${levelId} completed with ${stars} stars. Total stars: ${newProgress.totalStars}`);
    
    toast({
      title: "Progress Saved!",
      description: `Level ${levelId} completed with ${stars} stars.`,
    });
  };

  return {
    progress,
    loading,
    updateProgress,
  };
};
