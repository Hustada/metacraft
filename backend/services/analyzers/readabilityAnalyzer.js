function calculateReadability(text) {
  // Calculate basic metrics
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const words = text.split(/\s+/).filter(Boolean);
  const syllables = countSyllables(text);
  
  // Calculate average sentence length
  const avgSentenceLength = sentences.length ? words.length / sentences.length : 0;
  
  // Calculate word complexity
  const complexWords = words.filter(word => 
    countSyllables(word) > 2 && !/^(because|through|however)/.test(word.toLowerCase())
  );
  const complexWordPercentage = (complexWords.length / words.length) * 100;

  // Calculate Flesch Reading Ease
  const readingEase = calculateFleschReadingEase(words.length, sentences.length, syllables);

  // Calculate approximate grade level
  const gradeLevel = calculateGradeLevel(words.length, sentences.length, syllables);

  // Generate readability score (0-100)
  const readabilityScore = Math.max(0, Math.min(100, readingEase));

  // Generate suggestions based on metrics
  const suggestions = [];
  
  if (avgSentenceLength > 20) {
    suggestions.push("Consider breaking down longer sentences for better readability");
  }
  
  if (complexWordPercentage > 20) {
    suggestions.push("Use simpler words where possible to improve comprehension");
  }
  
  if (readingEase < 60) {
    suggestions.push("Content may be too complex for general audience");
  }

  return {
    score: readabilityScore,
    gradeLevel: `Grade ${Math.round(gradeLevel)}`,
    metrics: {
      averageSentenceLength: Math.round(avgSentenceLength * 10) / 10,
      complexWordPercentage: Math.round(complexWordPercentage * 10) / 10,
      readingEase: Math.round(readingEase * 10) / 10,
      totalWords: words.length,
      totalSentences: sentences.length
    },
    analysis: {
      complexity: readingEase > 80 ? "Easy" : readingEase > 60 ? "Moderate" : "Complex",
      sentenceStructure: `Average sentence length is ${Math.round(avgSentenceLength)} words`,
      wordChoice: `${Math.round(complexWordPercentage)}% of words are complex`,
      suggestions
    }
  };
}

// Helper function to count syllables
function countSyllables(text) {
  const words = text.toLowerCase().split(/\s+/);
  return words.reduce((total, word) => {
    // Remove non-word characters
    word = word.replace(/[^a-z]/g, '');
    
    // Count vowel groups
    const syllables = word.match(/[aeiouy]+/g) || [];
    
    // Adjust for common patterns
    let count = syllables.length;
    
    // Subtract silent e at end
    if (word.match(/[aeiouy]e$/)) count--;
    
    // Count minimum of 1 syllable per word
    return total + Math.max(1, count);
  }, 0);
}

// Calculate Flesch Reading Ease
function calculateFleschReadingEase(words, sentences, syllables) {
  if (words === 0 || sentences === 0) return 100;
  return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
}

// Calculate approximate grade level
function calculateGradeLevel(words, sentences, syllables) {
  if (words === 0 || sentences === 0) return 0;
  return 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
}

module.exports = calculateReadability;
