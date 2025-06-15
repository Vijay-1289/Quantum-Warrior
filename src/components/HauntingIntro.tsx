
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skull, Zap, Eye } from 'lucide-react';

interface HauntingIntroProps {
  onComplete: () => void;
}

export const HauntingIntro: React.FC<HauntingIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'haunting' | 'villain-appears' | 'warning'>('haunting');
  const [showVillain, setShowVillain] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and play the haunting audio once
  const playHauntingSound = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/Untitled video - Made with Clipchamp (4).mp3');
        audioRef.current.loop = false; // Play only once
        audioRef.current.volume = 0.3; // Set volume to 30%
      }
      
      audioRef.current.play().catch(error => {
        console.log('Audio playback failed:', error);
      });
    } catch (error) {
      console.log('Audio initialization failed:', error);
    }
  };

  // Stop the haunting audio
  const stopHauntingSound = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } catch (error) {
      console.log('Error stopping audio:', error);
    }
  };

  useEffect(() => {
    // Start playing the haunting audio immediately
    playHauntingSound();

    // Start with haunting atmosphere
    const timer1 = setTimeout(() => {
      setPhase('villain-appears');
      setShowVillain(true);
    }, 3000);

    const timer2 = setTimeout(() => {
      setPhase('warning');
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      stopHauntingSound();
    };
  }, []);

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      stopHauntingSound();
    };
  }, []);

  const handleComplete = () => {
    stopHauntingSound();
    onComplete();
  };

  const backgroundPattern = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF0000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Haunting Background */}
      <div className={`absolute inset-0 transition-all duration-2000 ${
        phase === 'haunting' 
          ? 'bg-gradient-to-br from-red-950 via-black to-purple-950' 
          : 'bg-gradient-to-br from-red-900 via-gray-900 to-black'
      }`}>
        <div 
          className="absolute inset-0 animate-pulse opacity-30"
          style={{ backgroundImage: `url("${backgroundPattern}")` }}
        />
      </div>

      {/* Floating dark particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            <div className="w-1 h-1 sm:w-2 sm:h-2 bg-red-500 rounded-full opacity-40 animate-ping" />
          </div>
        ))}
      </div>

      {/* Lightning effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-red-500 to-transparent opacity-30 animate-pulse" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-20 animate-pulse delay-1000" />
      </div>

      <div className="relative h-full flex flex-col justify-center items-center px-4 py-6 sm:py-8 text-center overflow-y-auto">
        {phase === 'haunting' && (
          <div className="animate-fade-in max-w-4xl w-full">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent mb-4 sm:mb-6 animate-pulse leading-tight">
              WELCOME...
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-red-300 mb-4 sm:mb-6 animate-pulse px-2">
              To a realm where reality bends and breaks...
            </p>
            <div className="flex justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Skull className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-red-500 animate-pulse" />
              <Eye className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-purple-500 animate-pulse delay-500" />
              <Skull className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-red-500 animate-pulse delay-1000" />
            </div>
          </div>
        )}

        {showVillain && (
          <div className={`transition-all duration-1000 max-w-4xl w-full ${
            phase === 'villain-appears' ? 'animate-scale-in' : ''
          }`}>
            {/* Quantum Villain Appearance */}
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-red-600/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative bg-black/40 backdrop-blur-lg border-2 border-red-500/50 rounded-full p-4 sm:p-6 mx-auto w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 flex items-center justify-center">
                <div className="text-2xl sm:text-4xl md:text-6xl animate-pulse">👾</div>
                <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full animate-ping" />
                <div className="absolute inset-2 border border-red-500/20 rounded-full animate-ping delay-500" />
              </div>
            </div>

            {phase === 'warning' && (
              <Card className="mx-auto bg-black/60 backdrop-blur-lg border-red-500/30 animate-fade-in max-w-2xl">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <Zap className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 text-red-500 animate-pulse" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-400 mb-3 sm:mb-4 md:mb-6 leading-tight">
                    THE QUANTUM VILLAIN SPEAKS
                  </h2>
                  <div className="space-y-2 sm:space-y-3 md:space-y-4 text-red-200 text-sm sm:text-base md:text-lg leading-relaxed">
                    <p className="animate-fade-in">
                      "So... another soul dares to enter my domain. You think you can master the quantum realm?"
                    </p>
                    <p className="animate-fade-in delay-1000">
                      "I have collapsed countless realities, destroyed infinite possibilities, and merged universes into chaos!"
                    </p>
                    <p className="animate-fade-in delay-2000">
                      "But perhaps... you might prove interesting. Let us see if you can rise to become a true Quantum Warrior."
                    </p>
                    <p className="animate-fade-in delay-3000 text-yellow-400 font-bold">
                      "Your journey begins NOW!"
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-6 md:mt-8">
                    <Button
                      onClick={handleComplete}
                      className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 md:py-4 md:px-8 rounded-full text-sm sm:text-base md:text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse w-full sm:w-auto"
                    >
                      <Skull className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2" />
                      Accept the Challenge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
