
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
  hasQuestions?: boolean;
  questions?: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
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

  // Generate enhanced challenge questions based on level concepts
  const getChallengeQuestions = (levelId: number) => {
    const questionBank: Record<number, Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>> = {
      1: [
        {
          question: "What is the fundamental difference between a classical bit and a qubit?",
          options: [
            "A qubit can only be 0 or 1",
            "A qubit can exist in superposition of 0 and 1 states",
            "A qubit is faster than a bit",
            "A qubit uses less energy"
          ],
          correctAnswer: 1,
          explanation: "Unlike classical bits that are either 0 or 1, qubits can exist in a quantum superposition of both states simultaneously, written as α|0⟩ + β|1⟩."
        },
        {
          question: "What happens when you measure a qubit in superposition?",
          options: [
            "It stays in superposition",
            "It becomes two separate qubits",
            "It collapses to either |0⟩ or |1⟩ probabilistically",
            "It disappears"
          ],
          correctAnswer: 2,
          explanation: "Measurement causes the quantum superposition to collapse, and the qubit becomes either |0⟩ or |1⟩ with probabilities determined by the quantum amplitudes."
        }
      ],
      2: [
        {
          question: "What does the Pauli-X gate do to a qubit?",
          options: [
            "Creates superposition",
            "Flips |0⟩ to |1⟩ and |1⟩ to |0⟩",
            "Measures the qubit",
            "Entangles two qubits"
          ],
          correctAnswer: 1,
          explanation: "The Pauli-X gate is the quantum NOT gate. It flips the computational basis states: X|0⟩ = |1⟩ and X|1⟩ = |0⟩."
        },
        {
          question: "What is the result of applying a Hadamard gate to |0⟩?",
          options: [
            "|1⟩",
            "|0⟩",
            "(|0⟩ + |1⟩)/√2",
            "(|0⟩ - |1⟩)/√2"
          ],
          correctAnswer: 2,
          explanation: "The Hadamard gate creates equal superposition: H|0⟩ = (|0⟩ + |1⟩)/√2, giving equal probability of measuring 0 or 1."
        }
      ],
      3: [
        {
          question: "What is quantum entanglement?",
          options: [
            "When qubits are physically close together",
            "When qubits share quantum correlations regardless of distance",
            "When qubits have the same energy",
            "When qubits rotate at the same speed"
          ],
          correctAnswer: 1,
          explanation: "Quantum entanglement creates correlations between particles where measuring one instantly determines the state of the other, no matter how far apart they are."
        },
        {
          question: "Which gate is commonly used to create entanglement?",
          options: [
            "Hadamard gate",
            "Pauli-X gate",
            "CNOT gate",
            "Z gate"
          ],
          correctAnswer: 2,
          explanation: "The CNOT (Controlled-NOT) gate creates entanglement. When applied to |+0⟩, it produces the Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2."
        }
      ]
    };
    return questionBank[levelId] || questionBank[1];
  };

  // Generate story pages with integrated questions
  const generateStoryPages = (level: QuantumLevel): StoryPage[] => {
    const challengeQuestions = getChallengeQuestions(level.id);
    
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
        content: level.storyText + "\n\nNow, let us delve deeper into the quantum principles that govern this realm...",
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
          {/* Book Cover */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg shadow-2xl transform transition-all duration-1000 ${
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
            className={`relative bg-gradient-to-br from-amber-50 to-yellow-50 border-4 border-amber-800 shadow-2xl transform transition-all duration-1000 ${
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
                  className={`transform transition-all duration-300 ${
                    isFlipping ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
                  }`}
                >
                  <div className="h-full flex items-center justify-center">
                    {renderAdvancedSVGIllustration(currentPageData?.illustration)}
                  </div>
                </div>
              </div>

              {/* Right Page - Text Content or Questions */}
              <div className="w-1/2 p-6 relative overflow-hidden">
                {showQuestions && currentQuestion ? (
                  // Question Mode
                  <div className="h-full flex flex-col">
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
                            className={`w-full p-3 text-left rounded-lg border-2 transition-all duration-200 ${
                              selectedAnswer === null
                                ? 'border-amber-300 hover:border-amber-500 hover:bg-amber-50'
                                : selectedAnswer === index
                                ? index === currentQuestion.correctAnswer
                                  ? 'border-green-500 bg-green-50 text-green-800'
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
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
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
                    className={`transform transition-all duration-300 ${
                      isFlipping ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
                    }`}
                  >
                    <h3 className="text-xl font-bold text-amber-900 mb-4 text-center border-b-2 border-amber-300 pb-2">
                      {currentPageData?.title}
                    </h3>
                    <div className="text-amber-800 leading-relaxed text-sm space-y-3 overflow-y-auto max-h-80">
                      {currentPageData?.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="text-justify">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Final Page
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-center">
                      {renderAdvancedSVGIllustration("quantum_battle_ready")}
                      <h3 className="text-xl font-bold text-amber-900 mb-4 mt-4">Ready to Test Your Quantum Knowledge?</h3>
                      <p className="text-sm text-amber-700 mb-6">You've mastered all the concepts needed for this challenge!</p>
                      <Button
                        onClick={handleStartChallenge}
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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
                className="border-amber-600 text-amber-700 hover:bg-amber-100"
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
                className="border-amber-600 text-amber-700 hover:bg-amber-100"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute bottom-2 left-6 text-xs text-amber-600">
              {showQuestions ? `Questions` : currentPage + 1}
            </div>
          </Card>
        </div>

        {/* Floating Quantum Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
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

// Enhanced SVG illustrations with more accurate quantum representations
function renderAdvancedSVGIllustration(key: string) {
  const illustrations: Record<string, JSX.Element> = {
    quantum_warrior_intro: (
      <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-lg">
        <defs>
          <radialGradient id="warriorGradient" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E293B" />
          </radialGradient>
          <linearGradient id="swordGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFA500" />
          </radialGradient>
        </defs>
        {/* Quantum Warrior */}
        <circle cx="150" cy="120" r="45" fill="url(#warriorGradient)" />
        <circle cx="135" cy="110" r="6" fill="#00FFFF" />
        <circle cx="165" cy="110" r="6" fill="#00FFFF" />
        <path d="M135 130 Q150 145 165 130" stroke="#00FFFF" strokeWidth="3" fill="none" />
        {/* Quantum Armor */}
        <rect x="125" y="165" width="50" height="90" fill="url(#warriorGradient)" rx="15" />
        <rect x="105" y="175" width="25" height="70" fill="url(#warriorGradient)" rx="12" />
        <rect x="170" y="175" width="25" height="70" fill="url(#warriorGradient)" rx="12" />
        {/* Quantum Sword */}
        <rect x="200" y="100" width="8" height="80" fill="url(#swordGradient)" rx="4" />
        <rect x="190" y="95" width="28" height="15" fill="url(#swordGradient)" rx="3" />
        {/* Quantum Energy Aura */}
        {[...Array(8)].map((_, i) => (
          <circle key={i} cx={150 + Math.cos(i * Math.PI / 4) * 60} cy={180 + Math.sin(i * Math.PI / 4) * 60} r="4" fill="#00FFFF" opacity="0.6">
            <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <text x="150" y="340" textAnchor="middle" fill="#6B46C1" fontSize="18" fontWeight="bold">Quantum Warrior</text>
      </svg>
    ),
    quantum_superposition: (
      <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-lg">
        <defs>
          <linearGradient id="superposGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="25%" stopColor="#EC4899" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="75%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        {/* Bloch Sphere */}
        <circle cx="150" cy="200" r="80" fill="none" stroke="#3B82F6" strokeWidth="3" opacity="0.6" />
        <ellipse cx="150" cy="200" rx="80" ry="20" fill="none" stroke="#3B82F6" strokeWidth="2" opacity="0.4" />
        <line x1="70" y1="200" x2="230" y2="200" stroke="#3B82F6" strokeWidth="2" opacity="0.4" />
        <line x1="150" y1="120" x2="150" y2="280" stroke="#3B82F6" strokeWidth="2" opacity="0.4" />
        {/* Superposition Wave */}
        <path d="M50 200 Q75 150 100 200 Q125 250 150 200 Q175 150 200 200 Q225 250 250 200" 
              fill="none" stroke="url(#superposGradient)" strokeWidth="4">
          <animate attributeName="d" 
                   values="M50 200 Q75 150 100 200 Q125 250 150 200 Q175 150 200 200 Q225 250 250 200;
                           M50 200 Q75 250 100 200 Q125 150 150 200 Q175 250 200 200 Q225 150 250 200;
                           M50 200 Q75 150 100 200 Q125 250 150 200 Q175 150 200 200 Q225 250 250 200" 
                   dur="3s" repeatCount="indefinite" />
        </path>
        {/* State Labels */}
        <text x="150" y="110" textAnchor="middle" fill="#3B82F6" fontSize="16" fontWeight="bold">|0⟩</text>
        <text x="150" y="295" textAnchor="middle" fill="#3B82F6" fontSize="16" fontWeight="bold">|1⟩</text>
        <text x="150" y="340" textAnchor="middle" fill="#6B46C1" fontSize="16" fontWeight="bold">Quantum Superposition</text>
      </svg>
    ),
    quantum_knowledge_test: (
      <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-lg">
        <defs>
          <radialGradient id="knowledgeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#3B82F6" />
          </radialGradient>
        </defs>
        {/* Brain/Knowledge Symbol */}
        <circle cx="150" cy="200" r="70" fill="url(#knowledgeGradient)" opacity="0.8" />
        {/* Neural Network Pattern */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * Math.PI * 2) / 12;
          const x = 150 + Math.cos(angle) * 50;
          const y = 200 + Math.sin(angle) * 50;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="6" fill="#FFD700" opacity="0.8">
                <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1 + i * 0.1}s`} repeatCount="indefinite" />
              </circle>
              <line x1="150" y1="200" x2={x} y2={y} stroke="#FFD700" strokeWidth="2" opacity="0.6" />
            </g>
          );
        })}
        {/* Question Mark */}
        <text x="150" y="210" textAnchor="middle" fill="#FFFFFF" fontSize="48" fontWeight="bold">?</text>
        <text x="150" y="340" textAnchor="middle" fill="#6B46C1" fontSize="16" fontWeight="bold">Test Your Knowledge</text>
      </svg>
    ),
    quantum_battle_ready: (
      <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-lg">
        <defs>
          <radialGradient id="battleGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#DC2626" />
          </radialGradient>
        </defs>
        {/* Battle Ready Symbol */}
        <circle cx="100" cy="100" r="80" fill="url(#battleGradient)" opacity="0.8">
          <animate attributeName="r" values="80;85;80" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <polygon points="100,40 120,80 160,80 130,110 140,150 100,130 60,150 70,110 40,80 80,80" fill="#FFD700">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
        </polygon>
        <text x="100" y="190" textAnchor="middle" fill="#6B46C1" fontSize="14" fontWeight="bold">Ready for Battle!</text>
      </svg>
    )
  };

  return illustrations[key] || illustrations.quantum_warrior_intro;
}

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
    'Qubit Technologies': 'quantum_superposition'
  };
  return conceptMap[concept] || 'quantum_warrior_intro';
}
