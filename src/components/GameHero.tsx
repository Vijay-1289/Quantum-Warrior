
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gamepad, Star, Trophy } from 'lucide-react';

interface GameHeroProps {
  playerStats: {
    quantumKnowledge: number;
    imageProcessing: number;
    totalScore: number;
  };
  onStartStory: () => void;
}

export const GameHero: React.FC<GameHeroProps> = ({ playerStats, onStartStory }) => {
  const backgroundPattern = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 min-h-screen">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 animate-pulse"
          style={{ backgroundImage: `url("${backgroundPattern}")` }}
        ></div>
      </div>

      <div className="relative container mx-auto px-4 py-16 text-center min-h-screen flex flex-col justify-center">
        {/* Main Title */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 animate-fade-in">
            QUANTUM
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-2 animate-fade-in">
            WARRIOR
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto animate-fade-in">
            Master the quantum realm and image processing to save the multiverse
          </p>
        </div>

        {/* Stats Display */}
        <div className="flex justify-center gap-6 mb-8 animate-scale-in">
          <Badge className="bg-purple-600/20 text-purple-300 px-4 py-2">
            <Star className="h-4 w-4 mr-2" />
            Level {Math.floor(playerStats.quantumKnowledge / 20) + 1}
          </Badge>
          <Badge className="bg-blue-600/20 text-blue-300 px-4 py-2">
            <Trophy className="h-4 w-4 mr-2" />
            {playerStats.totalScore} Points
          </Badge>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onStartStory}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in"
        >
          <Gamepad className="h-6 w-6 mr-2" />
          Start Your Quest
        </Button>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-pulse">
          <div className="w-4 h-4 bg-purple-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-32 right-20 animate-pulse delay-1000">
          <div className="w-6 h-6 bg-blue-400 rounded-full opacity-40"></div>
        </div>
        <div className="absolute bottom-20 left-20 animate-pulse delay-2000">
          <div className="w-3 h-3 bg-pink-400 rounded-full opacity-50"></div>
        </div>
      </div>
    </div>
  );
};
