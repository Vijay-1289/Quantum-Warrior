import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, Lightbulb, Zap, Target, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateQuizQuestions } from '@/utils/theoryContent';
import { useIsMobile } from '@/hooks/use-mobile';

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

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
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
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
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

  // Load AI-generated questions when component mounts
  useEffect(() => {
    const loadQuestions = async () => {
      console.log(`Loading AI-generated questions for Level ${level.id}: ${level.concept}`);
      setIsLoadingQuestions(true);
      setHasError(false);
      
      try {
        // Get the theory content from localStorage if available
        const theoryContent = localStorage.getItem(`theory_content_level_${level.id}`);
        console.log('Theory content found for quiz generation:', theoryContent ? 'Yes' : 'No');
        
        if (theoryContent) {
          console.log('Using stored theory content for quiz generation:', theoryContent.substring(0, 100) + '...');
        }
        
        const generatedQuestions = await generateQuizQuestions(level, theoryContent || undefined);
        console.log('Quiz questions generated successfully for level', level.id);
        
        if (generatedQuestions && generatedQuestions.length > 0) {
          setQuestions(generatedQuestions);
        } else {
          throw new Error('No valid questions generated');
        }
      } catch (error) {
        console.error('Failed to generate quiz questions for level', level.id, ':', error);
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
      console.log('Maximum retry attempts reached for quiz generation');
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
      console.error(`Quiz retry ${retryAttempts + 1} failed:`, error);
      setHasError(true);
      setQuestions([]);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!questions[currentQuestion]) return;
    
    const correctAnswer = questions[currentQuestion].options[questions[currentQuestion].correct];
    const isCorrect = selectedAnswer === correctAnswer;
    
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

  // Show loading state while questions are being generated
  if (isLoadingQuestions) {
    return (
      <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
        <CardContent className={`${isMobile ? 'p-4' : 'p-8'}`}>
          <div className={`flex items-center justify-center ${isMobile ? 'h-48' : 'h-64'}`}>
            <div className="text-center">
              <Loader2 className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} animate-spin text-purple-400 mx-auto mb-4`} />
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white mb-2`}>Generating Theory-Based Quiz</h3>
              <p className={`text-gray-300 ${isMobile ? 'text-sm' : 'text-base'}`}>Creating challenging questions based on {level.concept} theory...</p>
              <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mt-2`}>Questions will reference the detailed theory you studied</p>
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
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white mb-2`}>Failed to Generate Questions</h3>
              <p className={`text-gray-300 ${isMobile ? 'text-sm' : 'text-base'}`}>Unable to create quiz questions for {level.concept}</p>
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
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  className="border-gray-500 text-gray-300 hover:bg-gray-700"
                  size={isMobile ? "sm" : "default"}
                >
                  Reload Page
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
        <CardContent className="text-center">
          <div className="mb-6">
            <div className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-bold text-yellow-400 mb-2`}>{score}</div>
            <p className={`text-gray-300 ${isMobile ? 'text-sm' : 'text-base'}`}>Final Score</p>
          </div>
          <Button 
            onClick={handleCompleteLevel}
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
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className={`flex justify-between ${isMobile ? 'text-xs' : 'text-sm'} text-gray-300`}>
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <Progress value={progress} className={`${isMobile ? 'h-2' : 'h-3'}`} />
      </div>

      {/* Question Card - Scrollable on mobile */}
      <ScrollArea className={`${isMobile ? 'h-[calc(100vh-200px)]' : 'h-auto'}`}>
        <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
          <CardHeader className={`${isMobile ? 'p-4 pb-2' : 'p-6'}`}>
            <div className={`flex flex-wrap items-center gap-2 mb-2`}>
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
            {/* Scrollable Options Container */}
            <ScrollArea className={`${isMobile ? 'max-h-64' : 'max-h-80'} mb-${isMobile ? '4' : '6'}`}>
              <div className={`grid grid-cols-1 gap-${isMobile ? '2' : '3'} pr-4`}>
                {currentQuestionData.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === option ? "default" : "outline"}
                    className={`text-left justify-start h-auto ${isMobile ? 'p-3 text-sm' : 'p-4'} whitespace-normal break-words ${
                      selectedAnswer === option 
                        ? 'bg-purple-600 border-purple-400 text-white' 
                        : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50'
                    }`}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showExplanation}
                  >
                    <span className={`font-semibold mr-${isMobile ? '2' : '3'} flex-shrink-0`}>
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className={`${isMobile ? 'text-sm' : 'text-base'} leading-relaxed`}>{renderFormattedText(option)}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>

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
                  <Target className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  size={isMobile ? "sm" : "default"}
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Level'}
                  <Zap className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} ml-2`} />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
};
