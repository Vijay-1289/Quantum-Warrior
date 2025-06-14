
const GEMINI_API_KEY = 'AIzaSyDp1_tOfLEFj-SuZkkJ_HudDvR60huRijE';

export const generateTheoryContent = async (level: any): Promise<string> => {
  console.log(`Generating theory content for Level ${level.id}: ${level.title}`);
  
  try {
    const prompt = `Generate comprehensive educational theory content for Level ${level.id}: ${level.title}. 
    
    Topic: ${level.concept}
    Context: ${level.storyText}
    Difficulty: ${level.difficulty}
    
    Please create detailed educational content that covers:
    1. Fundamental concepts and definitions specific to "${level.concept}"
    2. Mathematical foundations (if applicable) 
    3. Real-world applications and examples
    4. Key principles and properties
    5. Advanced insights and connections to other quantum concepts
    
    Format the content with clear headings and well-structured paragraphs. Make it educational, engaging, and appropriate for ${level.difficulty} level learning of quantum computing concepts.
    
    IMPORTANT: Focus specifically on "${level.concept}" - do not use generic quantum computing content.
    
    Length: Approximately 500-700 words.`;

    console.log('Making API request to Gemini...');
    
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
          maxOutputTokens: 2048,
        }
      })
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response received successfully');
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid API response structure');
    }
    
    const generatedContent = data.candidates[0].content.parts[0].text;
    console.log(`Generated content length: ${generatedContent.length} characters`);
    
    return generatedContent;
  } catch (error) {
    console.error('Error generating theory content:', error);
    return getFallbackTheoryContent(level);
  }
};

export const generateQuizQuestions = async (level: any): Promise<Array<{
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}>> => {
  console.log(`Generating quiz questions for Level ${level.id}: ${level.title}`);
  
  try {
    const prompt = `Generate 3 multiple-choice quiz questions for Level ${level.id}: ${level.title}.
    
    Topic: ${level.concept}
    Context: ${level.storyText}
    Difficulty: ${level.difficulty}
    
    Focus specifically on "${level.concept}" concepts. For each question, provide:
    1. A clear, specific question about the topic
    2. Four multiple choice options (A, B, C, D)
    3. The correct answer (indicate which option number: 0, 1, 2, or 3)
    4. A brief explanation of why the answer is correct
    
    Format as JSON array with this exact structure:
    [
      {
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct": 0,
        "explanation": "Explanation here"
      }
    ]
    
    Make questions educational and appropriate for ${level.difficulty} level quantum computing.
    IMPORTANT: Return ONLY the JSON array, no additional text.`;

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
          maxOutputTokens: 1536,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    console.log('Quiz API response:', responseText);
    
    // Extract JSON from the response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const questions = JSON.parse(jsonMatch[0]);
      console.log(`Generated ${questions.length} quiz questions`);
      return questions;
    }
    
    throw new Error('Could not parse quiz questions from API response');
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    return getFallbackQuestions(level);
  }
};

const getFallbackTheoryContent = (level: any): string => {
  console.log(`Using fallback content for Level ${level.id}`);
  
  // Generate specific fallback content based on the level's concept
  const conceptSpecificContent = {
    'Classical vs Quantum': `CLASSICAL VS QUANTUM COMPUTING: THE FUNDAMENTAL PARADIGM SHIFT

Understanding the Core Differences:
Classical computers process information using bits that exist in definite states of 0 or 1. This binary foundation creates deterministic computational pathways where each operation produces predictable results.

Quantum computing introduces qubits that can exist in superposition - simultaneously representing both 0 and 1 states. This fundamental difference enables quantum computers to explore multiple computational paths simultaneously, offering potential exponential speedups for specific problems.

Practical Implications:
The transition from classical to quantum computing represents more than a technological upgrade - it's a complete paradigm shift in how we approach computational problems and information processing.`,

    'Quantum Basics': `QUANTUM COMPUTING FUNDAMENTALS

Core Principles:
Quantum computing harnesses three fundamental quantum mechanical phenomena: superposition, entanglement, and quantum interference. These principles work together to enable computational capabilities impossible with classical systems.

Superposition allows qubits to exist in multiple states simultaneously, creating parallel computational pathways. Entanglement creates correlations between qubits that persist regardless of physical separation. Quantum interference amplifies correct answers while canceling incorrect ones.

Building Blocks:
Understanding these quantum principles is essential for grasping how quantum algorithms achieve their remarkable speedups and why certain problems are particularly well-suited for quantum solutions.`,

    'Qubits and Superposition': `QUBITS AND QUANTUM SUPERPOSITION

Mathematical Foundation:
A qubit state |ψ⟩ = α|0⟩ + β|1⟩ represents a unit vector in a two-dimensional complex vector space. The coefficients α and β are complex numbers satisfying the normalization condition |α|² + |β|² = 1.

Bloch Sphere Visualization:
Any qubit state can be represented on the Bloch sphere, where computational basis states |0⟩ and |1⟩ are at the poles, and superposition states exist across the sphere's surface. This geometric representation helps visualize quantum operations as rotations on the sphere.

Measurement and Collapse:
When measured, a qubit in superposition collapses to either |0⟩ or |1⟩ with probabilities |α|² and |β|² respectively. This probabilistic nature is fundamental to quantum computation.`
  };

  return conceptSpecificContent[level.concept as keyof typeof conceptSpecificContent] || 
         conceptSpecificContent['Quantum Basics'];
};

const getFallbackQuestions = (level: any) => {
  console.log(`Using fallback questions for Level ${level.id}`);
  
  return [{
    question: `What is the main concept covered in Level ${level.id}: ${level.title}?`,
    options: [
      level.concept,
      "Classical computing only",
      "Traditional programming",
      "Basic mathematics"
    ],
    correct: 0,
    explanation: `Level ${level.id} focuses specifically on ${level.concept}, which is fundamental to understanding quantum computing principles.`
  }];
};
