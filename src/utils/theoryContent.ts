
const GEMINI_API_KEY = 'AIzaSyAv1w55nm72qtpFiij2FCBmQ0TxCAJ0iNg';

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
    throw error; // Don't fall back to mock data - let the component handle the error
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
    throw error; // Don't fall back to mock data - let the component handle the error
  }
};
