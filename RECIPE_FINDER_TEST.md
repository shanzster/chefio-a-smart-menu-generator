# 🧪 Recipe Finder (Menu Generator) Test Guide

## ✅ Quick Test

### Step 1: Check API Key
Your Spoonacular API key is configured:
```
VITE_SPOONACULAR_API_KEY=20e66283c3be4f3f83a3d2bccfcdaf71
```

### Step 2: Test the Recipe Finder

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Menu Generator:**
   - Click "Start Cooking Now" button on landing page
   - Or go directly to: http://localhost:5174/menu-generator

3. **Add ingredients:**
   - Type: `chicken, rice, tomato`
   - Click "Add" after each ingredient
   - Or press Enter

4. **Generate recipes:**
   - Click "Generate Recipes" button
   - Wait 2-3 seconds

5. **Expected result:**
   - ✅ Should show 4 recipe cards
   - ✅ Each with image, name, prep time
   - ✅ Nutrition info (calories, protein, carbs, fat)
   - ✅ Success toast: "Found 4 delicious recipes! 🍳"

## 🔍 What to Check

### If It Works
You'll see:
```
┌─────────────────────────────────┐
│  [Recipe Image]                 │
│  Chicken Rice Bowl              │
│  ⏱️ 25 mins | 🍽️ 4 servings    │
│  🔥 350 cal | 🥩 25g protein    │
│  [View Recipe] [Save]           │
└─────────────────────────────────┘
```

### If It Doesn't Work
You'll see:
- ❌ Error toast: "Failed to generate recipes"
- ❌ Console error in browser DevTools
- ❌ No recipe cards appear

## 🐛 Troubleshooting

### Issue 1: "Failed to generate recipes"
**Possible causes:**
- API key invalid or expired
- API rate limit exceeded (150 requests/day on free tier)
- Network connection issue
- CORS issue

**Check:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests

### Issue 2: API Rate Limit
Spoonacular free tier limits:
- 150 requests per day
- 1 request per second

**Solution:**
- Wait until tomorrow for limit reset
- Or upgrade to paid plan
- Or use mock data for testing

### Issue 3: No recipes found
**Possible causes:**
- Ingredients don't match any recipes
- Filters too restrictive

**Solution:**
- Try common ingredients: chicken, pasta, tomato
- Remove filters (dietary restrictions, calories, etc.)
- Try fewer ingredients (2-3 is ideal)

## 📊 API Status Check

### Test API Key Manually
Open this URL in browser:
```
https://api.spoonacular.com/recipes/findByIngredients?ingredients=chicken,rice&number=2&apiKey=20e66283c3be4f3f83a3d2bccfcdaf71
```

**Expected response:**
```json
[
  {
    "id": 12345,
    "title": "Chicken Rice Bowl",
    "image": "https://...",
    "usedIngredientCount": 2,
    "missedIngredientCount": 1
  }
]
```

**If you see error:**
```json
{
  "status": "failure",
  "code": 401,
  "message": "Invalid API key"
}
```
→ API key is invalid

```json
{
  "status": "failure", 
  "code": 402,
  "message": "Quota exceeded"
}
```
→ Daily limit reached

## 🎯 Features to Test

### Basic Recipe Generation
- [ ] Add 2-3 ingredients
- [ ] Click "Generate Recipes"
- [ ] See 4 recipe cards
- [ ] Each card has image, name, time, servings
- [ ] Nutrition info displayed

### Filters
- [ ] Set servings (1-12)
- [ ] Select dietary restriction (vegetarian, vegan, etc.)
- [ ] Set max calories
- [ ] Set min protein
- [ ] Set max carbs
- [ ] Generate with filters applied
- [ ] Recipes match filter criteria

### Recipe Details
- [ ] Click "View Recipe" on a card
- [ ] See full recipe details
- [ ] Ingredients list shown
- [ ] Instructions shown
- [ ] Nutrition breakdown shown

### Save Recipe
- [ ] Click "Save" on a recipe
- [ ] See success toast
- [ ] Recipe saved to collection (if logged in)

### Scanner Integration
- [ ] Go to Scanner page
- [ ] Scan an ingredient
- [ ] Click "Generate Recipes"
- [ ] Redirects to Menu Generator
- [ ] Scanned ingredient pre-filled

## 📝 Console Logs to Check

When generating recipes, you should see:
```
🔍 Searching recipes for: chicken, rice, tomato
📡 Calling Spoonacular API...
✅ Found 4 recipes
🎨 Rendering recipe cards...
```

If there's an error:
```
❌ Recipe generation error: [error details]
```

## 🎉 Success Criteria

Recipe Finder is working if:
- ✅ Can add ingredients
- ✅ Generate button works
- ✅ Recipes appear (4 cards)
- ✅ Images load
- ✅ Nutrition info shows
- ✅ Can view recipe details
- ✅ Can save recipes
- ✅ Filters work correctly

## 🔧 Quick Fixes

### Clear Cache
```bash
# Stop dev server (Ctrl+C)
# Clear Vite cache
rm -rf node_modules/.vite
# Restart
npm run dev
```

### Verify Environment Variables
```bash
# Check if .env is loaded
echo $VITE_SPOONACULAR_API_KEY
```

### Test with Mock Data
If API isn't working, you can test with mock data:
1. Open `src/services/ai/spoonacularService.js`
2. Add mock data return at the top of `searchRecipesByIngredients`

## 📞 Need Help?

If recipe finder isn't working:
1. Check browser console for errors
2. Verify API key is valid (test URL above)
3. Check if rate limit exceeded
4. Try with simple ingredients (chicken, rice)
5. Remove all filters
6. Check network connection

---

**Quick Test:** Add "chicken, rice, tomato" and click "Generate Recipes"

Should work immediately if API key is valid and rate limit not exceeded!
