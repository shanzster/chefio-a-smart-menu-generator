// Unified Recipe Service with automatic fallback
import * as spoonacularService from './spoonacularService.js';
import * as edamamService from './edamamService.js';

/**
 * Search recipes with automatic fallback
 * Tries Spoonacular first, falls back to Edamam if it fails
 */
export const searchRecipesByIngredients = async (ingredients, options = {}) => {
  console.log('🔍 [RECIPE SERVICE] Searching recipes...');
  
  // Try Spoonacular first
  try {
    console.log('📡 [RECIPE SERVICE] Trying Spoonacular API...');
    const recipes = await spoonacularService.searchRecipesByIngredients(ingredients, options);
    console.log(`✅ [RECIPE SERVICE] Spoonacular returned ${recipes.length} recipes`);
    return {
      recipes,
      provider: 'spoonacular',
      message: null
    };
  } catch (spoonacularError) {
    console.warn('⚠️ [RECIPE SERVICE] Spoonacular failed:', spoonacularError.message);
    
    // Check if it's a rate limit error
    const isRateLimit = spoonacularError.message?.includes('402') || 
                        spoonacularError.message?.includes('quota') ||
                        spoonacularError.message?.includes('limit');
    
    // Fall back to Edamam
    try {
      console.log('🔄 [RECIPE SERVICE] Falling back to Edamam API...');
      const recipes = await edamamService.searchRecipesByIngredients(ingredients, options);
      console.log(`✅ [RECIPE SERVICE] Edamam returned ${recipes.length} recipes`);
      
      return {
        recipes,
        provider: 'edamam',
        message: isRateLimit 
          ? 'Daily Spoonacular limit reached. Using free Edamam recipes.' 
          : 'Using Edamam recipes.'
      };
    } catch (edamamError) {
      console.error('❌ [RECIPE SERVICE] Both APIs failed');
      throw new Error('Unable to fetch recipes. Please try again later.');
    }
  }
};

/**
 * Get random recipes with automatic fallback
 */
export const getRandomRecipes = async (number = 3, tags = []) => {
  console.log('🎲 [RECIPE SERVICE] Getting random recipes...');
  
  // Try Spoonacular first
  try {
    console.log('📡 [RECIPE SERVICE] Trying Spoonacular API...');
    const recipes = await spoonacularService.getRandomRecipes(number, tags);
    console.log(`✅ [RECIPE SERVICE] Spoonacular returned ${recipes.length} recipes`);
    return {
      recipes,
      provider: 'spoonacular'
    };
  } catch (spoonacularError) {
    console.warn('⚠️ [RECIPE SERVICE] Spoonacular failed, falling back to Edamam');
    
    // Fall back to Edamam
    try {
      const recipes = await edamamService.getRandomRecipes(number, tags);
      console.log(`✅ [RECIPE SERVICE] Edamam returned ${recipes.length} recipes`);
      return {
        recipes,
        provider: 'edamam'
      };
    } catch (edamamError) {
      console.error('❌ [RECIPE SERVICE] Both APIs failed');
      throw new Error('Unable to fetch recipes. Please try again later.');
    }
  }
};

/**
 * Get recipe details (Spoonacular only feature)
 */
export const getRecipeDetails = async (recipeId) => {
  try {
    return await spoonacularService.getRecipeDetails(recipeId);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};
