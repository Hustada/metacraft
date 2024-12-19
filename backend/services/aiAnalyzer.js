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
      const $ = cheerio.load(html);
      
      // Clean the HTML
      $('script').remove();
      $('style').remove();
      $('noscript').remove();
      $('iframe').remove();
      
      const cleanHtml = $('body').html();
      const content = cleanHtml.substring(0, 15000);
      
      const response = await this.anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 2000,
        temperature: 0.7,
        system: DATA_EXTRACTION_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Analyze this HTML content:\n${content}`
          }
        ]
      });

      const extractedData = JSON.parse(response.content[0].text);
      return await analyzeContent(extractedData);
    } catch (error) {
      console.error('Claude analysis error:', error);
      throw new Error('Failed to analyze content with Claude');
    }
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
