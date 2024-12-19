const express = require('express');
const router = express.Router();
const { analyzeContent, MODELS } = require('../services/aiAnalyzer');
const { scrapeUrl } = require('../services/scraper');

router.post('/', async (req, res) => {
    try {
        const { url, modelId = 'gpt4' } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Validate model selection
        if (!MODELS[modelId]) {
            return res.status(400).json({ error: 'Invalid model selection' });
        }

        console.log(`\n🌐 Analyzing URL: ${url}`);
        console.log(`🤖 Using model: ${MODELS[modelId].name}`);

        // Scrape the URL
        const scrapedContent = await scrapeUrl(url);
        
        // Analyze with selected model
        const analysis = await analyzeContent(scrapedContent, modelId);

        res.json({
            success: true,
            components: analysis,
            model: MODELS[modelId].name
        });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to analyze URL'
        });
    }
});

module.exports = router;
