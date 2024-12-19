const { OpenAI } = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const cheerio = require('cheerio');
require('dotenv').config();

// Initialize AI clients
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

const DATA_EXTRACTION_PROMPT = `You are an expert data extraction and analysis assistant. Extract structured data and insights from the HTML content, focusing on:

1. Page Summary (Required):
  • Overview: A clear, concise summary of what the page is about
  • Key Insights: List 3-5 important takeaways or insights from the content. These should be specific, actionable, or noteworthy points that provide value to the reader
  • Topics: Main themes or subjects covered
  • Target Audience: Who this content is primarily intended for
  • Content Type: Type of page (article, product page, blog post, etc.)

2. Content Elements:
  • Titles: Extract all headings (H1, H2, H3…) with their hierarchy
  • Paragraphs: Main text content, excluding boilerplate
  • Links: Important links with context
  • Products: If present, extract product details (name, price, description, SKU)
  • Metadata: Published date, author, categories, etc.

3. Return a Structured JSON Object with:
{
  "summary": {
    "overview": "Clear description of the page content",
    "insights": [
      "Key insight 1 - specific and valuable",
      "Key insight 2 - focus on important findings",
      "Key insight 3 - actionable takeaway"
    ],
    "topics": ["Topic 1", "Topic 2"],
    "audience": "Target audience description",
    "contentType": "Type of content"
  },
  "titles": [{"type": "h1", "text": "Title"}],
  "paragraphs": ["Main content..."],
  "links": [{"text": "Link text", "url": "URL"}],
  "products": [{
    "title": "Product name",
    "price": 99.99,
    "description": "Description",
    "sku": "SKU123"
  }],
  "metadata": {
    "author": "Author name",
    "publishDate": "Date",
    "categories": ["Category 1"]
  }
}`;

const MODELS = {
    'gpt4': {
        id: 'gpt-4-turbo-preview',
        name: 'GPT-4 Turbo',
        provider: 'openai',
        description: 'Latest GPT-4 model with improved analysis capabilities',
        available: true,
        maxTokens: 4000,
        systemPrompt: DATA_EXTRACTION_PROMPT
    },
    'gpt35': {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        description: 'Fast and efficient for basic content analysis',
        available: true,
        maxTokens: 4000,
        systemPrompt: DATA_EXTRACTION_PROMPT
    },
    'claude': {
        id: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
        provider: 'anthropic',
        description: 'Advanced model with strong analytical capabilities',
        available: true,
        maxTokens: 4000,
        systemPrompt: DATA_EXTRACTION_PROMPT
    }
};

async function analyzeWithOpenAI(html, modelConfig) {
    const completion = await openai.chat.completions.create({
        model: modelConfig.id,
        messages: [
            { role: "system", content: modelConfig.systemPrompt },
            { role: "user", content: `Extract structured data from this HTML:\n${html}` }
        ],
        temperature: 0.2,
        max_tokens: modelConfig.maxTokens,
        response_format: { type: "json_object" }
    });

    return completion.choices[0].message.content;
}

async function analyzeWithClaude(content, modelConfig) {
    try {
        const prompt = `${modelConfig.systemPrompt}\n\nHere is the content to analyze:\n${content}\n\nProvide the analysis in the exact JSON format specified above.`;
        
        const response = await anthropic.messages.create({
            model: modelConfig.id,
            max_tokens: modelConfig.maxTokens,
            messages: [
                { 
                    role: "user", 
                    content: prompt 
                }
            ]
        });

        // Extract the content from the response
        const responseContent = response.content[0].text;
        
        // Find the JSON part of the response
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error analyzing with Claude:', error);
        throw error;
    }
}

async function analyzeWithAnthropic(html, modelConfig) {
    const message = await anthropic.messages.create({
        model: modelConfig.id,
        max_tokens: modelConfig.maxTokens,
        messages: [
            { role: "system", content: modelConfig.systemPrompt },
            { role: "user", content: `Extract structured data from this HTML:\n${html}` }
        ],
        temperature: 0.2
    });

    return message.content[0].text;
}

async function analyzeContent(htmlContent, modelId = 'gpt4') {
    try {
        console.log(`\n🔍 Analyzing with ${MODELS[modelId].name}...`);
        const $ = cheerio.load(htmlContent);
        
        // Extract main content and basic metadata
        console.log('📦 Extracting content...');
        const mainContent = $('main').html() || $('body').html();
        const basicMetadata = {
            title: $('title').text(),
            description: $('meta[name="description"]').attr('content'),
            keywords: $('meta[name="keywords"]').attr('content'),
            ogTitle: $('meta[property="og:title"]').attr('content'),
            ogDescription: $('meta[property="og:description"]').attr('content'),
            ogImage: $('meta[property="og:image"]').attr('content')
        };

        // Choose the appropriate AI provider
        const modelConfig = MODELS[modelId];
        if (!modelConfig.available) {
            throw new Error(`Model ${modelConfig.name} is not yet available`);
        }

        let result;
        if (modelConfig.provider === 'openai') {
            result = await analyzeWithOpenAI(mainContent, modelConfig);
        } else if (modelConfig.provider === 'anthropic') {
            if (modelConfig.name.includes('Claude')) {
                result = await analyzeWithClaude(mainContent, modelConfig);
            } else {
                result = await analyzeWithAnthropic(mainContent, modelConfig);
            }
        } else {
            throw new Error(`Provider ${modelConfig.provider} not implemented`);
        }

        // Parse the result and merge metadata
        const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;
        parsedResult.metadata = { ...parsedResult.metadata, ...basicMetadata };

        // Log extraction summary
        console.log(`✅ Extraction complete
📝 Content found:
  • Summary: ${parsedResult.summary ? 'Yes' : 'No'}
  • Titles: ${(parsedResult.titles || []).length}
  • Paragraphs: ${(parsedResult.paragraphs || []).length}
  • Links: ${(parsedResult.links || []).length}
  • Products: ${(parsedResult.products || []).length}
`);
        
        return parsedResult;
    } catch (error) {
        console.error('\n❌ Error in data extraction:', error);
        throw error;
    }
}

module.exports = {
    analyzeContent,
    MODELS
};
