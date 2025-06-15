
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface UserProgress {
  completedLevels: number[];
  currentLevel: number;
  totalStars: number;
  levelStars: Record<number, number>;
}

export const useUserProgress = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState<UserProgress>({
    completedLevels: [],
    currentLevel: 1,
    totalStars: 0,
    levelStars: {},
  });
  const [loading, setLoading] = useState(true);

  // Load progress from database when user logs in
  useEffect(() => {
    if (user) {
      loadProgressFromDatabase();
    } else {
      // Load from localStorage if not logged in (fallback)
      loadProgressFromLocalStorage();
    }
  }, [user]);

  const loadProgressFromDatabase = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProgress({
          completedLevels: data.completed_levels || [],
          currentLevel: data.current_level || 1,
          totalStars: data.total_stars || 0,
          levelStars: (data.level_stars as Record<number, number>) || {},
        });
      } else {
        // New user - check if they have localStorage data to migrate
        const localProgress = localStorage.getItem('quantumStoryProgress');
        if (localProgress) {
          const parsed = JSON.parse(localProgress);
          const migratedProgress = {
            completedLevels: parsed.completedLevels || [],
            currentLevel: parsed.currentLevel || 1,
            totalStars: parsed.totalStars || 0,
            levelStars: parsed.levelStars || {},
          };
          setProgress(migratedProgress);
          await saveProgressToDatabase(migratedProgress);
          // Clear localStorage after migration
          localStorage.removeItem('quantumStoryProgress');
          toast({
            title: "Progress Migrated!",
            description: "Your local progress has been saved to your account.",
          });
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      toast({
        title: "Error",
        description: "Failed to load your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProgressFromLocalStorage = () => {
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
    setLoading(false);
  };

  const saveProgressToDatabase = async (newProgress: UserProgress) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          completed_levels: newProgress.completedLevels,
          current_level: newProgress.currentLevel,
          total_stars: newProgress.totalStars,
          level_stars: newProgress.levelStars,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Save Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateProgress = async (levelId: number, stars: number) => {
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

    if (user) {
      await saveProgressToDatabase(newProgress);
    } else {
      // Fallback to localStorage if not logged in
      localStorage.setItem('quantumStoryProgress', JSON.stringify(newProgress));
    }

    console.log(`Level ${levelId} completed with ${stars} stars. Total stars: ${newProgress.totalStars}`);
  };

  return {
    progress,
    loading,
    updateProgress,
  };
};
