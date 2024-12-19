const Sentiment = require('sentiment');
const sentiment = new Sentiment();

function analyzeSentiment(text) {
  const result = sentiment.analyze(text);
  
  // Calculate normalized score between -1 and 1
  const normalizedScore = result.score / Math.max(Math.abs(result.score), 5);
  
  // Determine sentiment type
  let sentimentType = 'Neutral';
  if (normalizedScore > 0.3) sentimentType = 'Positive';
  if (normalizedScore < -0.3) sentimentType = 'Negative';

  // Extract emotional words
  const emotionalWords = [
    ...result.positive.map(word => ({ word, type: 'positive' })),
    ...result.negative.map(word => ({ word, type: 'negative' }))
  ];

  return {
    overall: sentimentType,
    score: normalizedScore,
    analysis: {
      tone: determineTone(result),
      emotionalTriggers: emotionalWords.map(w => w.word),
      highlights: {
        positive: result.positive,
        negative: result.negative
      }
    }
  };
}

function determineTone(sentimentResult) {
  const score = sentimentResult.score;
  const words = sentimentResult.tokens;
  
  // Check for technical words
  const technicalWords = words.filter(word => 
    /^(data|analysis|system|process|technical|technology|software|hardware|code|program)/.test(word)
  );
  
  if (technicalWords.length / words.length > 0.1) {
    return 'Technical';
  }
  
  // Check for formal/professional words
  const formalWords = words.filter(word => 
    /^(therefore|however|furthermore|consequently|additionally|regarding|pursuant|accordingly)/.test(word)
  );
  
  if (formalWords.length / words.length > 0.05) {
    return 'Professional';
  }
  
  return 'Casual';
}

module.exports = analyzeSentiment;
