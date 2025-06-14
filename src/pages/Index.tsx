import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { QuantumRoadmap } from '@/components/QuantumRoadmap';

const Index = () => {
  const [showRoadmap, setShowRoadmap] = useState(false);
  const navigate = useNavigate();

  const handleStartJourney = () => {
    setShowRoadmap(false);
    navigate('/story-board');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Quantum Warrior
          </h1>
          <p className="text-2xl text-purple-200 max-w-3xl mx-auto mb-8">
            Master quantum computing through an epic 100-level journey. Learn the mysteries of the quantum realm and become a true Quantum Warrior!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* 100-Level Journey Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-lg border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-3xl text-white flex items-center gap-2 justify-center">
              <Map className="h-8 w-8 text-blue-400" />
              100-Level Quantum Journey
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg text-center">
              Master quantum computing through 100 carefully crafted levels in our story-driven learning experience!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              size="lg"
              onClick={() => setShowRoadmap(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xl px-8 py-4"
            >
              <Map className="h-6 w-6 mr-3" />
              Start Your Quantum Journey
            </Button>
          </CardContent>
        </Card>

        {/* Story Section */}
        <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-lg border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2 justify-center">
              <BookOpen className="h-6 w-6 text-purple-400" />
              The Quantum Warrior's Tale
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-6 text-lg max-w-3xl mx-auto">
              In a world where reality itself is governed by quantum mechanics, a brave warrior must learn the ancient arts of quantum computing to defeat the Quantum Villain who threatens to collapse all parallel universes into chaos. Progress through 100 levels of increasing complexity and master the quantum realm!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-4">
                <div className="text-4xl font-bold text-blue-400 mb-2">100</div>
                <p className="text-gray-300">Levels to Master</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl font-bold text-purple-400 mb-2">10</div>
                <p className="text-gray-300">Chapters to Explore</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl font-bold text-pink-400 mb-2">∞</div>
                <p className="text-gray-300">Quantum Possibilities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roadmap Modal */}
      {showRoadmap && (
        <QuantumRoadmap
          onStartJourney={handleStartJourney}
          onClose={() => setShowRoadmap(false)}
        />
      )}
    </div>
  );
};

export default Index;
