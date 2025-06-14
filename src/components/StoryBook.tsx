
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, BookOpen } from 'lucide-react';
import { type QuantumLevel } from '@/data/quantumLevels';

interface StoryPage {
  id: number;
  title: string;
  content: string;
  illustration: string;
  concept: string;
}

interface StoryBookProps {
  level: QuantumLevel;
  onComplete: () => void;
}

export const StoryBook: React.FC<StoryBookProps> = ({ level, onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [bookOpened, setBookOpened] = useState(false);

  // Generate story pages based on level content
  const generateStoryPages = (level: QuantumLevel): StoryPage[] => {
    const basePages: StoryPage[] = [
      {
        id: 1,
        title: "The Journey Begins",
        content: `Welcome to Level ${level.id}: ${level.title}. In this chapter of your quantum adventure, you'll discover the mysteries of ${level.concept}.`,
        illustration: "🌟",
        concept: "Introduction"
      },
      {
        id: 2,
        title: "The Story Unfolds",
        content: level.storyText,
        illustration: getIllustrationForConcept(level.concept),
        concept: level.concept
      }
    ];

    // Add learning objective pages
    const learningPages: StoryPage[] = level.learningObjectives.map((objective, index) => ({
      id: basePages.length + index + 1,
      title: `Key Learning ${index + 1}`,
      content: `${objective}. This knowledge will be essential for completing your upcoming challenge!`,
      illustration: getObjectiveIllustration(index),
      concept: `Learning Objective ${index + 1}`
    }));

    // Add final preparation page
    const finalPage: StoryPage = {
      id: basePages.length + learningPages.length + 1,
      title: "Ready for the Challenge",
      content: `You now have all the knowledge needed to face the ${level.gameType} challenge ahead. Use what you've learned about ${level.concept} to succeed!`,
      illustration: "⚔️",
      concept: "Challenge Preparation"
    };

    return [...basePages, ...learningPages, finalPage];
  };

  const storyPages = generateStoryPages(level);
  const totalPages = storyPages.length;

  useEffect(() => {
    // Open book animation after component mounts
    setTimeout(() => setBookOpened(true), 500);
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const handleStartChallenge = () => {
    setBookOpened(false);
    setTimeout(onComplete, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="relative">
        {/* Book Container */}
        <div 
          className={`relative transform transition-all duration-1000 ${
            bookOpened ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
          }`}
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Book Spine/Cover */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg shadow-2xl transform transition-all duration-1000 ${
              bookOpened ? 'rotateY-90' : 'rotateY-0'
            }`}
            style={{
              width: '600px',
              height: '400px',
              transformOrigin: 'left center',
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <BookOpen className="h-16 w-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Level {level.id}</h2>
                <p className="text-lg">{level.title}</p>
              </div>
            </div>
          </div>

          {/* Book Pages */}
          <Card 
            className={`relative bg-gradient-to-br from-amber-50 to-yellow-50 border-4 border-amber-800 shadow-2xl transform transition-all duration-1000 ${
              bookOpened ? 'rotateY-0' : 'rotateY-90'
            }`}
            style={{
              width: '600px',
              height: '400px',
              transformOrigin: 'left center',
              backfaceVisibility: 'hidden'
            }}
          >
            {/* Page Content */}
            <div className="h-full flex">
              {/* Left Page */}
              <div className="w-1/2 p-6 border-r-2 border-amber-200 relative overflow-hidden">
                <div 
                  className={`transform transition-all duration-300 ${
                    isFlipping ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
                  }`}
                >
                  <div className="text-center mb-4">
                    <span className="text-6xl">{storyPages[currentPage]?.illustration}</span>
                  </div>
                  <h3 className="text-xl font-bold text-amber-900 mb-3 text-center">
                    {storyPages[currentPage]?.title}
                  </h3>
                  <div className="text-amber-800 leading-relaxed text-sm">
                    {storyPages[currentPage]?.content}
                  </div>
                </div>
              </div>

              {/* Right Page */}
              <div className="w-1/2 p-6 relative overflow-hidden">
                {currentPage < totalPages - 1 ? (
                  <div 
                    className={`transform transition-all duration-300 ${
                      isFlipping ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
                    }`}
                  >
                    <div className="text-center mb-4">
                      <span className="text-6xl">{storyPages[currentPage + 1]?.illustration}</span>
                    </div>
                    <h3 className="text-xl font-bold text-amber-900 mb-3 text-center">
                      {storyPages[currentPage + 1]?.title}
                    </h3>
                    <div className="text-amber-800 leading-relaxed text-sm">
                      {storyPages[currentPage + 1]?.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-center">
                      <span className="text-6xl block mb-4">🎯</span>
                      <h3 className="text-xl font-bold text-amber-900 mb-4">Ready to Begin?</h3>
                      <Button
                        onClick={handleStartChallenge}
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Start Challenge
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 0 || isFlipping}
                variant="outline"
                size="sm"
                className="border-amber-600 text-amber-700 hover:bg-amber-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-amber-700 font-medium">
                {Math.floor(currentPage / 2) + 1} / {Math.ceil(totalPages / 2)}
              </span>
              
              <Button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1 || isFlipping}
                variant="outline"
                size="sm"
                className="border-amber-600 text-amber-700 hover:bg-amber-100"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Page Numbers */}
            <div className="absolute bottom-2 left-6 text-xs text-amber-600">
              {currentPage + 1}
            </div>
            {currentPage < totalPages - 1 && (
              <div className="absolute bottom-2 right-6 text-xs text-amber-600">
                {currentPage + 2}
              </div>
            )}
          </Card>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-60 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper functions for illustrations
function getIllustrationForConcept(concept: string): string {
  const conceptMap: Record<string, string> = {
    'Classical vs Quantum': '⚖️',
    'Quantum Basics': '🌀',
    'Wave-Particle Duality': '🌊',
    'Quantum Probability': '🎲',
    'Superposition Paradox': '🐱',
    'Heisenberg Uncertainty': '❓',
    'Discrete Energy States': '🪜',
    'Quantum Light': '💡',
    'Computing Paradigms': '💻',
    'Quantum Revolution': '🚀',
    'Quantum Bit Basics': '🎯',
    'Qubit Visualization': '🔮',
    'Computational Basis': '📐',
    'Linear Combinations': '➕',
    'Quantum Measurement': '👁️',
    'Quantum Phase': '🌙',
    'Multi-Qubit Systems': '🔗',
    'State Preparation': '🎨',
    'Quantum Coherence': '💎',
    'Qubit Technologies': '🔬'
  };
  return conceptMap[concept] || '🔬';
}

function getObjectiveIllustration(index: number): string {
  const illustrations = ['📚', '🎓', '🧠', '💡', '🔍', '⚡', '🎯', '🛡️'];
  return illustrations[index % illustrations.length];
}
