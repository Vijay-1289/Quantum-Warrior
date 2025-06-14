
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, CheckCircle, XCircle, Lightbulb, Zap, Eye, MousePointer, Target } from 'lucide-react';
import { type QuantumLevel } from '@/data/quantumLevels';
import { useToast } from '@/hooks/use-toast';

interface QuantumMiniGameProps {
  level: QuantumLevel;
  onComplete: (stars: number) => void;
  onBack: () => void;
}

export const QuantumMiniGame: React.FC<QuantumMiniGameProps> = ({ level, onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [draggedItems, setDraggedItems] = useState<string[]>([]);
  const [clickedElements, setClickedElements] = useState<string[]>([]);
  const { toast } = useToast();

  // Generate concept-specific questions based on level
  const generateConceptQuestions = (level: QuantumLevel) => {
    const conceptQuestions: { [key: string]: any[] } = {
      "Classical vs Quantum": [
        {
          type: 'quiz',
          question: `What is the key difference between classical and quantum bits?`,
          options: ["Classical bits can be 0 or 1, quantum bits can be both", "No difference", "Classical is faster", "Quantum uses more memory"],
          correct: "Classical bits can be 0 or 1, quantum bits can be both",
          explanation: "Classical bits are deterministic (0 or 1), while qubits can exist in superposition of both states simultaneously."
        },
        {
          type: 'simulation',
          question: "Click on the elements that represent quantum properties:",
          elements: ["Superposition", "Deterministic", "Entanglement", "Binary States", "Probability", "Certainty"],
          correct: ["Superposition", "Entanglement", "Probability"],
          explanation: "Quantum systems exhibit superposition, entanglement, and probabilistic behavior."
        }
      ],
      "Quantum Basics": [
        {
          type: 'quiz',
          question: `What allows quantum particles to exist in multiple states?`,
          options: ["Superposition", "Classical physics", "Magnetism", "Electricity"],
          correct: "Superposition",
          explanation: "Superposition is the quantum principle that allows particles to exist in multiple states simultaneously."
        },
        {
          type: 'drag-drop',
          question: "Arrange these quantum concepts from basic to advanced:",
          items: ["Quantum States", "Superposition", "Entanglement", "Quantum Computing"],
          correct: ["Quantum States", "Superposition", "Entanglement", "Quantum Computing"],
          explanation: "The progression goes from understanding basic quantum states to complex quantum computing applications."
        }
      ],
      "Wave-Particle Duality": [
        {
          type: 'quiz',
          question: `In the double-slit experiment, what happens when we don't observe the particle?`,
          options: ["Creates interference pattern", "Goes through one slit", "Disappears", "Splits in half"],
          correct: "Creates interference pattern",
          explanation: "Without observation, particles behave as waves and create interference patterns through both slits."
        },
        {
          type: 'simulation',
          question: "Click on the wave-like behaviors of light:",
          elements: ["Interference", "Particle Collision", "Diffraction", "Point Impact", "Wave Propagation", "Discrete Packets"],
          correct: ["Interference", "Diffraction", "Wave Propagation"],
          explanation: "Light shows wave-like behavior through interference, diffraction, and wave propagation."
        }
      ],
      "Quantum Bit Basics": [
        {
          type: 'quiz',
          question: `What is a qubit?`,
          options: ["Quantum bit - basic unit of quantum information", "Classical bit", "Computer memory", "Data storage"],
          correct: "Quantum bit - basic unit of quantum information",
          explanation: "A qubit is the fundamental unit of quantum information, capable of existing in superposition."
        },
        {
          type: 'visualization',
          question: "Identify which states a qubit can exist in:",
          elements: ["|0⟩", "|1⟩", "Both |0⟩ and |1⟩", "Neither", "Classical 0", "Classical 1"],
          correct: ["|0⟩", "|1⟩", "Both |0⟩ and |1⟩"],
          explanation: "Qubits can exist in states |0⟩, |1⟩, or superposition of both simultaneously."
        }
      ],
      "Creating Superposition": [
        {
          type: 'quiz',
          question: `Which gate creates equal superposition from a |0⟩ state?`,
          options: ["Hadamard Gate", "X Gate", "Y Gate", "Z Gate"],
          correct: "Hadamard Gate",
          explanation: "The Hadamard gate transforms |0⟩ into (|0⟩ + |1⟩)/√2, creating equal superposition."
        },
        {
          type: 'simulation',
          question: "Apply the correct gate to create superposition:",
          elements: ["H", "X", "Y", "Z", "CNOT"],
          target: "Create |+⟩ from |0⟩",
          correct: ["H"],
          explanation: "The Hadamard (H) gate creates the |+⟩ superposition state from |0⟩."
        }
      ]
    };

    return conceptQuestions[level.concept] || [
      {
        type: 'quiz',
        question: `What is the main focus of ${level.concept}?`,
        options: [level.learningObjectives[0] || "Understanding the concept", "Classical computing", "Basic mathematics", "General physics"],
        correct: level.learningObjectives[0] || "Understanding the concept",
        explanation: `${level.concept} focuses on ${level.description.toLowerCase()}.`
      }
    ];
  };

  const questions = generateConceptQuestions(level);

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameComplete) {
      handleGameComplete();
    }
  }, [timeLeft, gameComplete]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleElementClick = (element: string) => {
    if (questions[currentQuestion].type === 'simulation' || questions[currentQuestion].type === 'visualization') {
      setClickedElements(prev => 
        prev.includes(element) 
          ? prev.filter(item => item !== element)
          : [...prev, element]
      );
    }
  };

  const handleDragDrop = (items: string[]) => {
    setDraggedItems(items);
  };

  const handleSubmitAnswer = () => {
    const currentQ = questions[currentQuestion];
    let isCorrect = false;

    switch (currentQ.type) {
      case 'quiz':
        isCorrect = selectedAnswer === currentQ.correct;
        break;
      case 'simulation':
      case 'visualization':
        isCorrect = JSON.stringify(clickedElements.sort()) === JSON.stringify(currentQ.correct.sort());
        break;
      case 'drag-drop':
        isCorrect = JSON.stringify(draggedItems) === JSON.stringify(currentQ.correct);
        break;
    }
    
    if (isCorrect) {
      setScore(score + 100);
      toast({
        title: "Excellent! 🎉",
        description: "You're mastering quantum concepts!",
      });
    } else {
      toast({
        title: "Not quite right",
        description: "Review the explanation and try again!",
        variant: "destructive"
      });
    }

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setClickedElements([]);
      setDraggedItems([]);
      setShowExplanation(false);
    } else {
      handleGameComplete();
    }
  };

  const handleGameComplete = () => {
    setGameComplete(true);
    const finalScore = score + Math.max(0, timeLeft * 2);
    const earnedStars = finalScore >= 800 ? 3 : finalScore >= 600 ? 2 : finalScore >= 400 ? 1 : 0;
    
    setTimeout(() => {
      onComplete(earnedStars);
    }, 2000);
  };

  const renderGameContent = () => {
    const currentQ = questions[currentQuestion];
    
    switch (currentQ.type) {
      case 'quiz':
        return (
          <div className="grid grid-cols-1 gap-3 mb-6">
            {currentQ.options.map((option: string, index: number) => (
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
        );

      case 'simulation':
      case 'visualization':
        return (
          <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {currentQ.elements.map((element: string, index: number) => (
                <Button
                  key={index}
                  variant={clickedElements.includes(element) ? "default" : "outline"}
                  className={`p-4 ${
                    clickedElements.includes(element)
                      ? 'bg-purple-600 border-purple-400 text-white'
                      : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50'
                  }`}
                  onClick={() => handleElementClick(element)}
                  disabled={showExplanation}
                >
                  {currentQ.type === 'simulation' ? <Eye className="h-4 w-4 mr-2" /> : <Target className="h-4 w-4 mr-2" />}
                  {element}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'drag-drop':
        return (
          <div className="mb-6">
            <div className="space-y-3">
              {currentQ.items.map((item: string, index: number) => (
                <div
                  key={index}
                  className={`p-3 rounded border cursor-move ${
                    draggedItems.includes(item)
                      ? 'bg-purple-600/20 border-purple-400'
                      : 'bg-gray-800/50 border-gray-600'
                  }`}
                  onClick={() => {
                    if (!showExplanation) {
                      const newOrder = draggedItems.includes(item)
                        ? draggedItems.filter(i => i !== item)
                        : [...draggedItems, item];
                      handleDragDrop(newOrder);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <MousePointer className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{item}</span>
                    {draggedItems.includes(item) && (
                      <Badge className="ml-auto">{draggedItems.indexOf(item) + 1}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canSubmit = () => {
    const currentQ = questions[currentQuestion];
    switch (currentQ.type) {
      case 'quiz':
        return selectedAnswer !== null;
      case 'simulation':
      case 'visualization':
        return clickedElements.length > 0;
      case 'drag-drop':
        return draggedItems.length === currentQ.items.length;
      default:
        return false;
    }
  };

  const getGameTypeIcon = (type: string) => {
    switch (type) {
      case 'simulation': return <Eye className="h-4 w-4" />;
      case 'visualization': return <Target className="h-4 w-4" />;
      case 'drag-drop': return <MousePointer className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (gameComplete) {
    const finalScore = score + Math.max(0, timeLeft * 2);
    const earnedStars = finalScore >= 800 ? 3 : finalScore >= 600 ? 2 : finalScore >= 400 ? 1 : 0;

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
        <CardContent className="text-center space-y-6">
          <div className="flex justify-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Star
                key={i}
                className={`h-8 w-8 ${
                  i < earnedStars ? 'text-yellow-400 fill-current' : 'text-gray-400'
                }`}
              />
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400">{finalScore}</div>
              <p className="text-gray-300">Final Score</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">{earnedStars}</div>
              <p className="text-gray-300">Stars Earned</p>
            </div>
          </div>

          <Button 
            onClick={() => onComplete(earnedStars)}
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Level
        </Button>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-600/20 text-blue-300 flex items-center gap-1">
            {getGameTypeIcon(questions[currentQuestion]?.type)}
            {questions[currentQuestion]?.type?.charAt(0).toUpperCase() + questions[currentQuestion]?.type?.slice(1)} Challenge
          </Badge>
        </div>
      </div>

      {/* Progress and Timer */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>Score: {score}</span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>
        
        <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{timeLeft}s</div>
              <p className="text-sm text-gray-400">Time Remaining</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Question Card */}
      <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            {getGameTypeIcon(questions[currentQuestion]?.type)}
            <Badge className="bg-purple-600/20 text-purple-300">
              {level.concept}
            </Badge>
          </div>
          <CardTitle className="text-xl text-white">
            {questions[currentQuestion]?.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderGameContent()}

          {/* Explanation */}
          {showExplanation && (
            <Card className={`mb-4 ${
              // Check if answer is correct based on game type
              (() => {
                const currentQ = questions[currentQuestion];
                let isCorrect = false;
                switch (currentQ.type) {
                  case 'quiz':
                    isCorrect = selectedAnswer === currentQ.correct;
                    break;
                  case 'simulation':
                  case 'visualization':
                    isCorrect = JSON.stringify(clickedElements.sort()) === JSON.stringify(currentQ.correct.sort());
                    break;
                  case 'drag-drop':
                    isCorrect = JSON.stringify(draggedItems) === JSON.stringify(currentQ.correct);
                    break;
                }
                return isCorrect ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30';
              })()
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {(() => {
                    const currentQ = questions[currentQuestion];
                    let isCorrect = false;
                    switch (currentQ.type) {
                      case 'quiz':
                        isCorrect = selectedAnswer === currentQ.correct;
                        break;
                      case 'simulation':
                      case 'visualization':
                        isCorrect = JSON.stringify(clickedElements.sort()) === JSON.stringify(currentQ.correct.sort());
                        break;
                      case 'drag-drop':
                        isCorrect = JSON.stringify(draggedItems) === JSON.stringify(currentQ.correct);
                        break;
                    }
                    return isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400 mt-0.5" />
                    );
                  })()}
                  <div>
                    <p className="font-semibold text-white mb-2">
                      {(() => {
                        const currentQ = questions[currentQuestion];
                        let isCorrect = false;
                        switch (currentQ.type) {
                          case 'quiz':
                            isCorrect = selectedAnswer === currentQ.correct;
                            break;
                          case 'simulation':
                          case 'visualization':
                            isCorrect = JSON.stringify(clickedElements.sort()) === JSON.stringify(currentQ.correct.sort());
                            break;
                          case 'drag-drop':
                            isCorrect = JSON.stringify(draggedItems) === JSON.stringify(currentQ.correct);
                            break;
                        }
                        return isCorrect ? 'Correct!' : 'Incorrect';
                      })()}
                    </p>
                    <p className="text-gray-300 text-sm">
                      {questions[currentQuestion]?.explanation}
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
                disabled={!canSubmit()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {currentQuestion < questions.length - 1 ? 'Next Challenge' : 'Complete Level'}
                <Zap className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
