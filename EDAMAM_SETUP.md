# Edamam Recipe API Setup (FREE Fallback)

## Why Edamam?
Edamam provides a FREE recipe search API as a fallback when Spoonacular's daily limit (150 requests) is exceeded.

## Free Tier Limits
- 10 requests per minute
- 10,000 requests per month
- No credit card required

## Setup Instructions

### 1. Sign Up for Edamam
1. Go to: https://developer.edamam.com/
2. Click "Sign Up" (top right)
3. Create a free account

### 2. Get Recipe Search API Credentials
1. After login, go to: https://developer.edamam.com/admin/applications
2. Click "Create a new application" or select existing one
3. Choose "Recipe Search API"
4. You'll get:
   - Application ID (APP_ID)
   - Application Key (APP_KEY)

### 3. Add to .env File
```env
VITE_EDAMAM_APP_ID=your_app_id_here
VITE_EDAMAM_APP_KEY=your_app_key_here
```

### 4. Test the Integration
1. Restart your dev server: `npm run dev`
2. Go to Menu Generator
3. Add ingredients and click "Generate Menu"
4. If Spoonacular fails, Edamam will automatically take over

## How It Works

### Automatic Fallback System
```
User clicks "Generate Menu"
    ↓
Try Spoonacular API
    ↓
Success? → Show recipes ✅
    ↓
Failed? → Try Edamam API
    ↓
Success? → Show recipes + info message ✅
    ↓
Failed? → Show error ❌
```

### Console Logs
Watch the browser console for:
- `🔍 [RECIPE SERVICE] Searching recipes...`
- `📡 [RECIPE SERVICE] Trying Spoonacular API...`
- `⚠️ [RECIPE SERVICE] Spoonacular failed`
- `🔄 [RECIPE SERVICE] Falling back to Edamam API...`
- `✅ [RECIPE SERVICE] Edamam returned X recipes`

## Features Supported

### ✅ Supported by Edamam
- Ingredient-based search
- Dietary restrictions (vegetarian, vegan, gluten-free, keto, paleo, pescetarian)
- Nutrition filters (calories, protein, carbs)
- Recipe images
- Ingredient lists
- Nutrition information per serving

### ❌ Not Supported by Edamam
- Ingredient match scoring (usedIngredientCount/missedIngredientCount)
- Step-by-step instructions (provides source URL instead)
- Recipe difficulty calculation (estimated from prep time)

## API Comparison

| Feature | Spoonacular | Edamam |
|---------|-------------|---------|
| Free Requests | 150/day | 10,000/month |
| Ingredient Matching | ✅ Excellent | ⚠️ Basic |
| Instructions | ✅ Detailed | ❌ Link only |
| Nutrition | ✅ Detailed | ✅ Detailed |
| Dietary Filters | ✅ Yes | ✅ Yes |
| Cost | Free tier | 100% Free |

## Troubleshooting

### "Both APIs failed"
- Check your internet connection
- Verify API credentials in .env
- Check browser console for specific errors
- Ensure you haven't exceeded Edamam's rate limit (10 req/min)

### Edamam returns fewer results
- Edamam's search is less flexible than Spoonacular
- Try using more common ingredient names
- Reduce the number of filters applied

### No instructions in recipes
- Edamam provides source URLs instead of instructions
- Click "View Recipe" to see full instructions on the original website

## Rate Limit Management

### Spoonacular (150/day)
- Resets at midnight UTC
- Use sparingly during development
- Consider caching results

### Edamam (10,000/month)
- 10 requests per minute limit
- Plenty for production use
- No daily reset needed

## Production Recommendations

1. Keep both APIs configured
2. Monitor usage in Firebase Analytics
3. Consider implementing request caching
4. Add user feedback for API switches
5. Upgrade to paid tier if needed

## Support
- Edamam Docs: https://developer.edamam.com/edamam-docs-recipe-api
- Edamam Support: support@edamam.com
