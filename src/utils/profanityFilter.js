/**
 * Profanity Filter Utility
 * Detects and highlights inappropriate language in text
 */

// Common profanity words list (expandable)
const PROFANITY_LIST = [
  // Mild profanity
  'damn', 'hell', 'crap', 'suck', 'stupid', 'idiot', 'dumb',
  // Strong profanity (censored versions for detection)
  'f**k', 'sh*t', 'b*tch', 'a**hole', 'bastard', 'piss',
  // Variations and common misspellings
  'fck', 'fuk', 'fvck', 'shyt', 'sht', 'btch', 'azz', 'arse',
  // Offensive slurs (partial list for detection)
  'hate', 'kill', 'die', 'ugly', 'trash', 'garbage', 'worthless',
  // Add more as needed
];

// Patterns for detecting profanity with special characters
const PROFANITY_PATTERNS = [
  /f[\*\@\#\$\%\^\&]ck/gi,
  /sh[\*\@\#\$\%\^\&]t/gi,
  /b[\*\@\#\$\%\^\&]tch/gi,
  /a[\*\@\#\$\%\^\&]s/gi,
  /d[\*\@\#\$\%\^\&]mn/gi,
];

/**
 * Escape special regex characters in a string
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Check if text contains profanity
 * @param {string} text - Text to check
 * @returns {boolean} - True if profanity detected
 */
export const containsProfanity = (text) => {
  if (!text) return false;
  
  const lowerText = text.toLowerCase();
  
  // Check against word list
  const hasProfanityWord = PROFANITY_LIST.some(word => {
    const escapedWord = escapeRegex(word);
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'i');
    return regex.test(lowerText);
  });
  
  if (hasProfanityWord) return true;
  
  // Check against patterns
  const hasProfanityPattern = PROFANITY_PATTERNS.some(pattern => 
    pattern.test(text)
  );
  
  return hasProfanityPattern;
};

/**
 * Get all profane words found in text
 * @param {string} text - Text to analyze
 * @returns {Array<string>} - Array of profane words found
 */
export const getProfaneWords = (text) => {
  if (!text) return [];
  
  const foundWords = [];
  
  // Check word list
  PROFANITY_LIST.forEach(word => {
    const escapedWord = escapeRegex(word);
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      foundWords.push(...matches);
    }
  });
  
  // Check patterns
  PROFANITY_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      foundWords.push(...matches);
    }
  });
  
  return [...new Set(foundWords)]; // Remove duplicates
};

/**
 * Highlight profanity in text with HTML spans
 * @param {string} text - Text to process
 * @returns {string} - HTML string with highlighted profanity
 */
export const highlightProfanity = (text) => {
  if (!text) return '';
  
  let highlightedText = text;
  
  // Highlight words from list
  PROFANITY_LIST.forEach(word => {
    const escapedWord = escapeRegex(word);
    const regex = new RegExp(`\\b(${escapedWord})\\b`, 'gi');
    highlightedText = highlightedText.replace(
      regex,
      '<span class="profanity-highlight">$1</span>'
    );
  });
  
  // Highlight pattern matches
  PROFANITY_PATTERNS.forEach(pattern => {
    highlightedText = highlightedText.replace(
      pattern,
      '<span class="profanity-highlight">$&</span>'
    );
  });
  
  return highlightedText;
};

/**
 * Censor profanity in text
 * @param {string} text - Text to censor
 * @param {string} replacement - Replacement character (default: *)
 * @returns {string} - Censored text
 */
export const censorProfanity = (text, replacement = '*') => {
  if (!text) return '';
  
  let censoredText = text;
  
  // Censor words from list
  PROFANITY_LIST.forEach(word => {
    const escapedWord = escapeRegex(word);
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
    censoredText = censoredText.replace(regex, (match) => {
      return match[0] + replacement.repeat(match.length - 2) + match[match.length - 1];
    });
  });
  
  // Censor pattern matches
  PROFANITY_PATTERNS.forEach(pattern => {
    censoredText = censoredText.replace(pattern, (match) => {
      return match[0] + replacement.repeat(match.length - 2) + match[match.length - 1];
    });
  });
  
  return censoredText;
};

/**
 * Get profanity severity level
 * @param {string} text - Text to analyze
 * @returns {string} - 'none', 'mild', 'moderate', 'severe'
 */
export const getProfanitySeverity = (text) => {
  if (!containsProfanity(text)) return 'none';
  
  const profaneWords = getProfaneWords(text);
  const count = profaneWords.length;
  
  if (count === 0) return 'none';
  if (count === 1) return 'mild';
  if (count <= 3) return 'moderate';
  return 'severe';
};

/**
 * Calculate profanity score (0-100)
 * @param {string} text - Text to analyze
 * @returns {number} - Score from 0 (clean) to 100 (very profane)
 */
export const getProfanityScore = (text) => {
  if (!text) return 0;
  
  const words = text.split(/\s+/).length;
  const profaneWords = getProfaneWords(text);
  const profaneCount = profaneWords.length;
  
  if (profaneCount === 0) return 0;
  
  // Calculate percentage and scale
  const percentage = (profaneCount / words) * 100;
  return Math.min(Math.round(percentage * 10), 100);
};
