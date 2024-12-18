const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { analyzeContent } = require('./services/aiAnalyzer');
require('dotenv').config();

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
    try {
        console.log('Received analyze request for URL:', req.body.url);
        const { url } = req.body;
        
        if (!url) {
            console.error('No URL provided');
            return res.status(400).json({ error: "URL is required" });
        }

        console.log('Analyzing URL:', url);

        // Make the request to the target website
        console.log('Fetching website content...');
        const response = await axios.get(url);
        const html = response.data;
        console.log('Website content fetched, length:', html.length);
        
        // Parse the HTML content
        console.log('Parsing HTML with Cheerio...');
        const $ = cheerio.load(html);
        
        // Basic analysis
        console.log('Performing basic analysis...');
        const basicAnalysis = {
            title: $('title').text().trim(),
            linkCount: $('a').length,
            imageCount: $('img').length,
            headerCount: $('h1, h2, h3, h4, h5, h6').length,
            paragraphCount: $('p').length,
            divCount: $('div').length
        };
        console.log('Basic analysis results:', basicAnalysis);

        // AI Analysis for component suggestions
        console.log('Starting AI analysis...');
        const aiAnalysisResponse = await analyzeContent(html);
        console.log('Raw AI analysis response:', aiAnalysisResponse);
        
        let aiAnalysis;
        try {
            aiAnalysis = typeof aiAnalysisResponse === 'string' 
                ? JSON.parse(aiAnalysisResponse) 
                : aiAnalysisResponse;
            console.log('Parsed AI analysis:', aiAnalysis);
        } catch (parseError) {
            console.error('Error parsing AI response:', parseError);
            aiAnalysis = {
                error: 'Failed to parse AI response',
                raw: aiAnalysisResponse
            };
        }
        
        // Combine both analyses
        const analysisResult = {
            success: true,
            structure: aiAnalysis.structure,
            components: aiAnalysis.components,
            html: aiAnalysis.html,
            themeSystem: aiAnalysis.themeSystem,
            basicAnalysis
        };
        
        console.log('Sending complete analysis result:', JSON.stringify(analysisResult, null, 2));
        res.json(analysisResult);
        
    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        res.status(500).json({ 
            error: error.message,
            details: error.response?.data || 'No additional details available'
        });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
