
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, BookOpen, Target, Gamepad, Lightbulb, Play, CheckCircle } from 'lucide-react';
import { type QuantumLevel } from '@/data/quantumLevels';
import { QuantumMiniGame } from '@/components/QuantumMiniGame';

interface LevelDetailProps {
  level: QuantumLevel;
  isCompleted: boolean;
  stars: number;
  onComplete: (stars: number) => void;
}

export const LevelDetail: React.FC<LevelDetailProps> = ({ level, isCompleted, stars, onComplete }) => {
  const [showGame, setShowGame] = useState(false);
  const [currentSection, setCurrentSection] = useState<'story' | 'learning' | 'game'>('story');

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

  const getGameTypeIcon = (gameType: string) => {
    switch (gameType) {
      case 'quiz': return Lightbulb;
      case 'simulation': return Play;
      case 'puzzle': return Target;
      case 'coding': return BookOpen;
      case 'visualization': return Star;
      default: return Gamepad;
    }
  };

  const GameIcon = getGameTypeIcon(level.gameType);

  if (showGame) {
    return (
      <QuantumMiniGame
        level={level}
        onComplete={(earnedStars) => {
          onComplete(earnedStars);
          setShowGame(false);
        }}
        onBack={() => setShowGame(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Level Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge className={getDifficultyColor(level.difficulty)}>
            {level.difficulty}
          </Badge>
          <Badge className="bg-blue-600/20 text-blue-300">
            {level.concept}
          </Badge>
        </div>
        {isCompleted && (
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < stars ? 'text-yellow-400 fill-current' : 'text-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2">
        <Button
          variant={currentSection === 'story' ? 'default' : 'outline'}
          onClick={() => setCurrentSection('story')}
          className="flex-1"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Story
        </Button>
        <Button
          variant={currentSection === 'learning' ? 'default' : 'outline'}
          onClick={() => setCurrentSection('learning')}
          className="flex-1"
        >
          <Target className="h-4 w-4 mr-2" />
          Learning
        </Button>
        <Button
          variant={currentSection === 'game' ? 'default' : 'outline'}
          onClick={() => setCurrentSection('game')}
          className="flex-1"
        >
          <GameIcon className="h-4 w-4 mr-2" />
          Play
        </Button>
      </div>

      {/* Content Sections */}
      {currentSection === 'story' && (
        <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-400" />
              The Story Continues...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed text-lg">
                {level.storyText}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {currentSection === 'learning' && (
        <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-400" />
              Learning Objectives
            </CardTitle>
            <CardDescription className="text-gray-300">
              Master these concepts to progress in your quantum journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {level.learningObjectives.map((objective, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{objective}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {currentSection === 'game' && (
        <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <GameIcon className="h-5 w-5 text-green-400" />
              Interactive Learning
            </CardTitle>
            <CardDescription className="text-gray-300">
              Put your knowledge to the test with interactive {level.gameType}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/20">
              <GameIcon className="h-16 w-16 mx-auto text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {level.gameType.charAt(0).toUpperCase() + level.gameType.slice(1)} Challenge
              </h3>
              <p className="text-gray-300 mb-6">
                Ready to test your understanding of {level.concept}?
              </p>
              <Button
                onClick={() => setShowGame(true)}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isCompleted ? 'Play Again' : 'Start Challenge'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
