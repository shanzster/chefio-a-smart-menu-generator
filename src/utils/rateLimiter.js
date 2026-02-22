/**
 * Rate Limiter for Visitor Menu Generations
 * Tracks usage in localStorage with 24-hour reset
 */

const STORAGE_KEY = 'chefio_visitor_usage';
const MAX_GENERATIONS = 5;
const RESET_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get current usage data from localStorage
 */
const getUsageData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading usage data:', error);
    return null;
  }
};

/**
 * Save usage data to localStorage
 */
const saveUsageData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving usage data:', error);
  }
};

/**
 * Check if usage data has expired (24 hours passed)
 */
const isExpired = (timestamp) => {
  const now = Date.now();
  return now - timestamp >= RESET_INTERVAL_MS;
};

/**
 * Initialize or reset usage data
 */
const initializeUsage = () => {
  const data = {
    count: 0,
    timestamp: Date.now(),
    resetAt: Date.now() + RESET_INTERVAL_MS
  };
  saveUsageData(data);
  return data;
};

/**
 * Check if visitor can generate more recipes
 */
export const canGenerate = () => {
  let usage = getUsageData();
  
  // No data or expired - reset
  if (!usage || isExpired(usage.timestamp)) {
    usage = initializeUsage();
  }
  
  return usage.count < MAX_GENERATIONS;
};

/**
 * Get remaining generations count
 */
export const getRemainingGenerations = () => {
  let usage = getUsageData();
  
  // No data or expired - reset
  if (!usage || isExpired(usage.timestamp)) {
    usage = initializeUsage();
  }
  
  return Math.max(0, MAX_GENERATIONS - usage.count);
};

/**
 * Get time until reset in milliseconds
 */
export const getTimeUntilReset = () => {
  const usage = getUsageData();
  
  if (!usage) {
    return 0;
  }
  
  const timeRemaining = usage.resetAt - Date.now();
  return Math.max(0, timeRemaining);
};

/**
 * Format time until reset as human-readable string
 */
export const getFormattedResetTime = () => {
  const ms = getTimeUntilReset();
  
  if (ms === 0) {
    return 'Ready to reset';
  }
  
  const hours = Math.floor(ms / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Increment usage count
 */
export const incrementUsage = () => {
  let usage = getUsageData();
  
  // No data or expired - reset
  if (!usage || isExpired(usage.timestamp)) {
    usage = initializeUsage();
  }
  
  usage.count += 1;
  saveUsageData(usage);
  
  return {
    count: usage.count,
    remaining: Math.max(0, MAX_GENERATIONS - usage.count)
  };
};

/**
 * Reset usage (for testing or manual reset)
 */
export const resetUsage = () => {
  return initializeUsage();
};

/**
 * Get usage statistics
 */
export const getUsageStats = () => {
  let usage = getUsageData();
  
  // No data or expired - reset
  if (!usage || isExpired(usage.timestamp)) {
    usage = initializeUsage();
  }
  
  return {
    used: usage.count,
    remaining: Math.max(0, MAX_GENERATIONS - usage.count),
    total: MAX_GENERATIONS,
    resetAt: usage.resetAt,
    resetIn: getFormattedResetTime()
  };
};
