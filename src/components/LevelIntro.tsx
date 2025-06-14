
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, Star } from 'lucide-react';
import { type QuantumLevel } from '@/data/quantumLevels';
import { ComicConversation } from '@/components/ComicConversation';
import { conversations } from '@/data/characters';

interface LevelIntroProps {
  level: QuantumLevel;
  isCompleted: boolean;
  stars: number;
  onStartLevel: () => void;
}

export const LevelIntro: React.FC<LevelIntroProps> = ({ level, isCompleted, stars, onStartLevel }) => {
  const [showConversation, setShowConversation] = useState(false);
  
  const hasConversation = conversations.some(c => c.levelId === level.id);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-600/20 text-green-300';
      case 'Intermediate': return 'bg-yellow-600/20 text-yellow-300';
      case 'Advanced': return 'bg-orange-600/20 text-orange-300';
      case 'Expert': return 'bg-red-600/20 text-red-300';
      case 'Master': return 'bg-purple-600/20 text-purple-300';
      default: return 'bg-gray-600/20 text-gray-300';
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Level Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge className={getDifficultyColor(level.difficulty)}>
              {level.difficulty}
            </Badge>
            <Badge className="bg-blue-600/20 text-blue-300">
              {level.concept}
            </Badge>
          </div>
          
          {isCompleted && (
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(3)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < stars ? 'text-yellow-400 fill-current' : 'text-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Story Section */}
        <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2 justify-center">
              <BookOpen className="h-6 w-6 text-purple-400" />
              Level {level.id}: {level.title}
            </CardTitle>
            <CardDescription className="text-gray-300 text-center text-lg">
              {level.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-6 border border-purple-500/20 mb-6">
              <p className="text-gray-300 leading-relaxed text-lg text-center">
                {level.storyText}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {hasConversation && (
                <Button
                  onClick={() => setShowConversation(true)}
                  variant="outline"
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                  size="lg"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Watch Story
                </Button>
              )}
              
              <Button
                onClick={onStartLevel}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Play className="h-5 w-5 mr-2" />
                {isCompleted ? 'Play Again' : 'Start Challenge'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Learning Objectives */}
        <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-xl text-white">What You'll Learn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {level.learningObjectives.map((objective, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-400 text-sm font-bold">{index + 1}</span>
                  </div>
                  <span className="text-gray-300">{objective}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comic Conversation Modal */}
      {showConversation && (
        <ComicConversation
          levelId={level.id}
          onComplete={() => setShowConversation(false)}
        />
      )}
    </>
  );
};
