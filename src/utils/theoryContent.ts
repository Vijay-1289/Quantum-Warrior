
const GEMINI_API_KEY = 'AIzaSyDp1_tOfLEFj-SuZkkJ_HudDvR60huRijE';

export const generateTheoryContent = async (level: any): Promise<string> => {
  console.log(`Generating theory content for Level ${level.id}: ${level.title} - Concept: ${level.concept}`);
  
  try {
    const prompt = `Generate comprehensive educational theory content for a quantum computing learning game.

Level Details:
- Level ID: ${level.id}
- Title: ${level.title}
- Concept: ${level.concept}
- Description: ${level.description}
- Difficulty: ${level.difficulty}
- Story Context: ${level.storyText}

Please create detailed educational content specifically about "${level.concept}" that includes:

1. **Fundamental Concepts**: Clear explanation of ${level.concept} and its core principles
2. **Mathematical Foundations**: Key equations, formulas, or mathematical representations (if applicable)
3. **Quantum Computing Context**: How ${level.concept} specifically relates to quantum computing
4. **Real-World Applications**: Practical examples and applications of ${level.concept}
5. **Key Insights**: Important properties, behaviors, and characteristics
6. **Advanced Connections**: How ${level.concept} connects to other quantum concepts

IMPORTANT REQUIREMENTS:
- Focus EXCLUSIVELY on "${level.concept}" - do not use generic quantum computing content
- Make it appropriate for ${level.difficulty} level learners
- Use clear headings and well-structured paragraphs
- Length: 500-700 words
- Be educational and engaging

Generate content that is unique to Level ${level.id} and the specific concept of "${level.concept}".`;

    console.log('Making Gemini API request with prompt for concept:', level.concept);
    
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
          maxOutputTokens: 2048,
        }
      })
    });

    console.log('Gemini API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API Response received successfully for level', level.id);
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
      console.error('Invalid API response structure:', data);
      throw new Error('Invalid API response structure');
    }
    
    const generatedContent = data.candidates[0].content.parts[0].text;
    console.log(`Generated theory content for Level ${level.id} (${level.concept}):`, generatedContent.substring(0, 200) + '...');
    
    if (!generatedContent || generatedContent.trim().length < 100) {
      throw new Error('Generated content too short or empty');
    }
    
    return generatedContent;
  } catch (error) {
    console.error('Error generating theory content for level', level.id, 'concept', level.concept, ':', error);
    return getFallbackTheoryContent(level);
  }
};

export const generateQuizQuestions = async (level: any): Promise<Array<{
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}>> => {
  console.log(`Generating quiz questions for Level ${level.id}: ${level.concept}`);
  
  try {
    const prompt = `Generate 3 multiple-choice quiz questions for a quantum computing learning game.

Level Details:
- Level: ${level.id} - ${level.title}
- Concept: ${level.concept}
- Difficulty: ${level.difficulty}
- Description: ${level.description}

Create 3 quiz questions that test understanding of "${level.concept}" specifically. Each question should:

1. Be directly related to "${level.concept}" (not generic quantum computing)
2. Be appropriate for ${level.difficulty} level
3. Have 4 multiple choice options
4. Include a clear explanation

Return ONLY a JSON array in this exact format:
[
  {
    "question": "Specific question about ${level.concept}?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Detailed explanation about ${level.concept}"
  },
  {
    "question": "Another question about ${level.concept}?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 1,
    "explanation": "Another explanation about ${level.concept}"
  },
  {
    "question": "Third question about ${level.concept}?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 2,
    "explanation": "Third explanation about ${level.concept}"
  }
]

IMPORTANT: Return ONLY the JSON array, no additional text or formatting.`;

    console.log('Making Gemini API request for quiz questions for concept:', level.concept);

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
          maxOutputTokens: 1536,
        }
      })
    });

    console.log('Quiz API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Quiz API Error:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    console.log('Quiz API raw response for level', level.id, ':', responseText);
    
    // Clean the response and extract JSON
    let cleanedResponse = responseText.trim();
    
    // Remove markdown code blocks if present
    cleanedResponse = cleanedResponse.replace(/```json\s*|\s*```/g, '');
    cleanedResponse = cleanedResponse.replace(/```\s*|\s*```/g, '');
    
    // Extract JSON array
    const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        const questions = JSON.parse(jsonMatch[0]);
        console.log(`Generated ${questions.length} quiz questions for Level ${level.id} (${level.concept})`);
        
        // Validate questions structure
        if (Array.isArray(questions) && questions.length > 0) {
          const validQuestions = questions.filter(q => 
            q.question && q.options && Array.isArray(q.options) && 
            q.options.length === 4 && typeof q.correct === 'number' && q.explanation
          );
          
          if (validQuestions.length > 0) {
            return validQuestions;
          }
        }
      } catch (parseError) {
        console.error('Failed to parse quiz questions JSON:', parseError);
      }
    }
    
    throw new Error('Could not parse valid quiz questions from API response');
  } catch (error) {
    console.error('Error generating quiz questions for level', level.id, ':', error);
    return getFallbackQuestions(level);
  }
};

const getFallbackTheoryContent = (level: any): string => {
  console.log(`Using fallback theory content for Level ${level.id} - ${level.concept}`);
  
  const conceptSpecificContent: Record<string, string> = {
    'Classical vs Quantum': `# CLASSICAL VS QUANTUM COMPUTING: THE FUNDAMENTAL PARADIGM SHIFT

## Understanding the Core Differences
Classical computers process information using bits that exist in definite states of 0 or 1. This binary foundation creates deterministic computational pathways where each operation produces predictable results.

Quantum computing introduces qubits that can exist in superposition - simultaneously representing both 0 and 1 states. This fundamental difference enables quantum computers to explore multiple computational paths simultaneously.

## The Quantum Advantage
While classical systems follow strict logical pathways, quantum systems harness quantum mechanical phenomena like superposition, entanglement, and interference to process information in fundamentally new ways.

## Practical Implications
The transition from classical to quantum computing represents more than a technological upgrade - it's a complete paradigm shift in how we approach computational problems and information processing.`,

    'Quantum Basics': `# QUANTUM COMPUTING FUNDAMENTALS

## Core Principles
Quantum computing harnesses three fundamental quantum mechanical phenomena: superposition, entanglement, and quantum interference. These principles work together to enable computational capabilities impossible with classical systems.

## Superposition
Allows qubits to exist in multiple states simultaneously, creating parallel computational pathways that can be explored at once.

## Entanglement
Creates correlations between qubits that persist regardless of physical separation, enabling complex quantum operations.

## Quantum Interference
Amplifies correct answers while canceling incorrect ones through careful manipulation of quantum states.

## Building Blocks
Understanding these quantum principles is essential for grasping how quantum algorithms achieve their remarkable speedups.`,

    'Qubits and Superposition': `# QUBITS AND QUANTUM SUPERPOSITION

## Mathematical Foundation
A qubit state |ψ⟩ = α|0⟩ + β|1⟩ represents a unit vector in a two-dimensional complex vector space. The coefficients α and β are complex numbers satisfying |α|² + |β|² = 1.

## Bloch Sphere Visualization
Any qubit state can be represented on the Bloch sphere, where computational basis states |0⟩ and |1⟩ are at the poles, and superposition states exist across the sphere's surface.

## Measurement and Collapse
When measured, a qubit in superposition collapses to either |0⟩ or |1⟩ with probabilities |α|² and |β|² respectively. This probabilistic nature is fundamental to quantum computation.

## Quantum Gates
Single-qubit operations can be visualized as rotations on the Bloch sphere, providing an intuitive understanding of quantum operations.`
  };

  // Generate a unique fallback based on the level's specific concept
  const baseContent = conceptSpecificContent[level.concept] || conceptSpecificContent['Quantum Basics'];
  
  return `${baseContent}

## Level ${level.id} Context
${level.description}

This level specifically focuses on "${level.concept}" within the context of quantum computing education. The concepts explored here build upon previous knowledge and prepare you for more advanced quantum computing applications.

---
*Note: This is fallback content. For the best learning experience, ensure you have an active internet connection for AI-generated personalized content.*`;
};

const getFallbackQuestions = (level: any) => {
  console.log(`Using fallback quiz questions for Level ${level.id} - ${level.concept}`);
  
  const conceptQuestions: Record<string, any[]> = {
    'Classical vs Quantum': [
      {
        question: `In Level ${level.id}, what is the fundamental difference between classical and quantum computing?`,
        options: [
          "Classical uses bits (0 or 1), quantum uses qubits (superposition)",
          "Classical is faster than quantum",
          "Quantum only works with binary data",
          "There is no significant difference"
        ],
        correct: 0,
        explanation: "The key difference is that classical bits exist in definite states (0 or 1), while qubits can exist in superposition of both states simultaneously."
      },
      {
        question: "What enables quantum computers to potentially solve certain problems faster than classical computers?",
        options: [
          "Better processors",
          "Quantum parallelism through superposition",
          "More memory",
          "Faster clock speeds"
        ],
        correct: 1,
        explanation: "Quantum computers can explore multiple solution paths simultaneously through superposition, potentially offering exponential speedups for specific problems."
      }
    ],
    'Quantum Basics': [
      {
        question: `What are the three fundamental quantum phenomena covered in Level ${level.id}?`,
        options: [
          "Speed, Memory, Processing",
          "Superposition, Entanglement, Interference",
          "Input, Output, Storage",
          "Classical, Digital, Analog"
        ],
        correct: 1,
        explanation: "The three fundamental quantum phenomena are superposition (multiple states), entanglement (quantum correlations), and interference (amplifying correct answers)."
      }
    ]
  };

  const questions = conceptQuestions[level.concept] || conceptQuestions['Quantum Basics'];
  
  return questions.map(q => ({
    ...q,
    question: q.question.includes('Level') ? q.question : `In Level ${level.id} (${level.concept}): ${q.question}`
  }));
};
