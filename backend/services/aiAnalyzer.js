const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = `You are an expert React developer specializing in modern, responsive web development.
Your task is to analyze HTML content and provide complete, production-ready React components with styling.

For each major section or pattern you identify, provide:

1. Component Structure:
   - Detailed React component code using TypeScript and modern React practices
   - Proper prop typing and interfaces
   - Styled-components or Chakra UI styling
   - Complete import statements
   - Any required hooks or utilities

2. Component Documentation:
   - Purpose and functionality
   - Props interface explanation
   - Usage examples
   - Styling customization options

3. Implementation Details:
   - State management considerations
   - Performance optimization suggestions
   - Accessibility features
   - Responsive design approach

4. Theme Customization:
   - Color scheme variables
   - Spacing and layout variables
   - Typography settings
   - Breakpoint configurations

Format your response as a structured JSON object with the following schema:
{
  "components": [{
    "name": string,
    "description": string,
    "code": string,
    "props": {
      "interface": string,
      "description": Object
    },
    "styling": {
      "theme": Object,
      "customization": string
    },
    "usage": string,
    "accessibility": string,
    "responsive": string
  }],
  "themeSystem": {
    "colors": Object,
    "spacing": Object,
    "typography": Object,
    "breakpoints": Object
  },
  "implementation": {
    "setup": string,
    "dependencies": string[],
    "structure": string
  }
}`;

async function analyzeContent(htmlContent) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4-1106-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { 
                    role: "user", 
                    content: `Analyze this HTML content and create modern, responsive React components:
                    ${htmlContent}
                    
                    Focus on:
                    - Creating reusable, well-structured components
                    - Modern styling with Chakra UI
                    - Responsive design patterns
                    - Accessibility best practices
                    - Theme customization options
                    - Complete implementation details`
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error analyzing content:', error);
        throw error;
    }
}

module.exports = {
    analyzeContent
};
