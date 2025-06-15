
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, Users, Sparkles, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type QuantumLevel } from '@/data/quantumLevels';

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

interface ComicStoryGeneratorProps {
  level: QuantumLevel;
  storyContent: string;
  onComplete: (comicStory: { characters: ComicCharacter[], panels: ComicPanel[] }) => void;
}

export const ComicStoryGenerator: React.FC<ComicStoryGeneratorProps> = ({ 
  level, 
  storyContent, 
  onComplete 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [characters, setCharacters] = useState<ComicCharacter[]>([]);
  const [panels, setPanels] = useState<ComicPanel[]>([]);
  const [currentStep, setCurrentStep] = useState<'characters' | 'story' | 'images' | 'complete'>('characters');
  const [retryAttempts, setRetryAttempts] = useState(0);
  const { toast } = useToast();

  const generateComicCharacters = async () => {
    const prompt = `Based on this quantum physics story about ${level.concept}:

"${storyContent}"

Create 3-4 comic book characters that would tell this story in an engaging way. Each character should have:
- A unique name
- A specific role (mentor, student, scientist, guide, etc.)
- A distinct personality
- A detailed appearance description for comic book illustration

Format as JSON:
{
  "characters": [
    {
      "name": "Character Name",
      "role": "their role",
      "personality": "personality description",
      "appearance": "detailed visual description for comic art"
    }
  ]
}`;

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAWRxRr47bxIl5lJPeMrIw6o0X0l4Yilv0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
          ],
          generationConfig: { temperature: 0.8, maxOutputTokens: 2048 }
        })
      });

      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const jsonMatch = data.candidates[0].content.parts[0].text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          return result.characters || [];
        }
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error generating comic characters:', error);
      throw error;
    }
  };

  const generateComicStory = async (characters: ComicCharacter[]) => {
    const characterList = characters.map(c => `${c.name} (${c.role})`).join(', ');
    
    const prompt = `Create a comic book conversation between these characters: ${characterList}

Based on this quantum physics story about ${level.concept}:
"${storyContent}"

Create 6-8 comic panels with dialogue that explains the concept through character interactions. Each panel should have:
- Character names involved
- Natural dialogue that teaches the concept
- Setting description
- Image prompt for comic book illustration

Format as JSON:
{
  "panels": [
    {
      "characters": ["Character1", "Character2"],
      "dialogue": "Natural conversation text",
      "speaker": "Character1",
      "setting": "scene description",
      "imagePrompt": "detailed comic book art prompt"
    }
  ]
}`;

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAWRxRr47bxIl5lJPeMrIw6o0X0l4Yilv0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
          ],
          generationConfig: { temperature: 0.8, maxOutputTokens: 4096 }
        })
      });

      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const jsonMatch = data.candidates[0].content.parts[0].text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          return result.panels || [];
        }
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error generating comic story:', error);
      throw error;
    }
  };

  const generateImages = async (characters: ComicCharacter[], panels: ComicPanel[]) => {
    // For now, we'll use placeholder images but prepare for future AI image generation
    const updatedCharacters = characters.map(char => ({
      ...char,
      imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${char.name}&backgroundColor=b6e3f4,c0aede,d1d4f9`
    }));

    const updatedPanels = panels.map((panel, index) => ({
      ...panel,
      imageUrl: `https://picsum.photos/400/300?random=${index + 1}`
    }));

    return { characters: updatedCharacters, panels: updatedPanels };
  };

  const generateComicContent = async () => {
    setIsGenerating(true);
    setCurrentStep('characters');

    try {
      // Step 1: Generate characters
      const generatedCharacters = await generateComicCharacters();
      setCharacters(generatedCharacters);
      
      setCurrentStep('story');
      
      // Step 2: Generate story panels
      const generatedPanels = await generateComicStory(generatedCharacters);
      setPanels(generatedPanels);
      
      setCurrentStep('images');
      
      // Step 3: Generate/assign images
      const { characters: finalCharacters, panels: finalPanels } = await generateImages(generatedCharacters, generatedPanels);
      
      setCurrentStep('complete');
      setCharacters(finalCharacters);
      setPanels(finalPanels);
      
      setTimeout(() => {
        onComplete({ characters: finalCharacters, panels: finalPanels });
      }, 1000);
      
    } catch (error) {
      console.error('Failed to generate comic content:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to create comic content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateComicContent();
  }, []);

  const handleRetry = () => {
    if (retryAttempts < 2) {
      setRetryAttempts(prev => prev + 1);
      generateComicContent();
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 'characters': return <Users className="h-6 w-6" />;
      case 'story': return <MessageSquare className="h-6 w-6" />;
      case 'images': return <Sparkles className="h-6 w-6" />;
      case 'complete': return <Sparkles className="h-6 w-6 text-green-400" />;
    }
  };

  const getStepText = () => {
    switch (currentStep) {
      case 'characters': return 'Creating comic characters...';
      case 'story': return 'Writing dialogue and story...';
      case 'images': return 'Generating comic art...';
      case 'complete': return 'Comic story complete!';
    }
  };

  return (
    <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {isGenerating ? (
            <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
          ) : (
            getStepIcon()
          )}
        </div>
        <CardTitle className="text-2xl text-white mb-2">AI Comic Generator</CardTitle>
        <Badge className="bg-blue-600/20 text-blue-300 mx-auto">
          {level.concept} Story
        </Badge>
      </CardHeader>
      
      <CardContent className="text-center space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{getStepText()}</h3>
          
          {/* Progress indicators */}
          <div className="flex justify-center gap-2">
            {['characters', 'story', 'images', 'complete'].map((step, index) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  step === currentStep ? 'bg-purple-400 animate-pulse' :
                  ['characters', 'story', 'images', 'complete'].indexOf(currentStep) > index ? 'bg-green-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Preview content */}
          {characters.length > 0 && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">Characters Created:</h4>
              <div className="text-gray-300 text-sm">
                {characters.map(char => char.name).join(', ')}
              </div>
            </div>
          )}

          {panels.length > 0 && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">Story Panels:</h4>
              <div className="text-gray-300 text-sm">
                {panels.length} comic panels created
              </div>
            </div>
          )}
        </div>

        {!isGenerating && currentStep !== 'complete' && retryAttempts < 2 && (
          <Button 
            onClick={handleRetry}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Generation
          </Button>
        )}

        <p className="text-gray-400 text-sm">
          Creating an engaging comic book experience for {level.concept}
        </p>
      </CardContent>
    </Card>
  );
};
