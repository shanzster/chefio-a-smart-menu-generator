// USDA FoodData Central API Service
// Documentation: https://fdc.nal.usda.gov/api-guide.html

const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY || 'DEMO_KEY';
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

/**
 * Search for foods in USDA database
 * @param {string} query - Search term (e.g., "chicken breast")
 * @param {number} pageSize - Number of results to return (default: 10)
 * @returns {Promise<Array>} Array of food items with nutrition data
 */
export const searchFoods = async (query, pageSize = 10) => {
  try {
    console.log(`🔍 [USDA] Searching for: "${query}"`);
    
    const url = `${BASE_URL}/foods/search?` + new URLSearchParams({
      api_key: USDA_API_KEY,
      query: query,
      pageSize: pageSize,
      dataType: 'Foundation,SR Legacy' // Use most reliable data sources
    });

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ [USDA] Found ${data.foods?.length || 0} results`);
    
    // Transform to simpler format
    return (data.foods || []).map(food => ({
      id: food.fdcId,
      name: food.description,
      brand: food.brandOwner || null,
      dataType: food.dataType,
      // Nutrition per 100g
      nutrition: {
        calories: getNutrientValue(food.foodNutrients, 'Energy', 208),
        protein: getNutrientValue(food.foodNutrients, 'Protein', 203),
        carbs: getNutrientValue(food.foodNutrients, 'Carbohydrate, by difference', 205),
        fat: getNutrientValue(food.foodNutrients, 'Total lipid (fat)', 204),
        fiber: getNutrientValue(food.foodNutrients, 'Fiber, total dietary', 291),
        sugar: getNutrientValue(food.foodNutrients, 'Sugars, total including NLEA', 269),
        sodium: getNutrientValue(food.foodNutrients, 'Sodium, Na', 307),
        cholesterol: getNutrientValue(food.foodNutrients, 'Cholesterol', 601),
        potassium: getNutrientValue(food.foodNutrients, 'Potassium, K', 306),
        calcium: getNutrientValue(food.foodNutrients, 'Calcium, Ca', 301),
        iron: getNutrientValue(food.foodNutrients, 'Iron, Fe', 303),
        vitaminC: getNutrientValue(food.foodNutrients, 'Vitamin C, total ascorbic acid', 401),
        vitaminA: getNutrientValue(food.foodNutrients, 'Vitamin A, IU', 318)
      },
      servingSize: 100, // USDA data is per 100g
      servingUnit: 'g'
    }));
  } catch (error) {
    console.error('💥 [USDA] Search error:', error);
    throw error;
  }
};

/**
 * Get detailed food information by FDC ID
 * @param {number} fdcId - Food Data Central ID
 * @returns {Promise<Object>} Detailed food information
 */
export const getFoodById = async (fdcId) => {
  try {
    console.log(`🔍 [USDA] Getting food details for ID: ${fdcId}`);
    
    const url = `${BASE_URL}/food/${fdcId}?api_key=${USDA_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ [USDA] Got details for: ${data.description}`);
    
    return {
      id: data.fdcId,
      name: data.description,
      brand: data.brandOwner || null,
      dataType: data.dataType,
      ingredients: data.ingredients || null,
      nutrition: extractAllNutrients(data.foodNutrients || []),
      servingSize: 100,
      servingUnit: 'g'
    };
  } catch (error) {
    console.error('💥 [USDA] Get food error:', error);
    throw error;
  }
};

/**
 * Calculate nutrition for multiple ingredients
 * @param {Array} ingredients - Array of {foodId, quantity (in grams)}
 * @returns {Promise<Object>} Total nutrition data
 */
export const calculateRecipeNutrition = async (ingredients) => {
  try {
    console.log(`🧮 [USDA] Calculating nutrition for ${ingredients.length} ingredients`);
    
    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      cholesterol: 0,
      potassium: 0,
      calcium: 0,
      iron: 0,
      vitaminC: 0,
      vitaminA: 0
    };

    for (const ingredient of ingredients) {
      const food = await getFoodById(ingredient.foodId);
      const multiplier = ingredient.quantity / 100; // Convert to per 100g

      Object.keys(totals).forEach(key => {
        totals[key] += (food.nutrition[key] || 0) * multiplier;
      });
    }

    console.log('✅ [USDA] Recipe nutrition calculated');
    return totals;
  } catch (error) {
    console.error('💥 [USDA] Calculate recipe error:', error);
    throw error;
  }
};

/**
 * Helper: Get nutrient value by name or ID
 */
const getNutrientValue = (nutrients, name, id) => {
  if (!nutrients || !Array.isArray(nutrients)) return 0;
  
  const nutrient = nutrients.find(n => 
    n.nutrientName === name || 
    n.nutrientId === id ||
    n.nutrientNumber === id
  );
  
  return nutrient ? parseFloat(nutrient.value || 0) : 0;
};

/**
 * Helper: Extract all nutrients into organized object
 */
const extractAllNutrients = (nutrients) => {
  return {
    // Macronutrients
    calories: getNutrientValue(nutrients, 'Energy', 208),
    protein: getNutrientValue(nutrients, 'Protein', 203),
    carbs: getNutrientValue(nutrients, 'Carbohydrate, by difference', 205),
    fat: getNutrientValue(nutrients, 'Total lipid (fat)', 204),
    
    // Detailed Carbs
    fiber: getNutrientValue(nutrients, 'Fiber, total dietary', 291),
    sugar: getNutrientValue(nutrients, 'Sugars, total including NLEA', 269),
    
    // Fats
    saturatedFat: getNutrientValue(nutrients, 'Fatty acids, total saturated', 606),
    transFat: getNutrientValue(nutrients, 'Fatty acids, total trans', 605),
    monounsaturatedFat: getNutrientValue(nutrients, 'Fatty acids, total monounsaturated', 645),
    polyunsaturatedFat: getNutrientValue(nutrients, 'Fatty acids, total polyunsaturated', 646),
    
    // Minerals
    sodium: getNutrientValue(nutrients, 'Sodium, Na', 307),
    cholesterol: getNutrientValue(nutrients, 'Cholesterol', 601),
    potassium: getNutrientValue(nutrients, 'Potassium, K', 306),
    calcium: getNutrientValue(nutrients, 'Calcium, Ca', 301),
    iron: getNutrientValue(nutrients, 'Iron, Fe', 303),
    magnesium: getNutrientValue(nutrients, 'Magnesium, Mg', 304),
    phosphorus: getNutrientValue(nutrients, 'Phosphorus, P', 305),
    zinc: getNutrientValue(nutrients, 'Zinc, Zn', 309),
    
    // Vitamins
    vitaminA: getNutrientValue(nutrients, 'Vitamin A, IU', 318),
    vitaminC: getNutrientValue(nutrients, 'Vitamin C, total ascorbic acid', 401),
    vitaminD: getNutrientValue(nutrients, 'Vitamin D (D2 + D3)', 328),
    vitaminE: getNutrientValue(nutrients, 'Vitamin E (alpha-tocopherol)', 323),
    vitaminK: getNutrientValue(nutrients, 'Vitamin K (phylloquinone)', 430),
    vitaminB6: getNutrientValue(nutrients, 'Vitamin B-6', 415),
    vitaminB12: getNutrientValue(nutrients, 'Vitamin B-12', 418),
    thiamin: getNutrientValue(nutrients, 'Thiamin', 404),
    riboflavin: getNutrientValue(nutrients, 'Riboflavin', 405),
    niacin: getNutrientValue(nutrients, 'Niacin', 406),
    folate: getNutrientValue(nutrients, 'Folate, total', 417)
  };
};

/**
 * Get daily value percentages based on 2000 calorie diet
 * @param {Object} nutrition - Nutrition data
 * @returns {Object} Daily value percentages
 */
export const getDailyValuePercentages = (nutrition) => {
  const dailyValues = {
    calories: 2000,
    protein: 50,
    carbs: 275,
    fat: 78,
    saturatedFat: 20,
    fiber: 28,
    sugar: 50,
    sodium: 2300,
    cholesterol: 300,
    potassium: 4700,
    calcium: 1300,
    iron: 18,
    vitaminA: 900,
    vitaminC: 90,
    vitaminD: 20
  };

  const percentages = {};
  Object.keys(dailyValues).forEach(key => {
    if (nutrition[key] !== undefined) {
      percentages[key] = Math.round((nutrition[key] / dailyValues[key]) * 100);
    }
  });

  return percentages;
};

export default {
  searchFoods,
  getFoodById,
  calculateRecipeNutrition,
  getDailyValuePercentages
};
