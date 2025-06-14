
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, Circle, Plus, GridIcon, Heart, CheckCircle, BookOpen, Trophy, ArrowRight, Sparkles, Home } from 'lucide-react';
import { chapters } from '@/data/quantumLevels';

interface QuantumRoadmapProps {
  onStartJourney: () => void;
  onClose: () => void;
}

export const QuantumRoadmap: React.FC<QuantumRoadmapProps> = ({ onStartJourney, onClose }) => {
  const [visibleChapters, setVisibleChapters] = useState<number[]>([]);
  const [floatingParticles, setFloatingParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

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
    // Generate floating quantum particles
    const particles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setFloatingParticles(particles);

    // Animate chapters appearing one by one with staggered timing
    chapters.forEach((_, index) => {
      setTimeout(() => {
        setVisibleChapters(prev => [...prev, index]);
      }, index * 400);
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Floating Quantum Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Quantum Energy Waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse" 
             style={{ animation: 'wave 4s ease-in-out infinite' }} />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-blue-500/10 to-transparent animate-pulse" 
             style={{ animation: 'wave 6s ease-in-out infinite reverse' }} />
      </div>

      <Card className="w-full max-w-7xl max-h-[95vh] bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 border border-purple-500/30 backdrop-blur-lg shadow-2xl">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-blue-600/20 rounded-lg blur-xl" />
            <div className="relative">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 animate-pulse">
                Your Quantum Journey Awaits
              </h2>
              <p className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
                Embark on an epic adventure through the quantum realm. Master each chapter to unlock the mysteries of quantum computing and become a true Quantum Warrior!
              </p>
            </div>
          </div>

          {/* Quantum Roadmap */}
          <ScrollArea className="h-[65vh] w-full relative">
            <div className="relative px-8">
              {/* Quantum Energy Path - Organic flowing line */}
              <svg className="absolute left-1/2 top-0 bottom-0 w-2 h-full transform -translate-x-1/2 z-0" viewBox="0 0 20 1000">
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="25%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#EC4899" />
                    <stop offset="75%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <path 
                  d="M10 0 Q15 100 10 200 Q5 300 10 400 Q15 500 10 600 Q5 700 10 800 Q15 900 10 1000" 
                  stroke="url(#pathGradient)" 
                  strokeWidth="4" 
                  fill="none"
                  filter="url(#glow)"
                  className="animate-pulse"
                />
              </svg>
              
              <div className="space-y-16 relative z-10">
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
                          : 'opacity-0 transform translate-y-8'
                      }`}
                      style={{
                        animationDelay: `${index * 0.4}s`,
                        animationFillMode: 'forwards'
                      }}
                    >
                      {/* Quantum Portal Node */}
                      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <div className="relative">
                          {/* Outer energy ring */}
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 animate-spin opacity-60" 
                               style={{ animation: 'spin 3s linear infinite' }} />
                          {/* Inner portal */}
                          <div className="absolute inset-2 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                              <span className="text-sm font-bold text-purple-900">{chapter.id}</span>
                            </div>
                          </div>
                          {/* Energy particles around portal */}
                          {[...Array(6)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                              style={{
                                top: '50%',
                                left: '50%',
                                transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-24px)`,
                                animation: `orbit ${2 + i * 0.3}s linear infinite`
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Chapter Crystal/Gem Card */}
                      <div 
                        className={`w-96 ${
                          isEven ? 'mr-12' : 'ml-12'
                        } relative`}
                      >
                        {/* Crystal Shape Container */}
                        <div className="relative transform hover:scale-105 transition-all duration-500 cursor-pointer group">
                          {/* Crystal Background */}
                          <div className={`relative bg-gradient-to-br ${chapter.color} bg-opacity-20 backdrop-blur-lg border border-purple-400/30 p-6 rounded-3xl shadow-2xl overflow-hidden`}>
                            {/* Crystal Facets Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                            <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-t from-transparent via-white/30 to-transparent" />
                            
                            {/* Floating Energy Inside Crystal */}
                            <div className="absolute inset-0 overflow-hidden">
                              {[...Array(8)].map((_, i) => (
                                <div
                                  key={i}
                                  className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-60"
                                  style={{
                                    left: `${20 + Math.random() * 60}%`,
                                    top: `${20 + Math.random() * 60}%`,
                                    animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
                                    animationDelay: `${Math.random() * 2}s`
                                  }}
                                />
                              ))}
                            </div>

                            <div className="relative z-10">
                              <div className="flex items-center gap-4 mb-4">
                                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                                  <IconComponent className="h-10 w-10 text-white drop-shadow-lg" />
                                </div>
                                <div>
                                  <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                                    Chapter {chapter.id}
                                  </h3>
                                  <p className="text-purple-100 text-lg font-medium">
                                    {chapter.title}
                                  </p>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-200 mb-6 leading-relaxed">
                                {chapter.description}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <Badge className="bg-purple-600/30 text-purple-200 border border-purple-400/50 px-3 py-1">
                                  10 Quantum Levels
                                </Badge>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    {[...Array(3)].map((_, i) => (
                                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current animate-pulse" 
                                           style={{ animationDelay: `${i * 0.2}s` }} />
                                    ))}
                                  </div>
                                  <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Quantum Trail Effect */}
                          {index < chapters.length - 1 && (
                            <div className={`absolute ${isEven ? 'right-0' : 'left-0'} bottom-0 transform translate-y-8`}>
                              <div className="flex items-center gap-2">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                                    style={{
                                      animationDelay: `${i * 0.2}s`,
                                      opacity: 1 - (i * 0.2)
                                    }}
                                  />
                                ))}
                                <ArrowRight className={`h-6 w-6 text-purple-400 animate-bounce ${!isEven ? 'rotate-180' : ''}`} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Final Quantum Master Achievement */}
              <div className="text-center mt-20 relative">
                <div className="relative inline-block">
                  {/* Master Portal */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 animate-spin opacity-80" 
                         style={{ animation: 'spin 4s linear infinite' }} />
                    <div className="absolute inset-4 w-24 h-24 rounded-full bg-gradient-to-r from-yellow-300 to-orange-300 flex items-center justify-center animate-pulse">
                      <Trophy className="h-16 w-16 text-white drop-shadow-lg" />
                    </div>
                    {/* Master Energy Rings */}
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-3 h-3 bg-yellow-300 rounded-full"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-48px)`,
                          animation: `orbit ${3 + i * 0.1}s linear infinite`
                        }}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mt-6 mb-4 drop-shadow-lg">Quantum Master</h3>
                <p className="text-purple-200 text-lg max-w-md mx-auto">
                  Complete all chapters to become the ultimate Quantum Warrior and master of the quantum realm!
                </p>
              </div>
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
              className="bg-transparent border-purple-400 text-purple-300 hover:bg-purple-900/30 hover:text-white transition-all duration-300 px-8 py-3"
            >
              <Home className="h-5 w-5 mr-2" />
              Maybe Later
            </Button>
            <Button
              onClick={onStartJourney}
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-700 hover:via-blue-700 hover:to-purple-700 text-white font-bold px-12 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="h-6 w-6 mr-3 animate-pulse" />
              Begin My Quantum Journey
              <ArrowRight className="h-6 w-6 ml-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes orbit {
          from { transform: translate(-50%, -50%) rotate(0deg) translateY(-24px); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateY(-24px); }
        }
        @keyframes wave {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
