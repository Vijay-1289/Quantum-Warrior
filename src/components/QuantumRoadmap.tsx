
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, Circle, Plus, GridIcon, Heart, CheckCircle, BookOpen, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { chapters } from '@/data/quantumLevels';

interface QuantumRoadmapProps {
  onStartJourney: () => void;
  onClose: () => void;
}

export const QuantumRoadmap: React.FC<QuantumRoadmapProps> = ({ onStartJourney, onClose }) => {
  const [visibleChapters, setVisibleChapters] = useState<number[]>([]);

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

  useEffect(() => {
    // Animate chapters appearing one by one
    chapters.forEach((_, index) => {
      setTimeout(() => {
        setVisibleChapters(prev => [...prev, index]);
      }, index * 300);
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-purple-500/20">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Your Quantum Journey Awaits
            </h2>
            <p className="text-lg text-purple-200 max-w-3xl mx-auto">
              Embark on an epic adventure through the quantum realm. Master each chapter to unlock the mysteries of quantum computing!
            </p>
          </div>

          {/* Roadmap */}
          <ScrollArea className="h-[60vh] w-full">
            <div className="relative">
              {/* Animated Path Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 via-blue-400 to-pink-400 transform -translate-x-1/2 animate-pulse"></div>
              
              <div className="space-y-8">
                {chapters.map((chapter, index) => {
                  const IconComponent = getIconComponent(chapter.icon);
                  const isVisible = visibleChapters.includes(index);
                  const isEven = index % 2 === 0;

                  return (
                    <div
                      key={chapter.id}
                      className={`relative flex items-center ${
                        isEven ? 'justify-start' : 'justify-end'
                      } ${
                        isVisible 
                          ? 'animate-fade-in opacity-100 transform translate-y-0' 
                          : 'opacity-0 transform translate-y-4'
                      }`}
                      style={{
                        animationDelay: `${index * 0.3}s`,
                        animationFillMode: 'forwards'
                      }}
                    >
                      {/* Chapter Card */}
                      <Card 
                        className={`w-80 ${
                          isEven ? 'mr-8' : 'ml-8'
                        } bg-gradient-to-br ${chapter.color} bg-opacity-20 border-purple-400/30 hover:scale-105 transition-all duration-300 cursor-pointer`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm">
                              <IconComponent className="h-8 w-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">
                                Chapter {chapter.id}
                              </h3>
                              <p className="text-purple-200">
                                {chapter.title}
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-300 mb-4">
                            {chapter.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <Badge className="bg-purple-600/20 text-purple-300">
                              10 Levels
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Sparkles className="h-4 w-4 text-yellow-400" />
                              <span className="text-sm text-yellow-400">Unlock Rewards</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Connection Node */}
                      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 border-4 border-white animate-pulse"></div>
                      </div>

                      {/* Arrow for flow direction */}
                      {index < chapters.length - 1 && (
                        <div className={`absolute ${isEven ? 'right-4' : 'left-4'} bottom-0 transform translate-y-full`}>
                          <ArrowRight className={`h-6 w-6 text-purple-400 animate-bounce ${!isEven ? 'rotate-180' : ''}`} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Final Achievement */}
              <div className="text-center mt-12 animate-fade-in">
                <div className="p-6 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 inline-block mb-4 animate-pulse">
                  <Trophy className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Quantum Master</h3>
                <p className="text-purple-200">Complete all chapters to become the ultimate Quantum Warrior!</p>
              </div>
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-transparent border-purple-400 text-purple-300 hover:bg-purple-900/20"
            >
              Maybe Later
            </Button>
            <Button
              onClick={onStartJourney}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-3 animate-pulse"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Begin My Journey
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
