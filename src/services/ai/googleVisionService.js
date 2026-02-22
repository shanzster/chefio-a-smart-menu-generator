/**
 * Google Cloud Vision Service
 * Uses Google's Vision API for image analysis (LABEL_DETECTION)
 * Free tier: 1,000 units/month
 * Docs: https://cloud.google.com/vision/docs/request-json
 */

const API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY;
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

/**
 * Analyze image using Google Cloud Vision
 */
export const analyzeImage = async (base64Image) => {
    if (!API_KEY) {
        throw new Error('Google Cloud Vision API key not configured');
    }

    try {
        // Remove data URL prefix
        const content = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

        console.log('🔍 [GOOGLE VISION] Sending request...');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                requests: [
                    {
                        image: {
                            content: content
                        },
                        features: [
                            {
                                type: 'LABEL_DETECTION',
                                maxResults: 10
                            },
                            {
                                type: 'OBJECT_LOCALIZATION',
                                maxResults: 5
                            }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Google Vision API error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const result = data.responses[0];

        // Process results
        const labels = result.labelAnnotations || [];
        const objects = result.localizedObjectAnnotations || [];

        console.log('📊 [GOOGLE VISION] Raw labels:', labels.map(l => l.description));
        console.log('📦 [GOOGLE VISION] Raw objects:', objects.map(o => o.name));

        // Combine and filter for food items
        let potentialFoods = [];

        // Prioritize objects (usually more specific/accurate for single items)
        objects.forEach(obj => {
            if (isFoodRelated(obj.name)) {
                potentialFoods.push({
                    name: formatName(obj.name),
                    confidence: Math.round(obj.score * 100),
                    category: categorizeFoodItem(obj.name),
                    source: 'object_detection'
                });
            }
        });

        // Add high-confidence labels if not already found
        labels.forEach(label => {
            // Skip generic terms like "Food", "Vegetable", "Dish" if we have specific items
            if (isGenericFoodTerm(label.description)) return;

            if (isFoodRelated(label.description)) {
                // Check if already exist from object detection
                const exists = potentialFoods.some(f => f.name.toLowerCase() === label.description.toLowerCase());

                if (!exists) {
                    potentialFoods.push({
                        name: formatName(label.description),
                        confidence: Math.round(label.score * 100),
                        category: categorizeFoodItem(label.description),
                        source: 'label_detection'
                    });
                }
            }
        });

        // Sort by confidence
        potentialFoods.sort((a, b) => b.confidence - a.confidence);

        // Take top 3
        const topFoods = potentialFoods.slice(0, 3);

        console.log('🍎 [GOOGLE VISION] Identified foods:', topFoods);

        // Fetch nutrition for top result
        if (topFoods.length > 0) {
            try {
                const nutrition = await getNutritionData(topFoods[0].name);
                if (nutrition) {
                    topFoods[0].nutrition = nutrition;
                }
            } catch (err) {
                console.warn('⚠️ [NUTRITION] Failed to fetch nutrition:', err);
            }
        }

        return topFoods;

    } catch (error) {
        console.error('💥 [GOOGLE VISION] API Error:', error);
        throw error;
    }
};

/**
 * Recognize food from canvas (Wrapper for Scanner component)
 */
export const recognizeFoodFromCanvas = async (canvas) => {
    const base64 = canvas.toDataURL('image/jpeg', 0.8);
    return analyzeImage(base64);
};

// --- Helper Functions ---

/**
 * Format result name
 */
function formatName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/**
 * Simple categorization logic
 */
function categorizeFoodItem(name) {
    const n = name.toLowerCase();

    if (['carrot', 'tomato', 'onion', 'garlic', 'potato', 'broccoli', 'corn', 'spinach', 'lettuce', 'cucumber', 'pepper', 'cabbage', 'vegetable'].some(v => n.includes(v))) return 'Vegetable';
    if (['apple', 'banana', 'orange', 'grape', 'strawberry', 'berry', 'melon', 'fruit', 'lemon', 'lime', 'citrus'].some(f => n.includes(f))) return 'Fruit';
    if (['chicken', 'beef', 'pork', 'meat', 'fish', 'tuna', 'salmon', 'egg', 'bacon', 'ham', 'sausage', 'steak', 'turkey'].some(p => n.includes(p))) return 'Protein';
    if (['rice', 'pasta', 'bread', 'grain', 'wheat', 'oat', 'cereal', 'flour', 'dough', 'noodle', 'bakery'].some(g => n.includes(g))) return 'Grain';
    if (['milk', 'cheese', 'yogurt', 'cream', 'butter', 'dairy'].some(d => n.includes(d))) return 'Dairy';

    return 'Other';
}

/**
 * Check if term is food related
 */
function isFoodRelated(term) {
    const t = term.toLowerCase();
    // Allow specific food keywords + standard categories
    const keywords = [
        'food', 'fruit', 'vegetable', 'meat', 'dairy', 'bread', 'grain',
        'fish', 'seafood', 'poultry', 'drink', 'beverage', 'snack',
        'carrot', 'apple', 'banana', 'orange', 'tomato', 'potato', 'onion', // Common items
        'chicken', 'beef', 'pork', 'egg', 'cheese', 'milk', 'rice', 'pasta',
        'dish', 'cuisine', 'ingredient'
    ];

    // Also check against our categorization lists
    const isCategory = categorizeFoodItem(t) !== 'Other';

    return keywords.some(k => t.includes(k)) || isCategory;
}

/**
 * Filter out generic terms to prefer specific item names
 */
function isGenericFoodTerm(term) {
    const generics = [
        'food', 'ingredient', 'recipe', 'cuisine', 'dish', 'meal',
        'vegetable', 'fruit', 'natural foods', 'local food', 'whole food',
        'superfood', 'staple food', 'vegan nutrition', 'vegetarian food',
        'produce', 'plant', 'bush', 'tree', 'root vegetable', 'leaf vegetable',
        'food group', 'nutrition', 'diet'
    ];
    return generics.includes(term.toLowerCase());
}

/**
 * Get nutrition data (Reused from previous service)
 */
async function getNutritionData(foodName) {
    if (!SPOONACULAR_API_KEY) return null;

    try {
        console.log(`🥗 [NUTRITION] Fetching data for ${foodName}...`);

        // 1. Search for ingredient ID
        const searchRes = await fetch(`https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(foodName)}&number=1&apiKey=${SPOONACULAR_API_KEY}`);
        const searchData = await searchRes.json();

        if (!searchData.results?.length) return null;

        const id = searchData.results[0].id;

        // 2. Get nutrition info
        const infoRes = await fetch(`https://api.spoonacular.com/food/ingredients/${id}/information?amount=100&unit=grams&apiKey=${SPOONACULAR_API_KEY}`);
        const infoData = await infoRes.json();

        const nutrientes = infoData.nutrition?.nutrients || [];

        return {
            calories: Math.round(nutrientes.find(n => n.name === 'Calories')?.amount || 0),
            protein: Math.round(nutrientes.find(n => n.name === 'Protein')?.amount || 0),
            carbs: Math.round(nutrientes.find(n => n.name === 'Carbohydrates')?.amount || 0),
            fat: Math.round(nutrientes.find(n => n.name === 'Fat')?.amount || 0),
            per: '100g'
        };
    } catch (error) {
        console.warn('⚠️ [NUTRITION] Error:', error);
        return null;
    }
}


export const isGoogleVisionConfigured = () => !!API_KEY;
