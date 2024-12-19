const express = require('express');
const cors = require('cors');
const { analyzeContent, MODELS } = require('./services/aiAnalyzer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Get available models
app.get('/api/models', (req, res) => {
  try {
    res.json(MODELS);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch available models' 
    });
  }
});

// Analyze URL content
app.post('/api/analyze', async (req, res) => {
  try {
    const { url, modelId } = req.body;

    if (!url) {
      return res.status(400).json({ 
        success: false, 
        error: 'URL is required' 
      });
    }

    if (!modelId || !MODELS[modelId]) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid model ID' 
      });
    }

    if (!MODELS[modelId].available) {
      return res.status(400).json({ 
        success: false, 
        error: `Model ${MODELS[modelId].name} is not yet available` 
      });
    }

    console.log(`\n📝 Analyzing URL: ${url}`);
    console.log(`🤖 Using model: ${MODELS[modelId].name}`);

    // Fetch the URL content
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const htmlContent = await response.text();

    // Analyze the content
    const data = await analyzeContent(htmlContent, modelId);

    res.json({ 
      success: true, 
      data,
      model: MODELS[modelId].name
    });
  } catch (error) {
    console.error('Error analyzing URL:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to analyze URL' 
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

🤖 Available Models:
${Object.entries(MODELS)
  .map(([id, model]) => `   • ${model.name}${model.available ? '' : ' (coming soon)'}`)
  .join('\n')}
`);
});
