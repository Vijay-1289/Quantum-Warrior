
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { characters, conversations, type Conversation } from '@/data/characters';

interface ComicConversationProps {
  levelId: number;
  onComplete: () => void;
}

export const ComicConversation: React.FC<ComicConversationProps> = ({ levelId, onComplete }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  const conversation = conversations.find(c => c.levelId === levelId);
  
  if (!conversation) {
    onComplete();
    return null;
  }

  const currentMessage = conversation.messages[currentMessageIndex];
  const character = characters.find(c => c.id === currentMessage.characterId);
  
  const nextMessage = () => {
    if (currentMessageIndex < conversation.messages.length - 1) {
      setIsTyping(true);
      setTimeout(() => {
        setCurrentMessageIndex(prev => prev + 1);
        setIsTyping(false);
      }, 500);
    } else {
      onComplete();
    }
  };

  const getEmotionStyle = (emotion: string) => {
    switch (emotion) {
      case 'excited': return 'animate-bounce';
      case 'worried': return 'animate-pulse';
      case 'confused': return 'animate-[wiggle_1s_ease-in-out_infinite]';
      case 'determined': return 'scale-110';
      default: return '';
    }
  };

  const getSpeechBubbleStyle = (role: string) => {
    switch (role) {
      case 'hero': return 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50';
      case 'mentor': return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50';
      case 'antagonist': return 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-400/50';
      case 'guide': return 'bg-gradient-to-r from-yellow-500/20 to-green-500/20 border-yellow-400/50';
      default: return 'bg-gray-500/20 border-gray-400/50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full bg-gradient-to-br from-slate-900 to-purple-900 border border-purple-500/20">
        <CardContent className="p-8">
          {/* Comic Panel */}
          <div className="min-h-[400px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 mb-6 border-2 border-purple-400/30 relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20 animate-pulse" />
            
            {/* Character Display */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center">
                {/* Character Avatar */}
                <div className={`text-8xl mb-4 ${getEmotionStyle(currentMessage.emotion)} transition-all duration-500`}>
                  {character?.avatar}
                </div>
                
                {/* Character Name */}
                <div className={`text-2xl font-bold mb-6 bg-gradient-to-r ${character?.color} bg-clip-text text-transparent`}>
                  {character?.name}
                </div>
                
                {/* Speech Bubble */}
                <div className={`relative max-w-2xl mx-auto p-6 rounded-2xl border-2 ${getSpeechBubbleStyle(character?.role || 'normal')} backdrop-blur-sm`}>
                  {/* Speech Bubble Tail */}
                  <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 ${getSpeechBubbleStyle(character?.role || 'normal').split(' ')[0]}`} />
                  
                  {/* Message Text */}
                  <p className={`text-lg text-white leading-relaxed ${isTyping ? 'animate-pulse' : ''}`}>
                    {isTyping ? '...' : currentMessage.text}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Comic Panel Border Effect */}
            <div className="absolute inset-0 border-4 border-white/10 rounded-lg pointer-events-none" />
          </div>
          
          {/* Progress Indicator */}
          <div className="flex justify-center mb-4">
            <div className="flex gap-2">
              {conversation.messages.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentMessageIndex ? 'bg-purple-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-400">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">
                {currentMessageIndex + 1} / {conversation.messages.length}
              </span>
            </div>
            
            <Button
              onClick={nextMessage}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={isTyping}
            >
              {currentMessageIndex < conversation.messages.length - 1 ? (
                <>
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                'Continue Adventure'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
