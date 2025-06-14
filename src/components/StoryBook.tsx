import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, BookOpen } from 'lucide-react';
import { type QuantumLevel } from '@/data/quantumLevels';
import { getIllustrationComponent } from '@/components/SVGIllustrations';

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

  // Generate concept-specific challenge questions based on level content
  const getChallengeQuestions = (levelId: number) => {
    const conceptQuestions: Record<number, Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>> = {
      1: [ // Classical vs Quantum Computing
        {
          question: "What is the main advantage of quantum computing over classical computing?",
          options: [
            "Quantum computers are smaller and cheaper",
            "Quantum computers can process multiple possibilities simultaneously through superposition",
            "Quantum computers use less electricity",
            "Quantum computers are easier to program"
          ],
          correctAnswer: 1,
          explanation: "Quantum computers leverage superposition to explore multiple computational paths simultaneously, potentially solving certain problems exponentially faster than classical computers."
        },
        {
          question: "In classical computing, what are the possible states of a bit?",
          options: [
            "0, 1, or both simultaneously",
            "Only 0 or 1, but not both at the same time",
            "Infinite possible values",
            "Any decimal number between 0 and 1"
          ],
          correctAnswer: 1,
          explanation: "Classical bits are deterministic and can only be in one definite state at a time: either 0 or 1. This is fundamentally different from quantum bits (qubits)."
        },
        {
          question: "What makes quantum information processing fundamentally different from classical information processing?",
          options: [
            "Quantum computers use different programming languages",
            "Quantum systems can exist in multiple states simultaneously until measured",
            "Quantum computers are faster at all tasks",
            "Quantum computers don't need electricity"
          ],
          correctAnswer: 1,
          explanation: "The key difference is quantum superposition - quantum systems can exist in multiple states at once, allowing for parallel processing of information that classical systems cannot achieve."
        }
      ],
      2: [ // Qubits & Superposition
        {
          question: "What does it mean for a qubit to be in superposition?",
          options: [
            "The qubit is broken and needs repair",
            "The qubit exists in a combination of both |0⟩ and |1⟩ states simultaneously",
            "The qubit is switching rapidly between 0 and 1",
            "The qubit can store more than one bit of information"
          ],
          correctAnswer: 1,
          explanation: "Superposition means the qubit exists in a quantum state that is a linear combination of the basis states |0⟩ and |1⟩, written as α|0⟩ + β|1⟩, where α and β are probability amplitudes."
        },
        {
          question: "What happens when you measure a qubit that is in superposition?",
          options: [
            "You get both 0 and 1 as results",
            "The measurement fails",
            "The superposition collapses and you get either 0 or 1 with certain probabilities",
            "The qubit becomes unusable"
          ],
          correctAnswer: 2,
          explanation: "Measurement causes the quantum superposition to collapse. The qubit will be found in either the |0⟩ or |1⟩ state, with probabilities determined by the squared magnitudes of the amplitudes |α|² and |β|²."
        },
        {
          question: "How is a qubit's superposition state mathematically represented?",
          options: [
            "As a simple 0 or 1",
            "As α|0⟩ + β|1⟩ where α and β are complex probability amplitudes",
            "As a percentage between 0% and 100%",
            "As a binary string"
          ],
          correctAnswer: 1,
          explanation: "A qubit in superposition is written as α|0⟩ + β|1⟩, where α and β are complex numbers called probability amplitudes. The probabilities of measuring 0 or 1 are |α|² and |β|² respectively, and |α|² + |β|² = 1."
        }
      ],
      3: [ // Quantum Gates & Operations
        {
          question: "What does the Hadamard gate do to a qubit in the |0⟩ state?",
          options: [
            "It flips it to |1⟩",
            "It creates an equal superposition: (|0⟩ + |1⟩)/√2",
            "It measures the qubit",
            "It does nothing"
          ],
          correctAnswer: 1,
          explanation: "The Hadamard gate transforms |0⟩ into (|0⟩ + |1⟩)/√2, creating an equal superposition where the qubit has a 50% probability of being measured as 0 or 1."
        },
        {
          question: "What is the purpose of the Pauli-X gate?",
          options: [
            "To create superposition",
            "To flip the qubit state: |0⟩ becomes |1⟩ and |1⟩ becomes |0⟩",
            "To measure the qubit",
            "To entangle two qubits"
          ],
          correctAnswer: 1,
          explanation: "The Pauli-X gate (also called the NOT gate) is the quantum equivalent of a classical NOT operation. It flips the computational basis states: X|0⟩ = |1⟩ and X|1⟩ = |0⟩."
        },
        {
          question: "Why are quantum gates represented as unitary matrices?",
          options: [
            "Because they're easier to compute",
            "Because quantum evolution must be reversible and preserve probability",
            "Because classical gates use the same representation",
            "Because they take up less memory"
          ],
          correctAnswer: 1,
          explanation: "Quantum gates must be unitary (reversible) operations because quantum mechanics requires that the total probability is conserved and that quantum evolution is reversible. Unitary matrices preserve the normalization of quantum states."
        }
      ],
      4: [ // Quantum Entanglement
        {
          question: "What is quantum entanglement?",
          options: [
            "When qubits are physically close to each other",
            "A quantum correlation where measuring one particle instantly affects its partner, regardless of distance",
            "When qubits have the same energy level",
            "A type of quantum gate operation"
          ],
          correctAnswer: 1,
          explanation: "Quantum entanglement creates a correlation between particles where the quantum state of each particle cannot be described independently. Measuring one particle instantly determines properties of its entangled partner, no matter how far apart they are."
        },
        {
          question: "What is a Bell state?",
          options: [
            "A single qubit in superposition",
            "A maximally entangled state of two qubits",
            "A type of quantum measurement",
            "A classical bit operation"
          ],
          correctAnswer: 1,
          explanation: "Bell states are the four maximally entangled quantum states of two qubits. For example, |Φ+⟩ = (|00⟩ + |11⟩)/√2 means the qubits are perfectly correlated - if one is measured as 0, the other will definitely be 0, and vice versa."
        },
        {
          question: "Why did Einstein call entanglement 'spooky action at a distance'?",
          options: [
            "Because it happens in dark places",
            "Because it seemed to violate the principle that nothing can travel faster than light",
            "Because it only works at night",
            "Because it involves supernatural forces"
          ],
          correctAnswer: 1,
          explanation: "Einstein was troubled by entanglement because measuring one particle seemed to instantly affect its partner regardless of distance, appearing to violate locality and special relativity. However, no information actually travels faster than light."
        }
      ],
      5: [ // Quantum Algorithms
        {
          question: "What problem does Grover's algorithm solve more efficiently than classical algorithms?",
          options: [
            "Factoring large numbers",
            "Searching through unsorted databases",
            "Multiplying matrices",
            "Sorting lists of numbers"
          ],
          correctAnswer: 1,
          explanation: "Grover's algorithm provides a quadratic speedup for searching unsorted databases. While classical algorithms require O(N) time on average, Grover's algorithm needs only O(√N) time."
        },
        {
          question: "What makes Shor's algorithm important for cryptography?",
          options: [
            "It can create unbreakable codes",
            "It can factor large integers exponentially faster than known classical algorithms",
            "It can generate random numbers",
            "It can compress data efficiently"
          ],
          correctAnswer: 1,
          explanation: "Shor's algorithm can factor large integers exponentially faster than the best known classical algorithms. This threatens RSA encryption, which relies on the difficulty of factoring large numbers for its security."
        },
        {
          question: "How do quantum algorithms achieve their speedup over classical algorithms?",
          options: [
            "By using faster processors",
            "By leveraging quantum superposition and interference to explore multiple solution paths simultaneously",
            "By using more memory",
            "By running on specialized hardware only"
          ],
          correctAnswer: 1,
          explanation: "Quantum algorithms use superposition to explore many possible solutions simultaneously (quantum parallelism) and employ interference to amplify the probability of correct answers while canceling out wrong ones."
        }
      ],
      6: [ // Quantum Image Processing
        {
          question: "What is the main challenge in quantum image processing?",
          options: [
            "Images are too large for quantum computers",
            "Converting classical pixel data into quantum states while preserving spatial information",
            "Quantum computers can't display colors",
            "Images require too much memory"
          ],
          correctAnswer: 1,
          explanation: "The primary challenge is efficiently encoding classical image data into quantum states. Various quantum image representations (like FRQI, NEQR) have been proposed to map pixel information into quantum amplitudes while maintaining spatial relationships."
        },
        {
          question: "How could quantum entanglement potentially improve image recognition?",
          options: [
            "By making images brighter",
            "By enabling detection of correlated features across different parts of an image simultaneously",
            "By reducing file sizes",
            "By changing image colors"
          ],
          correctAnswer: 1,
          explanation: "Quantum entanglement could allow quantum image processing algorithms to detect and analyze correlations between different spatial regions of an image simultaneously, potentially offering advantages in pattern recognition and feature detection."
        },
        {
          question: "What potential advantage could quantum image processing offer over classical methods?",
          options: [
            "Better image compression",
            "Exponential speedup for certain image analysis tasks through quantum parallelism",
            "Higher resolution displays",
            "Automatic image colorization"
          ],
          correctAnswer: 1,
          explanation: "Quantum image processing could theoretically provide exponential speedups for certain image analysis tasks by processing multiple image transformations in superposition and using quantum algorithms to analyze patterns that would be computationally intensive for classical systems."
        }
      ]
    };
    
    return conceptQuestions[levelId] || conceptQuestions[1];
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
                    {renderIllustration(currentPageData?.illustration)}
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
                      {renderIllustration("quantum_battle_ready")}
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
    'Bell States': 'quantum_entanglement'
  };
  return conceptMap[concept] || 'quantum_warrior_intro';
}
