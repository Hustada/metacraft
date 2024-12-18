const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeUrl(url) {
    try {
        // Make the request with a user agent to avoid being blocked
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // Load the HTML into cheerio
        const $ = cheerio.load(response.data);

        // Remove scripts and styles as we don't need them
        $('script').remove();
        $('style').remove();
        $('link[rel="stylesheet"]').remove();

        // Get the cleaned HTML
        const cleanedHtml = $('body').html();

        return cleanedHtml;
    } catch (error) {
        console.error('Error scraping URL:', error);
        throw new Error(`Failed to scrape URL: ${error.message}`);
    }
}

module.exports = {
    scrapeUrl
};
