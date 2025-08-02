import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 0.7, // Reduced from 1 for more consistent responses
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Example outputs for different types of AI requests
const EXAMPLE_PROMPTS = {
  summary: {
    input: "Job Title: Software Engineer",
    output: {
      "summaries": [
        {
          "experience_level": "Fresher",
          "summary": "Recent graduate with strong foundation in software development principles and programming languages. Eager to apply academic knowledge and learn industry best practices in a collaborative team environment."
        },
        {
          "experience_level": "Mid Level",
          "summary": "Experienced software engineer with 3-5 years of hands-on development experience. Proven track record of delivering scalable solutions and mentoring junior developers while contributing to technical architecture decisions."
        },
        {
          "experience_level": "Experienced",
          "summary": "Senior software engineer with 8+ years of expertise in full-stack development and system architecture. Demonstrated leadership in complex projects, technical strategy, and driving innovation across multiple teams."
        }
      ]
    }
  },
  experience: {
    input: "position title: Senior Frontend Developer",
    output: "<ul><li>Led development of responsive web applications using React.js and TypeScript</li><li>Optimized application performance resulting in 40% improvement in load times</li><li>Mentored junior developers and conducted code reviews</li><li>Collaborated with UX/UI teams to implement design systems</li><li>Implemented automated testing strategies with Jest and Cypress</li></ul>"
  }
};

// Function to create enhanced prompts with examples
const createPromptWithExamples = (prompt, type = 'summary') => {
  const example = EXAMPLE_PROMPTS[type];
  if (!example) return prompt;

  return `
${prompt}

Here's an example of the expected output format:

Input: "${example.input}"

Output: ${JSON.stringify(example.output, null, 2)}

Please provide your response in the exact same format as the example above.
`;
};

// Create a fresh chat session for each request to avoid context interference
const createFreshChatSession = () => {
  return model.startChat({
    generationConfig,
    history: [], // Empty history for fresh start
  });
};

// Add retry logic for failed requests with fresh sessions
const sendMessageWithRetry = async (prompt, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Create a fresh chat session for each attempt
      const freshSession = createFreshChatSession();
      const result = await freshSession.sendMessage(prompt);
      return result;
    } catch (error) {
      console.error(`AI request attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw error; // Re-throw on final attempt
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// Enhanced function that includes examples and uses fresh sessions
const sendMessageWithExamples = async (prompt, type = 'summary', maxRetries = 3) => {
  const enhancedPrompt = createPromptWithExamples(prompt, type);
  return sendMessageWithRetry(enhancedPrompt, maxRetries);
};

// Legacy export for backward compatibility (but now uses fresh sessions)
export const AIChatSession = {
  sendMessage: async (prompt) => {
    const freshSession = createFreshChatSession();
    return freshSession.sendMessage(prompt);
  }
};

// Export the retry function and enhanced function
export { sendMessageWithRetry, sendMessageWithExamples, EXAMPLE_PROMPTS };
