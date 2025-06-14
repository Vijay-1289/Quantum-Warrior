
export interface Character {
  id: string;
  name: string;
  avatar: string;
  color: string;
  role: string;
}

export interface Conversation {
  id: number;
  levelId: number;
  messages: {
    characterId: string;
    text: string;
    emotion: 'normal' | 'excited' | 'confused' | 'determined' | 'worried';
  }[];
}

export const characters: Character[] = [
  {
    id: 'quantum-warrior',
    name: 'Quantum Warrior',
    avatar: '🛡️',
    color: 'from-blue-400 to-purple-400',
    role: 'hero'
  },
  {
    id: 'quantum-sage',
    name: 'Quantum Sage',
    avatar: '🧙‍♂️',
    color: 'from-purple-400 to-pink-400',
    role: 'mentor'
  },
  {
    id: 'quantum-villain',
    name: 'Quantum Villain',
    avatar: '👹',
    color: 'from-red-400 to-orange-400',
    role: 'antagonist'
  },
  {
    id: 'quantum-spirit',
    name: 'Quantum Spirit',
    avatar: '✨',
    color: 'from-yellow-400 to-green-400',
    role: 'guide'
  }
];

export const conversations: Conversation[] = [
  {
    id: 1,
    levelId: 1,
    messages: [
      {
        characterId: 'quantum-sage',
        text: "Welcome, young warrior! The fabric of reality itself is in danger.",
        emotion: 'worried'
      },
      {
        characterId: 'quantum-warrior',
        text: "I'm ready to face any challenge! But what exactly threatens our world?",
        emotion: 'determined'
      },
      {
        characterId: 'quantum-sage',
        text: "The Quantum Villain seeks to collapse all possibilities into chaos. You must learn the ancient art of quantum computing to stop him.",
        emotion: 'normal'
      },
      {
        characterId: 'quantum-warrior',
        text: "Quantum computing? That sounds... complex.",
        emotion: 'confused'
      },
      {
        characterId: 'quantum-sage',
        text: "Fear not! We'll start with the basics. First, you must understand qubits - the building blocks of quantum reality.",
        emotion: 'excited'
      }
    ]
  },
  {
    id: 2,
    levelId: 5,
    messages: [
      {
        characterId: 'quantum-spirit',
        text: "Your mastery of basic qubits grows strong, warrior!",
        emotion: 'excited'
      },
      {
        characterId: 'quantum-warrior',
        text: "I'm beginning to understand... but there's so much more to learn.",
        emotion: 'determined'
      },
      {
        characterId: 'quantum-villain',
        text: "Foolish warrior! Your feeble understanding cannot stop the great collapse!",
        emotion: 'normal'
      },
      {
        characterId: 'quantum-warrior',
        text: "We'll see about that! I won't let you destroy all realities!",
        emotion: 'determined'
      }
    ]
  },
  {
    id: 3,
    levelId: 10,
    messages: [
      {
        characterId: 'quantum-sage',
        text: "Excellent progress! Now you must learn about quantum gates - the tools that manipulate reality itself.",
        emotion: 'excited'
      },
      {
        characterId: 'quantum-warrior',
        text: "These gates... they can change the very nature of qubits?",
        emotion: 'confused'
      },
      {
        characterId: 'quantum-sage',
        text: "Indeed! The X-gate flips states, the Hadamard creates superposition. Master these, and you master quantum reality!",
        emotion: 'normal'
      }
    ]
  }
];
