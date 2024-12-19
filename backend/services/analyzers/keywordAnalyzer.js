const { removeStopwords } = require('stopword');

function analyzeKeywords(text) {
  // Clean and tokenize the text
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  // Remove stopwords
  const filteredWords = removeStopwords(words);

  // Count word frequencies
  const freqMap = {};
  const totalWords = filteredWords.length;

  filteredWords.forEach(word => {
    freqMap[word] = (freqMap[word] || 0) + 1;
  });

  // Find phrases (2-3 words)
  const phrases = {};
  for (let i = 0; i < words.length - 1; i++) {
    const twoWordPhrase = words.slice(i, i + 2).join(' ');
    const threeWordPhrase = words.slice(i, i + 3).join(' ');
    
    if (!/\b(the|and|or|but|in|on|at|to|for|of|with|by)\b/.test(twoWordPhrase)) {
      phrases[twoWordPhrase] = (phrases[twoWordPhrase] || 0) + 1;
    }
    
    if (i < words.length - 2 && !/\b(the|and|or|but|in|on|at|to|for|of|with|by)\b/.test(threeWordPhrase)) {
      phrases[threeWordPhrase] = (phrases[threeWordPhrase] || 0) + 1;
    }
  }

  // Sort and format results
  const primary = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([keyword, frequency]) => ({
      keyword,
      frequency,
      density: ((frequency / totalWords) * 100).toFixed(2) + '%',
      importance: frequency > 5 ? 'High' : frequency > 2 ? 'Medium' : 'Low'
    }));

  const secondary = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(5, 10)
    .map(([keyword, frequency]) => ({
      keyword,
      frequency,
      density: ((frequency / totalWords) * 100).toFixed(2) + '%'
    }));

  const keyPhrases = Object.entries(phrases)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([phrase, frequency]) => ({
      phrase,
      frequency
    }));

  return {
    primary,
    secondary,
    phrases: keyPhrases
  };
}

module.exports = analyzeKeywords;
