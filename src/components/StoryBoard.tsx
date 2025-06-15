import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Trophy, BookOpen, Lock, CheckCircle, Circle, Plus, GridIcon, Heart, Home } from 'lucide-react';
import { quantumLevels, chapters, type QuantumLevel, type Chapter } from '@/data/quantumLevels';
import { LevelDetail } from '@/components/LevelDetail';
import { Link, useLocation } from 'react-router-dom';

interface StoryBoardProps {
  playerProgress: {
    completedLevels: number[];
    currentLevel: number;
    totalStars: number;
  };
  onLevelComplete: (levelId: number, stars: number) => void;
}

export const StoryBoard: React.FC<StoryBoardProps> = ({ playerProgress, onLevelComplete }) => {
  const [selectedLevel, setSelectedLevel] = useState<QuantumLevel | null>(null);
  const location = useLocation();
  
  // Get selected chapter from navigation state or default to 1
  const initialChapter = location.state?.selectedChapter || 1;
  const [selectedChapter, setSelectedChapter] = useState<number>(initialChapter);

  const getIconComponent = (iconName: string) => {
    const icons = {
      'star': Star,
      'circle': Circle,
      'plus': Plus,
      'grid-2x2': GridIcon,
      'heart': Heart,
      'check': CheckCircle,
      'book': BookOpen,
      'trophy': Trophy
    };
    return icons[iconName as keyof typeof icons] || Star;
  };

  const isLevelUnlocked = (level: QuantumLevel): boolean => {
    if (level.id === 1) return true;
    if (!level.prerequisite) return false;
    return level.prerequisite.every(prereq => playerProgress.completedLevels.includes(prereq));
  };

  const isLevelCompleted = (levelId: number): boolean => {
    return playerProgress.completedLevels.includes(levelId);
  };

  const getLevelStars = (levelId: number): number => {
    // Get stars from the levelStars record, default to 0 if not found
    return (playerProgress as any).levelStars?.[levelId] || 0;
  };

  const getChapterProgress = (chapter: Chapter): number => {
    const chapterLevels = quantumLevels.filter(level => level.chapter === chapter.id);
    const completedInChapter = chapterLevels.filter(level => isLevelCompleted(level.id)).length;
    return chapterLevels.length > 0 ? (completedInChapter / chapterLevels.length) * 100 : 0;
  };

  const isChapterUnlocked = (chapterIndex: number): boolean => {
    if (chapterIndex === 0) return true;
    
    // Chapter is unlocked if previous chapter has at least 80% completion
    const prevChapter = chapters[chapterIndex - 1];
    const prevChapterProgress = getChapterProgress(prevChapter);
    return prevChapterProgress >= 80;
  };

  // Auto-advance to next chapter if current chapter is completed
  useEffect(() => {
    const currentChapterProgress = getChapterProgress(chapters.find(c => c.id === selectedChapter)!);
    if (currentChapterProgress >= 80) {
      const nextChapterIndex = chapters.findIndex(c => c.id === selectedChapter) + 1;
      if (nextChapterIndex < chapters.length && isChapterUnlocked(nextChapterIndex)) {
        // Don't auto-advance if user manually selected a chapter
        if (!location.state?.selectedChapter) {
          setTimeout(() => {
            setSelectedChapter(chapters[nextChapterIndex].id);
          }, 2000);
        }
      }
    }
  }, [playerProgress.completedLevels, selectedChapter, location.state]);

  const currentChapter = chapters.find(c => c.id === selectedChapter);
  const currentChapterLevels = quantumLevels.filter(level => level.chapter === selectedChapter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header with Home Button - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="text-center flex-1 order-2 sm:order-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2 sm:mb-4">
              Quantum Learning Journey
            </h1>
            <p className="text-base sm:text-xl text-purple-200 max-w-3xl mx-auto px-2">
              Master quantum computing through 100 carefully crafted levels. Progress through chapters to unlock the secrets of the quantum realm!
            </p>
          </div>
          <div className="order-1 sm:order-2 w-full sm:w-auto flex justify-center sm:justify-end">
            <Link to="/">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-purple-400 text-purple-300 hover:bg-purple-900/20 hover:text-white w-full sm:w-auto"
              >
                <Home className="h-5 w-5 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress Overview - Mobile Optimized */}
        <Card className="mb-6 sm:mb-8 bg-black/20 backdrop-blur-lg border-purple-500/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl text-white flex items-center gap-2 justify-center">
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400">{playerProgress.completedLevels.length}</div>
                <p className="text-xs sm:text-sm text-gray-400">Levels Completed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{playerProgress.totalStars}</div>
                <p className="text-xs sm:text-sm text-gray-400">Total Stars</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400">{playerProgress.currentLevel}</div>
                <p className="text-xs sm:text-sm text-gray-400">Current Level</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-400">
                  {Math.round((playerProgress.completedLevels.length / quantumLevels.length) * 100)}%
                </div>
                <p className="text-xs sm:text-sm text-gray-400">Overall Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chapter Selection - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {chapters.map((chapter, index) => {
            const IconComponent = getIconComponent(chapter.icon);
            const progress = getChapterProgress(chapter);
            const isUnlocked = isChapterUnlocked(index);
            const isCompleted = progress >= 80;
            
            return (
              <Card
                key={chapter.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedChapter === chapter.id
                    ? `bg-gradient-to-br ${chapter.color} bg-opacity-20 border-purple-400`
                    : isUnlocked
                    ? 'bg-black/20 backdrop-blur-lg border-purple-500/20 hover:border-purple-400'
                    : 'bg-gray-800/20 border-gray-600/20'
                }`}
                onClick={() => isUnlocked && setSelectedChapter(chapter.id)}
              >
                <CardContent className="p-3 sm:p-4 text-center relative">
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                      <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                    </div>
                  )}
                  <IconComponent className={`h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 ${isUnlocked ? 'text-white' : 'text-gray-400'}`} />
                  <h3 className={`font-bold text-xs sm:text-sm ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                    Chapter {chapter.id}
                  </h3>
                  <p className={`text-xs ${isUnlocked ? 'text-gray-300' : 'text-gray-500'} truncate`}>
                    {chapter.title}
                  </p>
                  {isUnlocked && (
                    <div className="mt-2">
                      <Progress value={progress} className="h-1.5 sm:h-2" />
                      <p className="text-xs text-gray-400 mt-1">{Math.round(progress)}%</p>
                      {isCompleted && (
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 mx-auto mt-1" />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Current Chapter Details - Mobile Optimized */}
        {currentChapter && (
          <Card className="mb-6 sm:mb-8 bg-black/20 backdrop-blur-lg border-purple-500/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-2xl text-white flex items-center gap-2 justify-center">
                {React.createElement(getIconComponent(currentChapter.icon), { className: "h-5 w-5 sm:h-6 sm:w-6" })}
                {currentChapter.title}
              </CardTitle>
              <CardDescription className="text-gray-300 text-sm sm:text-base text-center px-2">
                {currentChapter.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Progress value={getChapterProgress(currentChapter)} className="h-2 sm:h-3" />
                <p className="text-xs sm:text-sm text-gray-400 mt-2 text-center">
                  Chapter Progress: {Math.round(getChapterProgress(currentChapter))}% 
                  {getChapterProgress(currentChapter) >= 80 && (
                    <span className="text-green-400 ml-2">✓ Chapter Complete!</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Level Grid - Mobile Optimized */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 mb-6 sm:mb-8">
          {currentChapterLevels.map((level) => {
            const unlocked = isLevelUnlocked(level);
            const completed = isLevelCompleted(level.id);
            const stars = getLevelStars(level.id);

            return (
              <Dialog key={level.id}>
                <DialogTrigger asChild>
                  <Card
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 aspect-square flex flex-col ${
                      completed
                        ? 'bg-gradient-to-br from-green-600/20 to-blue-600/20 border-green-400/50'
                        : unlocked
                        ? 'bg-black/20 backdrop-blur-lg border-purple-500/20 hover:border-purple-400'
                        : 'bg-gray-800/20 border-gray-600/20'
                    }`}
                  >
                    <CardContent className="p-2 sm:p-4 flex flex-col items-center justify-center h-full relative">
                      {!unlocked && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                          <Lock className="h-4 w-4 sm:h-6 sm:w-6 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="text-center">
                        <div className={`text-lg sm:text-2xl font-bold mb-1 sm:mb-2 ${unlocked ? 'text-white' : 'text-gray-400'}`}>
                          {level.id}
                        </div>
                        
                        {completed && (
                          <div className="flex justify-center mb-1 sm:mb-2">
                            {[...Array(3)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                  i < stars ? 'text-yellow-400 fill-current' : 'text-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                        
                        <h4 className={`font-semibold text-xs ${unlocked ? 'text-white' : 'text-gray-400'} line-clamp-2`}>
                          {level.title}
                        </h4>
                        
                        <Badge
                          className={`mt-1 sm:mt-2 text-xs ${
                            level.difficulty === 'Beginner' ? 'bg-green-600/20 text-green-300' :
                            level.difficulty === 'Intermediate' ? 'bg-yellow-600/20 text-yellow-300' :
                            level.difficulty === 'Advanced' ? 'bg-orange-600/20 text-orange-300' :
                            level.difficulty === 'Expert' ? 'bg-red-600/20 text-red-300' :
                            'bg-purple-600/20 text-purple-300'
                          } px-1 py-0 text-xs`}
                        >
                          {level.difficulty}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                
                {unlocked && (
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-purple-900 border border-purple-500/20 mx-2 sm:mx-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl sm:text-2xl text-white">
                        Level {level.id}: {level.title}
                      </DialogTitle>
                      <DialogDescription className="text-gray-300 text-sm sm:text-base">
                        {level.description}
                      </DialogDescription>
                    </DialogHeader>
                    <LevelDetail
                      level={level}
                      isCompleted={completed}
                      stars={stars}
                      onComplete={(earnedStars) => onLevelComplete(level.id, earnedStars)}
                    />
                  </DialogContent>
                )}
              </Dialog>
            );
          })}
        </div>
      </div>
    </div>
  );
};
