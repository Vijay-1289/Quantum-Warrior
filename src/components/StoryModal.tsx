
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Scroll, Sword, Star, Zap } from 'lucide-react';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
}

export const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose, currentLevel }) => {
  const getStoryContent = (level: number) => {
    const stories = {
      1: {
        title: "The Quantum Prophecy",
        content: `In the mystical realm of Quantopia, where reality itself obeys the laws of quantum mechanics, 
        a great darkness has emerged. The Quantum Villain, master of collapsed wave functions and destroyer of coherence, 
        threatens to merge all parallel universes into a single, chaotic timeline.
        
        You are the chosen Quantum Warrior, blessed with the ability to understand and manipulate quantum states. 
        Your journey begins with learning the fundamental building blocks of quantum reality - the mysterious qubits 
        that can exist in multiple states simultaneously through the power of superposition.`,
        icon: Star
      },
      2: {
        title: "The Gates of Power",
        content: `Having mastered the basics of qubits, you discover the ancient Quantum Gates - mystical portals 
        that can transform quantum states. The X-Gate flips qubits like a magical sword, the Hadamard Gate creates 
        superposition like a spell of uncertainty, and the Pauli gates (Y and Z) rotate qubits through dimensions 
        unknown to classical minds.
        
        These gates are your weapons against the Quantum Villain. Master them, and you'll gain the power to 
        manipulate quantum reality itself.`,
        icon: Sword
      },
      3: {
        title: "The Entanglement Mystery",
        content: `As your powers grow, you discover the most mysterious quantum phenomenon - entanglement. 
        When particles become entangled, they share an instantaneous connection across infinite distances, 
        defying the very nature of space and time.
        
        The Quantum Villain uses this power to corrupt entire universes simultaneously. You must learn to 
        harness entanglement yourself, creating Bell states and understanding the spooky action at a distance 
        that even Einstein found troubling.`,
        icon: Zap
      },
      4: {
        title: "Vision in the Quantum Realm",
        content: `Your quest takes an unexpected turn as you realize the Quantum Villain is manipulating not just 
        quantum states, but the very images and visual information across realities. To counter this threat, 
        you must master the ancient art of Image Processing.
        
        Learn to see patterns in pixels, understand how digital images encode information, and discover how 
        filters and transformations can reveal hidden truths in visual data.`,
        icon: Scroll
      },
      5: {
        title: "The Algorithm of Power",
        content: `Now wielding both quantum and image processing knowledge, you're ready to learn the legendary 
        Quantum Algorithms. Grover's Algorithm will help you search through the multiverse to find the Villain's 
        hiding place, while Shor's Algorithm will break the cryptographic barriers protecting his fortress.
        
        These algorithms represent the pinnacle of quantum computing - the fusion of mathematics, physics, 
        and computational power.`,
        icon: Star
      },
      6: {
        title: "The Final Confrontation",
        content: `The time has come for the ultimate battle. Armed with complete knowledge of quantum computing 
        and image processing, you face the Quantum Villain in his fortress of collapsed realities. 
        
        You must combine everything you've learned - quantum circuits, image analysis, and algorithmic thinking - 
        to restore balance to the multiverse and save all of existence from quantum chaos.`,
        icon: Sword
      }
    };

    return stories[level as keyof typeof stories] || stories[1];
  };

  const story = getStoryContent(currentLevel);
  const IconComponent = story.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-purple-500/20">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-purple-600/20 rounded-full">
              <IconComponent className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-white mb-2">
            {story.title}
          </DialogTitle>
        </DialogHeader>
        
        <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
          <CardContent className="p-6">
            <div className="prose prose-invert max-w-none">
              {story.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-300 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center pt-4">
          <Button 
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Continue Your Journey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
