# Menu Generator - New Filters Guide

## ✨ What's New

The Menu Generator now includes advanced filters to help you find the perfect recipes!

### Changes:
- ✅ **Limited to 4 recipes** (reduced from 6 for faster results)
- ✅ **Servings/Pax selector** - Choose how many people to serve
- ✅ **Dietary restrictions** - Filter by diet type
- ✅ **Nutrient filters** - Control calories, protein, and carbs

---

## 🎯 New Features

### 1. Recipe Limit
- Now generates **4 recipes** instead of 6
- Faster results (uses fewer API calls)
- More focused recommendations

### 2. Servings / Pax
- **Default:** 4 servings
- **Range:** 1-12 servings
- Recipes will be adjusted for the number of people

### 3. Dietary Restrictions
Choose from:
- **None** (default)
- **Vegetarian** - No meat
- **Vegan** - No animal products
- **Gluten Free** - No gluten
- **Ketogenic** - Low carb, high fat
- **Paleo** - Whole foods, no processed
- **Pescetarian** - Fish but no meat

### 4. Nutrient Filters

#### Max Calories (per serving)
- Set maximum calories per serving
- Example: 500 calories
- Great for weight management

#### Min Protein (grams)
- Set minimum protein per serving
- Example: 20 grams
- Perfect for high-protein diets

#### Max Carbs (grams)
- Set maximum carbs per serving
- Example: 50 grams
- Ideal for low-carb/keto diets

---

## 🎨 How to Use

### Step 1: Add Ingredients
1. Type ingredients (e.g., "Chicken", "Rice")
2. Press Enter or click "Add"
3. Add 2-5 ingredients for best results

### Step 2: Show Filters (Optional)
1. Click "Show Filters (Optional)" button
2. Filters panel will expand

### Step 3: Set Your Preferences

**For Weight Loss:**
```
Servings: 1
Max Calories: 400
Min Protein: 25
Max Carbs: 30
```

**For Muscle Building:**
```
Servings: 1
Min Protein: 40
Max Calories: 600
```

**For Family Dinner:**
```
Servings: 6
Dietary: None
(Leave nutrients empty)
```

**For Vegan Diet:**
```
Servings: 2
Dietary: Vegan
Max Calories: 500
```

### Step 4: Generate Recipes
1. Click "Generate Recipes"
2. Wait 2-3 seconds
3. View 4 filtered recipes!

### Step 5: Clear Filters
- Click "Clear all filters" to reset
- Or manually adjust each filter

---

## 📊 Filter Behavior

### How Filters Work:
1. **Ingredients** are searched first
2. **Dietary restriction** filters recipes by diet type
3. **Nutrient filters** remove recipes that don't meet criteria
4. **Result:** Only recipes matching ALL filters are shown

### If No Recipes Found:
- Try relaxing some filters
- Remove nutrient restrictions
- Use more common ingredients
- Change dietary restriction

---

## 💡 Tips & Tricks

### Best Practices:
1. **Start simple** - Add ingredients first, then filters
2. **Don't over-filter** - Too many restrictions = fewer results
3. **Be realistic** - Some combinations may not exist
4. **Experiment** - Try different filter combinations

### Common Combinations:

**Quick & Easy:**
- Ingredients: Chicken, Rice, Vegetables
- Max Calories: 500
- Servings: 2

**Keto-Friendly:**
- Ingredients: Beef, Cheese, Eggs
- Dietary: Ketogenic
- Max Carbs: 20
- Min Protein: 30

**Vegetarian Family Meal:**
- Ingredients: Pasta, Tomatoes, Cheese
- Dietary: Vegetarian
- Servings: 6

**High-Protein Breakfast:**
- Ingredients: Eggs, Cheese, Spinach
- Min Protein: 25
- Max Calories: 400
- Servings: 1

---

## 🔍 Understanding Results

### Recipe Cards Show:
- **Recipe image** from Spoonacular
- **Match score** - How many ingredients match
- **Prep time** - Total cooking time
- **Servings** - Number of portions
- **Difficulty** - Easy/Medium/Hard

### Recipe Details Include:
- Complete ingredient list with quantities
- Step-by-step instructions
- **Nutritional breakdown:**
  - Calories (per serving)
  - Protein (grams)
  - Carbs (grams)
  - Fat (grams)

---

## 📈 API Usage

### With Filters:
- Each generation = 5 API calls (1 search + 4 details)
- Free tier: 150 requests/day
- You can generate ~30 recipe sets per day

### Without Filters (Before):
- Each generation = 7 API calls (1 search + 6 details)
- You could generate ~21 recipe sets per day

**Result:** Filters actually save API calls! 🎉

---

## 🐛 Troubleshooting

### "No recipes found"
**Cause:** Filters too restrictive or unusual ingredients

**Solutions:**
1. Remove some nutrient filters
2. Change dietary restriction to "None"
3. Use more common ingredients
4. Increase max calories/carbs
5. Decrease min protein

### "Failed to generate recipes"
**Cause:** API error or network issue

**Solutions:**
1. Check internet connection
2. Verify API key in `.env`
3. Check Spoonacular dashboard for limits
4. Try again in a few seconds

### Recipes don't match filters
**Cause:** Spoonacular data may be incomplete

**Note:** Some recipes may not have complete dietary/nutrition data. The filter does its best with available information.

---

## 🎯 Example Scenarios

### Scenario 1: Healthy Lunch
```
Ingredients: Chicken, Quinoa, Broccoli
Servings: 2
Max Calories: 450
Min Protein: 30
Dietary: None
```

### Scenario 2: Vegan Dinner
```
Ingredients: Tofu, Rice, Vegetables
Servings: 4
Dietary: Vegan
Max Calories: 500
```

### Scenario 3: Keto Breakfast
```
Ingredients: Eggs, Bacon, Cheese
Servings: 1
Dietary: Ketogenic
Max Carbs: 10
Min Protein: 25
```

### Scenario 4: Family Pasta Night
```
Ingredients: Pasta, Tomatoes, Basil, Cheese
Servings: 6
Dietary: Vegetarian
Max Calories: 600
```

---

## ✨ Summary

Your Menu Generator now has:
- ✅ 4 recipe limit (faster, more focused)
- ✅ Servings selector (1-12 pax)
- ✅ 6 dietary restrictions
- ✅ 3 nutrient filters (calories, protein, carbs)
- ✅ Clear filters button
- ✅ Collapsible filter panel

**Perfect for:**
- Weight management
- Dietary restrictions
- Meal planning
- Nutrition tracking
- Family cooking

Enjoy your personalized recipe generation! 🍳
