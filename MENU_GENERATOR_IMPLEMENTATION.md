# Menu Generator Implementation Guide

## 🎯 Overview

The Menu Generator is the core feature of Chefio. It takes user-provided ingredients and generates recipe suggestions using AI.

---

## 🏗️ Architecture Options

### Option 1: OpenAI GPT API (Recommended)
**Pros:**
- Most powerful and flexible
- Natural language understanding
- Can generate creative recipes
- Handles dietary restrictions well
- Good at explaining cooking steps

**Cons:**
- Costs money per API call
- Requires API key management
- Rate limits apply

**Cost:** ~$0.002 per recipe generation

### Option 2: Spoonacular API
**Pros:**
- Specialized for recipes
- Large recipe database
- Nutritional data included
- Ingredient substitutions
- Free tier available

**Cons:**
- Limited free tier (150 requests/day)
- Less flexible than GPT
- Paid plans can be expensive

**Cost:** Free tier, then $0.004 per request

### Option 3: Edamam Recipe API
**Pros:**
- Good recipe database
- Nutritional analysis
- Dietary filters
- Free tier available

**Cons:**
- Limited customization
- Requires multiple API calls
- Free tier is limited

**Cost:** Free tier, then paid plans

### Option 4: Custom AI Model (Advanced)
**Pros:**
- Full control
- No per-request costs
- Privacy
- Customizable

**Cons:**
- Requires ML expertise
- Training data needed
- Infrastructure costs
- Maintenance overhead

---

## 🚀 Recommended Approach: OpenAI GPT-4

### Why OpenAI?
1. **Best Results**: Most accurate and creative
2. **Flexible**: Handles any ingredient combination
3. **Affordable**: ~$0.002 per generation
4. **Easy Integration**: Simple API
5. **Scalable**: Handles high volume

---

## 📋 Implementation Steps

### Step 1: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up / Log in
3. Go to API Keys section
4. Create new secret key
5. Copy and save securely

### Step 2: Install OpenAI SDK

```bash
npm install openai
```

### Step 3: Set Up Environment Variables

Create `.env` file:
```env
VITE_OPENAI_API_KEY=sk-your-api-key-here
```

### Step 4: Create AI Service

Create `src/services/ai/openaiService.js`:

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development
});

export const generateRecipes = async (ingredients, options = {}) => {
  const {
    dietaryRestrictions = [],
    prepTime = null,
    servings = 4,
    difficulty = null,
    cuisine = null
  } = options;

  const prompt = `
You are a professional chef AI assistant. Generate 3 creative and practical recipes using the following ingredients:

Ingredients: ${ingredients.join(', ')}

Requirements:
- Servings: ${servings}
${dietaryRestrictions.length > 0 ? `- Dietary restrictions: ${dietaryRestrictions.join(', ')}` : ''}
${prepTime ? `- Maximum prep time: ${prepTime} minutes` : ''}
${difficulty ? `- Difficulty level: ${difficulty}` : ''}
${cuisine ? `- Cuisine type: ${cuisine}` : ''}

For each recipe, provide:
1. Recipe name
2. Brief description (1 sentence)
3. Preparation time
4. Difficulty level (Easy/Medium/Hard)
5. Complete ingredient list with quantities
6. Step-by-step instructions
7. Nutritional information (calories, protein, carbs, fat per serving)
8. Cooking tips

Format the response as a JSON array of recipe objects.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a professional chef AI that generates creative, practical recipes. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 2000
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.recipes || [];
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};
```

### Step 5: Update Menu Generator Component

```javascript
import { generateRecipes } from '../../../services/ai/openaiService';
import { createRecipe } from '../../../services/firebase/recipeService';
import { toast } from '../../../store/toastStore';

const MenuGenerator = () => {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  // Options
  const [servings, setServings] = useState(4);
  const [prepTime, setPrepTime] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }

    setIsGenerating(true);
    
    try {
      const generatedRecipes = await generateRecipes(ingredients, {
        servings,
        prepTime: prepTime ? parseInt(prepTime) : null,
        difficulty,
        dietaryRestrictions
      });
      
      setRecipes(generatedRecipes);
      toast.success(`Generated ${generatedRecipes.length} recipes! 🍳`);
    } catch (error) {
      console.error('Recipe generation error:', error);
      toast.error('Failed to generate recipes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRecipe = async (recipe) => {
    try {
      await createRecipe({
        title: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prepTime: recipe.prepTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        nutrition: recipe.nutrition,
        category: 'Generated',
        tags: ingredients
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

## 🎨 Enhanced UI Features

### 1. Advanced Options Panel

```jsx
<div className="mb-6 p-4 bg-white/50 rounded-xl border border-gray-200">
  <h3 className="font-semibold mb-4">Options (Optional)</h3>
  
  <div className="grid grid-cols-2 gap-4">
    {/* Servings */}
    <div>
      <label className="text-sm font-medium mb-2 block">Servings</label>
      <input
        type="number"
        value={servings}
        onChange={(e) => setServings(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
        min="1"
        max="12"
      />
    </div>
    
    {/* Prep Time */}
    <div>
      <label className="text-sm font-medium mb-2 block">Max Prep Time</label>
      <select
        value={prepTime}
        onChange={(e) => setPrepTime(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
      >
        <option value="">Any</option>
        <option value="15">15 minutes</option>
        <option value="30">30 minutes</option>
        <option value="45">45 minutes</option>
        <option value="60">1 hour</option>
      </select>
    </div>
    
    {/* Difficulty */}
    <div>
      <label className="text-sm font-medium mb-2 block">Difficulty</label>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
      >
        <option value="">Any</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
    </div>
    
    {/* Dietary Restrictions */}
    <div>
      <label className="text-sm font-medium mb-2 block">Dietary</label>
      <select
        multiple
        value={dietaryRestrictions}
        onChange={(e) => setDietaryRestrictions(
          Array.from(e.target.selectedOptions, option => option.value)
        )}
        className="w-full px-3 py-2 border rounded-lg"
      >
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="gluten-free">Gluten-Free</option>
        <option value="dairy-free">Dairy-Free</option>
        <option value="low-carb">Low-Carb</option>
      </select>
    </div>
  </div>
</div>
```

### 2. Recipe Detail Modal

```jsx
{selectedRecipe && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedRecipe(null)} />
    
    <div className="relative bg-white rounded-3xl p-8 max-w-2xl max-h-[90vh] overflow-y-auto">
      <button
        onClick={() => setSelectedRecipe(null)}
        className="absolute top-4 right-4"
      >
        <FiX className="w-6 h-6" />
      </button>
      
      <h2 className="text-2xl font-bold mb-4">{selectedRecipe.name}</h2>
      <p className="text-gray-600 mb-6">{selectedRecipe.description}</p>
      
      {/* Ingredients */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Ingredients</h3>
        <ul className="space-y-2">
          {selectedRecipe.ingredients.map((ing, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full" />
              {ing}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Instructions */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Instructions</h3>
        <ol className="space-y-3">
          {selectedRecipe.instructions.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-bold text-primary">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      
      {/* Nutrition */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Nutrition (per serving)</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {selectedRecipe.nutrition.calories}
            </div>
            <div className="text-xs text-gray-600">Calories</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {selectedRecipe.nutrition.protein}g
            </div>
            <div className="text-xs text-gray-600">Protein</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {selectedRecipe.nutrition.carbs}g
            </div>
            <div className="text-xs text-gray-600">Carbs</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {selectedRecipe.nutrition.fat}g
            </div>
            <div className="text-xs text-gray-600">Fat</div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex gap-3">
        <Button fullWidth onClick={() => handleSaveRecipe(selectedRecipe)}>
          Save Recipe
        </Button>
        <Button variant="outline" fullWidth>
          Share
        </Button>
      </div>
    </div>
  </div>
)}
```

---

## 💰 Cost Estimation

### OpenAI GPT-4 Turbo
- **Cost per request**: ~$0.002
- **100 generations**: $0.20
- **1,000 generations**: $2.00
- **10,000 generations**: $20.00

### Monthly Estimates
- **100 users, 10 generations each**: $2/month
- **1,000 users, 10 generations each**: $20/month
- **10,000 users, 10 generations each**: $200/month

---

## 🔒 Security Best Practices

### 1. API Key Protection

**❌ Never do this:**
```javascript
const apiKey = "sk-your-key-here"; // Exposed in client code!
```

**✅ Do this instead:**

Option A: Backend Proxy (Recommended)
```javascript
// Create API route in your backend
// POST /api/generate-recipes
export async function POST(request) {
  const { ingredients, options } = await request.json();
  
  // Call OpenAI from server
  const recipes = await generateRecipes(ingredients, options);
  
  return Response.json({ recipes });
}
```

Option B: Firebase Cloud Functions
```javascript
// functions/index.js
exports.generateRecipes = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated');
  }
  
  const { ingredients, options } = data;
  const recipes = await callOpenAI(ingredients, options);
  
  return { recipes };
});
```

### 2. Rate Limiting

```javascript
// Limit users to X generations per day
const checkRateLimit = async (userId) => {
  const today = new Date().toISOString().split('T')[0];
  const userDoc = await db.collection('usage').doc(userId).get();
  
  const usage = userDoc.data()?.[today] || 0;
  
  if (usage >= 10) { // 10 generations per day
    throw new Error('Daily limit reached');
  }
  
  // Increment usage
  await db.collection('usage').doc(userId).set({
    [today]: usage + 1
  }, { merge: true });
};
```

### 3. Input Validation

```javascript
const validateIngredients = (ingredients) => {
  if (!Array.isArray(ingredients)) {
    throw new Error('Ingredients must be an array');
  }
  
  if (ingredients.length === 0) {
    throw new Error('At least one ingredient required');
  }
  
  if (ingredients.length > 20) {
    throw new Error('Maximum 20 ingredients allowed');
  }
  
  // Check for malicious content
  const dangerous = ['<script>', 'javascript:', 'onerror='];
  for (const ing of ingredients) {
    if (dangerous.some(d => ing.toLowerCase().includes(d))) {
      throw new Error('Invalid ingredient');
    }
  }
  
  return true;
};
```

---

## 📊 Analytics & Monitoring

### Track Usage

```javascript
const trackGeneration = async (userId, ingredients, success) => {
  await db.collection('analytics').add({
    userId,
    action: 'recipe_generation',
    ingredients: ingredients.length,
    success,
    timestamp: new Date()
  });
};
```

### Monitor Costs

```javascript
const logAPICall = async (cost, tokens) => {
  await db.collection('api_usage').add({
    service: 'openai',
    cost,
    tokens,
    timestamp: new Date()
  });
};
```

---

## 🧪 Testing Strategy

### 1. Unit Tests
```javascript
describe('generateRecipes', () => {
  it('should generate recipes with valid ingredients', async () => {
    const recipes = await generateRecipes(['chicken', 'rice']);
    expect(recipes).toHaveLength(3);
    expect(recipes[0]).toHaveProperty('name');
  });
  
  it('should handle dietary restrictions', async () => {
    const recipes = await generateRecipes(['tofu'], {
      dietaryRestrictions: ['vegan']
    });
    // Verify recipes are vegan
  });
});
```

### 2. Integration Tests
- Test with real API (use test key)
- Verify response format
- Check error handling

### 3. User Testing
- Beta test with real users
- Collect feedback
- Iterate on prompts

---

## 🚀 Deployment Checklist

- [ ] OpenAI API key secured
- [ ] Environment variables set
- [ ] Rate limiting implemented
- [ ] Error handling complete
- [ ] Loading states working
- [ ] Save recipe functionality
- [ ] Analytics tracking
- [ ] Cost monitoring
- [ ] User feedback collection
- [ ] Documentation complete

---

## 📈 Future Enhancements

### Phase 2
- [ ] Image generation for recipes
- [ ] Video cooking instructions
- [ ] Voice input for ingredients
- [ ] Recipe variations
- [ ] Meal planning (weekly menus)

### Phase 3
- [ ] Community recipe sharing
- [ ] Recipe ratings and reviews
- [ ] Ingredient substitutions
- [ ] Shopping list generation
- [ ] Cooking timers integration

---

## 🆘 Troubleshooting

### Issue: API Key Not Working
**Solution**: Verify key is correct, check billing, ensure proper environment variable

### Issue: Slow Response
**Solution**: Use GPT-3.5-turbo instead of GPT-4, reduce max_tokens

### Issue: Poor Recipe Quality
**Solution**: Improve prompt engineering, add more context, use examples

### Issue: High Costs
**Solution**: Implement caching, use cheaper model, add rate limits

---

## ✨ Summary

**Recommended Stack:**
- **AI**: OpenAI GPT-4 Turbo
- **Backend**: Firebase Cloud Functions
- **Storage**: Firestore
- **Security**: Server-side API calls
- **Cost**: ~$0.002 per generation

**Next Steps:**
1. Get OpenAI API key
2. Set up Cloud Functions
3. Implement generation logic
4. Add rate limiting
5. Test thoroughly
6. Deploy and monitor

This will give you a production-ready, scalable menu generator! 🎉
