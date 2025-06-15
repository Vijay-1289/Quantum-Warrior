
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Book, ChevronLeft, ChevronRight, Sparkles, Users, MessageSquare, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { type QuantumLevel } from '@/data/quantumLevels';
import { useToast } from '@/hooks/use-toast';
import { generateStoryContent, generateTheoryContent } from '@/utils/theoryContent';
import { ComicStoryGenerator } from './ComicStoryGenerator';

interface StoryBookProps {
  level: QuantumLevel;
  onComplete: () => void;
  onBack: () => void;
}

interface ComicCharacter {
  name: string;
  role: string;
  personality: string;
  appearance: string;
  imageUrl?: string;
}

interface ComicPanel {
  characters: string[];
  dialogue: string;
  speaker: string;
  setting: string;
  imagePrompt: string;
  imageUrl?: string;
}

export const StoryBook: React.FC<StoryBookProps> = ({ level, onComplete, onBack }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [storyPages, setStoryPages] = useState<string[]>([]);
  const [isLoadingStory, setIsLoadingStory] = useState(true);
  const [isGeneratingComic, setIsGeneratingComic] = useState(false);
  const [comicCharacters, setComicCharacters] = useState<ComicCharacter[]>([]);
  const [comicPanels, setComicPanels] = useState<ComicPanel[]>([]);
  const [hasError, setHasError] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [viewMode, setViewMode] = useState<'story' | 'comic'>('story');
  const { toast } = useToast();

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

  // Load AI-generated story when component mounts
  useEffect(() => {
    const loadStory = async () => {
      console.log(`Loading AI-generated story for Level ${level.id}: ${level.concept}`);
      setIsLoadingStory(true);
      setHasError(false);
      
      try {
        const generatedStory = await generateStoryContent(level);
        console.log('Story generated successfully for level', level.id);
        
        if (generatedStory && generatedStory.length > 0) {
          setStoryPages(generatedStory);
        } else {
          throw new Error('No valid story generated');
        }
      } catch (error) {
        console.error('Failed to generate story for level', level.id, ':', error);
        setHasError(true);
        setStoryPages([]);
      } finally {
        setIsLoadingStory(false);
      }
    };

    loadStory();
  }, [level]);

  const handleRetryStory = async () => {
    if (retryAttempts >= 2) {
      console.log('Maximum retry attempts reached for story generation');
      return;
    }

    setRetryAttempts(prev => prev + 1);
    setIsLoadingStory(true);
    setHasError(false);

    try {
      const generatedStory = await generateStoryContent(level);
      
      if (generatedStory && generatedStory.length > 0) {
        setStoryPages(generatedStory);
        setHasError(false);
      } else {
        throw new Error('No valid story generated on retry');
      }
    } catch (error) {
      console.error(`Story retry ${retryAttempts + 1} failed:`, error);
      setHasError(true);
      setStoryPages([]);
    } finally {
      setIsLoadingStory(false);
    }
  };

  const handleComicComplete = (comicData: { characters: ComicCharacter[], panels: ComicPanel[] }) => {
    setComicCharacters(comicData.characters);
    setComicPanels(comicData.panels);
    setIsGeneratingComic(false);
    setViewMode('comic');
  };

  const generateTheoryFromStory = async () => {
    if (storyPages.length === 0) return;

    const fullStoryContent = storyPages.join(' ');
    
    try {
      console.log('Generating theory content from story for level', level.id);
      const theoryContent = await generateTheoryContent(level, fullStoryContent);
      
      if (theoryContent) {
        // Store the theory content for use in quiz generation
        localStorage.setItem(`theory_content_level_${level.id}`, theoryContent);
        console.log('Theory content stored for level', level.id);
      }
    } catch (error) {
      console.error('Failed to generate theory from story:', error);
    }
  };

  const handleFinishStory = async () => {
    await generateTheoryFromStory();
    onComplete();
  };

  const startComicGeneration = () => {
    if (storyPages.length > 0) {
      setIsGeneratingComic(true);
    }
  };

  // Show loading state while story is being generated
  if (isLoadingStory) {
    return (
      <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
        <CardContent className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Crafting Your Story</h3>
              <p className="text-gray-300">Creating an engaging narrative about {level.concept}...</p>
              <p className="text-gray-400 text-sm mt-2">This story will guide your learning journey</p>
              {retryAttempts > 0 && (
                <p className="text-yellow-400 text-sm mt-1">Retry attempt {retryAttempts} of 2</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state if story failed to load
  if (hasError || storyPages.length === 0) {
    return (
      <Card className="bg-black/20 backdrop-blur-lg border-red-500/20">
        <CardContent className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Story Generation Failed</h3>
              <p className="text-gray-300">Unable to create story for {level.concept}</p>
              <p className="text-gray-400 text-sm mt-2">Please check your internet connection and try again</p>
              <div className="flex gap-3 mt-4 justify-center">
                {retryAttempts < 2 && (
                  <Button 
                    onClick={handleRetryStory}
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={isLoadingStory}
                  >
                    {isLoadingStory ? 'Retrying...' : 'Retry Generation'}
                  </Button>
                )}
                <Button 
                  onClick={onBack}
                  variant="outline"
                  className="border-gray-500 text-gray-300 hover:bg-gray-700"
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

  // Show comic generator
  if (isGeneratingComic) {
    return (
      <ComicStoryGenerator
        level={level}
        storyContent={storyPages.join(' ')}
        onComplete={handleComicComplete}
      />
    );
  }

  // Show comic view
  if (viewMode === 'comic' && comicPanels.length > 0) {
    const currentPanel = comicPanels[currentPage] || comicPanels[0];
    const speaker = comicCharacters.find(char => char.name === currentPanel.speaker);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Level
          </Button>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => setViewMode('story')}
              className="flex items-center gap-2"
            >
              <Book className="h-4 w-4" />
              Story Mode
            </Button>
            <Badge className="bg-blue-600/20 text-blue-300 flex items-center gap-1">
              <Users className="h-4 w-4" />
              Comic Mode
            </Badge>
          </div>
        </div>

        {/* Comic Panel */}
        <Card className="bg-gradient-to-br from-slate-900 to-purple-900 border border-purple-500/20">
          <CardContent className="p-0">
            {/* Comic Panel Display */}
            <div className="min-h-[500px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-lg relative overflow-hidden">
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20" />
              
              {/* Panel Image */}
              {currentPanel.imageUrl && (
                <div className="absolute inset-0">
                  <img 
                    src={currentPanel.imageUrl} 
                    alt={`Comic panel ${currentPage + 1}`}
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
              )}
              
              {/* Character and Speech Bubble */}
              <div className="relative z-10 flex items-end justify-center h-full p-8">
                <div className="text-center max-w-4xl">
                  {/* Character Display */}
                  {speaker && (
                    <div className="mb-6">
                      {speaker.imageUrl && (
                        <img 
                          src={speaker.imageUrl} 
                          alt={speaker.name}
                          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-400/50"
                        />
                      )}
                      <h3 className="text-2xl font-bold text-purple-300 mb-2">{speaker.name}</h3>
                      <p className="text-sm text-gray-400">{speaker.role}</p>
                    </div>
                  )}
                  
                  {/* Speech Bubble */}
                  <div className="relative bg-white/95 rounded-2xl p-6 border-4 border-purple-400/50 shadow-2xl">
                    {/* Speech bubble tail */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white/95 rotate-45 border-r-4 border-b-4 border-purple-400/50" />
                    
                    <p className="text-lg text-gray-800 leading-relaxed font-medium">
                      {renderFormattedText(currentPanel.dialogue)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Comic panel border */}
              <div className="absolute inset-4 border-4 border-white/20 rounded-lg pointer-events-none" />
            </div>

            {/* Panel Info */}
            <div className="p-6 bg-gray-900/50">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-400">Panel {currentPage + 1} of {comicPanels.length}</p>
                  <p className="text-xs text-gray-500">Setting: {currentPanel.setting}</p>
                </div>
                <Badge className="bg-purple-600/20 text-purple-300">
                  {level.concept}
                </Badge>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <Progress 
                  value={((currentPage + 1) / comicPanels.length) * 100} 
                  className="flex-1 mx-4 h-2"
                />

                {currentPage < comicPanels.length - 1 ? (
                  <Button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleFinishStory}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    Continue Learning
                    <Sparkles className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show story view (default)
  const currentStoryPage = storyPages[currentPage];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Level
        </Button>
        <div className="flex items-center gap-2">
          <Button 
            onClick={startComicGeneration}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Generate Comic
          </Button>
          <Badge className="bg-blue-600/20 text-blue-300 flex items-center gap-1">
            <Book className="h-4 w-4" />
            Story Mode
          </Badge>
        </div>
      </div>

      {/* Story Book */}
      <Card className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-lg border-purple-500/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Book className="h-12 w-12 text-purple-400" />
          </div>
          <CardTitle className="text-2xl text-white mb-2">The Quantum Chronicles</CardTitle>
          <CardDescription className="text-gray-300">
            Chapter {level.id}: {level.concept}
          </CardDescription>
          <Badge className="bg-blue-600/20 text-blue-300 mx-auto">
            AI Generated Story
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Story Content */}
          <div className="min-h-[400px] bg-black/20 rounded-lg p-8 border border-purple-500/20">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-gray-200">
                {renderFormattedText(currentStoryPage)}
              </p>
            </div>
          </div>

          {/* Progress and Navigation */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Page {currentPage + 1} of {storyPages.length}</span>
              <span>{level.concept}</span>
            </div>
            
            <Progress 
              value={((currentPage + 1) / storyPages.length) * 100} 
              className="h-3"
            />

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Page
              </Button>

              {currentPage < storyPages.length - 1 ? (
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
                >
                  Next Page
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleFinishStory}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  Continue to Theory
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
