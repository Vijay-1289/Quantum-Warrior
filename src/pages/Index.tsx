
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, BookOpen, Gamepad, Rocket, Layers } from 'lucide-react';
import { GameHero } from '@/components/GameHero';
import { LevelCard } from '@/components/LevelCard';
import { StoryModal } from '@/components/StoryModal';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showStory, setShowStory] = useState(false);
  const [playerStats, setPlayerStats] = useState({
    quantumKnowledge: 0,
    imageProcessing: 0,
    totalScore: 0
  });
  const { toast } = useToast();

  const levels = [
    {
      id: 1,
      title: "The Awakening",
      description: "Learn about quantum bits and superposition",
      difficulty: "Beginner",
      concept: "Qubits & Superposition",
      icon: Star,
      color: "from-blue-500 to-purple-600",
      unlocked: true
    },
    {
      id: 2,
      title: "Gates of Power",
      description: "Master basic quantum gates (X, Y, Z, H)",
      difficulty: "Beginner",
      concept: "Basic Quantum Gates",
      icon: Layers,
      color: "from-green-500 to-blue-600",
      unlocked: completedLevels.includes(1)
    },
    {
      id: 3,
      title: "Entanglement Mysteries",
      description: "Understand quantum entanglement and Bell states",
      difficulty: "Intermediate",
      concept: "Entanglement",
      icon: Rocket,
      color: "from-purple-500 to-pink-600",
      unlocked: completedLevels.includes(2)
    },
    {
      id: 4,
      title: "Image Vision Quest",
      description: "Learn image processing fundamentals",
      difficulty: "Intermediate",
      concept: "Image Processing Basics",
      icon: BookOpen,
      color: "from-orange-500 to-red-600",
      unlocked: completedLevels.includes(3)
    },
    {
      id: 5,
      title: "Quantum Algorithms",
      description: "Implement Grover's and Shor's algorithms",
      difficulty: "Advanced",
      concept: "Quantum Algorithms",
      icon: Gamepad,
      color: "from-indigo-500 to-purple-600",
      unlocked: completedLevels.includes(4)
    },
    {
      id: 6,
      title: "The Final Battle",
      description: "Combine quantum computing and image processing",
      difficulty: "Expert",
      concept: "Quantum Image Processing",
      icon: Trophy,
      color: "from-yellow-500 to-orange-600",
      unlocked: completedLevels.includes(5)
    }
  ];

  useEffect(() => {
    const savedProgress = localStorage.getItem('quantumWarriorProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCompletedLevels(progress.completedLevels || []);
      setCurrentLevel(progress.currentLevel || 1);
      setPlayerStats(progress.playerStats || { quantumKnowledge: 0, imageProcessing: 0, totalScore: 0 });
    }
  }, []);

  const saveProgress = () => {
    const progress = {
      completedLevels,
      currentLevel,
      playerStats
    };
    localStorage.setItem('quantumWarriorProgress', JSON.stringify(progress));
  };

  const handleLevelComplete = (levelId: number, score: number) => {
    if (!completedLevels.includes(levelId)) {
      setCompletedLevels([...completedLevels, levelId]);
      setPlayerStats(prev => ({
        ...prev,
        quantumKnowledge: prev.quantumKnowledge + (levelId <= 3 ? 20 : 10),
        imageProcessing: prev.imageProcessing + (levelId >= 4 ? 20 : 0),
        totalScore: prev.totalScore + score
      }));
      
      toast({
        title: "Level Completed!",
        description: `You've mastered ${levels.find(l => l.id === levelId)?.concept}!`,
      });
      
      if (levelId < levels.length) {
        setCurrentLevel(levelId + 1);
      }
    }
    saveProgress();
  };

  const startStory = () => {
    setShowStory(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <GameHero 
        playerStats={playerStats}
        onStartStory={startStory}
      />

      {/* Main Game Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <Card className="mb-8 bg-black/20 backdrop-blur-lg border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Your Journey Progress
            </CardTitle>
            <CardDescription className="text-gray-300">
              Master quantum computing and image processing to defeat the quantum villain!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{playerStats.quantumKnowledge}%</div>
                <Progress value={playerStats.quantumKnowledge} className="mt-2" />
                <p className="text-sm text-gray-400 mt-1">Quantum Knowledge</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{playerStats.imageProcessing}%</div>
                <Progress value={playerStats.imageProcessing} className="mt-2" />
                <p className="text-sm text-gray-400 mt-1">Image Processing</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{playerStats.totalScore}</div>
                <p className="text-sm text-gray-400 mt-1">Total Score</p>
              </div>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                Level {currentLevel} • {completedLevels.length}/{levels.length} Completed
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => (
            <LevelCard
              key={level.id}
              level={level}
              isCompleted={completedLevels.includes(level.id)}
              onComplete={(score) => handleLevelComplete(level.id, score)}
            />
          ))}
        </div>

        {/* Story Section */}
        <Card className="mt-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-lg border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-purple-400" />
              The Quantum Warrior's Tale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              In a world where reality itself is governed by quantum mechanics, a brave warrior must learn the ancient arts of quantum computing and image processing to defeat the Quantum Villain who threatens to collapse all parallel universes into chaos.
            </p>
            <Button 
              onClick={startStory}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Begin Your Journey
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Story Modal */}
      <StoryModal 
        isOpen={showStory}
        onClose={() => setShowStory(false)}
        currentLevel={currentLevel}
      />
    </div>
  );
};

export default Index;
