const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

/**
 * Search recipes by ingredients
 */
export const searchRecipesByIngredients = async (ingredients, options = {}) => {
  const {
    number = 4,
    ranking = 1, // 1 = maximize used ingredients
    ignorePantry = true,
    diet = undefined,
    maxCalories = undefined,
    minProtein = undefined,
    maxCarbs = undefined
  } = options;

  try {
    const ingredientsStr = ingredients.join(',');
    let url = `${BASE_URL}/recipes/findByIngredients?ingredients=${ingredientsStr}&number=${number}&ranking=${ranking}&ignorePantry=${ignorePantry}&apiKey=${API_KEY}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch recipes');
    }

    const recipes = await response.json();
    
    // Get detailed information for each recipe with nutrition filters
    const detailedRecipes = await Promise.all(
      recipes.map(recipe => getRecipeDetails(recipe.id))
    );

    // Apply filters on the detailed recipes
    let filteredRecipes = detailedRecipes;

    // Filter by diet
    if (diet) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        // Check if recipe matches dietary restriction
        return recipe.diets?.includes(diet.toLowerCase()) || 
               recipe.dishTypes?.some(type => type.toLowerCase().includes(diet.toLowerCase()));
      });
    }

    // Filter by max calories
    if (maxCalories) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.nutrition.calories <= maxCalories
      );
    }

    // Filter by min protein
    if (minProtein) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.nutrition.protein >= minProtein
      );
    }

    // Filter by max carbs
    if (maxCarbs) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.nutrition.carbs <= maxCarbs
      );
    }

    return filteredRecipes;
  } catch (error) {
    console.error('Spoonacular API Error:', error);
    throw error;
  }
};

/**
 * Get detailed recipe information
 */
export const getRecipeDetails = async (recipeId) => {
  try {
    const url = `${BASE_URL}/recipes/${recipeId}/information?includeNutrition=true&apiKey=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipe details');
    }

    const recipe = await response.json();
    
    // Transform to our format
    return {
      id: recipe.id,
      name: recipe.title,
      description: recipe.summary?.replace(/<[^>]*>/g, '').substring(0, 150) + '...' || 'Delicious recipe',
      image: recipe.image,
      prepTime: recipe.readyInMinutes,
      servings: recipe.servings,
      difficulty: recipe.readyInMinutes < 30 ? 'Easy' : recipe.readyInMinutes < 60 ? 'Medium' : 'Hard',
      diets: recipe.diets || [],
      dishTypes: recipe.dishTypes || [],
      ingredients: recipe.extendedIngredients?.map(ing => ({
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        original: ing.original
      })) || [],
      instructions: recipe.analyzedInstructions?.[0]?.steps?.map(step => step.step) || 
                   (recipe.instructions ? [recipe.instructions] : ['No instructions available']),
      nutrition: {
        calories: Math.round(recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 0),
        protein: Math.round(recipe.nutrition?.nutrients?.find(n => n.name === 'Protein')?.amount || 0),
        carbs: Math.round(recipe.nutrition?.nutrients?.find(n => n.name === 'Carbohydrates')?.amount || 0),
        fat: Math.round(recipe.nutrition?.nutrients?.find(n => n.name === 'Fat')?.amount || 0)
      },
      sourceUrl: recipe.sourceUrl,
      spoonacularUrl: recipe.spoonacularSourceUrl,
      usedIngredientCount: recipe.usedIngredientCount || 0,
      missedIngredientCount: recipe.missedIngredientCount || 0
    };
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};

/**
 * Get random recipes (for inspiration)
 */
export const getRandomRecipes = async (number = 3, tags = []) => {
  try {
    const tagsStr = tags.length > 0 ? `&tags=${tags.join(',')}` : '';
    const url = `${BASE_URL}/recipes/random?number=${number}${tagsStr}&apiKey=${API_KEY}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch random recipes');
    }

    const data = await response.json();
    
    return data.recipes.map(recipe => ({
      id: recipe.id,
      name: recipe.title,
      description: recipe.summary?.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
      image: recipe.image,
      prepTime: recipe.readyInMinutes,
      servings: recipe.servings,
      difficulty: recipe.readyInMinutes < 30 ? 'Easy' : recipe.readyInMinutes < 60 ? 'Medium' : 'Hard'
    }));
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    throw error;
  }
};
