const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = `You are an expert React developer. Your task is to convert HTML content into modern React components.
For each major section in the HTML (header, navigation, main content areas, etc.), create a complete, working React component.

Each component in your response must include the actual implementation code, not just descriptions.
Example of the expected component format:

{
  "componentName": "Header",
  "purpose": "Main site header with navigation",
  "preview": {
    "jsx": \`import React from 'react';
import { Box, Heading, Text, Link } from '@chakra-ui/react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <Box as="header" className="header container-fluid">
      <Box className="page_inner">
        <Box className="row">
          <Box className="col-sm-8">
            <Link href="/">
              <Heading as="h1">{title}</Heading>
              {subtitle && <Text as="small">{subtitle}</Text>}
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;\`,
    "css": \`.header {
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
}

.header h1 {
  margin: 0;
  font-size: 2rem;
}

.header small {
  display: block;
  font-size: 1rem;
  color: #666;
}\`,
    "props": \`// Example usage:
<Header 
  title="Books to Scrape"
  subtitle="We love being scraped!"
/>\`
  }
}

Format your response as a structured JSON object with the following schema:
{
  "components": [{
    "componentName": string,
    "purpose": string,
    "preview": {
      "jsx": string (complete React component code),
      "css": string (component styles),
      "props": string (example usage)
    },
    "props": Record<string, string>,
    "styling": Record<string, string>,
    "accessibility": Record<string, string>
  }],
  "themeSystem": {
    "colors": {
      "primary": Record<string, string>,
      "accent": Record<string, string>,
      "background": Record<string, string>,
      "text": Record<string, string>
    },
    "typography": {
      "fonts": Record<string, string>,
      "fontSizes": Record<string, string>
    },
    "spacing": Record<string, string>,
    "breakpoints": Record<string, string>
  },
  "implementation": {
    "setup": string,
    "dependencies": string[],
    "structure": string
  }
}

IMPORTANT: For each component:
1. Include ALL necessary imports
2. Use TypeScript interfaces for props
3. Include complete, working JSX code
4. Include actual CSS/styling code
5. Show example usage with props
6. Make components responsive
7. Include proper accessibility attributes
`;

async function analyzeContent(htmlContent) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4-1106-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { 
                    role: "user", 
                    content: `Convert this HTML into React components:
                    ${htmlContent}

                    Requirements:
                    1. Create separate components for each major section (header, navigation, content areas)
                    2. Use Chakra UI components where appropriate
                    3. Include TypeScript interfaces for all props
                    4. Provide complete, working component code that can be copied directly into a new file
                    5. Include all necessary imports
                    6. Add responsive styles
                    7. Include example usage with sample props
                    
                    The response MUST include the actual React component code in the preview.jsx field, not just descriptions.`
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1,
            max_tokens: 4000,
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
