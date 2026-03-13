/**
 * Food Image Service
 * Fetches food images from various sources
 */

const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

/**
 * Search for food image using Spoonacular
 * @param {string} foodName - Name of the food
 * @returns {Promise<string|null>} Image URL or null if not found
 */
export const getFoodImage = async (foodName) => {
  if (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === 'DEMO_KEY') {
    console.warn('⚠️ [FOOD IMAGE] Spoonacular API key not configured');
    return null;
  }

  try {
    console.log(`🖼️ [FOOD IMAGE] Searching for image: ${foodName}`);
    
    // Search for ingredient
    const searchUrl = `${SPOONACULAR_BASE_URL}/food/ingredients/search?query=${encodeURIComponent(foodName)}&number=1&apiKey=${SPOONACULAR_API_KEY}`;
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) {
      throw new Error(`Search failed: ${searchResponse.status}`);
    }
    
    const searchData = await searchResponse.json();
    
    if (!searchData.results || searchData.results.length === 0) {
      console.log('ℹ️ [FOOD IMAGE] No results found');
      return null;
    }
    
    const ingredient = searchData.results[0];
    
    // Construct image URL
    // Spoonacular provides images in format: https://spoonacular.com/cdn/ingredients_100x100/{image}
    const imageUrl = `https://spoonacular.com/cdn/ingredients_500x500/${ingredient.image}`;
    
    console.log(`✅ [FOOD IMAGE] Found image: ${imageUrl}`);
    return imageUrl;
    
  } catch (error) {
    console.error('💥 [FOOD IMAGE] Error fetching image:', error);
    return null;
  }
};

/**
 * Get placeholder image for food category
 * @param {string} foodName - Name of the food
 * @returns {string} Placeholder image URL
 */
export const getPlaceholderImage = (foodName) => {
  // You can use a service like UI Avatars or generate a simple placeholder
  const encodedName = encodeURIComponent(foodName);
  return `https://ui-avatars.com/api/?name=${encodedName}&size=500&background=10b981&color=fff&bold=true`;
};

/**
 * Get food image with fallback to placeholder
 * @param {string} foodName - Name of the food
 * @returns {Promise<string>} Image URL (real or placeholder)
 */
export const getFoodImageWithFallback = async (foodName) => {
  const realImage = await getFoodImage(foodName);
  return realImage || getPlaceholderImage(foodName);
};

export default {
  getFoodImage,
  getPlaceholderImage,
  getFoodImageWithFallback
};
