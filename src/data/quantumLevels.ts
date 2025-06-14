
export interface QuantumLevel {
  id: number;
  chapter: number;
  title: string;
  concept: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';
  storyText: string;
  learningObjectives: string[];
  prerequisite?: number[];
  unlocked: boolean;
  completed: boolean;
  stars: number;
  gameType: 'quiz' | 'simulation' | 'puzzle' | 'coding' | 'visualization';
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  color: string;
  icon: string;
  levelRange: [number, number];
}

export const chapters: Chapter[] = [
  {
    id: 1,
    title: "The Quantum Awakening",
    description: "Discover the fundamental differences between classical and quantum worlds",
    color: "from-blue-500 to-purple-600",
    icon: "star",
    levelRange: [1, 10]
  },
  {
    id: 2,
    title: "The Qubit Realm",
    description: "Master the basic building blocks of quantum information",
    color: "from-purple-500 to-pink-600",
    icon: "circle",
    levelRange: [11, 20]
  },
  {
    id: 3,
    title: "Superposition Mysteries",
    description: "Explore the quantum ability to be in multiple states simultaneously",
    color: "from-green-500 to-blue-600",
    icon: "plus",
    levelRange: [21, 30]
  },
  {
    id: 4,
    title: "Gate Mastery",
    description: "Learn to manipulate qubits with quantum gates",
    color: "from-orange-500 to-red-600",
    icon: "grid-2x2",
    levelRange: [31, 45]
  },
  {
    id: 5,
    title: "Entanglement Phenomena",
    description: "Understand the spooky connections between quantum particles",
    color: "from-indigo-500 to-purple-600",
    icon: "heart",
    levelRange: [46, 60]
  },
  {
    id: 6,
    title: "Measurement & Collapse",
    description: "Explore how observation affects quantum systems",
    color: "from-yellow-500 to-orange-600",
    icon: "check",
    levelRange: [61, 70]
  },
  {
    id: 7,
    title: "Circuit Architecture",
    description: "Build complex quantum circuits from basic components",
    color: "from-teal-500 to-blue-600",
    icon: "book",
    levelRange: [71, 80]
  },
  {
    id: 8,
    title: "Quantum Algorithms",
    description: "Implement powerful quantum algorithms",
    color: "from-pink-500 to-red-600",
    icon: "trophy",
    levelRange: [81, 90]
  },
  {
    id: 9,
    title: "Error Correction",
    description: "Learn to protect quantum information from decoherence",
    color: "from-cyan-500 to-purple-600",
    icon: "circle-check",
    levelRange: [91, 95]
  },
  {
    id: 10,
    title: "Quantum Supremacy",
    description: "Master advanced quantum computing concepts",
    color: "from-gradient-to-r from-yellow-400 via-red-500 to-pink-500",
    icon: "star",
    levelRange: [96, 100]
  }
];

export const quantumLevels: QuantumLevel[] = [
  // Chapter 1: The Quantum Awakening (1-10)
  {
    id: 1,
    chapter: 1,
    title: "The Classical World",
    concept: "Classical vs Quantum",
    description: "Understand how classical computers work with bits",
    difficulty: 'Beginner',
    storyText: "In the classical realm, everything is certain. Bits are either 0 or 1, like coins that have definitely landed. But legends speak of a mysterious quantum realm where particles dance between possibilities...",
    learningObjectives: ["Understand classical bits", "Learn binary representation", "Contrast with quantum concepts"],
    unlocked: true,
    completed: false,
    stars: 0,
    gameType: 'visualization'
  },
  {
    id: 2,
    chapter: 1,
    title: "The Quantum Mystery",
    concept: "Quantum Basics",
    description: "First glimpse into the quantum world",
    difficulty: 'Beginner',
    storyText: "You discover an ancient scroll describing particles that can be in multiple states at once. This challenges everything you know about reality...",
    learningObjectives: ["Introduction to quantum concepts", "Quantum vs classical behavior", "Wave-particle duality"],
    prerequisite: [1],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'quiz'
  },
  {
    id: 3,
    chapter: 1,
    title: "The Double Slit Experiment",
    concept: "Wave-Particle Duality",
    description: "Witness the fundamental quantum phenomenon",
    difficulty: 'Beginner',
    storyText: "You perform the legendary double-slit experiment and witness particles behaving like waves, creating interference patterns that defy classical logic...",
    learningObjectives: ["Understand wave-particle duality", "Learn about interference", "Quantum measurement effects"],
    prerequisite: [2],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'simulation'
  },
  {
    id: 4,
    chapter: 1,
    title: "Probability Waves",
    concept: "Quantum Probability",
    description: "Learn how quantum mechanics deals with probability",
    difficulty: 'Beginner',
    storyText: "Unlike classical probability where outcomes are predetermined, quantum probability involves wave functions that describe all possible states simultaneously...",
    learningObjectives: ["Quantum probability concepts", "Wave function basics", "Probability amplitudes"],
    prerequisite: [3],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'puzzle'
  },
  {
    id: 5,
    chapter: 1,
    title: "Schrödinger's Cat",
    concept: "Superposition Paradox",
    description: "Explore the famous thought experiment",
    difficulty: 'Beginner',
    storyText: "You encounter a mystical cat that exists in a superposition of being both alive and dead until observed. This paradox reveals the strange nature of quantum superposition...",
    learningObjectives: ["Superposition concept", "Measurement problem", "Quantum paradoxes"],
    prerequisite: [4],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'visualization'
  },
  {
    id: 6,
    chapter: 1,
    title: "The Uncertainty Principle",
    concept: "Heisenberg Uncertainty",
    description: "Learn about fundamental quantum limits",
    difficulty: 'Beginner',
    storyText: "You discover that the more precisely you know a particle's position, the less you can know about its momentum. This isn't a limitation of measurement tools, but a fundamental property of reality...",
    learningObjectives: ["Uncertainty principle", "Complementary properties", "Quantum limits"],
    prerequisite: [5],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'quiz'
  },
  {
    id: 7,
    chapter: 1,
    title: "Quantum Energy Levels",
    concept: "Discrete Energy States",
    description: "Understand quantized energy in atoms",
    difficulty: 'Beginner',
    storyText: "You learn that electrons in atoms can only exist at specific energy levels, like steps on a mystical staircase. They can jump between levels but never exist in between...",
    learningObjectives: ["Energy quantization", "Atomic orbitals", "Quantum jumps"],
    prerequisite: [6],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'simulation'
  },
  {
    id: 8,
    chapter: 1,
    title: "Photons and Light",
    concept: "Quantum Light",
    description: "Explore the quantum nature of light",
    difficulty: 'Beginner',
    storyText: "Light reveals its dual nature as both wave and particle. Individual photons carry discrete packets of energy, yet collectively they create wave patterns...",
    learningObjectives: ["Photon properties", "Wave-particle duality in light", "Quantum optics basics"],
    prerequisite: [7],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'puzzle'
  },
  {
    id: 9,
    chapter: 1,
    title: "Quantum vs Classical Computing",
    concept: "Computing Paradigms",
    description: "Compare different computational approaches",
    difficulty: 'Beginner',
    storyText: "Classical computers process information sequentially, like reading a book page by page. Quantum computers can process multiple possibilities simultaneously, like reading all pages at once...",
    learningObjectives: ["Classical computing limits", "Quantum advantages", "Computational complexity"],
    prerequisite: [8],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'visualization'
  },
  {
    id: 10,
    chapter: 1,
    title: "The Quantum Leap",
    concept: "Quantum Revolution",
    description: "Understand the potential of quantum technology",
    difficulty: 'Beginner',
    storyText: "You stand at the threshold of the quantum realm, ready to harness its power. The quantum revolution promises to transform cryptography, simulation, and artificial intelligence...",
    learningObjectives: ["Quantum applications", "Future technologies", "Quantum advantage"],
    prerequisite: [9],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'quiz'
  },

  // Chapter 2: The Qubit Realm (11-20)
  {
    id: 11,
    chapter: 2,
    title: "Meet the Qubit",
    concept: "Quantum Bit Basics",
    description: "Introduction to the fundamental unit of quantum information",
    difficulty: 'Beginner',
    storyText: "You encounter your first qubit - a quantum bit that can be 0, 1, or both simultaneously. Unlike classical bits, qubits exist in a realm of infinite possibilities...",
    learningObjectives: ["Qubit definition", "Quantum states", "Bloch sphere introduction"],
    prerequisite: [10],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'visualization'
  },
  {
    id: 12,
    chapter: 2,
    title: "The Bloch Sphere",
    concept: "Qubit Visualization",
    description: "Visualize qubit states on the Bloch sphere",
    difficulty: 'Beginner',
    storyText: "You discover a mystical sphere where every point represents a different qubit state. The north pole is |0⟩, the south pole is |1⟩, and the equator holds superposition states...",
    learningObjectives: ["Bloch sphere geometry", "State visualization", "Polar coordinates"],
    prerequisite: [11],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'simulation'
  },
  {
    id: 13,
    chapter: 2,
    title: "Basis States",
    concept: "Computational Basis",
    description: "Learn about |0⟩ and |1⟩ states",
    difficulty: 'Beginner',
    storyText: "The computational basis states |0⟩ and |1⟩ are the quantum equivalent of classical 0 and 1. These form the foundation upon which all quantum states are built...",
    learningObjectives: ["Basis states", "Dirac notation", "State vectors"],
    prerequisite: [12],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'puzzle'
  },
  {
    id: 14,
    chapter: 2,
    title: "Quantum Superposition",
    concept: "Linear Combinations",
    description: "Create superposition states",
    difficulty: 'Beginner',
    storyText: "You learn to create superposition - a qubit that is simultaneously in states |0⟩ and |1⟩. The qubit exists in all possibilities until the moment of measurement...",
    learningObjectives: ["Superposition principle", "Linear combinations", "Amplitudes"],
    prerequisite: [13],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'visualization'
  },
  {
    id: 15,
    chapter: 2,
    title: "Measurement Magic",
    concept: "Quantum Measurement",
    description: "Understand how measurement affects qubits",
    difficulty: 'Beginner',
    storyText: "The moment you observe a qubit in superposition, it collapses to either |0⟩ or |1⟩. The act of measurement fundamentally changes the quantum system...",
    learningObjectives: ["Measurement process", "State collapse", "Born rule"],
    prerequisite: [14],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'simulation'
  },
  {
    id: 16,
    chapter: 2,
    title: "Phase Relationships",
    concept: "Quantum Phase",
    description: "Explore the hidden dimension of quantum states",
    difficulty: 'Intermediate',
    storyText: "Beyond probability amplitudes lies the mysterious quantum phase - an invisible property that affects how quantum states interfere with each other...",
    learningObjectives: ["Phase concept", "Global vs relative phase", "Interference effects"],
    prerequisite: [15],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'puzzle'
  },
  {
    id: 17,
    chapter: 2,
    title: "Multiple Qubits",
    concept: "Multi-Qubit Systems",
    description: "Scale up to systems with multiple qubits",
    difficulty: 'Intermediate',
    storyText: "As you add more qubits, the quantum system's complexity grows exponentially. Two qubits can represent four states simultaneously, three qubits can represent eight...",
    learningObjectives: ["Multi-qubit states", "Tensor products", "Exponential scaling"],
    prerequisite: [16],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'visualization'
  },
  {
    id: 18,
    chapter: 2,
    title: "Qubit Initialization",
    concept: "State Preparation",
    description: "Learn to prepare qubits in desired states",
    difficulty: 'Intermediate',
    storyText: "Before any quantum computation, qubits must be initialized to a known state. You master the art of preparing qubits in precise quantum states...",
    learningObjectives: ["State preparation", "Initialization methods", "Pure states"],
    prerequisite: [17],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'simulation'
  },
  {
    id: 19,
    chapter: 2,
    title: "Qubit Coherence",
    concept: "Quantum Coherence",
    description: "Understand the fragility of quantum states",
    difficulty: 'Intermediate',
    storyText: "Qubits are delicate creatures. Environmental noise constantly threatens to destroy their quantum properties through a process called decoherence...",
    learningObjectives: ["Coherence time", "Decoherence effects", "Environmental coupling"],
    prerequisite: [18],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'puzzle'
  },
  {
    id: 20,
    chapter: 2,
    title: "The Qubit Arsenal",
    concept: "Qubit Technologies",
    description: "Explore different physical implementations of qubits",
    difficulty: 'Intermediate',
    storyText: "Qubits can be implemented using various physical systems: superconducting circuits, trapped ions, photons, quantum dots. Each has unique advantages and challenges...",
    learningObjectives: ["Qubit implementations", "Physical systems", "Technology comparison"],
    prerequisite: [19],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'quiz'
  },

  // Continue with more levels... (this would continue for all 100 levels)
  // For brevity, I'll add a few more key levels to show the progression

  // Chapter 3: Superposition Mysteries (21-30)
  {
    id: 21,
    chapter: 3,
    title: "The Hadamard Gate",
    concept: "Creating Superposition",
    description: "Master the gate that creates equal superposition",
    difficulty: 'Intermediate',
    storyText: "You discover the Hadamard gate - a quantum transformer that takes definite states and creates perfect superposition. It's your key to unlocking quantum parallelism...",
    learningObjectives: ["Hadamard gate", "Equal superposition", "Gate matrices"],
    prerequisite: [20],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'simulation'
  },

  // Chapter 4: Gate Mastery (31-45)
  {
    id: 31,
    chapter: 4,
    title: "The Pauli Gates",
    concept: "Basic Quantum Gates",
    description: "Learn the fundamental single-qubit gates",
    difficulty: 'Intermediate',
    storyText: "You encounter the Pauli gates - X, Y, and Z - each representing rotations around different axes of the Bloch sphere. These are your basic tools for qubit manipulation...",
    learningObjectives: ["Pauli X, Y, Z gates", "Rotations", "Gate algebra"],
    prerequisite: [30],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'puzzle'
  },

  // Skip to advanced levels...
  
  // Chapter 8: Quantum Algorithms (81-90)
  {
    id: 81,
    chapter: 8,
    title: "Grover's Search",
    concept: "Quantum Search Algorithm",
    description: "Implement the famous quantum search algorithm",
    difficulty: 'Advanced',
    storyText: "You learn Grover's algorithm - a quantum search that can find items in unsorted databases quadratically faster than any classical algorithm...",
    learningObjectives: ["Grover's algorithm", "Amplitude amplification", "Quantum speedup"],
    prerequisite: [80],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'coding'
  },

  // Chapter 10: Quantum Supremacy (96-100)
  {
    id: 96,
    chapter: 10,
    title: "Quantum Error Correction",
    concept: "Protecting Quantum Information",
    description: "Learn to protect qubits from decoherence",
    difficulty: 'Expert',
    storyText: "You master the art of quantum error correction - using redundancy and clever encoding to protect quantum information from the corrupting effects of decoherence...",
    learningObjectives: ["Error correction codes", "Stabilizer formalism", "Fault tolerance"],
    prerequisite: [95],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'coding'
  },
  {
    id: 97,
    chapter: 10,
    title: "Quantum Machine Learning",
    concept: "AI Meets Quantum",
    description: "Explore quantum-enhanced machine learning",
    difficulty: 'Expert',
    storyText: "You discover how quantum computers can potentially accelerate machine learning, using quantum parallelism to process high-dimensional data...",
    learningObjectives: ["Quantum ML", "Variational algorithms", "NISQ applications"],
    prerequisite: [96],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'simulation'
  },
  {
    id: 98,
    chapter: 10,
    title: "Quantum Cryptography",
    concept: "Unbreakable Security",
    description: "Master quantum key distribution",
    difficulty: 'Expert',
    storyText: "You learn quantum cryptography - using the laws of quantum mechanics to create communication channels with provable security based on physics itself...",
    learningObjectives: ["Quantum key distribution", "BB84 protocol", "Quantum security"],
    prerequisite: [97],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'puzzle'
  },
  {
    id: 99,
    chapter: 10,
    title: "Quantum Simulation",
    concept: "Digital Quantum Simulation",
    description: "Simulate quantum systems with quantum computers",
    difficulty: 'Master',
    storyText: "You achieve the ultimate goal - using quantum computers to simulate other quantum systems, unlocking insights into materials, chemistry, and fundamental physics...",
    learningObjectives: ["Quantum simulation", "Trotterization", "Physical applications"],
    prerequisite: [98],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'coding'
  },
  {
    id: 100,
    chapter: 10,
    title: "The Quantum Master",
    concept: "Quantum Supremacy",
    description: "Achieve mastery over the quantum realm",
    difficulty: 'Master',
    storyText: "Congratulations, Quantum Warrior! You have mastered the quantum realm and can now wield its power to solve problems beyond classical reach. The multiverse is safe in your hands!",
    learningObjectives: ["Complete mastery", "Quantum advantage", "Future horizons"],
    prerequisite: [99],
    unlocked: false,
    completed: false,
    stars: 0,
    gameType: 'visualization'
  }
];

// Note: This is a condensed version showing the structure. 
// In the full implementation, all 100 levels would be detailed with complete learning objectives and stories.
