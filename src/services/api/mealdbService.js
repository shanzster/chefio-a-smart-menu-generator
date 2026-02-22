const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

/**
 * Get random meals
 */
export const getRandomMeals = async (count = 10) => {
  try {
    // TheMealDB doesn't support bulk random, so we'll make multiple requests
    const promises = Array.from({ length: count }, () => 
      fetch(`${BASE_URL}/random.php`).then(res => res.json())
    );
    
    const results = await Promise.all(promises);
    
    return results.map(data => {
      const meal = data.meals[0];
      return transformMeal(meal);
    });
  } catch (error) {
    console.error('Error fetching random meals:', error);
    throw error;
  }
};

/**
 * Search meals by category
 */
export const getMealsByCategory = async (category, limit = 10) => {
  try {
    const categoryMap = {
      'All': null,
      'Breakfast': 'Breakfast',
      'Lunch': null, // TheMealDB doesn't have lunch category
      'Dinner': null, // Will use multiple categories
      'Snacks': 'Starter',
      'Desserts': 'Dessert'
    };

    const apiCategory = categoryMap[category];
    
    if (!apiCategory && category === 'All') {
      // Get random meals for "All"
      return await getRandomMeals(limit);
    }

    if (!apiCategory) {
      // For Lunch/Dinner, get random meals
      return await getRandomMeals(limit);
    }

    const response = await fetch(`${BASE_URL}/filter.php?c=${apiCategory}`);
    const data = await response.json();
    
    if (!data.meals) {
      return await getRandomMeals(limit);
    }

    // Get detailed info for each meal (limited to specified count)
    const meals = data.meals.slice(0, limit);
    const detailedMeals = await Promise.all(
      meals.map(meal => getMealDetails(meal.idMeal))
    );
    
    return detailedMeals;
  } catch (error) {
    console.error('Error fetching meals by category:', error);
    throw error;
  }
};

/**
 * Get meal details by ID
 */
export const getMealDetails = async (mealId) => {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${mealId}`);
    const data = await response.json();
    
    if (!data.meals || data.meals.length === 0) {
      throw new Error('Meal not found');
    }

    return transformMeal(data.meals[0]);
  } catch (error) {
    console.error('Error fetching meal details:', error);
    throw error;
  }
};

/**
 * Search meals by name
 */
export const searchMealsByName = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search.php?s=${query}`);
    const data = await response.json();
    
    if (!data.meals) {
      return [];
    }

    return data.meals.map(meal => transformMeal(meal));
  } catch (error) {
    console.error('Error searching meals:', error);
    throw error;
  }
};

/**
 * Transform TheMealDB meal to our format
 */
const transformMeal = (meal) => {
  // Extract ingredients
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient,
        amount: measure || '',
        unit: '',
        original: `${measure} ${ingredient}`.trim()
      });
    }
  }

  // Parse instructions into steps
  const instructions = meal.strInstructions
    ? meal.strInstructions.split(/\r?\n/).filter(step => step.trim().length > 0)
    : ['No instructions available'];

  // Estimate prep time based on instruction length
  const estimatedPrepTime = Math.min(15 + Math.floor(ingredients.length * 5), 120);

  // Estimate calories based on category
  const caloriesByCategory = {
    'Dessert': 450,
    'Breakfast': 350,
    'Starter': 200,
    'Side': 150,
    'Vegetarian': 300,
    'Vegan': 280,
    'Beef': 500,
    'Chicken': 400,
    'Seafood': 350,
    'Pasta': 450,
    'Pork': 480
  };

  const estimatedCalories = caloriesByCategory[meal.strCategory] || 400;

  return {
    id: meal.idMeal,
    name: meal.strMeal,
    description: meal.strInstructions?.substring(0, 150) + '...' || 'Delicious meal',
    image: meal.strMealThumb,
    prepTime: estimatedPrepTime,
    servings: 4, // TheMealDB doesn't provide servings, default to 4
    difficulty: estimatedPrepTime < 30 ? 'Easy' : estimatedPrepTime < 60 ? 'Medium' : 'Hard',
    category: meal.strCategory,
    cuisine: meal.strArea,
    tags: meal.strTags ? meal.strTags.split(',') : [],
    ingredients,
    instructions,
    nutrition: {
      calories: estimatedCalories,
      protein: Math.round(estimatedCalories * 0.25 / 4), // Rough estimate
      carbs: Math.round(estimatedCalories * 0.5 / 4),
      fat: Math.round(estimatedCalories * 0.25 / 9)
    },
    sourceUrl: meal.strSource || meal.strYoutube,
    videoUrl: meal.strYoutube
  };
};

export default {
  getRandomMeals,
  getMealsByCategory,
  getMealDetails,
  searchMealsByName
};
