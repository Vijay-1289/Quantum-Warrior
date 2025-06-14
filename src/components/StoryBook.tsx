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
        illustration: "intro",
        concept: "Introduction"
      },
      {
        id: 2,
        title: "The Story Unfolds",
        content: level.storyText,
        illustration: getIllustrationKey(level.concept),
        concept: level.concept
      }
    ];

    // Add pages for each challenge question with theoretical explanations
    const challengePages: StoryPage[] = challengeQuestions.map((question, index) => ({
      id: basePages.length + index + 1,
      title: `Key Concept ${index + 1}: ${question.topic}`,
      content: `${question.explanation}\n\nRemember this concept well - you'll need to apply this knowledge in your upcoming challenge! Understanding ${question.topic.toLowerCase()} is crucial for mastering ${level.concept}.`,
      illustration: getQuestionIllustrationKey(question.topic),
      concept: question.topic
    }));

    // Add learning objective pages
    const learningPages: StoryPage[] = level.learningObjectives.map((objective, index) => ({
      id: basePages.length + challengePages.length + index + 1,
      title: `Learning Goal ${index + 1}`,
      content: `${objective}. This connects directly to the challenge concepts you've just learned about. Apply these principles when facing your test!`,
      illustration: "learning",
      concept: `Learning Objective ${index + 1}`
    }));

    // Add final preparation page
    const finalPage: StoryPage = {
      id: basePages.length + challengePages.length + learningPages.length + 1,
      title: "Ready for the Challenge",
      content: `You now have all the theoretical knowledge needed to face the ${level.gameType} challenge ahead. You've learned about the key concepts that will be tested. Use your understanding of ${level.concept} to succeed! Remember the specific topics we covered - they will appear in your challenge.`,
      illustration: "challenge",
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
              {/* Left Page - SVG Illustration */}
              <div className="w-1/2 p-6 border-r-2 border-amber-200 relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50">
                <div 
                  className={`transform transition-all duration-300 ${
                    isFlipping ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
                  }`}
                >
                  <div className="h-full flex items-center justify-center">
                    {renderSVGIllustration(storyPages[currentPage]?.illustration)}
                  </div>
                </div>
              </div>

              {/* Right Page - Text Content */}
              <div className="w-1/2 p-6 relative overflow-hidden">
                {currentPage < totalPages - 1 ? (
                  <div 
                    className={`transform transition-all duration-300 ${
                      isFlipping ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
                    }`}
                  >
                    <h3 className="text-xl font-bold text-amber-900 mb-4 text-center border-b-2 border-amber-300 pb-2">
                      {storyPages[currentPage]?.title}
                    </h3>
                    <div className="text-amber-800 leading-relaxed text-sm space-y-3">
                      {storyPages[currentPage]?.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="text-justify">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-center">
                      {renderSVGIllustration("challenge")}
                      <h3 className="text-xl font-bold text-amber-900 mb-4 mt-4">Ready to Test Your Knowledge?</h3>
                      <p className="text-sm text-amber-700 mb-6">You've learned all the concepts needed for this challenge!</p>
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
                {currentPage + 1} / {totalPages}
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

// Helper function to render SVG illustrations
function renderSVGIllustration(key: string) {
  const illustrations: Record<string, JSX.Element> = {
    intro: (
      <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-lg">
        <defs>
          <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        {/* Quantum Warrior Character */}
        <circle cx="150" cy="120" r="40" fill="url(#heroGradient)" />
        <circle cx="135" cy="110" r="5" fill="white" />
        <circle cx="165" cy="110" r="5" fill="white" />
        <path d="M140 130 Q150 140 160 130" stroke="white" strokeWidth="2" fill="none" />
        <rect x="130" y="160" width="40" height="80" fill="url(#heroGradient)" rx="10" />
        <rect x="110" y="170" width="20" height="60" fill="url(#heroGradient)" rx="10" />
        <rect x="170" y="170" width="20" height="60" fill="url(#heroGradient)" rx="10" />
        <rect x="135" y="240" width="15" height="50" fill="url(#heroGradient)" rx="7" />
        <rect x="150" y="240" width="15" height="50" fill="url(#heroGradient)" rx="7" />
        {/* Quantum Energy */}
        <circle cx="80" cy="80" r="3" fill="#FFD700" opacity="0.8">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="220" cy="100" r="4" fill="#FF6B6B" opacity="0.8">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="90" cy="200" r="2" fill="#4ECDC4" opacity="0.8">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <text x="150" y="320" textAnchor="middle" fill="#6B46C1" fontSize="16" fontWeight="bold">Quantum Warrior</text>
      </svg>
    ),
    qubit: (
      <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-lg">
        <defs>
          <radialGradient id="qubitGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </radialGradient>
        </defs>
        {/* Bloch Sphere */}
        <circle cx="150" cy="200" r="80" fill="none" stroke="#3B82F6" strokeWidth="3" opacity="0.6" />
        <ellipse cx="150" cy="200" rx="80" ry="20" fill="none" stroke="#3B82F6" strokeWidth="2" opacity="0.4" />
        <line x1="70" y1="200" x2="230" y2="200" stroke="#3B82F6" strokeWidth="2" opacity="0.4" />
        <line x1="150" y1="120" x2="150" y2="280" stroke="#3B82F6" strokeWidth="2" opacity="0.4" />
        {/* Qubit Vector */}
        <line x1="150" y1="200" x2="190" y2="160" stroke="#FF6B6B" strokeWidth="4" markerEnd="url(#arrowhead)" />
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#FF6B6B" />
          </marker>
        </defs>
        {/* State Labels */}
        <text x="150" y="110" textAnchor="middle" fill="#3B82F6" fontSize="14" fontWeight="bold">|0⟩</text>
        <text x="150" y="295" textAnchor="middle" fill="#3B82F6" fontSize="14" fontWeight="bold">|1⟩</text>
        <text x="150" y="330" textAnchor="middle" fill="#6B46C1" fontSize="16" fontWeight="bold">Qubit State</text>
      </svg>
    ),
    superposition: (
      <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-lg">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        {/* Wave Function */}
        <path d="M50 200 Q100 150 150 200 T250 200" fill="none" stroke="url(#waveGradient)" strokeWidth="4">
          <animate attributeName="d" values="M50 200 Q100 150 150 200 T250 200;M50 200 Q100 250 150 200 T250 200;M50 200 Q100 150 150 200 T250 200" dur="3s" repeatCount="indefinite" />
        </path>
        {/* Probability Amplitudes */}
        <circle cx="80" cy="150" r="8" fill="#8B5CF6" opacity="0.8">
          <animate attributeName="cy" values="150;250;150" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="200" r="10" fill="#EC4899" opacity="0.8">
          <animate attributeName="r" values="10;15;10" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="220" cy="150" r="8" fill="#3B82F6" opacity="0.8">
          <animate attributeName="cy" values="150;250;150" dur="3s" repeatCount="indefinite" />
        </circle>
        <text x="150" y="100" textAnchor="middle" fill="#6B46C1" fontSize="14" fontWeight="bold">|0⟩ + |1⟩</text>
        <text x="150" y="330" textAnchor="middle" fill="#6B46C1" fontSize="16" fontWeight="bold">Superposition</text>
      </svg>
    ),
    entanglement: (
      <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-lg">
        <defs>
          <linearGradient id="entangleGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="100%" stopColor="#4ECDC4" />
          </linearGradient>
          <linearGradient id="entangleGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ECDC4" />
            <stop offset="100%" stopColor="#FF6B6B" />
          </linearGradient>
        </defs>
        {/* Two Entangled Particles */}
        <circle cx="100" cy="150" r="25" fill="url(#entangleGradient1)" opacity="0.8">
          <animate attributeName="r" values="25;30;25" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="250" r="25" fill="url(#entangleGradient2)" opacity="0.8">
          <animate attributeName="r" values="25;30;25" dur="2s" repeatCount="indefinite" begin="1s" />
        </circle>
        {/* Entanglement Connection */}
        <path d="M125 150 Q150 100 175 150 Q150 200 125 150" fill="none" stroke="#8B5CF6" strokeWidth="3" opacity="0.6">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M125 150 Q150 300 175 250" fill="none" stroke="#8B5CF6" strokeWidth="3" opacity="0.6">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
        </path>
        {/* Spooky Action Lines */}
        <line x1="90" y1="140" x2="210" y2="260" stroke="#FFD700" strokeWidth="2" opacity="0.4" strokeDasharray="5,5">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="1s" repeatCount="indefinite" />
        </line>
        <text x="150" y="80" textAnchor="middle" fill="#6B46C1" fontSize="16" fontWeight="bold">Entangled Qubits</text>
        <text x="150" y="350" textAnchor="middle" fill="#6B46C1" fontSize="14">Spooky Action at Distance</text>
      </svg>
    ),
    gates: (
      <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-lg">
        <defs>
          <linearGradient id="gateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        {/* Quantum Circuit */}
        <line x1="50" y1="150" x2="250" y2="150" stroke="#374151" strokeWidth="3" />
        <line x1="50" y1="250" x2="250" y2="250" stroke="#374151" strokeWidth="3" />
        
        {/* X Gate */}
        <rect x="90" y="130" width="40" height="40" fill="url(#gateGradient)" rx="5" />
        <text x="110" y="155" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">X</text>
        
        {/* H Gate */}
        <rect x="170" y="130" width="40" height="40" fill="url(#gateGradient)" rx="5" />
        <text x="190" y="155" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">H</text>
        
        {/* CNOT Gate */}
        <circle cx="110" cy="250" r="8" fill="#374151" />
        <line x1="110" y1="170" x2="110" y2="250" stroke="#374151" strokeWidth="3" />
        <circle cx="110" cy="250" r="15" fill="none" stroke="#374151" strokeWidth="3" />
        <line x1="105" y1="250" x2="115" y2="250" stroke="#374151" strokeWidth="3" />
        <line x1="110" y1="245" x2="110" y2="255" stroke="#374151" strokeWidth="3" />
        
        {/* Input/Output Labels */}
        <text x="30" y="155" textAnchor="middle" fill="#374151" fontSize="12">|0⟩</text>
        <text x="30" y="255" textAnchor="middle" fill="#374151" fontSize="12">|0⟩</text>
        <text x="270" y="155" textAnchor="middle" fill="#374151" fontSize="12">|ψ⟩</text>
        <text x="270" y="255" textAnchor="middle" fill="#374151" fontSize="12">|φ⟩</text>
        
        <text x="150" y="320" textAnchor="middle" fill="#6B46C1" fontSize="16" fontWeight="bold">Quantum Gates</text>
      </svg>
    ),
    challenge: (
      <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-lg">
        <defs>
          <radialGradient id="challengeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>
        </defs>
        {/* Trophy */}
        <ellipse cx="150" cy="200" rx="60" ry="40" fill="url(#challengeGradient)" />
        <rect x="130" y="240" width="40" height="60" fill="url(#challengeGradient)" rx="5" />
        <rect x="120" y="300" width="60" height="20" fill="#92400E" rx="10" />
        {/* Trophy Handles */}
        <ellipse cx="90" cy="180" rx="15" ry="25" fill="none" stroke="url(#challengeGradient)" strokeWidth="8" />
        <ellipse cx="210" cy="180" rx="15" ry="25" fill="none" stroke="url(#challengeGradient)" strokeWidth="8" />
        {/* Stars */}
        <polygon points="150,160 155,170 165,170 157,177 160,187 150,180 140,187 143,177 135,170 145,170" fill="#FFD700">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
        </polygon>
        <polygon points="110,120 113,126 119,126 114,130 116,136 110,132 104,136 106,130 101,126 107,126" fill="#FFD700">
          <animate attributeName="opacity" values="1;0.5;1" dur="1.2s" repeatCount="indefinite" />
        </polygon>
        <polygon points="190,120 193,126 199,126 194,130 196,136 190,132 184,136 186,130 181,126 187,126" fill="#FFD700">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="0.8s" repeatCount="indefinite" />
        </polygon>
        <text x="150" y="350" textAnchor="middle" fill="#6B46C1" fontSize="16" fontWeight="bold">Ready for Challenge!</text>
      </svg>
    ),
    learning: (
      <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-lg">
        <defs>
          <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#5B21B6" />
          </linearGradient>
        </defs>
        {/* Open Book */}
        <path d="M50 150 Q150 120 250 150 L250 280 Q150 250 50 280 Z" fill="url(#bookGradient)" opacity="0.8" />
        <path d="M50 150 Q150 120 250 150 L250 160 Q150 130 50 160 Z" fill="#8B5CF6" opacity="0.6" />
        {/* Book Pages */}
        <rect x="70" y="170" width="60" height="80" fill="white" opacity="0.9" rx="2" />
        <rect x="170" y="170" width="60" height="80" fill="white" opacity="0.9" rx="2" />
        {/* Text Lines */}
        <line x1="75" y1="180" x2="120" y2="180" stroke="#374151" strokeWidth="2" />
        <line x1="75" y1="190" x2="125" y2="190" stroke="#374151" strokeWidth="2" />
        <line x1="75" y1="200" x2="115" y2="200" stroke="#374151" strokeWidth="2" />
        <line x1="175" y1="180" x2="220" y2="180" stroke="#374151" strokeWidth="2" />
        <line x1="175" y1="190" x2="225" y2="190" stroke="#374151" strokeWidth="2" />
        <line x1="175" y1="200" x2="215" y2="200" stroke="#374151" strokeWidth="2" />
        {/* Learning Bulb */}
        <circle cx="150" cy="100" r="20" fill="#FCD34D" opacity="0.8">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        <rect x="145" y="120" width="10" height="15" fill="#92400E" rx="2" />
        <text x="150" y="320" textAnchor="middle" fill="#6B46C1" fontSize="16" fontWeight="bold">Learn & Grow</text>
      </svg>
    )
  };

  return illustrations[key] || illustrations.intro;
}

// Helper functions for mapping concepts to illustration keys
function getIllustrationKey(concept: string): string {
  const conceptMap: Record<string, string> = {
    'Classical vs Quantum': 'intro',
    'Quantum Basics': 'qubit',
    'Wave-Particle Duality': 'superposition',
    'Quantum Probability': 'qubit',
    'Superposition Paradox': 'superposition',
    'Heisenberg Uncertainty': 'superposition',
    'Discrete Energy States': 'qubit',
    'Quantum Light': 'superposition',
    'Computing Paradigms': 'gates',
    'Quantum Revolution': 'challenge',
    'Quantum Bit Basics': 'qubit',
    'Qubit Visualization': 'qubit',
    'Computational Basis': 'qubit',
    'Linear Combinations': 'superposition',
    'Quantum Measurement': 'qubit',
    'Quantum Phase': 'superposition',
    'Multi-Qubit Systems': 'entanglement',
    'State Preparation': 'gates',
    'Quantum Coherence': 'superposition',
    'Qubit Technologies': 'gates'
  };
  return conceptMap[concept] || 'intro';
}

function getQuestionIllustrationKey(topic: string): string {
  const topicMap: Record<string, string> = {
    'What is a Qubit?': 'qubit',
    'Understanding Superposition': 'superposition',
    'The Measurement Process': 'qubit',
    'The X Gate (NOT Gate)': 'gates',
    'Creating Superposition with Hadamard': 'gates',
    'Gate Sequences and Reversibility': 'gates',
    'What is Quantum Entanglement?': 'entanglement',
    "Einstein's 'Spooky Action'": 'entanglement',
    'Bell States - Maximum Entanglement': 'entanglement',
    'Understanding Pixels': 'learning',
    'RGB Color Model': 'learning',
    'Image Filtering Fundamentals': 'learning',
    "Grover's Search Algorithm": 'gates',
    "Shor's Factoring Algorithm": 'gates',
    'Quantum Parallelism and Interference': 'superposition',
    'Quantum Image Processing Potential': 'learning',
    'Classical to Quantum State Conversion': 'gates',
    'Quantum Pattern Recognition': 'learning'
  };
  return topicMap[topic] || 'learning';
}
