
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Trophy, BookOpen, Gamepad, Rocket, Layers, Lock } from 'lucide-react';
import { LevelGame } from '@/components/LevelGame';

interface Level {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  concept: string;
  icon: React.ComponentType<any>;
  color: string;
  unlocked: boolean;
}

interface LevelCardProps {
  level: Level;
  isCompleted: boolean;
  onComplete: (score: number) => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({ level, isCompleted, onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const IconComponent = level.icon;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-600/20 text-green-300';
      case 'Intermediate': return 'bg-yellow-600/20 text-yellow-300';
      case 'Advanced': return 'bg-orange-600/20 text-orange-300';
      case 'Expert': return 'bg-red-600/20 text-red-300';
      default: return 'bg-gray-600/20 text-gray-300';
    }
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
      level.unlocked 
        ? `bg-gradient-to-br ${level.color} bg-opacity-10 backdrop-blur-lg border-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/20` 
        : 'bg-gray-800/50 backdrop-blur-lg border-gray-600/20'
    }`}>
      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-green-600 text-white">
            <Trophy className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        </div>
      )}

      {/* Lock Overlay */}
      {!level.unlocked && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
          <Lock className="h-12 w-12 text-gray-400" />
        </div>
      )}

      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-3 rounded-full ${level.unlocked ? 'bg-white/20' : 'bg-gray-600/20'}`}>
            <IconComponent className={`h-6 w-6 ${level.unlocked ? 'text-white' : 'text-gray-400'}`} />
          </div>
          <div>
            <CardTitle className={`text-xl ${level.unlocked ? 'text-white' : 'text-gray-400'}`}>
              {level.title}
            </CardTitle>
            <Badge className={getDifficultyColor(level.difficulty)}>
              {level.difficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <CardDescription className={`mb-4 ${level.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
          {level.description}
        </CardDescription>
        
        <div className="mb-4">
          <p className={`text-sm font-semibold ${level.unlocked ? 'text-purple-300' : 'text-gray-500'}`}>
            Learn: {level.concept}
          </p>
        </div>

        {level.unlocked ? (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                className={`w-full bg-gradient-to-r ${level.color} hover:opacity-90 text-white font-semibold`}
                disabled={!level.unlocked}
              >
                {isCompleted ? 'Play Again' : 'Start Level'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-purple-900 border border-purple-500/20">
              <DialogHeader>
                <DialogTitle className="text-2xl text-white flex items-center gap-2">
                  <IconComponent className="h-6 w-6" />
                  {level.title}
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  {level.description}
                </DialogDescription>
              </DialogHeader>
              <LevelGame 
                level={level} 
                onComplete={(score) => {
                  onComplete(score);
                  setIsOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        ) : (
          <Button disabled className="w-full bg-gray-600 text-gray-400">
            <Lock className="h-4 w-4 mr-2" />
            Locked
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
