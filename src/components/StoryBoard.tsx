
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, Trophy, Lock, Zap, BookOpen, Target, Atom } from 'lucide-react';
import { quantumLevels } from '@/data/quantumLevels';
import { LevelDetail } from '@/components/LevelDetail';
import { useIsMobile } from '@/hooks/use-mobile';

interface UserProgress {
  completedLevels: number[];
  currentLevel: number;
  totalStars: number;
  levelStars: Record<number, number>;
}

interface StoryBoardProps {
  playerProgress: UserProgress;
  onLevelComplete: (levelId: number, stars: number) => void;
  canAccessLevel?: (levelId: number) => boolean;
}

export const StoryBoard: React.FC<StoryBoardProps> = ({ 
  playerProgress, 
  onLevelComplete,
  canAccessLevel = () => true 
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-600/20 text-green-300 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30';
      case 'Advanced': return 'bg-orange-600/20 text-orange-300 border-orange-500/30';
      case 'Expert': return 'bg-red-600/20 text-red-300 border-red-500/30';
      case 'Master': return 'bg-purple-600/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStarsForLevel = (levelId: number): number => {
    return playerProgress.levelStars[levelId] || 0;
  };

  const isLevelCompleted = (levelId: number): boolean => {
    return playerProgress.completedLevels.includes(levelId);
  };

  const isLevelAccessible = (levelId: number): boolean => {
    return canAccessLevel(levelId);
  };

  const getAccessibilityMessage = (levelId: number): string => {
    if (levelId === 1) return '';
    
    const previousLevelStars = playerProgress.levelStars[levelId - 1] || 0;
    const isChapterTransition = levelId % 10 === 1 && levelId > 1;
    
    if (previousLevelStars < 2) {
      return `Complete previous level with at least 2 stars (current: ${previousLevelStars})`;
    }
    
    if (isChapterTransition && playerProgress.totalStars < 20) {
      return `Need 20 total stars for next chapter (current: ${playerProgress.totalStars})`;
    }
    
    return '';
  };

  if (selectedLevel) {
    const level = quantumLevels.find(l => l.id === selectedLevel);
    if (level) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="outline" 
              onClick={() => setSelectedLevel(null)}
              className="mb-6 border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
            >
              ← Back to Story Board
            </Button>
            <LevelDetail
              level={level}
              isCompleted={isLevelCompleted(selectedLevel)}
              stars={getStarsForLevel(selectedLevel)}
              onComplete={(stars) => {
                onLevelComplete(selectedLevel, stars);
                setSelectedLevel(null);
              }}
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold text-white mb-4`}>
            Quantum Warrior Quest
          </h1>
          <p className={`${isMobile ? 'text-lg' : 'text-xl'} text-gray-300 mb-6`}>
            Master the mysteries of quantum physics through an epic adventure
          </p>
          
          {/* Progress Overview */}
          <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4 max-w-2xl mx-auto`}>
            <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
              <CardContent className={`${isMobile ? 'p-3' : 'p-4'} text-center`}>
                <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-yellow-400`}>
                  {playerProgress.totalStars}
                </div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-300`}>Total Stars</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
              <CardContent className={`${isMobile ? 'p-3' : 'p-4'} text-center`}>
                <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-green-400`}>
                  {playerProgress.completedLevels.length}
                </div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-300`}>Completed</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
              <CardContent className={`${isMobile ? 'p-3' : 'p-4'} text-center`}>
                <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-blue-400`}>
                  {playerProgress.currentLevel}
                </div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-300`}>Current Level</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
              <CardContent className={`${isMobile ? 'p-3' : 'p-4'} text-center`}>
                <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-purple-400`}>
                  {Math.floor(playerProgress.currentLevel / 10) + 1}
                </div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-300`}>Chapter</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Level Grid */}
        <ScrollArea className={`${isMobile ? 'h-[60vh]' : 'h-[70vh]'}`}>
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} gap-6`}>
            {quantumLevels.map((level) => {
              const isCompleted = isLevelCompleted(level.id);
              const isAccessible = isLevelAccessible(level.id);
              const stars = getStarsForLevel(level.id);
              const accessMessage = getAccessibilityMessage(level.id);
              
              return (
                <Card 
                  key={level.id}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    isAccessible 
                      ? 'hover:scale-105 bg-gradient-to-br from-slate-800/50 to-purple-800/50 backdrop-blur-lg border-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer'
                      : 'bg-gray-800/30 backdrop-blur-lg border-gray-600/20'
                  }`}
                  onClick={() => isAccessible && setSelectedLevel(level.id)}
                >
                  {/* Lock Overlay for Inaccessible Levels */}
                  {!isAccessible && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                      <Lock className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-gray-400 mb-2`} />
                      <p className={`text-gray-400 text-center ${isMobile ? 'text-xs' : 'text-sm'} px-4`}>
                        {accessMessage}
                      </p>
                    </div>
                  )}

                  {/* Completion Badge */}
                  {isCompleted && (
                    <div className="absolute top-2 right-2 z-20">
                      <Badge className="bg-green-600 text-white flex items-center gap-1">
                        <Trophy className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                        Complete
                      </Badge>
                    </div>
                  )}

                  <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`${isMobile ? 'p-2' : 'p-3'} rounded-full ${isAccessible ? 'bg-white/20' : 'bg-gray-600/20'}`}>
                        <Atom className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} ${isAccessible ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} ${isAccessible ? 'text-white' : 'text-gray-400'}`}>
                          Level {level.id}: {level.title}
                        </CardTitle>
                        <Badge className={`${getDifficultyColor(level.difficulty)} ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          {level.difficulty}
                        </Badge>
                      </div>
                    </div>

                    {/* Stars Display */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(3)].map((_, i) => (
                        <Star
                          key={i}
                          className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} ${
                            i < stars ? 'text-yellow-400 fill-current' : 'text-gray-400'
                          }`}
                        />
                      ))}
                      <span className={`ml-2 ${isMobile ? 'text-sm' : 'text-base'} ${isAccessible ? 'text-gray-300' : 'text-gray-500'}`}>
                        {stars}/3 stars
                      </span>
                    </div>

                    <CardDescription className={`${isMobile ? 'text-sm' : 'text-base'} ${isAccessible ? 'text-gray-300' : 'text-gray-500'} mb-4`}>
                      {level.description}
                    </CardDescription>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className={`${isAccessible ? 'border-purple-400 text-purple-300' : 'border-gray-500 text-gray-400'} ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        <BookOpen className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
                        {level.concept}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className={`${isMobile ? 'p-4 pt-0' : 'p-6 pt-0'}`}>
                    <Button 
                      className={`w-full ${
                        isAccessible 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!isAccessible}
                      size={isMobile ? "sm" : "default"}
                    >
                      {isAccessible ? (
                        <>
                          <Target className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
                          {isCompleted ? 'Play Again' : 'Start Level'}
                        </>
                      ) : (
                        <>
                          <Lock className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
                          Locked
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
