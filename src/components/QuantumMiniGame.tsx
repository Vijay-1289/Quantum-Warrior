
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
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
  const { toast } = useToast();

  // Generate questions based on level content
  const generateQuestions = (level: QuantumLevel) => {
    // This would be expanded with a comprehensive question database
    const baseQuestions = [
      {
        question: `What is the main concept you learned about ${level.concept}?`,
        options: [
          level.learningObjectives[0] || "First learning objective",
          "Something unrelated",
          "Classical computing only",
          "Not applicable"
        ],
        correct: level.learningObjectives[0] || "First learning objective",
        explanation: `${level.concept} is fundamental because ${level.description}`
      },
      {
        question: `In the context of ${level.concept}, what makes quantum different from classical?`,
        options: [
          "Quantum uses superposition",
          "They are the same",
          "Classical is always better", 
          "No difference exists"
        ],
        correct: "Quantum uses superposition",
        explanation: "Quantum systems can exist in multiple states simultaneously through superposition, unlike classical systems."
      },
      {
        question: `What is a key application of ${level.concept}?`,
        options: [
          level.learningObjectives[1] || "Advanced applications",
          "Only theoretical interest",
          "No practical use",
          "Classical replacement only"
        ],
        correct: level.learningObjectives[1] || "Advanced applications",
        explanation: `${level.concept} has practical applications in quantum computing and related fields.`
      }
    ];

    return baseQuestions.slice(0, Math.min(3, level.learningObjectives.length));
  };

  const questions = generateQuestions(level);

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
      setShowExplanation(false);
    } else {
      handleGameComplete();
    }
  };

  const handleGameComplete = () => {
    setGameComplete(true);
    const finalScore = score + Math.max(0, timeLeft * 2); // Bonus for remaining time
    const earnedStars = finalScore >= 800 ? 3 : finalScore >= 600 ? 2 : finalScore >= 400 ? 1 : 0;
    
    setTimeout(() => {
      onComplete(earnedStars);
    }, 2000);
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
        <Badge className="bg-blue-600/20 text-blue-300">
          {level.gameType.charAt(0).toUpperCase() + level.gameType.slice(1)} Challenge
        </Badge>
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
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Challenge'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
