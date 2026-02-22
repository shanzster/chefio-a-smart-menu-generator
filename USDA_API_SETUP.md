# USDA FoodData Central API - Quick Setup Guide

## Step 1: Get Your Free API Key

1. Go to: [https://api.data.gov/signup/](https://api.data.gov/signup/)
2. Fill out the form:
   - First Name
   - Last Name
   - Email Address
   - Website (can use: `http://localhost:5173` or your project URL)
3. Click "Sign Up"
4. Check your email for the API key (arrives instantly)
5. Copy your API key - looks like: `DEMO_KEY` or `abc123xyz456...`

---

## Step 2: Test the API

### Test in Browser
Open this URL in your browser (replace `YOUR_API_KEY`):
```
https://api.nal.usda.gov/fdc/v1/foods/search?api_key=YOUR_API_KEY&query=chicken%20breast
```

You should see JSON data with chicken breast nutrition info!

### Test with cURL (Command Line)
```bash
curl "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=YOUR_API_KEY&query=apple"
```

---

## Step 3: Add API Key to .env File

Add this line to your `.env` file:
```
VITE_USDA_API_KEY=your_actual_api_key_here
```

**Important:** 
- Use `VITE_` prefix for Vite to expose it to frontend
- Never commit `.env` to git (already in `.gitignore`)
- Add to `.env.example` as a template

---

## API Endpoints You'll Use

### 1. Search Foods
**Endpoint:** `GET /fdc/v1/foods/search`

**Example:**
```javascript
const searchFood = async (query) => {
  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${API_KEY}&query=${query}&pageSize=10`
  );
  return response.json();
};
```

**Response:**
```json
{
  "foods": [
    {
      "fdcId": 171705,
      "description": "Chicken, broilers or fryers, breast, meat only, raw",
      "foodNutrients": [
        {
          "nutrientName": "Protein",
          "value": 22.5,
          "unitName": "G"
        },
        {
          "nutrientName": "Energy",
          "value": 120,
          "unitName": "KCAL"
        }
      ]
    }
  ]
}
```

### 2. Get Food Details by ID
**Endpoint:** `GET /fdc/v1/food/{fdcId}`

**Example:**
```javascript
const getFoodDetails = async (fdcId) => {
  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${API_KEY}`
  );
  return response.json();
};
```

---

## Common Nutrient IDs

When you want specific nutrients, use these IDs:

| Nutrient | ID | Unit |
|----------|-----|------|
| Calories (Energy) | 208 | kcal |
| Protein | 203 | g |
| Total Fat | 204 | g |
| Carbohydrates | 205 | g |
| Fiber | 291 | g |
| Sugars | 269 | g |
| Sodium | 307 | mg |
| Potassium | 306 | mg |
| Calcium | 301 | mg |
| Iron | 303 | mg |
| Vitamin C | 401 | mg |
| Vitamin A | 318 | IU |
| Vitamin D | 328 | IU |
| Cholesterol | 601 | mg |

---

## Example: Complete Search Function

```javascript
// src/services/nutrition/usdaService.js

const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY;
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export const searchFoods = async (query) => {
  try {
    const response = await fetch(
      `${BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=10&dataType=Foundation,SR%20Legacy`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search foods');
    }
    
    const data = await response.json();
    
    // Transform to simpler format
    return data.foods.map(food => ({
      id: food.fdcId,
      name: food.description,
      calories: getNutrient(food.foodNutrients, 'Energy'),
      protein: getNutrient(food.foodNutrients, 'Protein'),
      carbs: getNutrient(food.foodNutrients, 'Carbohydrate, by difference'),
      fat: getNutrient(food.foodNutrients, 'Total lipid (fat)'),
      fiber: getNutrient(food.foodNutrients, 'Fiber, total dietary'),
      sugar: getNutrient(food.foodNutrients, 'Sugars, total including NLEA')
    }));
  } catch (error) {
    console.error('USDA API Error:', error);
    throw error;
  }
};

const getNutrient = (nutrients, name) => {
  const nutrient = nutrients.find(n => n.nutrientName === name);
  return nutrient ? nutrient.value : 0;
};

export const getFoodById = async (fdcId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/food/${fdcId}?api_key=${USDA_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to get food details');
    }
    
    return response.json();
  } catch (error) {
    console.error('USDA API Error:', error);
    throw error;
  }
};
```

---

## Usage in Your App

### In Nutrition Analysis Page:
```javascript
import { searchFoods } from '../../services/nutrition/usdaService';

const handleSearch = async (ingredient) => {
  const results = await searchFoods(ingredient);
  console.log(results);
  // Display results to user
};
```

### Calculate Recipe Nutrition:
```javascript
const calculateRecipeNutrition = (ingredients) => {
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };
  
  ingredients.forEach(ing => {
    totals.calories += ing.calories * (ing.quantity / 100);
    totals.protein += ing.protein * (ing.quantity / 100);
    totals.carbs += ing.carbs * (ing.quantity / 100);
    totals.fat += ing.fat * (ing.quantity / 100);
  });
  
  return totals;
};
```

---

## Important Notes

1. **Rate Limits:** No official limit, but be reasonable (don't spam)
2. **Data Type:** Use `Foundation` or `SR Legacy` for best results
3. **Portions:** USDA data is per 100g, adjust for actual portions
4. **Caching:** Cache common foods to reduce API calls
5. **Error Handling:** Always handle API errors gracefully

---

## Workflow: Scanner + USDA Together

```
1. User scans food with camera
   ↓
2. TensorFlow.js identifies: "Chicken Breast"
   ↓
3. User confirms or edits name
   ↓
4. Click "View Nutrition"
   ↓
5. Search USDA API for "Chicken Breast"
   ↓
6. Display nutrition info (calories, protein, etc.)
```

**They work together:**
- **Scanner (TensorFlow.js):** Identifies WHAT the food is
- **USDA API:** Tells you the NUTRITION of that food

---

## Next Steps

1. ✅ Get your USDA API key
2. ✅ Add to `.env` file
3. ✅ Test the API in browser
4. ⏳ Create `usdaService.js`
5. ⏳ Implement nutrition search
6. ⏳ Display nutrition data
7. ⏳ Connect scanner results to nutrition lookup

---

## Resources

- [API Key Signup](https://api.data.gov/signup/)
- [USDA API Documentation](https://fdc.nal.usda.gov/api-guide.html)
- [Interactive API Explorer](https://fdc.nal.usda.gov/api-spec/fdc_api.html)
