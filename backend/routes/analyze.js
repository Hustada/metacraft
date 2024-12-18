const express = require('express');
const router = express.Router();
const { analyzeContent } = require('../services/aiAnalyzer');
const { scrapeUrl } = require('../services/scraper');

router.post('/analyze', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // First scrape the URL
        const htmlContent = await scrapeUrl(url);
        
        // Then analyze the content
        const analysis = await analyzeContent(htmlContent);
        
        // Parse the response to ensure it's valid JSON
        const parsedAnalysis = typeof analysis === 'string' ? JSON.parse(analysis) : analysis;
        
        // Send the structured response
        res.json({
            success: true,
            data: {
                structure: parsedAnalysis.structure,
                components: parsedAnalysis.components,
                html: parsedAnalysis.html,
                themeSystem: parsedAnalysis.themeSystem
            }
        });
    } catch (error) {
        console.error('Error in analyze route:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to analyze content'
        });
    }
});

module.exports = router;
