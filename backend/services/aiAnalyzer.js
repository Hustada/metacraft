const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = `You are an expert React developer who specializes in converting HTML into modern, reusable React components.
Your task is to analyze HTML content and provide:
1. A structured analysis of the HTML layout
2. React components for major sections
3. Theme recommendations

Format your response as a JSON object with this exact structure:

{
  "structure": {
    "header": {
      "type": "header",
      "children": [
        {
          "type": string,
          "className": string,
          "text": string,
          "children": array
        }
      ]
    },
    "main": {
      "type": "main",
      "children": [
        {
          "type": string,
          "className": string,
          "text": string,
          "children": array
        }
      ]
    }
  },
  "components": string (complete React component code),
  "html": string (formatted HTML code),
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
  }
}

Requirements for the components field:
1. Create separate components for major sections (Header, Main, etc.)
2. Use Material-UI components
3. Include TypeScript interfaces for props
4. Include all necessary imports
5. Make components responsive
6. Add proper accessibility attributes
7. Include example usage with props

Example component format:
const Header = () => {
  return (
    <header>
      <nav className="navbar">
        <div className="logo">Example Site</div>
        <ul className="nav-links">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
    </header>
  );
};

const Main = () => {
  return (
    <main>
      <section className="hero">
        <h1>Welcome to our site</h1>
        <p>This is a beautiful hero section with engaging content.</p>
      </section>
    </main>
  );
};`;

async function analyzeContent(htmlContent) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4-1106-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { 
                    role: "user", 
                    content: `Analyze this HTML and convert it into React components following the exact format specified:
                    ${htmlContent}`
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
