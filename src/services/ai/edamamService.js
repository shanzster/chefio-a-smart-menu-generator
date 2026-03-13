// Edamam Recipe Search API - FREE TIER
// 10 requests/min, 10,000 requests/month
const APP_ID = import.meta.env.VITE_EDAMAM_APP_ID;
const APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY;
const BASE_URL = 'https://api.edamam.com/api/recipes/v2';

/**
 * Search recipes by ingredients using Edamam (FREE)
 */
export const searchRecipesByIngredients = async (ingredients, options = {}) => {
  const {
    number = 4,
    diet = undefined,
    maxCalories = undefined,
    minProtein = undefined,
    maxCarbs = undefined
  } = options;

  try {
    // Build query from ingredients
    const query = ingredients.join(' ');
    
    let url = `${BASE_URL}?type=public&q=${encodeURIComponent(query)}&app_id=${APP_ID}&app_key=${APP_KEY}&to=${number}`;

    // Add diet filter
    if (diet) {
      const dietMap = {
        'vegetarian': 'vegetarian',
        'vegan': 'vegan',
        'gluten-free': 'gluten-free',
        'keto': 'low-carb',
        'paleo': 'paleo',
        'pescetarian': 'pescatarian'
      };
      const edamamDiet = dietMap[diet.toLowerCase()];
      if (edamamDiet) {
        url += `&diet=${edamamDiet}`;
      }
    }

    // Add nutrition filters
    if (maxCalories) {
      url += `&calories=0-${maxCalories}`;
    }
    if (minProtein) {
      url += `&nutrients[PROCNT]=${minProtein}%2B`; // URL encoded +
    }
    if (maxCarbs) {
      url += `&nutrients[CHOCDF]=0-${maxCarbs}`;
    }

    console.log('🍳 [EDAMAM] Fetching recipes...');
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch recipes from Edamam');
    }

    const data = await response.json();
    console.log(`✅ [EDAMAM] Found ${data.hits?.length || 0} recipes`);

    // Transform to our format
    return data.hits.map(hit => transformEdamamRecipe(hit.recipe));
  } catch (error) {
    console.error('❌ [EDAMAM] API Error:', error);
    throw error;
  }
};

/**
 * Transform Edamam recipe to our format
 */
const transformEdamamRecipe = (recipe) => {
  return {
    id: recipe.uri.split('#recipe_')[1] || recipe.uri,
    name: recipe.label,
    description: recipe.cuisineType?.join(', ') || 'Delicious recipe',
    image: recipe.image,
    prepTime: recipe.totalTime || 30,
    servings: recipe.yield || 4,
    difficulty: (recipe.totalTime || 30) < 30 ? 'Easy' : (recipe.totalTime || 30) < 60 ? 'Medium' : 'Hard',
    diets: recipe.dietLabels || [],
    dishTypes: recipe.dishType || [],
    healthLabels: recipe.healthLabels || [],
    ingredients: recipe.ingredients?.map(ing => ({
      name: ing.food,
      amount: ing.quantity || 0,
      unit: ing.measure || '',
      original: ing.text
    })) || [],
    instructions: recipe.url ? [`View full instructions at: ${recipe.url}`] : ['No instructions available'],
    nutrition: {
      calories: Math.round(recipe.calories / recipe.yield) || 0,
      protein: Math.round(recipe.totalNutrients?.PROCNT?.quantity / recipe.yield) || 0,
      carbs: Math.round(recipe.totalNutrients?.CHOCDF?.quantity / recipe.yield) || 0,
      fat: Math.round(recipe.totalNutrients?.FAT?.quantity / recipe.yield) || 0
    },
    sourceUrl: recipe.url,
    source: recipe.source,
    usedIngredientCount: 0, // Edamam doesn't provide this
    missedIngredientCount: 0,
    provider: 'edamam' // Mark as Edamam recipe
  };
};

/**
 * Get random recipes (for inspiration)
 */
export const getRandomRecipes = async (number = 3, tags = []) => {
  try {
    const query = tags.length > 0 ? tags.join(' ') : 'popular';
    let url = `${BASE_URL}?type=public&q=${encodeURIComponent(query)}&app_id=${APP_ID}&app_key=${APP_KEY}&to=${number}&random=true`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch random recipes from Edamam');
    }

    const data = await response.json();

    return data.hits.map(hit => ({
      id: hit.recipe.uri.split('#recipe_')[1] || hit.recipe.uri,
      name: hit.recipe.label,
      description: hit.recipe.cuisineType?.join(', ') || 'Delicious recipe',
      image: hit.recipe.image,
      prepTime: hit.recipe.totalTime || 30,
      servings: hit.recipe.yield || 4,
      difficulty: (hit.recipe.totalTime || 30) < 30 ? 'Easy' : (hit.recipe.totalTime || 30) < 60 ? 'Medium' : 'Hard'
    }));
  } catch (error) {
    console.error('Error fetching random recipes from Edamam:', error);
    throw error;
  }
};
