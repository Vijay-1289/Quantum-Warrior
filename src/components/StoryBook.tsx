
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, BookOpen } from 'lucide-react';
import { type QuantumLevel } from '@/data/quantumLevels';
import { getIllustrationComponent } from '@/components/SVGIllustrations';
import { getStoryQuestions, getStoryContent, type StoryQuestion } from '@/utils/storyQuestions';

interface StoryPage {
  id: number;
  title: string;
  content: string;
  illustration: string;
  concept: string;
  hasQuestions?: boolean;
  questions?: StoryQuestion[];
}

interface StoryBookProps {
  level: QuantumLevel;
  onComplete: () => void;
}

export const StoryBook: React.FC<StoryBookProps> = ({ level, onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [bookOpened, setBookOpened] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Generate story pages with enhanced content
  const generateStoryPages = (level: QuantumLevel): StoryPage[] => {
    const challengeQuestions = getStoryQuestions(level.id);
    const enhancedStory = getStoryContent(level);
    
    const pages: StoryPage[] = [
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
        content: `${enhancedStory}\n\n${level.storyText}\n\nNow, let us delve deeper into the quantum principles that govern this realm...`,
        illustration: getAdvancedIllustrationKey(level.concept),
        concept: level.concept
      },
      {
        id: 3,
        title: "Test Your Quantum Knowledge",
        content: "Before you face the final challenge, the Quantum Masters want to test your understanding. Answer these questions to prove your readiness for battle!",
        illustration: "quantum_knowledge_test",
        concept: "Knowledge Test",
        hasQuestions: true,
        questions: challengeQuestions
      },
      {
        id: 4,
        title: "Ready for the Quantum Battle",
        content: `Excellent! You have proven your mastery of ${level.concept}. You are now ready to face the Quantum Villain in the ${level.gameType} challenge.\n\nRemember: Every aspect of your upcoming battle relates directly to the concepts you've just learned. Trust in your quantum wisdom!`,
        illustration: "quantum_battle_ready",
        concept: "Final Preparation"
      }
    ];

    return pages;
  };

  const storyPages = generateStoryPages(level);
  const totalPages = storyPages.length;

  useEffect(() => {
    setTimeout(() => setBookOpened(true), 500);
  }, []);

  const handleNextPage = () => {
    const currentPageData = storyPages[currentPage];
    
    if (currentPageData?.hasQuestions && !showQuestions) {
      setShowQuestions(true);
      return;
    }
    
    if (showQuestions) {
      const questions = currentPageData?.questions || [];
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
        return;
      } else {
        setShowQuestions(false);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
      }
    }
    
    if (currentPage < totalPages - 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const handlePrevPage = () => {
    if (showQuestions) {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
        return;
      } else {
        setShowQuestions(false);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        return;
      }
    }
    
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
  };

  const handleStartChallenge = () => {
    setBookOpened(false);
    setTimeout(onComplete, 800);
  };

  const currentPageData = storyPages[currentPage];
  const currentQuestion = currentPageData?.questions?.[currentQuestionIndex];

  // Render the appropriate illustration component
  const renderIllustration = (illustrationKey: string | undefined) => {
    if (!illustrationKey) return null;
    const IllustrationComponent = getIllustrationComponent(illustrationKey);
    return <IllustrationComponent />;
  };

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

              {/* Right Page - Text Content or Questions */}
              <div className="w-1/2 p-6 relative overflow-hidden">
                {showQuestions && currentQuestion ? (
                  // Question Mode
                  <div className="h-full flex flex-col animate-fade-in">
                    <h3 className="text-lg font-bold text-amber-900 mb-4 text-center">
                      Question {currentQuestionIndex + 1} of {currentPageData?.questions?.length}
                    </h3>
                    
                    <div className="flex-1 space-y-4">
                      <p className="text-amber-800 font-medium mb-4">
                        {currentQuestion.question}
                      </p>
                      
                      <div className="space-y-2">
                        {currentQuestion.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={selectedAnswer !== null}
                            className={`w-full p-3 text-left rounded-lg border-2 transition-all duration-300 ease-out transform hover:scale-102 ${
                              selectedAnswer === null
                                ? 'border-amber-300 hover:border-amber-500 hover:bg-amber-50 hover:shadow-md'
                                : selectedAnswer === index
                                ? index === currentQuestion.correctAnswer
                                  ? 'border-green-500 bg-green-50 text-green-800 scale-102'
                                  : 'border-red-500 bg-red-50 text-red-800'
                                : index === currentQuestion.correctAnswer
                                ? 'border-green-500 bg-green-50 text-green-800'
                                : 'border-gray-300 bg-gray-50 text-gray-600'
                            }`}
                          >
                            {String.fromCharCode(65 + index)}. {option}
                          </button>
                        ))}
                      </div>
                      
                      {showExplanation && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-scale-in">
                          <p className="text-blue-800 text-sm">
                            <strong>Explanation:</strong> {currentQuestion.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : currentPage < totalPages - 1 ? (
                  // Regular Page Content
                  <div 
                    className={`transform transition-all duration-500 ease-out ${
                      isFlipping ? 'scale-95 opacity-50 translate-x-4' : 'scale-100 opacity-100 translate-x-0'
                    }`}
                  >
                    <h3 className="text-xl font-bold text-amber-900 mb-4 text-center border-b-2 border-amber-300 pb-2">
                      {currentPageData?.title}
                    </h3>
                    <div className="text-amber-800 leading-relaxed text-sm space-y-3 overflow-y-auto max-h-80">
                      {currentPageData?.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="text-justify animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Final Page
                  <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                    <div className="text-center">
                      {renderIllustration("quantum_battle_ready")}
                      <h3 className="text-xl font-bold text-amber-900 mb-4 mt-4">Ready to Test Your Quantum Knowledge?</h3>
                      <p className="text-sm text-amber-700 mb-6">You've mastered all the concepts needed for this challenge!</p>
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
                disabled={(currentPage === 0 && !showQuestions && currentQuestionIndex === 0) || isFlipping}
                variant="outline"
                size="sm"
                className="border-amber-600 text-amber-700 hover:bg-amber-100 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-amber-700 font-medium">
                {showQuestions 
                  ? `Q${currentQuestionIndex + 1}/${currentPageData?.questions?.length || 0}` 
                  : `${currentPage + 1} / ${totalPages}`
                }
              </span>
              
              <Button
                onClick={handleNextPage}
                disabled={
                  (!showQuestions && currentPage >= totalPages - 1) || 
                  (showQuestions && selectedAnswer === null) ||
                  isFlipping
                }
                variant="outline"
                size="sm"
                className="border-amber-600 text-amber-700 hover:bg-amber-100 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute bottom-2 left-6 text-xs text-amber-600">
              {showQuestions ? `Questions` : currentPage + 1}
            </div>
          </Card>
        </div>

        {/* Enhanced Floating Quantum Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full opacity-60 ${
                i % 3 === 0 ? 'bg-yellow-300' : i % 3 === 1 ? 'bg-blue-300' : 'bg-purple-300'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.8; }
        }
      `}</style>
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
