const franc = require('franc').franc;  // Update the import to use .franc

const LANGUAGE_NAMES = {
  'eng': 'English',
  'spa': 'Spanish',
  'fra': 'French',
  'deu': 'German',
  'ita': 'Italian',
  'por': 'Portuguese',
  'rus': 'Russian',
  'jpn': 'Japanese',
  'kor': 'Korean',
  'cmn': 'Chinese',
  'ara': 'Arabic',
  'hin': 'Hindi',
  'und': 'Unknown'
};

function detectLanguage(text) {
  try {
    const langCode = franc(text);
    const confidence = franc(text, { minLength: 1 });  // Get confidence score
    
    return {
      code: langCode,
      name: LANGUAGE_NAMES[langCode] || 'Unknown',
      confidence: typeof confidence === 'number' ? Math.round(confidence * 100) + '%' : '0%'
    };
  } catch (error) {
    console.error('Language detection error:', error);
    return {
      code: 'und',
      name: 'Unknown',
      confidence: '0%'
    };
  }
}

module.exports = detectLanguage;
