
import React from 'react';

// Enhanced SVG illustrations with more accurate quantum representations
export const QuantumWarriorIntro = () => (
  <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-lg">
    <defs>
      <radialGradient id="warriorGradient" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="50%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1E293B" />
      </radialGradient>
      <linearGradient id="swordGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#FFA500" />
      </linearGradient>
    </defs>
    {/* Quantum Warrior */}
    <circle cx="150" cy="120" r="45" fill="url(#warriorGradient)" />
    <circle cx="135" cy="110" r="6" fill="#00FFFF" />
    <circle cx="165" cy="110" r="6" fill="#00FFFF" />
    <path d="M135 130 Q150 145 165 130" stroke="#00FFFF" strokeWidth="3" fill="none" />
    {/* Quantum Armor */}
    <rect x="125" y="165" width="50" height="90" fill="url(#warriorGradient)" rx="15" />
    <rect x="105" y="175" width="25" height="70" fill="url(#warriorGradient)" rx="12" />
    <rect x="170" y="175" width="25" height="70" fill="url(#warriorGradient)" rx="12" />
    {/* Quantum Sword */}
    <rect x="200" y="100" width="8" height="80" fill="url(#swordGradient)" rx="4" />
    <rect x="190" y="95" width="28" height="15" fill="url(#swordGradient)" rx="3" />
    {/* Quantum Energy Aura */}
    {[...Array(8)].map((_, i) => (
      <circle key={i} cx={150 + Math.cos(i * Math.PI / 4) * 60} cy={180 + Math.sin(i * Math.PI / 4) * 60} r="4" fill="#00FFFF" opacity="0.6">
        <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
      </circle>
    ))}
    <text x="150" y="340" textAnchor="middle" fill="#6B46C1" fontSize="18" fontWeight="bold">Quantum Warrior</text>
  </svg>
);

export const QuantumSuperposition = () => (
  <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-lg">
    <defs>
      <linearGradient id="superposGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="25%" stopColor="#EC4899" />
        <stop offset="50%" stopColor="#3B82F6" />
        <stop offset="75%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    {/* Bloch Sphere */}
    <circle cx="150" cy="200" r="80" fill="none" stroke="#3B82F6" strokeWidth="3" opacity="0.6" />
    <ellipse cx="150" cy="200" rx="80" ry="20" fill="none" stroke="#3B82F6" strokeWidth="2" opacity="0.4" />
    <line x1="70" y1="200" x2="230" y2="200" stroke="#3B82F6" strokeWidth="2" opacity="0.4" />
    <line x1="150" y1="120" x2="150" y2="280" stroke="#3B82F6" strokeWidth="2" opacity="0.4" />
    {/* Superposition Wave */}
    <path d="M50 200 Q75 150 100 200 Q125 250 150 200 Q175 150 200 200 Q225 250 250 200" 
          fill="none" stroke="url(#superposGradient)" strokeWidth="4">
      <animate attributeName="d" 
               values="M50 200 Q75 150 100 200 Q125 250 150 200 Q175 150 200 200 Q225 250 250 200;
                       M50 200 Q75 250 100 200 Q125 150 150 200 Q175 250 200 200 Q225 150 250 200;
                       M50 200 Q75 150 100 200 Q125 250 150 200 Q175 150 200 200 Q225 250 250 200" 
               dur="3s" repeatCount="indefinite" />
    </path>
    {/* State Labels */}
    <text x="150" y="110" textAnchor="middle" fill="#3B82F6" fontSize="16" fontWeight="bold">|0⟩</text>
    <text x="150" y="295" textAnchor="middle" fill="#3B82F6" fontSize="16" fontWeight="bold">|1⟩</text>
    <text x="150" y="340" textAnchor="middle" fill="#6B46C1" fontSize="16" fontWeight="bold">Quantum Superposition</text>
  </svg>
);

export const QuantumKnowledgeTest = () => (
  <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-lg">
    <defs>
      <radialGradient id="knowledgeGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#3B82F6" />
      </radialGradient>
    </defs>
    {/* Brain/Knowledge Symbol */}
    <circle cx="150" cy="200" r="70" fill="url(#knowledgeGradient)" opacity="0.8" />
    {/* Neural Network Pattern */}
    {[...Array(12)].map((_, i) => {
      const angle = (i * Math.PI * 2) / 12;
      const x = 150 + Math.cos(angle) * 50;
      const y = 200 + Math.sin(angle) * 50;
      return (
        <g key={i}>
          <circle cx={x} cy={y} r="6" fill="#FFD700" opacity="0.8">
            <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1 + i * 0.1}s`} repeatCount="indefinite" />
          </circle>
          <line x1="150" y1="200" x2={x} y2={y} stroke="#FFD700" strokeWidth="2" opacity="0.6" />
        </g>
      );
    })}
    {/* Question Mark */}
    <text x="150" y="210" textAnchor="middle" fill="#FFFFFF" fontSize="48" fontWeight="bold">?</text>
    <text x="150" y="340" textAnchor="middle" fill="#6B46C1" fontSize="16" fontWeight="bold">Test Your Knowledge</text>
  </svg>
);

export const QuantumBattleReady = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-lg">
    <defs>
      <radialGradient id="battleGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#DC2626" />
      </radialGradient>
    </defs>
    {/* Battle Ready Symbol */}
    <circle cx="100" cy="100" r="80" fill="url(#battleGradient)" opacity="0.8">
      <animate attributeName="r" values="80;85;80" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <polygon points="100,40 120,80 160,80 130,110 140,150 100,130 60,150 70,110 40,80 80,80" fill="#FFD700">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
    </polygon>
    <text x="100" y="190" textAnchor="middle" fill="#6B46C1" fontSize="14" fontWeight="bold">Ready for Battle!</text>
  </svg>
);

export const QuantumGates = () => (
  <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-lg">
    <defs>
      <linearGradient id="gateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
    {/* Quantum Circuit */}
    <line x1="50" y1="150" x2="250" y2="150" stroke="#3B82F6" strokeWidth="3" />
    <line x1="50" y1="250" x2="250" y2="250" stroke="#3B82F6" strokeWidth="3" />
    
    {/* Hadamard Gate */}
    <rect x="100" y="130" width="40" height="40" fill="url(#gateGradient)" stroke="#1E40AF" strokeWidth="2" />
    <text x="120" y="155" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">H</text>
    
    {/* CNOT Gate */}
    <circle cx="180" cy="150" r="8" fill="#3B82F6" />
    <line x1="180" y1="150" x2="180" y2="250" stroke="#3B82F6" strokeWidth="3" />
    <circle cx="180" cy="250" r="15" fill="none" stroke="#3B82F6" strokeWidth="3" />
    <line x1="172" y1="250" x2="188" y2="250" stroke="#3B82F6" strokeWidth="3" />
    <line x1="180" y1="242" x2="180" y2="258" stroke="#3B82F6" strokeWidth="3" />
    
    <text x="150" y="340" textAnchor="middle" fill="#6B46C1" fontSize="16" fontWeight="bold">Quantum Gates</text>
  </svg>
);

export const QuantumEntanglement = () => (
  <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-lg">
    <defs>
      <radialGradient id="entanglementGradient" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </radialGradient>
    </defs>
    {/* Entangled Particles */}
    <circle cx="100" cy="200" r="30" fill="url(#entanglementGradient)" opacity="0.8">
      <animate attributeName="r" values="30;35;30" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="200" cy="200" r="30" fill="url(#entanglementGradient)" opacity="0.8">
      <animate attributeName="r" values="35;30;35" dur="2s" repeatCount="indefinite" />
    </circle>
    
    {/* Entanglement Connection */}
    <path d="M130 200 Q150 180 170 200" stroke="#EC4899" strokeWidth="4" fill="none">
      <animate attributeName="d" values="M130 200 Q150 180 170 200;M130 200 Q150 220 170 200;M130 200 Q150 180 170 200" dur="1.5s" repeatCount="indefinite" />
    </path>
    <path d="M130 200 Q150 220 170 200" stroke="#8B5CF6" strokeWidth="4" fill="none">
      <animate attributeName="d" values="M130 200 Q150 220 170 200;M130 200 Q150 180 170 200;M130 200 Q150 220 170 200" dur="1.5s" repeatCount="indefinite" />
    </path>
    
    <text x="150" y="340" textAnchor="middle" fill="#6B46C1" fontSize="16" fontWeight="bold">Quantum Entanglement</text>
  </svg>
);

// Helper function to get the appropriate illustration component
export const getIllustrationComponent = (key: string) => {
  const illustrations: Record<string, React.ComponentType> = {
    'quantum_warrior_intro': QuantumWarriorIntro,
    'quantum_superposition': QuantumSuperposition,
    'quantum_knowledge_test': QuantumKnowledgeTest,
    'quantum_battle_ready': QuantumBattleReady,
    'quantum_gates': QuantumGates,
    'quantum_entanglement': QuantumEntanglement
  };
  
  return illustrations[key] || QuantumWarriorIntro;
};
