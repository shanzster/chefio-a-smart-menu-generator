# Menu Generator - Free Alternative (Spoonacular)

## 🆓 Free Option: Spoonacular API

For testing and development, you can use Spoonacular's free tier.

### Pros:
- ✅ Free tier: 150 requests/day
- ✅ No credit card required
- ✅ Recipe database included
- ✅ Nutritional data
- ✅ Easy to use

### Cons:
- ❌ Limited to 150 requests/day
- ❌ Less flexible than GPT
- ❌ Can't generate truly custom recipes

---

## 🚀 Quick Setup

### Step 1: Get API Key

1. Go to [Spoonacular](https://spoonacular.com/food-api)
2. Sign up for free account
3. Get your API key from dashboard
4. Free tier: 150 requests/day

### Step 2: Add to Environment

```env
VITE_SPOONACULAR_API_KEY=your-api-key-here
```

### Step 3: Create Service

Create `src/services/ai/spoonacularService.js`:

```javascript
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

export const searchRecipesByIngredients = async (ingredients, options = {}) => {
  const {
    number = 3,
    ranking = 1, // 1 = maximize used ingredients, 2 = minimize missing ingredients
    ignorePantry = true
  } = options;

  try {
    const ingredientsStr = ingredients.join(',');
    const url = `${BASE_URL}/recipes/findByIngredients?ingredients=${ingredientsStr}&number=${number}&ranking=${ranking}&ignorePantry=${ignorePantry}&apiKey=${API_KEY}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }

    const recipes = await response.json();
    
    // Get detailed information for each recipe
    const detailedRecipes = await Promise.all(
      recipes.map(recipe => getRecipeDetails(recipe.id))
    );

    return detailedRecipes;
  } catch (error) {
    console.error('Spoonacular API Error:', error);
    throw error;
  }
};

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
      description: recipe.summary?.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
      image: recipe.image,
      prepTime: recipe.readyInMinutes,
      servings: recipe.servings,
      difficulty: recipe.readyInMinutes < 30 ? 'Easy' : recipe.readyInMinutes < 60 ? 'Medium' : 'Hard',
      ingredients: recipe.extendedIngredients.map(ing => ({
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        original: ing.original
      })),
      instructions: recipe.analyzedInstructions[0]?.steps.map(step => step.step) || [],
      nutrition: {
        calories: Math.round(recipe.nutrition?.nutrients.find(n => n.name === 'Calories')?.amount || 0),
        protein: Math.round(recipe.nutrition?.nutrients.find(n => n.name === 'Protein')?.amount || 0),
        carbs: Math.round(recipe.nutrition?.nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0),
        fat: Math.round(recipe.nutrition?.nutrients.find(n => n.name === 'Fat')?.amount || 0)
      },
      sourceUrl: recipe.sourceUrl,
      spoonacularUrl: recipe.spoonacularSourceUrl
    };
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};

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
```

### Step 4: Update Menu Generator

```javascript
import { searchRecipesByIngredients } from '../../../services/ai/spoonacularService';
import { createRecipe } from '../../../services/firebase/recipeService';
import { toast } from '../../../store/toastStore';

const MenuGenerator = () => {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }

    setIsGenerating(true);
    
    try {
      const generatedRecipes = await searchRecipesByIngredients(ingredients, {
        number: 6, // Get 6 recipes
        ranking: 1 // Maximize used ingredients
      });
      
      setRecipes(generatedRecipes);
      toast.success(`Found ${generatedRecipes.length} recipes! 🍳`);
    } catch (error) {
      console.error('Recipe search error:', error);
      toast.error('Failed to find recipes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRecipe = async (recipe) => {
    try {
      await createRecipe({
        title: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients.map(ing => ing.original),
        instructions: recipe.instructions,
        prepTime: `${recipe.prepTime} mins`,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        nutrition: recipe.nutrition,
        category: 'Generated',
        tags: ingredients,
        image: recipe.image,
        sourceUrl: recipe.sourceUrl
      });
      
      toast.success('Recipe saved to your collection! 📖');
    } catch (error) {
      console.error('Save recipe error:', error);
      toast.error('Failed to save recipe');
    }
  };

  // ... rest of component
};
```

---

## 📊 API Limits

### Free Tier
- **150 requests/day**
- **1 request/second**
- No credit card required

### Paid Tiers
- **Mega**: $49/month - 5,000 requests/day
- **Ultra**: $99/month - 15,000 requests/day
- **Extreme**: $199/month - 50,000 requests/day

---

## 💡 Optimization Tips

### 1. Cache Results

```javascript
const recipeCache = new Map();

export const searchRecipesByIngredientsWithCache = async (ingredients, options) => {
  const cacheKey = `${ingredients.sort().join(',')}-${JSON.stringify(options)}`;
  
  if (recipeCache.has(cacheKey)) {
    console.log('Using cached results');
    return recipeCache.get(cacheKey);
  }
  
  const recipes = await searchRecipesByIngredients(ingredients, options);
  recipeCache.set(cacheKey, recipes);
  
  return recipes;
};
```

### 2. Store in Firestore

```javascript
// Save API results to Firestore
const saveRecipeToCache = async (ingredients, recipes) => {
  const cacheKey = ingredients.sort().join(',');
  
  await db.collection('recipe_cache').doc(cacheKey).set({
    ingredients,
    recipes,
    timestamp: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });
};

// Check cache before API call
const checkRecipeCache = async (ingredients) => {
  const cacheKey = ingredients.sort().join(',');
  const doc = await db.collection('recipe_cache').doc(cacheKey).get();
  
  if (doc.exists) {
    const data = doc.data();
    if (data.expiresAt.toDate() > new Date()) {
      return data.recipes;
    }
  }
  
  return null;
};
```

### 3. Batch Requests

```javascript
// Get multiple recipes in one request
const getMultipleRecipeDetails = async (recipeIds) => {
  const url = `${BASE_URL}/recipes/informationBulk?ids=${recipeIds.join(',')}&includeNutrition=true&apiKey=${API_KEY}`;
  
  const response = await fetch(url);
  return response.json();
};
```

---

## 🎨 Enhanced Recipe Cards

```jsx
<Card hover className="overflow-hidden">
  {/* Recipe Image */}
  {recipe.image && (
    <div className="relative h-48 overflow-hidden">
      <img 
        src={recipe.image} 
        alt={recipe.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-2 right-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-success">
        {recipe.usedIngredientCount}/{recipe.usedIngredientCount + recipe.missedIngredientCount} ingredients
      </div>
    </div>
  )}
  
  <div className="p-4">
    <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
      {recipe.description}
    </p>
    
    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
      <span className="flex items-center gap-1">
        <FiClock /> {recipe.prepTime} mins
      </span>
      <span className="flex items-center gap-1">
        <FiUsers /> {recipe.servings}
      </span>
      <Badge variant="success">{recipe.difficulty}</Badge>
    </div>
    
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        fullWidth
        onClick={() => setSelectedRecipe(recipe)}
      >
        View Details
      </Button>
      <Button 
        fullWidth
        onClick={() => handleSaveRecipe(recipe)}
      >
        Save
      </Button>
    </div>
  </div>
</Card>
```

---

## 🔄 Comparison: OpenAI vs Spoonacular

| Feature | OpenAI GPT-4 | Spoonacular |
|---------|--------------|-------------|
| **Cost** | $0.002/request | Free (150/day) |
| **Creativity** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Accuracy** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Speed** | 2-5 seconds | 1-2 seconds |
| **Customization** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Images** | No (extra cost) | Yes (included) |
| **Nutrition** | Generated | Real data |
| **Setup** | Easy | Easy |
| **Free Tier** | No | Yes (150/day) |

---

## 🎯 Recommendation

### For Development/Testing:
**Use Spoonacular**
- Free tier is sufficient
- Real recipe data
- Includes images
- Good for MVP

### For Production:
**Use OpenAI GPT-4**
- More flexible
- Better quality
- Handles any ingredients
- Worth the cost (~$20/month for 10k requests)

### Hybrid Approach:
**Use Both**
- Spoonacular for common ingredients
- OpenAI for unusual combinations
- Cache results to minimize costs

---

## ✨ Quick Start

1. Get Spoonacular API key (free)
2. Add to `.env`
3. Copy service code
4. Update Menu Generator
5. Test with ingredients
6. Deploy!

This gives you a working menu generator with zero cost! 🎉
