const OpenAI = require('openai');
const { Anthropic } = require('@anthropic-ai/sdk');
const { DATA_EXTRACTION_PROMPT } = require('./prompts');
const { analyzeContent } = require('./analyzers');
const cheerio = require('cheerio');

class AIAnalyzer {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async analyzeWithGPT(html, modelId) {
    try {
      const $ = cheerio.load(html);
      
      // Clean the HTML by removing scripts, styles, and comments
      $('script').remove();
      $('style').remove();
      $('noscript').remove();
      $('iframe').remove();
      
      // Extract visible text content
      const cleanHtml = $('body').html();
      
      const prompt = DATA_EXTRACTION_PROMPT;
      const content = cleanHtml.substring(0, 15000); // Limit content length
      
      const response = await this.openai.chat.completions.create({
        model: modelId,
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: `Analyze this HTML content:\n${content}` }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      });

      const extractedData = JSON.parse(response.choices[0].message.content);
      return await analyzeContent(extractedData);
    } catch (error) {
      console.error('GPT analysis error:', error);
      throw new Error('Failed to analyze content with GPT');
    }
  }

  async analyzeWithClaude(html) {
    try {
      const content = this.cleanHtml(html);
      
      const response = await this.anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 4096,
        system: "You are a content analyzer. Your responses must be valid JSON objects following the exact schema provided. Do not include any explanatory text or markdown formatting.",
        messages: [
          {
            role: 'user',
            content: `Analyze this HTML content and return a JSON object. Do not include any explanatory text or markdown formatting. Return only the JSON object that matches this schema:

{
  "summary": {
    "overview": "Brief overview of the content",
    "insights": ["key insight 1", "key insight 2"],
    "topics": ["topic 1", "topic 2"],
    "audience": "intended audience",
    "contentType": "type of content (article, blog post, etc.)"
  },
  "titles": [
    {
      "type": "main/sub/section",
      "text": "title text"
    }
  ],
  "paragraphs": ["paragraph 1", "paragraph 2"],
  "links": [
    {
      "text": "link text",
      "url": "link url",
      "type": "internal/external"
    }
  ],
  "metadata": {
    "author": "author name if available",
    "publishDate": "publication date if available",
    "categories": ["category1", "category2"],
    "description": "meta description if available",
    "keywords": ["keyword1", "keyword2"],
    "url": "page url",
    "analyzedAt": "current timestamp",
    "model": "model name"
  }
}

HTML Content to analyze:
${content}`
          }
        ],
        temperature: 0.1
      });

      // Debug logging
      console.log('Claude raw response:', response.content[0].text);

      // Extract the JSON string from Claude's response
      const jsonStr = response.content[0].text.trim();
      
      // Parse the JSON, handling potential formatting issues
      let extractedData;
      try {
        // Try parsing directly first
        extractedData = JSON.parse(jsonStr);
      } catch (parseError) {
        console.log('Direct JSON parse failed:', parseError.message);
        
        // Try to extract JSON from markdown code blocks
        const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          console.log('Found JSON in code block:', jsonMatch[1].trim());
          extractedData = JSON.parse(jsonMatch[1].trim());
        } else {
          // Try to find anything that looks like a JSON object
          const possibleJson = jsonStr.match(/\{[\s\S]*\}/);
          if (possibleJson) {
            console.log('Found possible JSON object:', possibleJson[0]);
            extractedData = JSON.parse(possibleJson[0]);
          } else {
            console.log('No valid JSON found in response');
            throw new Error('Could not parse Claude response as JSON');
          }
        }
      }

      return await analyzeContent(extractedData);
    } catch (error) {
      console.error('Claude analysis error:', error);
      throw new Error('Failed to analyze content with Claude');
    }
  }

  cleanHtml(html) {
    const $ = cheerio.load(html);
    $('script').remove();
    $('style').remove();
    $('noscript').remove();
    $('iframe').remove();
    return $('body').html().substring(0, 15000);
  }

  async analyze(url, html, modelId) {
    try {
      let result;
      
      if (modelId === 'gpt4') {
        result = await this.analyzeWithGPT(html, 'gpt-4-turbo-preview');
      } else if (modelId === 'gpt35') {
        result = await this.analyzeWithGPT(html, 'gpt-3.5-turbo');
      } else if (modelId === 'claude') {
        result = await this.analyzeWithClaude(html);
      } else {
        throw new Error('Unsupported model');
      }

      // Post-process the analysis
      return {
        ...result,
        metadata: {
          ...result.metadata,
          url,
          analyzedAt: new Date().toISOString(),
          model: modelId
        }
      };
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    }
  }
}

// Export the class using CommonJS
module.exports = AIAnalyzer;
