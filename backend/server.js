const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }

        // Make the request to the target website
        const response = await axios.get(url);
        const html = response.data;
        
        // Parse the HTML content
        const $ = cheerio.load(html);
        
        // Basic analysis results
        const analysisResult = {
            analysis: `Website analysis for ${url}:\n` + 
                     `Title: ${$('title').text() || 'No title'}\n` +
                     `Number of links: ${$('a').length}\n` +
                     `Number of images: ${$('img').length}\n`,
            structure: `Page Structure:\n` +
                      `Headers: ${$('h1, h2, h3, h4, h5, h6').length}\n` +
                      `Paragraphs: ${$('p').length}\n` +
                      `Divs: ${$('div').length}\n`,
            code_snippets: "Sample HTML structure:\n" + $.html().substring(0, 500) + "..."
        };
        
        res.json(analysisResult);
        
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
