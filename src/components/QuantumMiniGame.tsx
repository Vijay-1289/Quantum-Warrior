import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Star, CheckCircle, XCircle, Lightbulb, Zap, Eye, MousePointer, Target, Loader2, AlertCircle } from 'lucide-react';
import { type QuantumLevel } from '@/data/quantumLevels';
import { useToast } from '@/hooks/use-toast';
import { generateQuizQuestions } from '@/utils/theoryContent';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuantumMiniGameProps {
  level: QuantumLevel;
  onComplete: (stars: number) => void;
  onBack: () => void;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface TimeChangeAnimation {
  id: number;
  change: number;
  show: boolean;
}

export const QuantumMiniGame: React.FC<QuantumMiniGameProps> = ({ level, onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [timeChangeAnimations, setTimeChangeAnimations] = useState<TimeChangeAnimation[]>([]);
  const [animationCounter, setAnimationCounter] = useState(0);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Function to render text with bold formatting
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <strong key={index} className="font-bold">{boldText}</strong>;
      }
      return part;
    });
  };

  // Function to show time change animation
  const showTimeChangeAnimation = (change: number) => {
    const newAnimation: TimeChangeAnimation = {
      id: animationCounter,
      change,
      show: true
    };
    
    setTimeChangeAnimations(prev => [...prev, newAnimation]);
    setAnimationCounter(prev => prev + 1);
    
    // Remove animation after 2 seconds
    setTimeout(() => {
      setTimeChangeAnimations(prev => 
        prev.map(anim => 
          anim.id === newAnimation.id ? { ...anim, show: false } : anim
        )
      );
      
      // Clean up after fade out
      setTimeout(() => {
        setTimeChangeAnimations(prev => 
          prev.filter(anim => anim.id !== newAnimation.id)
        );
      }, 500);
    }, 1500);
  };

  // Load AI-generated questions when component mounts
  useEffect(() => {
    const loadQuestions = async () => {
      console.log(`Loading AI-generated mini-game questions for Level ${level.id}: ${level.concept}`);
      setIsLoadingQuestions(true);
      setHasError(false);
      
      try {
        // Get the theory content from localStorage if available
        const theoryContent = localStorage.getItem(`theory_content_level_${level.id}`);
        console.log('Theory content found for mini-game generation:', theoryContent ? 'Yes' : 'No');
        
        const generatedQuestions = await generateQuizQuestions(level, theoryContent || undefined);
        console.log('Mini-game questions generated successfully for level', level.id);
        
        if (generatedQuestions && generatedQuestions.length > 0) {
          setQuestions(generatedQuestions);
        } else {
          throw new Error('No valid questions generated');
        }
      } catch (error) {
        console.error('Failed to generate mini-game questions for level', level.id, ':', error);
        setHasError(true);
        setQuestions([]);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    loadQuestions();
  }, [level]);

  const handleRetryQuestions = async () => {
    if (retryAttempts >= 2) {
      console.log('Maximum retry attempts reached for mini-game generation');
      return;
    }

    setRetryAttempts(prev => prev + 1);
    setIsLoadingQuestions(true);
    setHasError(false);

    try {
      const theoryContent = localStorage.getItem(`theory_content_level_${level.id}`);
      const generatedQuestions = await generateQuizQuestions(level, theoryContent || undefined);
      
      if (generatedQuestions && generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        setHasError(false);
      } else {
        throw new Error('No valid questions generated on retry');
      }
    } catch (error) {
      console.error(`Mini-game retry ${retryAttempts + 1} failed:`, error);
      setHasError(true);
      setQuestions([]);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete && !isLoadingQuestions && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameComplete) {
      handleGameComplete();
    }
  }, [timeLeft, gameComplete, isLoadingQuestions, questions.length]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!questions[currentQuestion]) return;
    
    const correctAnswer = questions[currentQuestion].options[questions[currentQuestion].correct];
    const isCorrect = selectedAnswer === correctAnswer;
    
    if (isCorrect) {
      setScore(score + 100);
      setCorrectAnswers(prev => prev + 1);
      // Add 2 seconds for correct answer
      setTimeLeft(prev => prev + 2);
      showTimeChangeAnimation(2);
      toast({
        title: "Excellent! 🎉",
        description: "You're mastering quantum concepts! +2 seconds bonus!",
      });
    } else {
      // Subtract 2 seconds for wrong answer, but don't go below 0
      setTimeLeft(prev => Math.max(0, prev - 2));
      showTimeChangeAnimation(-2);
      toast({
        title: "Not quite right",
        description: "Review the explanation and try again! -2 seconds penalty",
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
    
    // Calculate stars based on correct answers
    let earnedStars = 0;
    if (correctAnswers >= questions.length) {
      earnedStars = 3; // All questions correct
    } else if (correctAnswers >= 2) {
      earnedStars = 2; // 2 or more correct
    } else if (correctAnswers >= 1) {
      earnedStars = 1; // At least 1 correct
    }
    
    setTimeout(() => {
      onComplete(earnedStars);
    }, 2000);
  };

  // Show loading state while questions are being generated
  if (isLoadingQuestions) {
    return (
      <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
        <CardContent className={`${isMobile ? 'p-4' : 'p-8'}`}>
          <div className={`flex items-center justify-center ${isMobile ? 'h-48' : 'h-64'}`}>
            <div className="text-center">
              <Loader2 className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} animate-spin text-purple-400 mx-auto mb-4`} />
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white mb-2`}>Generating AI Mini-Game</h3>
              <p className={`text-gray-300 ${isMobile ? 'text-sm' : 'text-base'}`}>Creating interactive challenges for {level.concept}...</p>
              <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mt-2`}>Questions will test your understanding</p>
              {retryAttempts > 0 && (
                <p className={`text-yellow-400 ${isMobile ? 'text-xs' : 'text-sm'} mt-1`}>Retry attempt {retryAttempts} of 2</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state if questions failed to load
  if (hasError || questions.length === 0) {
    return (
      <Card className="bg-black/20 backdrop-blur-lg border-red-500/20">
        <CardContent className={`${isMobile ? 'p-4' : 'p-8'}`}>
          <div className={`flex items-center justify-center ${isMobile ? 'h-48' : 'h-64'}`}>
            <div className="text-center">
              <AlertCircle className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-red-400 mx-auto mb-4`} />
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white mb-2`}>Failed to Generate Mini-Game</h3>
              <p className={`text-gray-300 ${isMobile ? 'text-sm' : 'text-base'}`}>Unable to create challenges for {level.concept}</p>
              <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mt-2`}>Please check your internet connection and try again</p>
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 mt-4 justify-center`}>
                {retryAttempts < 2 && (
                  <Button 
                    onClick={handleRetryQuestions}
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={isLoadingQuestions}
                    size={isMobile ? "sm" : "default"}
                  >
                    {isLoadingQuestions ? 'Retrying...' : 'Retry Generation'}
                  </Button>
                )}
                <Button 
                  onClick={onBack} 
                  variant="outline"
                  className="border-gray-500 text-gray-300 hover:bg-gray-700"
                  size={isMobile ? "sm" : "default"}
                >
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  if (gameComplete) {
    // Calculate stars based on correct answers
    let earnedStars = 0;
    if (correctAnswers >= questions.length) {
      earnedStars = 3; // All questions correct
    } else if (correctAnswers >= 2) {
      earnedStars = 2; // 2 or more correct
    } else if (correctAnswers >= 1) {
      earnedStars = 1; // At least 1 correct
    }
    
    const finalScore = score + Math.max(0, timeLeft * 2);

    return (
      <Card className="bg-gradient-to-br from-green-900/50 to-blue-900/50 backdrop-blur-lg border-green-500/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} text-green-400`} />
          </div>
          <CardTitle className={`${isMobile ? 'text-xl' : 'text-2xl'} text-white`}>Level Complete!</CardTitle>
          <CardDescription className={`text-gray-300 ${isMobile ? 'text-sm' : 'text-base'}`}>
            You've mastered {level.concept}!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="flex justify-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Star
                key={i}
                className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} ${
                  i < earnedStars ? 'text-yellow-400 fill-current' : 'text-gray-400'
                }`}
              />
            ))}
          </div>
          
          <div className={`grid grid-cols-${isMobile ? '1' : '3'} gap-4 text-center`}>
            <div>
              <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-blue-400`}>{finalScore}</div>
              <p className={`text-gray-300 ${isMobile ? 'text-sm' : 'text-base'}`}>Final Score</p>
            </div>
            <div>
              <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-green-400`}>{correctAnswers}/{questions.length}</div>
              <p className={`text-gray-300 ${isMobile ? 'text-sm' : 'text-base'}`}>Correct Answers</p>
            </div>
            <div>
              <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-yellow-400`}>{earnedStars}</div>
              <p className={`text-gray-300 ${isMobile ? 'text-sm' : 'text-base'}`}>Stars Earned</p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
            <p className={`text-gray-300 ${isMobile ? 'text-sm' : 'text-base'} mb-2`}>Star Requirements:</p>
            <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-400 space-y-1`}>
              <p>⭐ 1 Star: Answer 1 question correctly</p>
              <p>⭐⭐ 2 Stars: Answer 2 questions correctly</p>
              <p>⭐⭐⭐ 3 Stars: Answer all questions correctly</p>
            </div>
          </div>

          <Button 
            onClick={() => onComplete(earnedStars)}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            size={isMobile ? "sm" : "default"}
          >
            Continue Journey
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  if (!currentQuestionData) {
    return (
      <Card className="bg-black/20 backdrop-blur-lg border-red-500/20">
        <CardContent className={`${isMobile ? 'p-4' : 'p-8'} text-center`}>
          <p className="text-red-400">Failed to load questions. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 h-full">
      {/* Header */}
      <div className={`flex items-center justify-between ${isMobile ? 'px-2' : ''}`}>
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="flex items-center gap-2"
          size={isMobile ? "sm" : "default"}
        >
          <ArrowLeft className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          {isMobile ? 'Back' : 'Back to Level'}
        </Button>
        <div className="flex items-center gap-2">
          <Badge className={`bg-blue-600/20 text-blue-300 flex items-center gap-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            <Lightbulb className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            AI Challenge
          </Badge>
        </div>
      </div>

      {/* Progress and Timer */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-4'}`}>
        <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
          <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
            <div className={`flex justify-between ${isMobile ? 'text-xs' : 'text-sm'} text-gray-300 mb-2`}>
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>Correct: {correctAnswers}/{questions.length}</span>
            </div>
            <Progress value={progress} className={`${isMobile ? 'h-2' : 'h-3'}`} />
          </CardContent>
        </Card>
        
        <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20 relative">
          <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
            <div className="text-center">
              <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-orange-400'}`}>
                {timeLeft}s
              </div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-400`}>Time Remaining</p>
            </div>
            
            {/* Time Change Animations */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {timeChangeAnimations.map((animation) => (
                <div
                  key={animation.id}
                  className={`absolute ${isMobile ? 'text-lg' : 'text-2xl'} font-bold transition-all duration-500 ${
                    animation.show 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 -translate-y-8'
                  } ${
                    animation.change > 0 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}
                  style={{
                    animation: animation.show 
                      ? 'fadeInUp 0.5s ease-out forwards' 
                      : 'fadeOutUp 0.5s ease-out forwards'
                  }}
                >
                  {animation.change > 0 ? '+' : ''}{animation.change}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Question Card */}
      <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
        <CardHeader className={`${isMobile ? 'p-4 pb-2' : 'p-6'}`}>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Lightbulb className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-yellow-400`} />
            <Badge className={`bg-purple-600/20 text-purple-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {level.concept}
            </Badge>
            <Badge className={`bg-blue-600/20 text-blue-300 ${isMobile ? 'text-xs' : 'text-xs'}`}>
              AI Generated
            </Badge>
          </div>
          <CardTitle className={`${isMobile ? 'text-lg leading-6' : 'text-xl'} text-white`}>
            {renderFormattedText(currentQuestionData.question)}
          </CardTitle>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-4 pt-0' : 'p-6 pt-0'}`}>
          {/* Mobile: Full height scrollable container for options */}
          {isMobile ? (
            <div className="h-[40vh] mb-4">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-1 gap-3 pr-4">
                  {currentQuestionData.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === option ? "default" : "outline"}
                      className={`text-left justify-start h-auto p-4 whitespace-normal break-words min-h-[60px] ${
                        selectedAnswer === option 
                          ? 'bg-purple-600 border-purple-400 text-white' 
                          : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50'
                      }`}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={showExplanation}
                    >
                      <span className="font-semibold mr-3 flex-shrink-0 text-lg">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-sm leading-relaxed">{renderFormattedText(option)}</span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            /* Desktop: Regular layout */
            <div className="grid grid-cols-1 gap-3 mb-6">
              {currentQuestionData.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className={`text-left justify-start h-auto p-4 whitespace-normal break-words ${
                    selectedAnswer === option 
                      ? 'bg-purple-600 border-purple-400 text-white' 
                      : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50'
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showExplanation}
                >
                  <span className="font-semibold mr-3 flex-shrink-0">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="text-base leading-relaxed">{renderFormattedText(option)}</span>
                </Button>
              ))}
            </div>
          )}

          {/* Explanation */}
          {showExplanation && (
            <Card className={`mb-4 ${
              selectedAnswer === currentQuestionData.options[currentQuestionData.correct]
                ? 'bg-green-900/20 border-green-500/30'
                : 'bg-red-900/20 border-red-500/30'
            }`}>
              <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
                <div className="flex items-start gap-3">
                  {selectedAnswer === currentQuestionData.options[currentQuestionData.correct] ? (
                    <CheckCircle className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-green-400 mt-0.5 flex-shrink-0`} />
                  ) : (
                    <XCircle className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-red-400 mt-0.5 flex-shrink-0`} />
                  )}
                  <div className="flex-1">
                    <p className={`font-semibold text-white mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {selectedAnswer === currentQuestionData.options[currentQuestionData.correct] ? 'Correct!' : 'Incorrect'}
                    </p>
                    <p className={`text-gray-300 ${isMobile ? 'text-xs' : 'text-sm'} leading-relaxed`}>
                      {renderFormattedText(currentQuestionData.explanation)}
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
                size={isMobile ? "sm" : "default"}
              >
                <Zap className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                size={isMobile ? "sm" : "default"}
              >
                {currentQuestion < questions.length - 1 ? 'Next Challenge' : 'Complete Level'}
                <Zap className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} ml-2`} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Custom CSS for animations */}
      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(-10px);
            }
          }
          
          @keyframes fadeOutUp {
            0% {
              opacity: 1;
              transform: translateY(-10px);
            }
            100% {
              opacity: 0;
              transform: translateY(-30px);
            }
          }
        `}
      </style>
    </div>
  );
};
