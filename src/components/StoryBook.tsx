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

  // Generate more accurate challenge questions based on level concepts
  const getChallengeQuestions = (levelId: number) => {
    const questionBank: Record<number, Array<{topic: string, explanation: string}>> = {
      1: [
        {
          topic: "What is a Qubit?",
          explanation: "A qubit is the fundamental unit of quantum information. Unlike classical bits that exist as either 0 or 1, qubits can exist in a superposition of both states simultaneously. This quantum property enables exponential computational advantages."
        },
        {
          topic: "Understanding Superposition",
          explanation: "Superposition is the quantum phenomenon where a particle exists in multiple states simultaneously until measured. For qubits, this means being in a combination of |0⟩ and |1⟩ states, mathematically represented as α|0⟩ + β|1⟩ where |α|² + |β|² = 1."
        },
        {
          topic: "Quantum Measurement",
          explanation: "When a qubit in superposition is measured, it collapses to either |0⟩ or |1⟩ with probabilities determined by the amplitudes. This probabilistic nature is fundamental to quantum mechanics and differs from classical deterministic measurements."
        }
      ],
      2: [
        {
          topic: "Pauli-X Gate (NOT Gate)",
          explanation: "The X gate is the quantum analog of the classical NOT gate. It flips |0⟩ to |1⟩ and |1⟩ to |0⟩. Mathematically, it's represented by the Pauli-X matrix [[0,1],[1,0]] and performs a bit-flip operation on the computational basis."
        },
        {
          topic: "Hadamard Gate - Creating Superposition",
          explanation: "The Hadamard gate creates equal superposition from basis states. It transforms |0⟩ → (|0⟩ + |1⟩)/√2 and |1⟩ → (|0⟩ - |1⟩)/√2. This gate is essential for quantum algorithms as it enables quantum parallelism."
        },
        {
          topic: "Gate Unitarity and Reversibility",
          explanation: "All quantum gates are unitary matrices, meaning they preserve probability amplitudes and are reversible. The inverse of any quantum gate can undo its operation, unlike classical irreversible gates."
        }
      ],
      3: [
        {
          topic: "Quantum Entanglement Fundamentals",
          explanation: "Entanglement creates quantum correlations between particles where measuring one instantly determines the state of the other, regardless of distance. This non-local connection is a purely quantum phenomenon with no classical equivalent."
        },
        {
          topic: "Bell States and Maximum Entanglement",
          explanation: "The four Bell states represent maximally entangled two-qubit systems: |Φ±⟩ = (|00⟩ ± |11⟩)/√2 and |Ψ±⟩ = (|01⟩ ± |10⟩)/√2. These states exhibit perfect correlation and are fundamental to quantum protocols."
        },
        {
          topic: "CNOT Gate for Entanglement Creation",
          explanation: "The Controlled-NOT (CNOT) gate creates entanglement between qubits. It flips the target qubit if the control qubit is |1⟩. When applied to |+0⟩ (where |+⟩ = (|0⟩ + |1⟩)/√2), it produces the entangled Bell state |Φ+⟩."
        }
      ],
      4: [
        {
          topic: "Classical vs Quantum Image Representation",
          explanation: "Classical images use pixels with definite RGB values (0-255). Quantum image processing encodes pixel information in qubit amplitudes, potentially allowing superposition of multiple image states for parallel processing of different image transformations."
        },
        {
          topic: "Quantum Image Encoding Schemes",
          explanation: "NEQR (Novel Enhanced Quantum Representation) and FRQI (Flexible Representation of Quantum Images) are methods to encode classical images into quantum states, where pixel positions and intensities are stored in qubit superpositions."
        },
        {
          topic: "Quantum Fourier Transform for Images",
          explanation: "The Quantum Fourier Transform (QFT) can analyze frequency components of quantum-encoded images exponentially faster than classical FFT, enabling advanced quantum image processing applications like pattern recognition and compression."
        }
      ],
      5: [
        {
          topic: "Grover's Search Algorithm Mechanics",
          explanation: "Grover's algorithm searches unsorted databases in O(√N) time using amplitude amplification. It repeatedly applies the Grover operator (oracle + diffusion) to amplify correct answer amplitudes while diminishing incorrect ones."
        },
        {
          topic: "Quantum Oracle Functions",
          explanation: "An oracle in quantum computing is a 'black box' that marks target items by flipping their phase. For search problems, the oracle flips the phase of the target state |x⟩ → -|x⟩, setting up the amplitude amplification process."
        },
        {
          topic: "Amplitude Amplification Process",
          explanation: "The diffusion operator reflects amplitudes about their average, combined with the oracle phase flip. This geometric rotation in the amplitude space systematically increases the probability of measuring the target state."
        }
      ],
      6: [
        {
          topic: "Quantum Speedup in Image Processing",
          explanation: "Quantum algorithms can theoretically process multiple image transformations simultaneously through superposition, offering exponential speedups for certain operations like searching, pattern matching, and feature extraction."
        },
        {
          topic: "Quantum Edge Detection",
          explanation: "Quantum edge detection algorithms use quantum operators to identify pixel intensity gradients. The quantum approach can potentially analyze multiple edge detection kernels in superposition, processing various edge types simultaneously."
        },
        {
          topic: "Quantum Pattern Recognition",
          explanation: "Quantum machine learning algorithms for pattern recognition in images leverage quantum entanglement and superposition to potentially recognize multiple patterns simultaneously, offering advantages in computer vision tasks."
        }
      ]
    };

    return questionBank[levelId] || questionBank[1];
  };

  // Generate story pages with more detailed quantum concepts
  const generateStoryPages = (level: QuantumLevel): StoryPage[] => {
    const challengeQuestions = getChallengeQuestions(level.id);
    
    const basePages: StoryPage[] = [
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
        content: level.storyText,
        illustration: getAdvancedIllustrationKey(level.concept),
        concept: level.concept
      }
    ];

    // Add detailed theoretical pages for each challenge concept
    const challengePages: StoryPage[] = challengeQuestions.map((question, index) => ({
      id: basePages.length + index + 1,
      title: `Quantum Wisdom ${index + 1}: ${question.topic}`,
      content: `The ancient quantum scrolls reveal:\n\n${question.explanation}\n\nThis knowledge is crucial for your upcoming trial. The Quantum Villain will test your understanding of these very concepts. Study well, for mastery of ${question.topic.toLowerCase()} will determine your success in the quantum challenge ahead!`,
      illustration: getConceptIllustrationKey(question.topic),
      concept: question.topic
    }));

    // Add learning objectives as quest goals
    const learningPages: StoryPage[] = level.learningObjectives.map((objective, index) => ({
      id: basePages.length + challengePages.length + index + 1,
      title: `Quest Objective ${index + 1}`,
      content: `Your mission: ${objective}\n\nThis objective connects directly to the quantum principles you've learned. The Quantum Villain has crafted challenges that will test your mastery of these very concepts. Remember the theoretical foundations - they are your weapons in the battle ahead!`,
      illustration: "quest_objective",
      concept: `Quest ${index + 1}`
    }));

    // Final preparation page
    const finalPage: StoryPage = {
      id: basePages.length + challengePages.length + learningPages.length + 1,
      title: "Ready for the Quantum Battle",
      content: `You are now armed with the quantum knowledge necessary to face the ${level.gameType} challenge.\n\nYou have studied the theoretical foundations, understood the mathematical principles, and learned the practical applications. The Quantum Villain awaits, but you are prepared!\n\nRemember: Every question in your challenge relates directly to the concepts you've just mastered. Trust in your quantum wisdom!`,
      illustration: "quantum_battle_ready",
      concept: "Final Preparation"
    };

    return [...basePages, ...challengePages, ...learningPages, finalPage];
  };

  const storyPages = generateStoryPages(level);
  const totalPages = storyPages.length;

  useEffect(() => {
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
                    {renderAdvancedSVGIllustration(storyPages[currentPage]?.illustration)}
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
                    <div className="text-amber-800 leading-relaxed text-sm space-y-3 overflow-y-auto max-h-80">
                      {storyPages[currentPage]?.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="text-justify">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ) : (
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

            <div className="absolute bottom-2 left-6 text-xs text-amber-600">
              {currentPage + 1}
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
          </linearGradient>
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
    quantum_entanglement: (
      <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-lg">
        <defs>
          <radialGradient id="entangle1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="100%" stopColor="#4ECDC4" />
          </radialGradient>
          <radialGradient id="entangle2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4ECDC4" />
            <stop offset="100%" stopColor="#FF6B6B" />
          </radialGradient>
        </defs>
        {/* Entangled Qubits */}
        <circle cx="100" cy="150" r="30" fill="url(#entangle1)" opacity="0.8">
          <animate attributeName="r" values="30;35;30" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="250" r="30" fill="url(#entangle2)" opacity="0.8">
          <animate attributeName="r" values="30;35;30" dur="2s" repeatCount="indefinite" begin="1s" />
        </circle>
        {/* Quantum Correlation Lines */}
        <path d="M130 150 Q150 100 170 150 Q150 200 130 150" fill="none" stroke="#8B5CF6" strokeWidth="4" opacity="0.7">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M130 150 Q150 300 170 250" fill="none" stroke="#EC4899" strokeWidth="4" opacity="0.7">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
        </path>
        {/* Bell State Notation */}
        <text x="150" y="80" textAnchor="middle" fill="#6B46C1" fontSize="14" fontWeight="bold">|Φ+⟩ = (|00⟩ + |11⟩)/√2</text>
        <text x="150" y="350" textAnchor="middle" fill="#6B46C1" fontSize="16" fontWeight="bold">Quantum Entanglement</text>
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
    'Computing Paradigms': 'quantum_gates',
    'Quantum Revolution': 'quantum_battle_ready',
    'Quantum Bit Basics': 'quantum_superposition',
    'Qubit Visualization': 'quantum_superposition',
    'Computational Basis': 'quantum_superposition',
    'Linear Combinations': 'quantum_superposition',
    'Quantum Measurement': 'quantum_superposition',
    'Quantum Phase': 'quantum_superposition',
    'Multi-Qubit Systems': 'quantum_entanglement',
    'State Preparation': 'quantum_gates',
    'Quantum Coherence': 'quantum_superposition',
    'Qubit Technologies': 'quantum_gates'
  };
  return conceptMap[concept] || 'quantum_warrior_intro';
}

function getConceptIllustrationKey(topic: string): string {
  const topicMap: Record<string, string> = {
    'What is a Qubit?': 'quantum_superposition',
    'Understanding Superposition': 'quantum_superposition',
    'Quantum Measurement': 'quantum_superposition',
    'Pauli-X Gate (NOT Gate)': 'quantum_gates',
    'Hadamard Gate - Creating Superposition': 'quantum_gates',
    'Gate Unitarity and Reversibility': 'quantum_gates',
    'Quantum Entanglement Fundamentals': 'quantum_entanglement',
    'Bell States and Maximum Entanglement': 'quantum_entanglement',
    'CNOT Gate for Entanglement Creation': 'quantum_entanglement',
    'Classical vs Quantum Image Representation': 'quest_objective',
    'Quantum Image Encoding Schemes': 'quest_objective',
    'Quantum Fourier Transform for Images': 'quest_objective',
    "Grover's Search Algorithm Mechanics": 'quantum_gates',
    'Quantum Oracle Functions': 'quantum_gates',
    'Amplitude Amplification Process': 'quantum_superposition',
    'Quantum Speedup in Image Processing': 'quest_objective',
    'Quantum Edge Detection': 'quest_objective',
    'Quantum Pattern Recognition': 'quest_objective'
  };
  return topicMap[topic] || 'quest_objective';
}
