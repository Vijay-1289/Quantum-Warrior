
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, BookOpen, Loader2 } from 'lucide-react';
import { type QuantumLevel } from '@/data/quantumLevels';
import { getIllustrationComponent } from '@/components/SVGIllustrations';
import { generateTheoryContent, generateQuizQuestions } from '@/utils/theoryContent';

interface StoryPage {
  id: number;
  title: string;
  content: string;
  illustration: string;
  concept: string;
  isTheoryPage?: boolean;
  isLoading?: boolean;
}

interface StoryBookProps {
  level: QuantumLevel;
  onComplete: () => void;
}

export const StoryBook: React.FC<StoryBookProps> = ({ level, onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [bookOpened, setBookOpened] = useState(false);
  const [storyPages, setStoryPages] = useState<StoryPage[]>([]);
  const [theoryContent, setTheoryContent] = useState<string>('');
  const [isGeneratingContent, setIsGeneratingContent] = useState(true);

  // Generate initial story pages
  const generateInitialPages = (level: QuantumLevel): StoryPage[] => {
    console.log(`Creating story pages for Level ${level.id}: ${level.title}`);
    
    return [
      {
        id: 1,
        title: "The Quantum Adventure Begins",
        content: `Welcome, brave Quantum Warrior, to Level ${level.id}: ${level.title}!\n\nIn this chapter of your epic journey through the quantum realm, you will master the profound mysteries of ${level.concept}. The ancient quantum masters have left knowledge that will be essential for defeating the Quantum Villain.\n\nPrepare yourself, for the concepts ahead will challenge your understanding of reality itself!`,
        illustration: "quantum_warrior_intro",
        concept: "Introduction"
      },
      {
        id: 2,
        title: "The Quantum Tale Unfolds",
        content: `${level.storyText}\n\nNow, let us delve deeper into the quantum principles that govern this realm. The knowledge you're about to gain will be crucial for your upcoming challenge.`,
        illustration: getAdvancedIllustrationKey(level.concept),
        concept: level.concept
      },
      {
        id: 3,
        title: `Mastering ${level.concept}`,
        content: '',
        illustration: getAdvancedIllustrationKey(level.concept),
        concept: "Detailed Theory",
        isTheoryPage: true,
        isLoading: true
      },
      {
        id: 4,
        title: "Ready for the Quantum Battle",
        content: `Excellent! You have absorbed the deep knowledge of ${level.concept}. You are now ready to face the Quantum Villain in the ${level.gameType} challenge.\n\nRemember: Every aspect of your upcoming battle relates directly to the concepts you've just learned. Trust in your quantum wisdom and apply the theoretical foundations you've mastered!`,
        illustration: "quantum_battle_ready",
        concept: "Final Preparation"
      }
    ];
  };

  // Initialize story pages and generate content immediately
  useEffect(() => {
    console.log(`StoryBook mounted for Level ${level.id}: ${level.title}`);
    const initialPages = generateInitialPages(level);
    setStoryPages(initialPages);
    setIsGeneratingContent(true);
    
    // Generate theory content immediately when component mounts
    const loadTheoryContent = async () => {
      console.log(`Generating theory content for Level ${level.id}: ${level.concept}`);
      
      try {
        const content = await generateTheoryContent(level);
        console.log('Theory content generated successfully for level', level.id);
        
        setTheoryContent(content);
        setStoryPages(prevPages => 
          prevPages.map(page => 
            page.isTheoryPage 
              ? { ...page, content, isLoading: false }
              : page
          )
        );
        setIsGeneratingContent(false);
      } catch (error) {
        console.error('Failed to generate theory content for level', level.id, ':', error);
        
        const fallbackContent = `Failed to generate custom content for ${level.concept}. Please check your internet connection and try again.\n\nThis level covers ${level.concept}, a fundamental concept in quantum computing that builds upon previous knowledge and prepares you for advanced quantum applications.`;
        
        setTheoryContent(fallbackContent);
        setStoryPages(prevPages => 
          prevPages.map(page => 
            page.isTheoryPage 
              ? { ...page, content: fallbackContent, isLoading: false }
              : page
          )
        );
        setIsGeneratingContent(false);
      }
    };

    loadTheoryContent();
    setTimeout(() => setBookOpened(true), 500);
  }, [level]);

  const totalPages = storyPages.length;

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

  const currentPageData = storyPages[currentPage];

  // Render the appropriate illustration component
  const renderIllustration = (illustrationKey: string | undefined) => {
    if (!illustrationKey) return null;
    const IllustrationComponent = getIllustrationComponent(illustrationKey);
    return <IllustrationComponent />;
  };

  if (!currentPageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="relative">
        {/* Book Container */}
        <div 
          className={`relative transform transition-all duration-1000 ease-out ${
            bookOpened ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
          }`}
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Book Cover */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg shadow-2xl transform transition-all duration-1000 ease-out ${
              bookOpened ? 'rotateY-90' : 'rotateY-0'
            }`}
            style={{
              width: '800px',
              height: '600px',
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
            className={`relative bg-gradient-to-br from-amber-50 to-yellow-50 border-4 border-amber-800 shadow-2xl transform transition-all duration-1000 ease-out ${
              bookOpened ? 'rotateY-0' : 'rotateY-90'
            }`}
            style={{
              width: '800px',
              height: '600px',
              transformOrigin: 'left center',
              backfaceVisibility: 'hidden'
            }}
          >
            {/* Page Content */}
            <div className="h-full flex">
              {/* Left Page - Enhanced SVG Illustration */}
              <div className="w-1/2 p-6 border-r-2 border-amber-200 relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50">
                <div 
                  className={`transform transition-all duration-500 ease-out ${
                    isFlipping ? 'scale-95 opacity-50 rotate-y-12' : 'scale-100 opacity-100 rotate-y-0'
                  }`}
                >
                  <div className="h-full flex items-center justify-center">
                    {renderIllustration(currentPageData?.illustration)}
                  </div>
                </div>
              </div>

              {/* Right Page - Enhanced Content */}
              <div className="w-1/2 p-6 relative overflow-hidden">
                {currentPage < totalPages - 1 ? (
                  <div 
                    className={`transform transition-all duration-500 ease-out ${
                      isFlipping ? 'scale-95 opacity-50 translate-x-4' : 'scale-100 opacity-100 translate-x-0'
                    }`}
                  >
                    <h3 className="text-xl font-bold text-amber-900 mb-4 text-center border-b-2 border-amber-300 pb-2">
                      {currentPageData?.title}
                    </h3>
                    
                    {/* Loading state for theory page */}
                    {currentPageData?.isLoading || (currentPageData?.isTheoryPage && isGeneratingContent) ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 animate-spin text-amber-600 mx-auto mb-4" />
                          <p className="text-amber-700">Generating personalized theory content for {level.concept}...</p>
                          <p className="text-amber-600 text-xs mt-2">This may take a few moments</p>
                        </div>
                      </div>
                    ) : (
                      <div className={`text-amber-800 leading-relaxed text-sm space-y-3 overflow-y-auto ${
                        currentPageData?.isTheoryPage ? 'max-h-96' : 'max-h-80'
                      }`}>
                        {currentPageData?.content.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="text-justify">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}
                    
                    {/* Theory Page Indicator */}
                    {currentPageData?.isTheoryPage && !currentPageData?.isLoading && !isGeneratingContent && (
                      <div className="absolute bottom-4 right-6 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                        AI Generated Theory
                      </div>
                    )}
                  </div>
                ) : (
                  // Final Page
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-center">
                      {renderIllustration("quantum_battle_ready")}
                      <h3 className="text-xl font-bold text-amber-900 mb-4 mt-4">Ready to Apply Your Knowledge?</h3>
                      <p className="text-sm text-amber-700 mb-6">You've mastered the theory. Now put it into practice!</p>
                      <Button
                        onClick={handleStartChallenge}
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Start Quantum Challenge
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
                className="border-amber-600 text-amber-700 hover:bg-amber-100 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-amber-700 font-medium">
                {currentPage + 1} / {totalPages}
              </span>
              
              <Button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1 || isFlipping}
                variant="outline"
                size="sm"
                className="border-amber-600 text-amber-700 hover:bg-amber-100 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute bottom-2 left-6 text-xs text-amber-600">
              Page {currentPage + 1}
            </div>
          </Card>
        </div>

        {/* Enhanced Floating Quantum Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full opacity-60 animate-bounce ${
                i % 3 === 0 ? 'bg-yellow-300' : i % 3 === 1 ? 'bg-blue-300' : 'bg-purple-300'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper functions for more accurate illustration mapping
function getAdvancedIllustrationKey(concept: string): string {
  const conceptMap: Record<string, string> = {
    'Classical vs Quantum': 'quantum_warrior_intro',
    'Quantum Basics': 'quantum_superposition',
    'Wave-Particle Duality': 'quantum_superposition',
    'Quantum Probability': 'quantum_superposition',
    'Superposition Paradox': 'quantum_superposition',
    'Heisenberg Uncertainty': 'quantum_superposition',
    'Discrete Energy States': 'quantum_superposition',
    'Quantum Light': 'quantum_superposition',
    'Computing Paradigms': 'quantum_superposition',
    'Quantum Revolution': 'quantum_battle_ready',
    'Quantum Bit Basics': 'quantum_superposition',
    'Qubit Visualization': 'quantum_superposition',
    'Computational Basis': 'quantum_superposition',
    'Linear Combinations': 'quantum_superposition',
    'Quantum Measurement': 'quantum_superposition',
    'Quantum Phase': 'quantum_superposition',
    'Multi-Qubit Systems': 'quantum_superposition',
    'State Preparation': 'quantum_superposition',
    'Quantum Coherence': 'quantum_superposition',
    'Qubit Technologies': 'quantum_superposition',
    'Quantum Gates': 'quantum_gates',
    'Gate Operations': 'quantum_gates',
    'Quantum Entanglement': 'quantum_entanglement',
    'Bell States': 'quantum_entanglement',
    'Image Processing Basics': 'quantum_superposition',
    'Quantum Algorithms': 'quantum_gates',
    'Quantum Image Processing': 'quantum_entanglement'
  };
  return conceptMap[concept] || 'quantum_warrior_intro';
}
