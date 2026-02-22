/**
 * Clarifai Food Recognition Service
 * Provides accurate food and ingredient recognition using Clarifai's Food Model
 * Free tier: 1,000 operations/month
 * Docs: https://docs.clarifai.com/api-guide/predict/images
 */

const API_KEY = import.meta.env.VITE_CLARIFAI_API_KEY;
const USER_ID = import.meta.env.VITE_CLARIFAI_USER_ID || 'clarifai';
const APP_ID = import.meta.env.VITE_CLARIFAI_APP_ID || 'main';
const MODEL_ID = 'food-item-recognition';
const MODEL_VERSION_ID = 'dfebc169854e429086aceb8368662641'; // Latest stable version

// Spoonacular API for nutrition lookup
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

/**
 * Recognize food from base64 image
 */
export const recognizeFoodFromBase64 = async (base64Image) => {
    console.log('\n🍽️ [CLARIFAI] Starting food recognition...');

    if (!API_KEY || API_KEY === 'your-clarifai-api-key-here') {
        console.warn('⚠️ [CLARIFAI] API key not configured');
        throw new Error('Clarifai API key not configured');
    }

    try {
        // Remove data URL prefix if present
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

        console.log('📤 [CLARIFAI] Sending request to API...');

        const response = await fetch(
            `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Key ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_app_id: {
                        user_id: USER_ID,
                        app_id: APP_ID
                    },
                    inputs: [
                        {
                            data: {
                                image: {
                                    base64: base64Data
                                }
                            }
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ [CLARIFAI] API error:', errorData);
            throw new Error(`Clarifai API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ [CLARIFAI] Response received');

        // Extract concepts (predictions)
        const concepts = data.outputs?.[0]?.data?.concepts || [];

        if (concepts.length === 0) {
            console.warn('⚠️ [CLARIFAI] No food items detected');
            return [];
        }

        console.log(`📊 [CLARIFAI] Found ${concepts.length} predictions`);

        // Transform to our format (TOP 3 ONLY)
        const recognizedFoods = concepts
            .filter(concept => concept.value > 0.5) // Only keep predictions with >50% confidence
            .slice(0, 3) // TOP 3 PREDICTIONS ONLY
            .map(concept => ({
                name: formatFoodName(concept.name),
                confidence: Math.round(concept.value * 100),
                category: categorizeFoodItem(concept.name),
                rawName: concept.name
            }));

        console.log('🎯 [CLARIFAI] Top 3 results:', recognizedFoods.map(f => `${f.name} (${f.confidence}%)`));

        // Add nutrition data for top result
        if (recognizedFoods.length > 0) {
            try {
                console.log('🍎 [CLARIFAI] Fetching nutrition data for:', recognizedFoods[0].name);
                const nutrition = await getNutritionData(recognizedFoods[0].name);
                recognizedFoods[0].nutrition = nutrition;
                console.log('✅ [CLARIFAI] Nutrition data added:', nutrition);
            } catch (nutritionError) {
                console.warn('⚠️ [CLARIFAI] Failed to fetch nutrition data:', nutritionError.message);
                // Continue without nutrition data
            }
        }

        return recognizedFoods;
    } catch (error) {
        console.error('💥 [CLARIFAI] Recognition error:', error);
        throw error;
    }
};

/**
 * Recognize food from canvas element
 */
export const recognizeFoodFromCanvas = async (canvas) => {
    console.log('🖼️ [CLARIFAI] Converting canvas to base64...');

    try {
        // Convert canvas to base64 JPEG (smaller file size)
        const base64Image = canvas.toDataURL('image/jpeg', 0.8);
        console.log('✅ [CLARIFAI] Canvas converted');

        return await recognizeFoodFromBase64(base64Image);
    } catch (error) {
        console.error('💥 [CLARIFAI] Canvas conversion error:', error);
        throw error;
    }
};

/**
 * Format food name for display
 */
const formatFoodName = (name) => {
    // Clarifai returns names like "carrot", "tomato", etc.
    // Capitalize first letter of each word
    return name
        .split(/[\s_-]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

/**
 * Categorize food item into our categories
 */
const categorizeFoodItem = (foodName) => {
    const name = foodName.toLowerCase();

    // Proteins
    const proteins = [
        'chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp',
        'meat', 'turkey', 'lamb', 'duck', 'bacon', 'sausage', 'ham',
        'egg', 'tofu', 'tempeh', 'seitan'
    ];
    if (proteins.some(p => name.includes(p))) return 'Protein';

    // Vegetables
    const vegetables = [
        'tomato', 'onion', 'garlic', 'carrot', 'broccoli', 'spinach',
        'lettuce', 'pepper', 'cucumber', 'potato', 'cabbage', 'celery',
        'mushroom', 'zucchini', 'eggplant', 'corn', 'peas', 'bean',
        'kale', 'cauliflower', 'asparagus', 'radish', 'beet', 'turnip',
        'squash', 'pumpkin', 'vegetable'
    ];
    if (vegetables.some(v => name.includes(v))) return 'Vegetable';

    // Fruits
    const fruits = [
        'apple', 'banana', 'orange', 'grape', 'strawberry', 'lemon',
        'lime', 'berry', 'mango', 'pineapple', 'watermelon', 'peach',
        'pear', 'cherry', 'kiwi', 'avocado', 'plum', 'apricot',
        'grapefruit', 'melon', 'fruit'
    ];
    if (fruits.some(f => name.includes(f))) return 'Fruit';

    // Grains
    const grains = [
        'rice', 'pasta', 'bread', 'wheat', 'oat', 'quinoa', 'noodle',
        'cereal', 'flour', 'tortilla', 'bagel', 'croissant', 'grain',
        'barley', 'couscous', 'bulgur'
    ];
    if (grains.some(g => name.includes(g))) return 'Grain';

    // Dairy
    const dairy = [
        'milk', 'cheese', 'yogurt', 'butter', 'cream', 'ice cream',
        'dairy', 'cheddar', 'mozzarella', 'parmesan'
    ];
    if (dairy.some(d => name.includes(d))) return 'Dairy';

    return 'Other';
};

/**
 * Get nutrition data from Spoonacular API
 */
const getNutritionData = async (foodName) => {
    if (!SPOONACULAR_API_KEY) {
        console.warn('⚠️ [NUTRITION] Spoonacular API key not configured');
        return null;
    }

    try {
        console.log('🔍 [NUTRITION] Searching for:', foodName);

        // Search for ingredient
        const searchUrl = `https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(foodName)}&number=1&apiKey=${SPOONACULAR_API_KEY}`;
        const searchResponse = await fetch(searchUrl);

        if (!searchResponse.ok) {
            throw new Error(`Spoonacular search failed: ${searchResponse.status}`);
        }

        const searchData = await searchResponse.json();

        if (!searchData.results || searchData.results.length === 0) {
            console.warn('⚠️ [NUTRITION] No ingredient found for:', foodName);
            return null;
        }

        const ingredientId = searchData.results[0].id;
        console.log('✅ [NUTRITION] Found ingredient ID:', ingredientId);

        // Get nutrition info (for 100g)
        const nutritionUrl = `https://api.spoonacular.com/food/ingredients/${ingredientId}/information?amount=100&unit=grams&apiKey=${SPOONACULAR_API_KEY}`;
        const nutritionResponse = await fetch(nutritionUrl);

        if (!nutritionResponse.ok) {
            throw new Error(`Spoonacular nutrition failed: ${nutritionResponse.status}`);
        }

        const nutritionData = await nutritionResponse.json();

        // Extract key nutrients
        const nutrients = nutritionData.nutrition?.nutrients || [];
        const calories = nutrients.find(n => n.name === 'Calories')?.amount || 0;
        const protein = nutrients.find(n => n.name === 'Protein')?.amount || 0;
        const carbs = nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0;
        const fat = nutrients.find(n => n.name === 'Fat')?.amount || 0;

        const nutrition = {
            calories: Math.round(calories),
            protein: Math.round(protein * 10) / 10,
            carbs: Math.round(carbs * 10) / 10,
            fat: Math.round(fat * 10) / 10,
            per: '100g'
        };

        console.log('📊 [NUTRITION] Data:', nutrition);
        return nutrition;
    } catch (error) {
        console.error('💥 [NUTRITION] Error:', error.message);
        return null;
    }
};

/**
 * Check if Clarifai API is configured
 */
export const isClarifaiConfigured = () => {
    return API_KEY && API_KEY !== 'your-clarifai-api-key-here';
};
