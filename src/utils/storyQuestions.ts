
import { type QuantumLevel } from '@/data/quantumLevels';

export interface StoryQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const getStoryQuestions = (levelId: number): StoryQuestion[] => {
  const questionBank: Record<number, StoryQuestion[]> = {
    1: [ // Classical vs Quantum Computing
      {
        question: "What is the fundamental difference between a classical bit and a qubit?",
        options: [
          "A qubit can only be 0 or 1",
          "A qubit can exist in superposition of 0 and 1 states",
          "A qubit is faster than a bit",
          "A qubit uses less energy"
        ],
        correctAnswer: 1,
        explanation: "Unlike classical bits that are either 0 or 1, qubits can exist in a quantum superposition of both states simultaneously, written as α|0⟩ + β|1⟩."
      },
      {
        question: "What gives quantum computers their potential advantage over classical computers?",
        options: [
          "They use less electricity",
          "They can process multiple possibilities simultaneously through superposition",
          "They are smaller in size",
          "They are easier to program"
        ],
        correctAnswer: 1,
        explanation: "Quantum computers leverage superposition and entanglement to explore multiple computational paths simultaneously, potentially solving certain problems exponentially faster than classical computers."
      },
      {
        question: "In classical computing, how many states can a bit represent at any given time?",
        options: [
          "Infinite states",
          "Two states: 0 and 1, but only one at a time",
          "Multiple states simultaneously",
          "It depends on the processor"
        ],
        correctAnswer: 1,
        explanation: "Classical bits are deterministic and can only be in one definite state at a time: either 0 or 1. This is fundamentally different from quantum bits (qubits) which can be in superposition."
      }
    ],
    2: [ // Qubits & Superposition
      {
        question: "What does it mean for a qubit to be in superposition?",
        options: [
          "The qubit is broken and needs repair",
          "The qubit exists in a combination of both |0⟩ and |1⟩ states simultaneously",
          "The qubit is switching rapidly between 0 and 1",
          "The qubit can store more than one bit of information"
        ],
        correctAnswer: 1,
        explanation: "Superposition means the qubit exists in a quantum state that is a linear combination of the basis states |0⟩ and |1⟩, written as α|0⟩ + β|1⟩, where α and β are probability amplitudes."
      },
      {
        question: "What happens when you measure a qubit that is in superposition?",
        options: [
          "You get both 0 and 1 as results",
          "The measurement fails",
          "The superposition collapses and you get either 0 or 1 with certain probabilities",
          "The qubit becomes unusable"
        ],
        correctAnswer: 2,
        explanation: "Measurement causes the quantum superposition to collapse. The qubit will be found in either the |0⟩ or |1⟩ state, with probabilities determined by the squared magnitudes of the amplitudes |α|² and |β|²."
      },
      {
        question: "How is a qubit's superposition state mathematically represented?",
        options: [
          "As a simple 0 or 1",
          "As α|0⟩ + β|1⟩ where α and β are complex probability amplitudes",
          "As a percentage between 0% and 100%",
          "As a binary string"
        ],
        correctAnswer: 1,
        explanation: "A qubit in superposition is written as α|0⟩ + β|1⟩, where α and β are complex numbers called probability amplitudes. The probabilities of measuring 0 or 1 are |α|² and |β|² respectively, and |α|² + |β|² = 1."
      }
    ],
    3: [ // Quantum Gates & Operations
      {
        question: "What does the Hadamard gate do to a qubit in the |0⟩ state?",
        options: [
          "It flips it to |1⟩",
          "It creates an equal superposition: (|0⟩ + |1⟩)/√2",
          "It measures the qubit",
          "It does nothing"
        ],
        correctAnswer: 1,
        explanation: "The Hadamard gate transforms |0⟩ into (|0⟩ + |1⟩)/√2, creating an equal superposition where the qubit has a 50% probability of being measured as 0 or 1."
      },
      {
        question: "What is the purpose of the Pauli-X gate?",
        options: [
          "To create superposition",
          "To flip the qubit state: |0⟩ becomes |1⟩ and |1⟩ becomes |0⟩",
          "To measure the qubit",
          "To entangle two qubits"
        ],
        correctAnswer: 1,
        explanation: "The Pauli-X gate (also called the NOT gate) is the quantum equivalent of a classical NOT operation. It flips the computational basis states: X|0⟩ = |1⟩ and X|1⟩ = |0⟩."
      },
      {
        question: "Why are quantum gates represented as unitary matrices?",
        options: [
          "Because they're easier to compute",
          "Because quantum evolution must be reversible and preserve probability",
          "Because classical gates use the same representation",
          "Because they take up less memory"
        ],
        correctAnswer: 1,
        explanation: "Quantum gates must be unitary (reversible) operations because quantum mechanics requires that the total probability is conserved and that quantum evolution is reversible. Unitary matrices preserve the normalization of quantum states."
      }
    ],
    4: [ // Image Processing Basics
      {
        question: "What is a pixel in digital image processing?",
        options: [
          "A type of camera lens",
          "The smallest controllable element of a digital image",
          "A color enhancement filter",
          "A file compression algorithm"
        ],
        correctAnswer: 1,
        explanation: "A pixel (picture element) is the smallest controllable element of a digital image. Each pixel contains color information (like RGB values) and together they form the complete image when arranged in a grid."
      },
      {
        question: "What does RGB stand for in digital imaging?",
        options: [
          "Real, Generated, Binary",
          "Red, Green, Blue - the three primary colors of light",
          "Resolution, Gamma, Brightness",
          "Raster, Graphics, Bitmap"
        ],
        correctAnswer: 1,
        explanation: "RGB represents the three primary colors of light: Red, Green, and Blue. Each pixel in an RGB image has intensity values for these three color channels, typically ranging from 0 to 255, allowing for millions of possible colors."
      },
      {
        question: "What is the purpose of image filtering in digital image processing?",
        options: [
          "To reduce file size only",
          "To enhance, modify, or extract features from images using mathematical operations",
          "To change the image format",
          "To add watermarks to images"
        ],
        correctAnswer: 1,
        explanation: "Image filtering applies mathematical operations (convolutions, transforms) to modify images for various purposes like noise reduction, edge detection, blurring, sharpening, or feature enhancement. Filters are fundamental tools in computer vision and image analysis."
      }
    ],
    5: [ // Quantum Algorithms
      {
        question: "What problem does Grover's algorithm solve more efficiently than classical algorithms?",
        options: [
          "Factoring large numbers",
          "Searching through unsorted databases",
          "Matrix multiplication",
          "Sorting lists of numbers"
        ],
        correctAnswer: 1,
        explanation: "Grover's algorithm provides a quadratic speedup for searching unsorted databases. While classical algorithms require O(N) time on average to find an item, Grover's algorithm needs only O(√N) time, offering significant speedup for large databases."
      },
      {
        question: "What makes Shor's algorithm revolutionary for cryptography?",
        options: [
          "It can create unbreakable encryption",
          "It can factor large integers exponentially faster than known classical algorithms",
          "It generates truly random numbers",
          "It compresses data without loss"
        ],
        correctAnswer: 1,
        explanation: "Shor's algorithm can factor large integers exponentially faster than the best known classical algorithms. This threatens RSA encryption, which relies on the computational difficulty of factoring large numbers for its security."
      },
      {
        question: "How do quantum algorithms achieve their computational advantages?",
        options: [
          "By using faster quantum processors",
          "By leveraging quantum superposition and interference to explore multiple solution paths simultaneously",
          "By using more memory efficiently",
          "By running on specialized quantum hardware only"
        ],
        correctAnswer: 1,
        explanation: "Quantum algorithms exploit quantum superposition to explore many possible solutions simultaneously (quantum parallelism) and use quantum interference to amplify the probability of correct answers while canceling out incorrect ones."
      }
    ],
    6: [ // Quantum Image Processing
      {
        question: "What is the main challenge in quantum image processing?",
        options: [
          "Quantum computers are too slow for image processing",
          "Efficiently encoding classical pixel data into quantum states while preserving spatial information",
          "Quantum computers cannot display colors",
          "Images require too much quantum memory"
        ],
        correctAnswer: 1,
        explanation: "The primary challenge is efficiently mapping classical image data into quantum states. Various quantum image representations (like FRQI - Flexible Representation of Quantum Images, NEQR - Novel Enhanced Quantum Representation) have been proposed to encode pixel information into quantum amplitudes while maintaining spatial relationships."
      },
      {
        question: "How could quantum entanglement potentially improve image recognition?",
        options: [
          "By making images display faster",
          "By enabling simultaneous analysis of correlated features across different parts of an image",
          "By reducing image file sizes",
          "By automatically enhancing image colors"
        ],
        correctAnswer: 1,
        explanation: "Quantum entanglement could allow quantum image processing algorithms to detect and analyze correlations between different spatial regions of an image simultaneously, potentially offering exponential advantages in pattern recognition and feature detection tasks."
      },
      {
        question: "What potential advantage could quantum image processing offer over classical methods?",
        options: [
          "Better image compression ratios",
          "Exponential speedup for certain image analysis tasks through quantum parallelism",
          "Higher resolution image displays",
          "Automatic image colorization"
        ],
        correctAnswer: 1,
        explanation: "Quantum image processing could theoretically provide exponential speedups for certain image analysis tasks by processing multiple image transformations in superposition and using quantum algorithms like Grover's search for pattern matching that would be computationally intensive for classical systems."
      }
    ]
  };
  
  return questionBank[levelId] || questionBank[1];
};

export const getStoryContent = (level: QuantumLevel): string => {
  const storyEnhancements: Record<number, string> = {
    1: "In the realm where classical and quantum worlds collide, you discover that reality itself can exist in multiple states. The ancient quantum masters speak of bits that can be both 0 and 1 simultaneously - a concept that challenges everything you thought you knew about information.",
    2: "Deep in the quantum realm, you encounter your first qubit - a mysterious entity that defies classical logic. Unlike the binary certainty of classical bits, this quantum warrior can dance between states, existing in a superposition that holds infinite possibilities until the moment of observation collapses it into reality.",
    3: "The quantum gates stand before you like ancient portals, each one capable of manipulating the very fabric of quantum reality. The Hadamard gate whispers secrets of superposition, while the Pauli gates offer the power to flip and rotate quantum states. Master these gates, and you master the building blocks of quantum computation.",
    4: "You enter the digital realm where images are composed of countless pixels, each holding color information in RGB channels. Here, classical image processing techniques await your mastery - filters that can enhance, blur, sharpen, and transform visual data through mathematical operations that reveal hidden patterns.",
    5: "In the algorithmic sanctum, you discover the legendary quantum algorithms that promise to revolutionize computation. Grover's algorithm offers the power to search through vast databases with quadratic speedup, while Shor's algorithm threatens to break the cryptographic foundations of the digital world.",
    6: "At the convergence of quantum computing and image processing, you find the cutting edge of technological evolution. Here, quantum states encode pixel information in ways that classical computers cannot fathom, promising exponential speedups for image analysis tasks through the mysterious power of quantum entanglement and superposition."
  };
  
  return storyEnhancements[level.id] || level.storyText;
};
