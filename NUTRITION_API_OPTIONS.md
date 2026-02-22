# Nutrition Analysis API Options for Chefio

## Overview
This document evaluates free and affordable nutrition APIs for implementing the Nutrition Analysis feature in Chefio. The feature should allow users to analyze ingredients and recipes for nutritional information including calories, macronutrients (protein, carbs, fats), vitamins, and minerals.

---

## API Options Comparison

### 1. USDA FoodData Central API ⭐ RECOMMENDED
**Provider:** U.S. Department of Agriculture (Government)  
**Website:** [https://fdc.nal.usda.gov/api-guide](https://fdc.nal.usda.gov/api-guide)

#### Pricing
- **100% FREE** - Government-funded, no cost
- Requires free API key from data.gov
- No rate limits specified (reasonable use expected)

#### Features
- 300,000+ food items in database
- Comprehensive nutritional data (25+ nutrients)
- Foundation Foods, SR Legacy, Branded Foods databases
- FDA-compliant data
- Search by food name, UPC barcode
- Detailed nutrient breakdown per 100g

#### Pros
- ✅ Completely free forever
- ✅ Government-backed, reliable data
- ✅ No rate limits or usage restrictions
- ✅ Extensive database (300K+ items)
- ✅ FDA-compliant nutritional information
- ✅ No attribution required
- ✅ Includes vitamins, minerals, amino acids

#### Cons
- ❌ API responses can be complex/verbose
- ❌ Requires parsing and data transformation
- ❌ No natural language processing
- ❌ Must search by exact food names

#### Use Cases
- Ingredient-based nutrition lookup
- Recipe nutrition calculation
- Detailed nutrient analysis
- Compliance with FDA standards

---

### 2. API Ninjas Nutrition API
**Provider:** API Ninjas  
**Website:** [https://api-ninjas.com/api/nutrition](https://api-ninjas.com/api/nutrition)

#### Pricing
- **Free Tier:** Not clearly specified on website
- **Developer Plan:** $39/month (100,000 calls/month)
- **Business Plan:** $99/month (1M calls/month)

#### Features
- Natural Language Processing (NLP)
- Extract nutrition from freeform text
- Works with recipes, menus, food journals
- Returns nutrition per 100g or specified quantity
- Simple JSON response format

#### Pros
- ✅ Natural language processing
- ✅ Easy to use - just send text
- ✅ Works with recipes and ingredient lists
- ✅ Clean, simple API responses
- ✅ Fast response times

#### Cons
- ❌ Free tier limits unclear
- ❌ May require paid plan for production
- ❌ Less comprehensive than USDA
- ❌ Smaller database

#### Use Cases
- Recipe text analysis
- Menu nutrition extraction
- Food journal parsing

---

### 3. Edamam Nutrition Analysis API
**Provider:** Edamam  
**Website:** [https://www.edamam.com/](https://www.edamam.com/)

#### Pricing
- **Developer Plan:** Free tier available
- **Free Tier:** 10,000 calls/month
- **Paid Plans:** Start at $49/month

#### Features
- Recipe nutrition analysis
- Ingredient parsing
- Nutrition data in <1 second
- Diet labels and health labels
- Allergen detection

#### Pros
- ✅ Free tier with 10K calls/month
- ✅ Fast processing (<1 second)
- ✅ Recipe-focused
- ✅ Allergen detection
- ✅ Diet compliance checking

#### Cons
- ❌ Limited free tier (10K/month)
- ❌ Requires paid plan for scaling
- ❌ Attribution required on free tier

#### Use Cases
- Recipe nutrition analysis
- Diet compliance checking
- Allergen detection

---

### 4. Spoonacular Nutrition API
**Provider:** Spoonacular (RapidAPI)  
**Website:** [https://spoonacular.com/food-api](https://spoonacular.com/food-api)

#### Pricing
- **Free Tier:** 150 requests/day
- **Paid Plans:** $10-$500/month

#### Features
- Recipe nutrition analysis
- Ingredient nutrition lookup
- Meal planning features
- Diet compliance
- Already integrated in Chefio for recipes!

#### Pros
- ✅ Already using for menu generation
- ✅ Free tier available (150/day)
- ✅ Comprehensive recipe features
- ✅ Single API for multiple features

#### Cons
- ❌ Very limited free tier (150/day)
- ❌ Expensive for scaling
- ❌ Already using quota for menu generation

#### Use Cases
- Recipe nutrition (if not exceeding limits)
- Integrated with existing menu generator

---

## Recommendation: USDA FoodData Central API

### Why USDA?
1. **100% Free Forever** - No costs, no limits, government-funded
2. **Most Comprehensive** - 300K+ foods, 25+ nutrients per food
3. **FDA Compliant** - Official government data
4. **No Rate Limits** - Unlimited reasonable use
5. **Reliable** - Government-backed infrastructure
6. **Complete Data** - Vitamins, minerals, amino acids, macros

### Implementation Strategy

#### Phase 1: Basic Nutrition Lookup
- Search USDA database by ingredient name
- Display calories, protein, carbs, fats
- Show per 100g and per serving

#### Phase 2: Recipe Analysis
- Sum nutrition from all ingredients
- Calculate per serving
- Display total recipe nutrition

#### Phase 3: Advanced Features
- Vitamin and mineral breakdown
- Daily value percentages
- Nutrition charts/visualizations
- Export nutrition labels

---

## API Integration Plan

### USDA FoodData Central Integration

#### 1. Get API Key
- Sign up at [https://api.data.gov/signup/](https://api.data.gov/signup/)
- Free, instant approval
- No credit card required

#### 2. API Endpoints

**Search Foods:**
```
GET https://api.nal.usda.gov/fdc/v1/foods/search
Parameters:
  - api_key: YOUR_API_KEY
  - query: "chicken breast"
  - dataType: ["Foundation", "SR Legacy"]
  - pageSize: 10
```

**Get Food Details:**
```
GET https://api.nal.usda.gov/fdc/v1/food/{fdcId}
Parameters:
  - api_key: YOUR_API_KEY
  - format: full
  - nutrients: [203, 204, 205, 208] (protein, fat, carbs, calories)
```

#### 3. Key Nutrient IDs
- **208:** Energy (Calories)
- **203:** Protein
- **204:** Total Fat
- **205:** Carbohydrates
- **291:** Fiber
- **269:** Sugars
- **307:** Sodium
- **306:** Potassium
- **301:** Calcium
- **303:** Iron
- **401:** Vitamin C
- **318:** Vitamin A

#### 4. Response Structure
```json
{
  "fdcId": 123456,
  "description": "Chicken, broilers or fryers, breast, meat only, raw",
  "foodNutrients": [
    {
      "nutrientId": 208,
      "nutrientName": "Energy",
      "value": 120,
      "unitName": "kcal"
    },
    {
      "nutrientId": 203,
      "nutrientName": "Protein",
      "value": 22.5,
      "unitName": "g"
    }
  ]
}
```

---

## Implementation Files

### Service Layer
- `src/services/nutrition/usdaService.js` - USDA API integration
- `src/services/nutrition/nutritionCalculator.js` - Recipe nutrition calculations

### Components
- `src/pages/cook/Nutrition/Nutrition.jsx` - Main nutrition analysis page
- `src/components/nutrition/NutritionCard.jsx` - Display nutrition info
- `src/components/nutrition/NutritionChart.jsx` - Visual charts

### Features to Implement
1. **Ingredient Search** - Search USDA database
2. **Nutrition Display** - Show macros, calories, vitamins
3. **Recipe Analysis** - Calculate total recipe nutrition
4. **Serving Calculator** - Adjust nutrition per serving
5. **Daily Value %** - Show % of recommended daily intake
6. **Export** - Download nutrition label

---

## Alternative: Hybrid Approach

If USDA API is too complex, consider:

1. **Primary:** USDA FoodData Central (free, comprehensive)
2. **Fallback:** Spoonacular (already integrated, for recipes)
3. **Cache:** Store frequently used nutrition data locally

This ensures:
- Free operation for most use cases
- Fallback for complex recipes
- Reduced API calls through caching

---

## Next Steps

1. ✅ Create this documentation
2. ⏳ Get USDA API key from data.gov
3. ⏳ Create `usdaService.js` with API integration
4. ⏳ Implement nutrition search and display
5. ⏳ Add recipe nutrition calculator
6. ⏳ Build nutrition visualization components
7. ⏳ Test with real ingredients and recipes

---

## Resources

- [USDA FoodData Central API Guide](https://fdc.nal.usda.gov/api-guide.html)
- [USDA API Key Signup](https://api.data.gov/signup/)
- [USDA Nutrient List](https://fdc.nal.usda.gov/nutrient-list.html)
- [API Ninjas Nutrition Docs](https://api-ninjas.com/api/nutrition)
- [Edamam Nutrition API](https://developer.edamam.com/edamam-nutrition-api)

---

**Decision:** Use USDA FoodData Central API as the primary nutrition data source due to its comprehensive free tier, government-backed reliability, and extensive nutritional data coverage.
