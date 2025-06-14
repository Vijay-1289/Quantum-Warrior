
import { type QuantumLevel } from '@/data/quantumLevels';

const GEMINI_API_KEY = 'AIzaSyDp1_tOfLEFj-SuZkkJ_HudDvR60huRijE';

export const generateTheoryContent = async (level: QuantumLevel): Promise<string> => {
  try {
    const prompt = `Generate comprehensive educational theory content for Level ${level.id}: ${level.title}. 
    
    Topic: ${level.concept}
    Context: ${level.storyText}
    
    Please create detailed educational content that covers:
    1. Fundamental concepts and definitions
    2. Mathematical foundations (if applicable)
    3. Real-world applications and examples
    4. Key principles and properties
    5. Advanced insights and connections to other quantum concepts
    
    Format the content with clear headings and well-structured paragraphs. Make it educational, engaging, and appropriate for learning quantum computing concepts at this level.
    
    Length: Approximately 400-600 words.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generating theory content:', error);
    return getFallbackTheoryContent(level);
  }
};

export const generateQuizQuestions = async (level: QuantumLevel): Promise<Array<{
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}>> => {
  try {
    const prompt = `Generate 3 multiple-choice quiz questions for Level ${level.id}: ${level.title}.
    
    Topic: ${level.concept}
    Context: ${level.storyText}
    
    For each question, provide:
    1. A clear, specific question about the topic
    2. Four multiple choice options (A, B, C, D)
    3. The correct answer (indicate which option)
    4. A brief explanation of why the answer is correct
    
    Format as JSON array with this structure:
    [
      {
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct": 0,
        "explanation": "Explanation here"
      }
    ]
    
    Make questions educational and appropriate for the quantum computing level.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Could not parse quiz questions from API response');
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    return getFallbackQuestions(level);
  }
};

const getFallbackTheoryContent = (level: QuantumLevel): string => {
  const fallbackContent: Record<number, string> = {
    1: `CLASSICAL VS QUANTUM COMPUTING: THE FUNDAMENTAL PARADIGM SHIFT

Classical Computing Foundation:
Classical computers process information using bits - fundamental units that exist in definite states of either 0 or 1. This binary system forms the backbone of all classical computation, where logic gates perform deterministic operations on these well-defined states.

The Quantum Revolution:
Quantum computing introduces qubits (quantum bits) that can exist in superposition - a fundamental quantum phenomenon where a particle simultaneously occupies multiple states. Unlike classical bits, qubits can be in a combination of |0⟩ and |1⟩ states, mathematically represented as α|0⟩ + β|1⟩, where α and β are complex probability amplitudes.`,

    2: `QUBITS AND SUPERPOSITION: QUANTUM STATES EXPLAINED

Mathematical Foundation:
A qubit state |ψ⟩ = α|0⟩ + β|1⟩ represents a unit vector in a two-dimensional complex vector space. The coefficients α and β are complex numbers satisfying |α|² + |β|² = 1.

Bloch Sphere Representation:
Any qubit state can be visualized on the Bloch sphere where computational basis states |0⟩ and |1⟩ are at the poles, and superposition states exist across the sphere's surface.`,

    3: `QUANTUM GATES AND CIRCUIT OPERATIONS

Universal Gate Sets:
Quantum computation relies on quantum gates - unitary operations that reversibly transform qubit states. The Clifford+T gate set provides universal quantum computation capability.

Single-Qubit Operations:
Hadamard gates create superposition, Pauli gates perform rotations, and phase gates modify quantum phases without changing probability amplitudes.`,

    4: `DIGITAL IMAGE PROCESSING FUNDAMENTALS

Pixel-Based Representation:
Digital images consist of discrete picture elements arranged in grid structures, with color information encoded in various formats like RGB or grayscale values.

Processing Techniques:
Image enhancement involves filtering, convolution operations, histogram equalization, and morphological transformations to improve visual quality.`,

    5: `QUANTUM ALGORITHMS AND COMPUTATIONAL ADVANTAGES

Grover's Search Algorithm:
Provides quadratic speedup for unstructured search problems through amplitude amplification, requiring only O(√N) operations compared to classical O(N).

Quantum Speedup Sources:
Quantum algorithms achieve advantages through superposition enabling parallel exploration, quantum interference amplifying correct answers, and entanglement creating impossible classical correlations.`,

    6: `QUANTUM IMAGE PROCESSING: NEXT-GENERATION COMPUTING

Quantum Image Representations:
FRQI and NEQR encodings store classical pixel data in quantum superposition states, enabling parallel processing of multiple image regions simultaneously.

Future Applications:
Quantum-enhanced computer vision, pattern recognition with exponential speedups, and quantum machine learning for advanced image analysis tasks.`
  };
  
  return fallbackContent[level.id] || fallbackContent[1];
};

const getFallbackQuestions = (level: QuantumLevel) => {
  const fallbackQuestions: Record<number, Array<{
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }>> = {
    1: [{
      question: "What is the fundamental difference between classical bits and qubits?",
      options: [
        "Qubits can only be 0 or 1",
        "Qubits can be in superposition of 0 and 1",
        "Qubits are faster than bits",
        "Qubits use less energy"
      ],
      correct: 1,
      explanation: "Qubits can exist in superposition, meaning they can be in a combination of both 0 and 1 states simultaneously, unlike classical bits which are definitively either 0 or 1."
    }],
    2: [{
      question: "What does the Bloch sphere represent in quantum computing?",
      options: [
        "The speed of quantum operations",
        "All possible states of a single qubit",
        "The energy levels of quantum systems",
        "The error rates in quantum computers"
      ],
      correct: 1,
      explanation: "The Bloch sphere is a geometric representation of all possible pure states of a single qubit, with computational basis states |0⟩ and |1⟩ at the poles."
    }],
    // Add more fallback questions for other levels...
  };
  
  return fallbackQuestions[level.id] || fallbackQuestions[1];
};
