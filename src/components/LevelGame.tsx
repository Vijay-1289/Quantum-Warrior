
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Lightbulb, Zap, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Level {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  concept: string;
  icon: React.ComponentType<any>;
  color: string;
  unlocked: boolean;
}

interface LevelGameProps {
  level: Level;
  onComplete: (score: number) => void;
}

export const LevelGame: React.FC<LevelGameProps> = ({ level, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const { toast } = useToast();

  const getQuestionsForLevel = (levelId: number) => {
    const questions = {
      1: [ // Qubits & Superposition
        {
          question: "What is the fundamental unit of quantum information?",
          options: ["Bit", "Qubit", "Byte", "Gate"],
          correct: "Qubit",
          explanation: "A qubit (quantum bit) is the basic unit of quantum information. Unlike classical bits that are either 0 or 1, qubits can exist in a superposition of both states simultaneously!"
        },
        {
          question: "What allows a qubit to be in multiple states at once?",
          options: ["Entanglement", "Superposition", "Decoherence", "Measurement"],
          correct: "Superposition",
          explanation: "Superposition is the quantum mechanical principle that allows particles to exist in multiple states simultaneously until measured. It's like Schrödinger's cat being both alive and dead!"
        },
        {
          question: "When you measure a qubit in superposition, what happens?",
          options: ["It stays in superposition", "It collapses to a definite state", "It disappears", "It duplicates"],
          correct: "It collapses to a definite state",
          explanation: "Measurement causes the quantum state to collapse from superposition into one of the possible definite states (0 or 1) with certain probabilities."
        }
      ],
      2: [ // Basic Quantum Gates
        {
          question: "What does the X gate do to a qubit?",
          options: ["Rotates it", "Flips it (NOT operation)", "Measures it", "Entangles it"],
          correct: "Flips it (NOT operation)",
          explanation: "The X gate is the quantum equivalent of the classical NOT gate. It flips |0⟩ to |1⟩ and |1⟩ to |0⟩."
        },
        {
          question: "Which gate creates superposition from a definite state?",
          options: ["X Gate", "Y Gate", "Z Gate", "Hadamard Gate"],
          correct: "Hadamard Gate",
          explanation: "The Hadamard gate (H) creates an equal superposition. It transforms |0⟩ into (|0⟩ + |1⟩)/√2 and |1⟩ into (|0⟩ - |1⟩)/√2."
        },
        {
          question: "What happens when you apply two X gates in sequence?",
          options: ["The qubit is destroyed", "Nothing - it returns to original state", "It creates superposition", "It measures the qubit"],
          correct: "Nothing - it returns to original state",
          explanation: "The X gate is its own inverse. Applying it twice returns the qubit to its original state: X(X|ψ⟩) = |ψ⟩."
        }
      ],
      3: [ // Entanglement
        {
          question: "What is quantum entanglement?",
          options: ["When qubits get tangled up", "A correlation between particles that persists over distance", "A type of quantum gate", "A measurement technique"],
          correct: "A correlation between particles that persists over distance",
          explanation: "Entanglement creates a mysterious connection between particles where measuring one instantly affects the other, regardless of the distance between them!"
        },
        {
          question: "What did Einstein call entanglement?",
          options: ["Quantum magic", "Spooky action at a distance", "Impossible physics", "Quantum telepathy"],
          correct: "Spooky action at a distance",
          explanation: "Einstein was uncomfortable with entanglement and called it 'spooky action at a distance' because it seemed to violate locality - the idea that objects are only affected by their immediate surroundings."
        },
        {
          question: "What is a Bell state?",
          options: ["A type of quantum gate", "A maximally entangled state of two qubits", "A measurement device", "A quantum algorithm"],
          correct: "A maximally entangled state of two qubits",
          explanation: "Bell states are the four maximally entangled quantum states of two qubits. They form the foundation for many quantum protocols and demonstrate the strongest form of quantum correlation."
        }
      ],
      4: [ // Image Processing Basics
        {
          question: "What is a pixel?",
          options: ["A type of camera", "The smallest unit of a digital image", "A color filter", "An image format"],
          correct: "The smallest unit of a digital image",
          explanation: "A pixel (picture element) is the smallest controllable element of a picture. Digital images are composed of thousands or millions of pixels arranged in a grid."
        },
        {
          question: "What does RGB stand for in digital images?",
          options: ["Red, Green, Blue", "Red, Gray, Black", "Real, Generated, Bitmap", "Resolution, Gamma, Brightness"],
          correct: "Red, Green, Blue",
          explanation: "RGB represents the three primary colors of light. Each pixel in an RGB image has values for red, green, and blue components, typically ranging from 0 to 255."
        },
        {
          question: "What is image filtering used for?",
          options: ["Deleting images", "Enhancing or modifying image features", "Compressing files", "Changing file formats"],
          correct: "Enhancing or modifying image features",
          explanation: "Image filtering applies mathematical operations to modify images - like blurring, sharpening, edge detection, or noise reduction. Filters are the tools that transform raw images into enhanced visuals!"
        }
      ],
      5: [ // Quantum Algorithms
        {
          question: "What is Grover's algorithm used for?",
          options: ["Factoring large numbers", "Searching unsorted databases", "Creating entanglement", "Measuring qubits"],
          correct: "Searching unsorted databases",
          explanation: "Grover's algorithm provides a quadratic speedup for searching unsorted databases. While classical algorithms need O(N) time, Grover's algorithm needs only O(√N) time!"
        },
        {
          question: "What is Shor's algorithm famous for?",
          options: ["Image processing", "Database searching", "Factoring large integers", "Creating random numbers"],
          correct: "Factoring large integers",
          explanation: "Shor's algorithm can factor large integers exponentially faster than classical algorithms. This threatens current cryptographic systems but also opens doors to new quantum cryptography!"
        },
        {
          question: "What gives quantum algorithms their power?",
          options: ["Faster processors", "Quantum parallelism and interference", "Better programming", "More memory"],
          correct: "Quantum parallelism and interference",
          explanation: "Quantum algorithms leverage superposition to explore many possibilities simultaneously (quantum parallelism) and use interference to amplify correct answers while canceling wrong ones."
        }
      ],
      6: [ // Quantum Image Processing
        {
          question: "How can quantum computing help with image processing?",
          options: ["By storing more images", "By processing multiple image states simultaneously", "By making images smaller", "By changing image colors"],
          correct: "By processing multiple image states simultaneously",
          explanation: "Quantum image processing can theoretically process multiple image transformations in superposition, potentially offering exponential speedups for certain image analysis tasks!"
        },
        {
          question: "What is the main challenge in quantum image processing?",
          options: ["Lack of quantum computers", "Converting classical images to quantum states", "Images are too colorful", "Quantum computers can't display images"],
          correct: "Converting classical images to quantum states",
          explanation: "A major challenge is efficiently encoding classical image data into quantum states while preserving the information needed for processing. Various quantum image representations are being researched!"
        },
        {
          question: "What quantum property could revolutionize pattern recognition?",
          options: ["Decoherence", "Quantum entanglement for correlated feature detection", "Measurement", "Classical interference"],
          correct: "Quantum entanglement for correlated feature detection",
          explanation: "Quantum entanglement could enable the detection of correlated patterns across different parts of images simultaneously, potentially revolutionizing computer vision and AI!"
        }
      ]
    };

    return questions[levelId as keyof typeof questions] || questions[1];
  };

  const questions = getQuestionsForLevel(level.id);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 100);
      toast({
        title: "Correct! 🎉",
        description: "You're mastering quantum concepts!",
      });
    } else {
      toast({
        title: "Not quite right",
        description: "Don't worry, learning is a journey!",
        variant: "destructive"
      });
    }

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setGameComplete(true);
    }
  };

  const handleCompleteLevel = () => {
    const finalScore = score + (questions.length - currentQuestion - 1) * 50; // Bonus for completion
    onComplete(finalScore);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (gameComplete) {
    return (
      <Card className="bg-gradient-to-br from-green-900/50 to-blue-900/50 backdrop-blur-lg border-green-500/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-400" />
          </div>
          <CardTitle className="text-2xl text-white">Level Complete!</CardTitle>
          <CardDescription className="text-gray-300">
            You've mastered {level.concept}!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <div className="text-4xl font-bold text-yellow-400 mb-2">{score}</div>
            <p className="text-gray-300">Final Score</p>
          </div>
          <Button 
            onClick={handleCompleteLevel}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            Continue Journey
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-300">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Question Card */}
      <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            <Badge className="bg-purple-600/20 text-purple-300">
              {level.concept}
            </Badge>
          </div>
          <CardTitle className="text-xl text-white">
            {questions[currentQuestion].question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 mb-6">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`text-left justify-start h-auto p-4 ${
                  selectedAnswer === option 
                    ? 'bg-purple-600 border-purple-400 text-white' 
                    : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50'
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={showExplanation}
              >
                <span className="font-semibold mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </Button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <Card className={`mb-4 ${
              selectedAnswer === questions[currentQuestion].correct
                ? 'bg-green-900/20 border-green-500/30'
                : 'bg-red-900/20 border-red-500/30'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {selectedAnswer === questions[currentQuestion].correct ? (
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold text-white mb-2">
                      {selectedAnswer === questions[currentQuestion].correct ? 'Correct!' : 'Incorrect'}
                    </p>
                    <p className="text-gray-300 text-sm">
                      {questions[currentQuestion].explanation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            {!showExplanation ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Target className="h-4 w-4 mr-2" />
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Level'}
                <Zap className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
