import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, Circle, Plus, GridIcon, Heart, CheckCircle, BookOpen, Trophy, ArrowRight, Sparkles, Home, Play } from 'lucide-react';
import { chapters } from '@/data/quantumLevels';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuantumRoadmapProps {
  onStartJourney: () => void;
  onClose: () => void;
  playerProgress?: {
    completedLevels: number[];
    currentLevel: number;
    totalStars: number;
  };
}

export const QuantumRoadmap: React.FC<QuantumRoadmapProps> = ({ 
  onStartJourney, 
  onClose,
  playerProgress = { completedLevels: [], currentLevel: 1, totalStars: 0 }
}) => {
  const [visibleChapters, setVisibleChapters] = useState<number[]>([]);
  const [floatingParticles, setFloatingParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

  const isChapterUnlocked = (chapterIndex: number): boolean => {
    if (chapterIndex === 0) return true;
    // Chapter is unlocked if previous chapter has at least 80% completion
    const prevChapterLevels = getChapterLevels(chapterIndex);
    const completedInPrevChapter = prevChapterLevels.filter(level => 
      playerProgress.completedLevels.includes(level)
    ).length;
    return completedInPrevChapter >= Math.ceil(prevChapterLevels.length * 0.8);
  };

  const getChapterLevels = (chapterIndex: number): number[] => {
    // Return level IDs for the chapter (assuming 10 levels per chapter)
    const startLevel = chapterIndex * 10 + 1;
    return Array.from({ length: 10 }, (_, i) => startLevel + i);
  };

  const getChapterProgress = (chapterIndex: number): number => {
    const chapterLevels = getChapterLevels(chapterIndex);
    const completedInChapter = chapterLevels.filter(level => 
      playerProgress.completedLevels.includes(level)
    ).length;
    return (completedInChapter / chapterLevels.length) * 100;
  };

  const handleChapterClick = (chapterIndex: number) => {
    if (isChapterUnlocked(chapterIndex)) {
      // Navigate to story board with the specific chapter selected
      navigate('/story-board', { state: { selectedChapter: chapterIndex + 1 } });
    }
  };

  useEffect(() => {
    // Generate floating quantum particles
    const particles = Array.from({ length: isMobile ? 15 : 25 }, (_, i) => ({
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
  }, [isMobile]);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden">
      {/* Floating Quantum Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingParticles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute ${isMobile ? 'w-1 h-1' : 'w-2 h-2'} bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60 animate-bounce`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDuration: `${3 + Math.random() * 2}s`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Quantum Energy Waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-blue-500/10 to-transparent animate-pulse" 
             style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full h-full flex flex-col p-2 sm:p-4">
        <Card className="flex-1 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 border border-purple-500/30 backdrop-blur-lg shadow-2xl overflow-hidden">
          <ScrollArea className="h-full">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-blue-600/20 rounded-lg blur-xl" />
                <div className="relative">
                  <h2 className={`${isMobile ? 'text-3xl' : 'text-4xl lg:text-5xl'} font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3 sm:mb-4 animate-pulse`}>
                    Your Quantum Journey Awaits
                  </h2>
                  <p className={`${isMobile ? 'text-base' : 'text-lg lg:text-xl'} text-purple-200 max-w-4xl mx-auto leading-relaxed px-2`}>
                    Embark on an epic adventure through the quantum realm. Master each chapter to unlock the mysteries of quantum computing and become a true Quantum Warrior!
                  </p>
                </div>
              </div>

              {/* Progress Overview */}
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-3 sm:gap-4 mb-6 sm:mb-8`}>
                <div className="text-center bg-black/20 rounded-lg p-3 sm:p-4">
                  <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-blue-400`}>{playerProgress.completedLevels.length}</div>
                  <p className="text-xs sm:text-sm text-gray-400">Levels Completed</p>
                </div>
                <div className="text-center bg-black/20 rounded-lg p-3 sm:p-4">
                  <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-yellow-400`}>{playerProgress.totalStars}</div>
                  <p className="text-xs sm:text-sm text-gray-400">Total Stars</p>
                </div>
                <div className="text-center bg-black/20 rounded-lg p-3 sm:p-4">
                  <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-purple-400`}>{playerProgress.currentLevel}</div>
                  <p className="text-xs sm:text-sm text-gray-400">Current Level</p>
                </div>
              </div>

              {/* Quantum Roadmap */}
              <div className="relative px-2 sm:px-4 lg:px-8">
                {/* Quantum Energy Path - Mobile optimized */}
                {!isMobile && (
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
                )}
                
                <div className={`${isMobile ? 'space-y-8' : 'space-y-16'} relative z-10`}>
                  {chapters.map((chapter, index) => {
                    const IconComponent = getIconComponent(chapter.icon);
                    const isVisible = visibleChapters.includes(index);
                    const isEven = index % 2 === 0;
                    const isUnlocked = isChapterUnlocked(index);
                    const progress = getChapterProgress(index);
                    const isCompleted = progress >= 100;

                    return (
                      <div
                        key={chapter.id}
                        className={`relative flex items-center ${
                          isMobile ? 'justify-center' : isEven ? 'justify-start' : 'justify-end'
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
                        {/* Quantum Portal Node - Mobile optimized */}
                        {!isMobile && (
                          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                            <div className="relative">
                              {/* Outer energy ring */}
                              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${
                                isCompleted ? 'bg-gradient-to-r from-green-400 via-blue-400 to-green-400' :
                                isUnlocked ? 'bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400' :
                                'bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600'
                              } ${isUnlocked ? 'animate-spin' : ''} opacity-60`} 
                                   style={{ animationDuration: '3s' }} />
                              {/* Inner portal */}
                              <div className={`absolute inset-2 w-8 h-8 sm:w-12 sm:h-12 rounded-full ${
                                isCompleted ? 'bg-gradient-to-r from-green-600 to-green-500' :
                                isUnlocked ? 'bg-gradient-to-r from-blue-600 to-purple-600' :
                                'bg-gradient-to-r from-gray-700 to-gray-600'
                              } flex items-center justify-center ${isUnlocked ? 'animate-pulse' : ''}`}>
                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/90 flex items-center justify-center">
                                  {isCompleted ? (
                                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                  ) : (
                                    <span className="text-xs sm:text-sm font-bold text-purple-900">{chapter.id}</span>
                                  )}
                                </div>
                              </div>
                              {/* Energy particles around portal - fewer on mobile */}
                              {isUnlocked && [...Array(isMobile ? 4 : 6)].map((_, i) => (
                                <div
                                  key={i}
                                  className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-spin"
                                  style={{
                                    top: '50%',
                                    left: '50%',
                                    transform: `translate(-50%, -50%) rotate(${i * (isMobile ? 90 : 60)}deg) translateY(-${isMobile ? 16 : 24}px)`,
                                    animationDuration: `${2 + i * 0.3}s`
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Chapter Crystal/Gem Card - Mobile optimized */}
                        <div className={`${isMobile ? 'w-full max-w-sm' : 'w-96'} ${
                          !isMobile && (isEven ? 'mr-12' : 'ml-12')
                        } relative`}>
                          {/* Crystal Shape Container */}
                          <div 
                            className={`relative transform hover:scale-105 transition-all duration-500 ${
                              isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                            } group`}
                            onClick={() => handleChapterClick(index)}
                          >
                            {/* Crystal Background */}
                            <div className={`relative ${
                              isCompleted ? 'bg-gradient-to-br from-green-600/30 to-blue-600/30' :
                              isUnlocked ? `bg-gradient-to-br ${chapter.color}` :
                              'bg-gradient-to-br from-gray-800/30 to-gray-700/30'
                            } bg-opacity-20 backdrop-blur-lg border ${
                              isCompleted ? 'border-green-400/50' :
                              isUnlocked ? 'border-purple-400/30' :
                              'border-gray-600/30'
                            } p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden`}>
                              {/* Lock overlay for locked chapters */}
                              {!isUnlocked && (
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-2xl sm:rounded-3xl">
                                  <div className="text-center">
                                    <Circle className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-xs text-gray-400">Complete previous chapter</p>
                                  </div>
                                </div>
                              )}
                              
                              {/* Crystal Facets Effect */}
                              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                              <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-t from-transparent via-white/30 to-transparent" />
                              
                              {/* Floating Energy Inside Crystal - fewer on mobile */}
                              {isUnlocked && (
                                <div className="absolute inset-0 overflow-hidden">
                                  {[...Array(isMobile ? 4 : 8)].map((_, i) => (
                                    <div
                                      key={i}
                                      className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-60 animate-bounce"
                                      style={{
                                        left: `${20 + Math.random() * 60}%`,
                                        top: `${20 + Math.random() * 60}%`,
                                        animationDuration: `${2 + Math.random() * 3}s`,
                                        animationDelay: `${Math.random() * 2}s`
                                      }}
                                    />
                                  ))}
                                </div>
                              )}

                              <div className="relative z-10">
                                <div className={`flex items-center ${isMobile ? 'gap-2 mb-3' : 'gap-4 mb-4'}`}>
                                  <div className={`${isMobile ? 'p-2' : 'p-4'} rounded-xl sm:rounded-2xl ${
                                    isUnlocked ? 'bg-white/10 group-hover:bg-white/20' : 'bg-gray-700/20'
                                  } backdrop-blur-sm transition-all duration-300`}>
                                    <IconComponent className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8 sm:h-10 sm:w-10'} ${
                                      isUnlocked ? 'text-white' : 'text-gray-500'
                                    } drop-shadow-lg`} />
                                  </div>
                                  <div>
                                    <h3 className={`${isMobile ? 'text-lg' : 'text-xl sm:text-2xl'} font-bold ${
                                      isUnlocked ? 'text-white' : 'text-gray-500'
                                    } drop-shadow-lg`}>
                                      Chapter {chapter.id}
                                    </h3>
                                    <p className={`${
                                      isUnlocked ? 'text-purple-100' : 'text-gray-500'
                                    } ${isMobile ? 'text-sm' : 'text-base sm:text-lg'} font-medium`}>
                                      {chapter.title}
                                    </p>
                                  </div>
                                </div>
                                
                                <p className={`${isMobile ? 'text-xs' : 'text-sm'} ${
                                  isUnlocked ? 'text-gray-200' : 'text-gray-500'
                                } mb-4 sm:mb-6 leading-relaxed`}>
                                  {chapter.description}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <Badge className={`${
                                    isCompleted ? 'bg-green-600/30 text-green-200 border-green-400/50' :
                                    isUnlocked ? 'bg-purple-600/30 text-purple-200 border-purple-400/50' :
                                    'bg-gray-600/30 text-gray-400 border-gray-500/50'
                                  } ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1'}`}>
                                    10 Quantum Levels
                                  </Badge>
                                  <div className="flex items-center gap-2">
                                    {isUnlocked && (
                                      <div className="flex items-center gap-2">
                                        <div className="text-xs text-gray-300">
                                          {Math.round(progress)}%
                                        </div>
                                        {isCompleted ? (
                                          <Trophy className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-yellow-400 animate-pulse`} />
                                        ) : (
                                          <Play className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-blue-400 animate-pulse`} />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Quantum Trail Effect - Hidden on mobile */}
                            {!isMobile && index < chapters.length - 1 && (
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
                <div className={`text-center ${isMobile ? 'mt-12' : 'mt-20'} relative`}>
                  <div className="relative inline-block">
                    {/* Master Portal */}
                    <div className="relative">
                      <div className={`${isMobile ? 'w-24 h-24' : 'w-32 h-32'} rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 animate-spin opacity-80`} 
                           style={{ animationDuration: '4s' }} />
                      <div className={`absolute ${isMobile ? 'inset-3 w-18 h-18' : 'inset-4 w-24 h-24'} rounded-full bg-gradient-to-r from-yellow-300 to-orange-300 flex items-center justify-center animate-pulse`}>
                        <Trophy className={`${isMobile ? 'h-10 w-10' : 'h-16 w-16'} text-white drop-shadow-lg`} />
                      </div>
                      {/* Master Energy Rings - fewer on mobile */}
                      {[...Array(isMobile ? 8 : 12)].map((_, i) => (
                        <div
                          key={i}
                          className={`absolute ${isMobile ? 'w-2 h-2' : 'w-3 h-3'} bg-yellow-300 rounded-full animate-spin`}
                          style={{
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) rotate(${i * (isMobile ? 45 : 30)}deg) translateY(-${isMobile ? 36 : 48}px)`,
                            animationDuration: `${3 + i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <h3 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-white mt-4 sm:mt-6 mb-3 sm:mb-4 drop-shadow-lg`}>Quantum Master</h3>
                  <p className={`text-purple-200 ${isMobile ? 'text-base' : 'text-lg'} max-w-md mx-auto px-4`}>
                    Complete all chapters to become the ultimate Quantum Warrior and master of the quantum realm!
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex items-center justify-center ${isMobile ? 'flex-col gap-4' : 'gap-6'} mt-6 sm:mt-8 px-4`}>
                <Button
                  onClick={onClose}
                  variant="outline"
                  size={isMobile ? "default" : "lg"}
                  className={`bg-transparent border-purple-400 text-purple-300 hover:bg-purple-900/30 hover:text-white transition-all duration-300 ${isMobile ? 'px-6 py-2 w-full' : 'px-8 py-3'}`}
                >
                  <Home className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} mr-2`} />
                  Maybe Later
                </Button>
                <Button
                  onClick={onStartJourney}
                  size={isMobile ? "default" : "lg"}
                  className={`bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-700 hover:via-blue-700 hover:to-purple-700 text-white font-bold ${isMobile ? 'px-8 py-3 text-base w-full' : 'px-12 py-4 text-lg'} shadow-2xl transform hover:scale-105 transition-all duration-300`}
                >
                  <Sparkles className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} mr-2 sm:mr-3 animate-pulse`} />
                  Begin My Quantum Journey
                  <ArrowRight className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} ml-2 sm:ml-3`} />
                </Button>
              </div>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};
