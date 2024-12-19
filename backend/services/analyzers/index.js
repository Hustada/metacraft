const analyzeSentiment = require('./sentimentAnalyzer');
const calculateReadability = require('./readabilityAnalyzer');
const analyzeSEO = require('./seoAnalyzer');
const analyzeKeywords = require('./keywordAnalyzer');
const detectLanguage = require('./languageDetector');

function combineText(data) {
  const parts = [];
  if (data.titles) {
    parts.push(...data.titles.map(t => t.text));
  }
  if (data.paragraphs) {
    parts.push(...data.paragraphs);
  }
  return parts.join(' ');
}

async function analyzeContent(extractedData) {
  try {
    const combinedText = combineText(extractedData);
    
    // Run all analyses with error handling for each
    let language = { code: 'und', name: 'Unknown', confidence: '0%' };
    let sentiment = null;
    let readability = null;
    let seo = null;
    let keywords = null;

    try {
      language = detectLanguage(combinedText);
    } catch (error) {
      console.error('Language detection failed:', error);
    }

    try {
      sentiment = analyzeSentiment(combinedText);
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
    }

    try {
      readability = calculateReadability(combinedText);
    } catch (error) {
      console.error('Readability analysis failed:', error);
    }

    try {
      seo = analyzeSEO(extractedData);
    } catch (error) {
      console.error('SEO analysis failed:', error);
    }

    try {
      keywords = analyzeKeywords(combinedText);
    } catch (error) {
      console.error('Keyword analysis failed:', error);
    }

    // Combine all analyses into a single result
    return {
      ...extractedData,
      analysis: {
        language,
        sentiment,
        readability,
        seo,
        keywords
      }
    };
  } catch (error) {
    console.error('Content analysis error:', error);
    throw error;
  }
}

module.exports = {
  analyzeContent,
  analyzeSentiment,
  calculateReadability,
  analyzeSEO,
  analyzeKeywords,
  detectLanguage
};
