
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

  // Get challenge questions for this level to include theoretical explanations
  const getChallengeQuestions = (levelId: number) => {
    const questions = {
      1: [
        {
          topic: "What is a Qubit?",
          explanation: "A qubit (quantum bit) is the fundamental unit of quantum information. Unlike classical bits that are either 0 or 1, qubits can exist in a superposition of both states simultaneously. This is the key to quantum computing's power."
        },
        {
          topic: "Understanding Superposition",
          explanation: "Superposition allows a qubit to be in multiple states at once until measured. It's like Schrödinger's cat being both alive and dead - the qubit exists in all possibilities simultaneously."
        },
        {
          topic: "The Measurement Process",
          explanation: "When you measure a qubit in superposition, it collapses to a definite state (0 or 1) with certain probabilities. This collapse is fundamental to how quantum computers extract information."
        }
      ],
      2: [
        {
          topic: "The X Gate (NOT Gate)",
          explanation: "The X gate is the quantum equivalent of the classical NOT gate. It flips |0⟩ to |1⟩ and |1⟩ to |0⟩. It's one of the most basic quantum operations you'll use."
        },
        {
          topic: "Creating Superposition with Hadamard",
          explanation: "The Hadamard gate (H) creates equal superposition from definite states. It transforms |0⟩ into (|0⟩ + |1⟩)/√2, putting the qubit in a perfect 50-50 superposition."
        },
        {
          topic: "Gate Sequences and Reversibility",
          explanation: "Quantum gates are reversible. Applying two X gates in sequence returns the qubit to its original state: X(X|ψ⟩) = |ψ⟩. This reversibility is crucial for quantum computation."
        }
      ],
      3: [
        {
          topic: "What is Quantum Entanglement?",
          explanation: "Entanglement creates a mysterious connection between particles where measuring one instantly affects the other, regardless of distance. It's a purely quantum phenomenon with no classical equivalent."
        },
        {
          topic: "Einstein's 'Spooky Action'",
          explanation: "Einstein called entanglement 'spooky action at a distance' because it seemed to violate locality. However, experiments have confirmed that entanglement is real and fundamental to quantum mechanics."
        },
        {
          topic: "Bell States - Maximum Entanglement",
          explanation: "Bell states are the four maximally entangled quantum states of two qubits. They demonstrate the strongest form of quantum correlation and are foundational for quantum protocols."
        }
      ],
      4: [
        {
          topic: "Understanding Pixels",
          explanation: "A pixel (picture element) is the smallest controllable element of a digital image. Images are composed of thousands or millions of pixels arranged in a grid, each with color information."
        },
        {
          topic: "RGB Color Model",
          explanation: "RGB represents Red, Green, and Blue - the three primary colors of light. Each pixel has values for these components (typically 0-255), which combine to create all visible colors."
        },
        {
          topic: "Image Filtering Fundamentals",
          explanation: "Image filtering applies mathematical operations to modify images - like blurring, sharpening, or edge detection. Filters are mathematical tools that transform raw images into enhanced visuals."
        }
      ],
      5: [
        {
          topic: "Grover's Search Algorithm",
          explanation: "Grover's algorithm provides quadratic speedup for searching unsorted databases. While classical algorithms need O(N) time, Grover's algorithm needs only O(√N) time through quantum parallelism."
        },
        {
          topic: "Shor's Factoring Algorithm",
          explanation: "Shor's algorithm can factor large integers exponentially faster than classical algorithms. This threatens current cryptographic systems but opens doors to new quantum cryptography methods."
        },
        {
          topic: "Quantum Parallelism and Interference",
          explanation: "Quantum algorithms leverage superposition to explore many possibilities simultaneously (quantum parallelism) and use interference to amplify correct answers while canceling wrong ones."
        }
      ],
      6: [
        {
          topic: "Quantum Image Processing Potential",
          explanation: "Quantum computing can theoretically process multiple image transformations in superposition, offering exponential speedups for certain image analysis tasks through quantum parallelism."
        },
        {
          topic: "Classical to Quantum State Conversion",
          explanation: "A major challenge is efficiently encoding classical image data into quantum states while preserving information needed for processing. Various quantum image representations are being researched."
        },
        {
          topic: "Quantum Pattern Recognition",
          explanation: "Quantum entanglement could enable detection of correlated patterns across different parts of images simultaneously, potentially revolutionizing computer vision and AI applications."
        }
      ]
    };

    return questions[levelId as keyof typeof questions] || questions[1];
  };

  // Generate story pages based on level content with integrated challenge concepts
  const generateStoryPages = (level: QuantumLevel): StoryPage[] => {
    const challengeQuestions = getChallengeQuestions(level.id);
    
    const basePages: StoryPage[] = [
      {
        id: 1,
        title: "The Journey Begins",
        content: `Welcome to Level ${level.id}: ${level.title}. In this chapter of your quantum adventure, you'll discover the mysteries of ${level.concept}. Pay close attention to the concepts ahead - they will be essential for your upcoming challenge!`,
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

    // Add pages for each challenge question with theoretical explanations
    const challengePages: StoryPage[] = challengeQuestions.map((question, index) => ({
      id: basePages.length + index + 1,
      title: `Key Concept ${index + 1}: ${question.topic}`,
      content: `${question.explanation}\n\nRemember this concept well - you'll need to apply this knowledge in your upcoming challenge! Understanding ${question.topic.toLowerCase()} is crucial for mastering ${level.concept}.`,
      illustration: getQuestionIllustration(question.topic),
      concept: question.topic
    }));

    // Add learning objective pages
    const learningPages: StoryPage[] = level.learningObjectives.map((objective, index) => ({
      id: basePages.length + challengePages.length + index + 1,
      title: `Learning Goal ${index + 1}`,
      content: `${objective}. This connects directly to the challenge concepts you've just learned about. Apply these principles when facing your test!`,
      illustration: getObjectiveIllustration(index),
      concept: `Learning Objective ${index + 1}`
    }));

    // Add final preparation page
    const finalPage: StoryPage = {
      id: basePages.length + challengePages.length + learningPages.length + 1,
      title: "Ready for the Challenge",
      content: `You now have all the theoretical knowledge needed to face the ${level.gameType} challenge ahead. You've learned about the key concepts that will be tested. Use your understanding of ${level.concept} to succeed! Remember the specific topics we covered - they will appear in your challenge.`,
      illustration: "⚔️",
      concept: "Challenge Preparation"
    };

    return [...basePages, ...challengePages, ...learningPages, finalPage];
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
                    <span className="text-4xl">{storyPages[currentPage]?.illustration}</span>
                  </div>
                  <h3 className="text-lg font-bold text-amber-900 mb-3 text-center">
                    {storyPages[currentPage]?.title}
                  </h3>
                  <div className="text-amber-800 leading-relaxed text-xs">
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
                      <span className="text-4xl">{storyPages[currentPage + 1]?.illustration}</span>
                    </div>
                    <h3 className="text-lg font-bold text-amber-900 mb-3 text-center">
                      {storyPages[currentPage + 1]?.title}
                    </h3>
                    <div className="text-amber-800 leading-relaxed text-xs">
                      {storyPages[currentPage + 1]?.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-center">
                      <span className="text-6xl block mb-4">🎯</span>
                      <h3 className="text-xl font-bold text-amber-900 mb-4">Ready to Test Your Knowledge?</h3>
                      <p className="text-sm text-amber-700 mb-4">You've learned all the concepts needed for this challenge!</p>
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

function getQuestionIllustration(topic: string): string {
  const topicMap: Record<string, string> = {
    'What is a Qubit?': '🎯',
    'Understanding Superposition': '🌀',
    'The Measurement Process': '👁️',
    'The X Gate (NOT Gate)': '🔄',
    'Creating Superposition with Hadamard': '➕',
    'Gate Sequences and Reversibility': '🔁',
    'What is Quantum Entanglement?': '🔗',
    "Einstein's 'Spooky Action'": '👻',
    'Bell States - Maximum Entanglement': '💫',
    'Understanding Pixels': '📺',
    'RGB Color Model': '🌈',
    'Image Filtering Fundamentals': '🖼️',
    "Grover's Search Algorithm": '🔍',
    "Shor's Factoring Algorithm": '🔢',
    'Quantum Parallelism and Interference': '⚡',
    'Quantum Image Processing Potential': '🖥️',
    'Classical to Quantum State Conversion': '🔄',
    'Quantum Pattern Recognition': '🧠'
  };
  return topicMap[topic] || '💡';
}

function getObjectiveIllustration(index: number): string {
  const illustrations = ['📚', '🎓', '🧠', '💡', '🔍', '⚡', '🎯', '🛡️'];
  return illustrations[index % illustrations.length];
}
