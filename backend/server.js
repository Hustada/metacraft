const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const AIAnalyzer = require('./services/aiAnalyzer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const MODELS = {
  'gpt4': {
    id: 'gpt-4-turbo-preview',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    description: 'Latest GPT-4 model with improved analysis capabilities',
    features: ['Advanced content understanding', 'Detailed analysis', 'High accuracy'],
    available: true
  },
  'gpt35': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    description: 'Fast and efficient for basic content analysis',
    features: ['Quick analysis', 'Cost-effective', 'Good for simple content'],
    available: true
  },
  'claude': {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    description: 'Advanced model with strong analytical capabilities',
    features: ['Comprehensive analysis', 'Strong reasoning', 'Detailed insights'],
    available: true
  }
};

// Initialize rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(cors());
app.use(limiter);
app.use(express.json());

// Get available models
app.get('/api/models', (req, res) => {
  res.json(MODELS);
});

// Debug endpoint to check available models
app.get('/api/debug/models', (req, res) => {
  res.json({
    availableModels: Object.keys(MODELS),
    modelDetails: MODELS
  });
});

// Analyze URL endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { url, modelId } = req.body;
    console.log('Received request:', { url, modelId }); // Debug log
    
    if (!url || !modelId) {
      console.log('Missing required fields:', { url, modelId }); // Debug log
      return res.status(400).json({ error: 'URL and model ID are required' });
    }
    
    if (!MODELS[modelId]) {
      console.log('Invalid model ID:', modelId, 'Available models:', Object.keys(MODELS)); // Debug log
      return res.status(400).json({ error: 'Invalid model ID' });
    }

    console.log(`\n📝 Analyzing URL: ${url} with model: ${modelId}`);

    // Fetch HTML content
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const html = await response.text();

    // Initialize analyzer and process content
    const analyzer = new AIAnalyzer();
    const result = await analyzer.analyze(url, html, modelId);

    console.log('Analysis completed successfully'); // Debug log
    res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to analyze URL',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.listen(port, () => {
  console.log(`
🚀 Web Scraper API Server Running
🌐 URL: http://localhost:${port}
📋 Available Endpoints:
   • GET  /api/models - List available AI models
   • POST /api/analyze - Analyze webpage content
   • GET  /api/debug/models - Debug endpoint for models

🤖 Available Models:
${Object.entries(MODELS)
  .map(([id, model]) => `   • ${model.name}${model.available ? '' : ' (coming soon)'}`)
  .join('\n')}
`);
});
