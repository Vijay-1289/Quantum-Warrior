
const GEMINI_API_KEY = 'AIzaSyAv1w55nm72qtpFiij2FCBmQ0TxCAJ0iNg';

export const generateTheoryContent = async (level: any, storyContent?: string): Promise<string> => {
  console.log(`Generating elaborate theory content for Level ${level.id}: ${level.title} - Concept: ${level.concept}`);
  
  try {
    const prompt = `Generate comprehensive educational theory content for a quantum computing learning game.

Level Details:
- Level ID: ${level.id}
- Title: ${level.title}
- Concept: ${level.concept}
- Description: ${level.description}
- Difficulty: ${level.difficulty}
- Story Context: ${level.storyText}

${storyContent ? `
REFERENCE STORY FROM PAGE 2:
${storyContent}

Based on this story context, create an ELABORATE and DETAILED theoretical explanation that builds upon the narrative elements introduced in the story above.` : ''}

Create a comprehensive deep-dive into "${level.concept}" that includes:

1. **Fundamental Theory**: Detailed explanation of ${level.concept} with scientific depth
2. **Mathematical Framework**: Key equations, formulas, and mathematical representations
3. **Quantum Mechanics Context**: How ${level.concept} fits into quantum theory
4. **Physical Interpretation**: What ${level.concept} means physically and conceptually
5. **Experimental Evidence**: Real-world experiments that demonstrate ${level.concept}
6. **Applications**: Practical uses in quantum computing and technology
7. **Advanced Concepts**: Connection to other quantum phenomena
8. **Problem-Solving**: How to apply ${level.concept} in calculations and problems

IMPORTANT REQUIREMENTS:
- This is an ELABORATE theoretical deep-dive - make it comprehensive and detailed
- Focus EXCLUSIVELY on "${level.concept}" with scientific rigor
- Build upon the story context provided to create seamless narrative flow
- Make it appropriate for ${level.difficulty} level but with substantial depth
- Include specific examples, analogies, and detailed explanations
- Length: 800-1000 words for comprehensive coverage
- Use clear headings and well-structured content

Generate content that provides deep theoretical understanding of "${level.concept}" for Level ${level.id}.`;

    console.log('Making Gemini API request for elaborate theory content:', level.concept);
    
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
    console.log(`Generated elaborate theory content for Level ${level.id} (${level.concept}):`, generatedContent.substring(0, 200) + '...');
    
    if (!generatedContent || generatedContent.trim().length < 200) {
      throw new Error('Generated content too short or empty');
    }
    
    return generatedContent;
  } catch (error) {
    console.error('Error generating theory content for level', level.id, 'concept', level.concept, ':', error);
    throw error;
  }
};

export const generateQuizQuestions = async (level: any, theoryContent?: string): Promise<Array<{
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}>> => {
  console.log(`Generating quiz questions for Level ${level.id}: ${level.concept}`);
  
  try {
    const prompt = `Generate 3 challenging multiple-choice quiz questions for a quantum computing learning game.

Level Details:
- Level: ${level.id} - ${level.title}
- Concept: ${level.concept}
- Difficulty: ${level.difficulty}
- Description: ${level.description}

${theoryContent ? `
DETAILED THEORY CONTENT TO REFERENCE:
${theoryContent}

Base the quiz questions on the detailed theory content above. The questions should test understanding of the specific concepts, examples, and explanations provided in the theory content.` : ''}

Create 3 quiz questions that test deep understanding of "${level.concept}" specifically. Each question should:

1. Be directly related to "${level.concept}" and reference the theory content provided
2. Be challenging and appropriate for ${level.difficulty} level
3. Test conceptual understanding, not just memorization
4. Have 4 multiple choice options with only one clearly correct answer
5. Include detailed explanations that reinforce the theory

Return ONLY a JSON array in this exact format:
[
  {
    "question": "Challenging question about ${level.concept} based on the theory?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Detailed explanation referencing the theory content about ${level.concept}"
  },
  {
    "question": "Another challenging question about ${level.concept}?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 1,
    "explanation": "Another detailed explanation about ${level.concept}"
  },
  {
    "question": "Third challenging question about ${level.concept}?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 2,
    "explanation": "Third detailed explanation about ${level.concept}"
  }
]

IMPORTANT: Return ONLY the JSON array, no additional text or formatting.`;

    console.log('Making Gemini API request for quiz questions based on theory for concept:', level.concept);

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
    throw error;
  }
};
