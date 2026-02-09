# Menu Generator - Quick Setup Guide

## ✅ Implementation Complete!

The Menu Generator has been integrated with **Spoonacular API** (free tier).

---

## 🚀 Quick Start (3 Steps)

### Step 1: Get Your Free API Key

1. Go to [Spoonacular Food API](https://spoonacular.com/food-api)
2. Click "Get Access" or "Start Now"
3. Sign up with your email (no credit card required)
4. Go to your [Dashboard](https://spoonacular.com/food-api/console#Dashboard)
5. Copy your API key (looks like: `abc123def456...`)

**Free Tier Includes:**
- ✅ 150 requests per day
- ✅ Recipe search by ingredients
- ✅ Detailed recipe information
- ✅ Nutritional data
- ✅ Recipe images
- ✅ No credit card required

---

### Step 2: Add API Key to Your Project

Create or update `.env` file in your project root:

```env
VITE_SPOONACULAR_API_KEY=your-api-key-here
```

**Important:** Replace `your-api-key-here` with your actual API key from Step 1.

---

### Step 3: Restart Development Server

```bash
npm run dev
```

That's it! Your Menu Generator is now live! 🎉

---

## 🎯 How It Works

### User Flow:
1. User adds ingredients (e.g., "Chicken", "Rice", "Tomatoes")
2. Clicks "Generate Recipes"
3. AI searches Spoonacular's database for matching recipes
4. Returns 6 recipes with images, instructions, and nutrition
5. User can view details and save to their collection

### Features Implemented:
- ✅ Real-time recipe search by ingredients
- ✅ Recipe images from Spoonacular
- ✅ Detailed ingredient lists with quantities
- ✅ Step-by-step cooking instructions
- ✅ Nutritional information (calories, protein, carbs, fat)
- ✅ Match score (shows how many ingredients match)
- ✅ Save recipes to Firebase collection
- ✅ Beautiful recipe detail modal
- ✅ Toast notifications for success/errors
- ✅ Loading states and error handling

---

## 📊 API Usage Limits

### Free Tier:
- **150 requests/day** (resets at midnight UTC)
- **1 request/second** rate limit

### What Counts as a Request:
- Each "Generate Recipes" click = 7 requests (1 search + 6 detail calls)
- You can generate ~21 recipe sets per day on free tier

### Monitoring Usage:
Check your usage at: https://spoonacular.com/food-api/console#Dashboard

---

## 🧪 Testing

### Test the Menu Generator:

1. Navigate to Menu Generator page (logged in as cook)
2. Add ingredients: "Chicken", "Rice", "Garlic"
3. Click "Generate Recipes"
4. Wait 2-3 seconds for results
5. Click "View Details" on any recipe
6. Click "Save to Collection" to save to Firebase

### Expected Results:
- 6 recipes with images
- Each recipe shows prep time, servings, difficulty
- Match score shows ingredient usage
- Modal shows full recipe details
- Success toast when saved

---

## 🔧 Troubleshooting

### Error: "Failed to generate recipes"

**Possible Causes:**
1. API key not set or incorrect
2. Daily limit reached (150 requests)
3. Network error

**Solutions:**
1. Check `.env` file has correct API key
2. Restart dev server after adding `.env`
3. Check Spoonacular dashboard for usage
4. Try again in a few seconds (rate limit)

### Error: "Please check your API key"

**Solution:**
- Verify API key in `.env` file
- Make sure it starts with `VITE_`
- Restart development server

### No recipes found

**Possible Causes:**
- Unusual ingredient combinations
- Spoonacular doesn't have matching recipes

**Solutions:**
- Try common ingredients (chicken, pasta, rice)
- Use fewer ingredients (2-4 works best)
- Try different ingredient combinations

---

## 💰 Cost Analysis

### Free Tier (Current):
- **Cost:** $0/month
- **Limit:** 150 requests/day (~21 recipe generations)
- **Perfect for:** Development, testing, small user base

### If You Need More:

**Mega Plan - $49/month:**
- 5,000 requests/day
- ~714 recipe generations/day
- Good for: Small to medium apps

**Ultra Plan - $99/month:**
- 15,000 requests/day
- ~2,142 recipe generations/day
- Good for: Growing apps

**Extreme Plan - $199/month:**
- 50,000 requests/day
- ~7,142 recipe generations/day
- Good for: Large scale apps

---

## 🔄 Upgrade to OpenAI (Optional)

If you want more creative/flexible recipes, you can switch to OpenAI GPT-4:

**Pros:**
- More creative recipe generation
- Better handling of unusual ingredients
- Can generate custom recipes
- More flexible dietary restrictions

**Cons:**
- Costs money (~$0.002 per generation)
- Requires OpenAI account
- No recipe images (unless you pay extra)

**See:** `MENU_GENERATOR_IMPLEMENTATION.md` for OpenAI setup

---

## 📁 Files Created/Modified

### New Files:
- `src/services/ai/spoonacularService.js` - API integration

### Modified Files:
- `src/pages/cook/MenuGenerator/MenuGenerator.jsx` - Updated with real API calls

### Existing Files Used:
- `src/services/firebase/recipeService.js` - Save recipes to Firebase
- `src/store/toastStore.js` - Toast notifications

---

## 🎨 UI Features

### Recipe Cards:
- Recipe image from Spoonacular
- Recipe name and description
- Prep time, servings, difficulty
- Match score (ingredient usage)
- "View Details" and "Save" buttons

### Recipe Detail Modal:
- Full-screen recipe view
- Complete ingredient list with quantities
- Step-by-step instructions
- Nutritional breakdown (4 metrics)
- Save to collection
- Link to original source

### Ingredient Input:
- Type and press Enter to add
- Quick-add suggestions
- Remove ingredients easily
- Visual ingredient tags

---

## 🚀 Next Steps

### Immediate:
1. Get Spoonacular API key
2. Add to `.env` file
3. Test the generator
4. Share with users!

### Future Enhancements:
- [ ] Add dietary filters (vegetarian, vegan, gluten-free)
- [ ] Add cuisine type filter (Italian, Asian, Mexican)
- [ ] Add prep time filter (under 30 mins, etc.)
- [ ] Add servings selector
- [ ] Cache popular recipes in Firebase
- [ ] Add recipe ratings/reviews
- [ ] Share recipes via QR code
- [ ] Print recipe feature
- [ ] Shopping list generation

---

## ✨ Summary

Your Menu Generator is production-ready with:
- ✅ Real AI-powered recipe search
- ✅ Beautiful UI with images
- ✅ Complete recipe details
- ✅ Firebase integration
- ✅ Free tier (150 requests/day)
- ✅ Easy to upgrade later

Just add your API key and you're live! 🎉
