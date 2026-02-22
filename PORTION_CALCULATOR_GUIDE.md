# 🧮 Portion Calculator - User Guide

## ✅ What's Working Now

The Portion Calculator is fully functional and integrated with your saved recipes!

## 🎯 Features

### 1. Recipe Selection
- Loads your saved recipes from Menu Generator
- Shows recipe name and original servings
- Click to select a recipe

### 2. Servings Adjustment
- **Original Servings**: The recipe's default serving size
- **Desired Servings**: How many servings you want to make
- Use +/- buttons to adjust
- Shows scale factor (e.g., 1.5x, 2x)

### 3. Scaled Ingredients
- Automatically calculates new ingredient amounts
- Shows original amount (crossed out)
- Shows scaled amount (highlighted)
- Rounds to 2 decimal places

### 4. Scaled Nutrition
- Calculates nutrition per serving
- Shows calories, protein, carbs, fat
- Updates automatically when servings change
- Color-coded cards for easy reading

### 5. Save Scaled Recipe
- Saves the scaled version to localStorage
- Includes scale factor and timestamp
- Can be accessed later

### 6. Generate Shopping List
- Creates formatted shopping list
- Includes all scaled ingredients
- Copies to clipboard automatically
- Ready to use for shopping

## 📱 How to Use

### Step 1: Save Recipes First
1. Go to Menu Generator
2. Generate recipes from ingredients
3. Click "Save" on recipes you like
4. Recipes are now available in Portion Calculator

### Step 2: Select Recipe
1. Go to Portion Calculator
2. See list of saved recipes on left
3. Click on a recipe to select it

### Step 3: Adjust Servings
1. Original servings shows recipe default
2. Use +/- buttons to set desired servings
3. Scale factor updates automatically

### Step 4: View Scaled Ingredients
1. See all ingredients with new amounts
2. Original amounts shown crossed out
3. New amounts highlighted in badges

### Step 5: Check Nutrition
1. Nutrition values update automatically
2. Shows per-serving values
3. Color-coded for easy reading:
   - 🟠 Orange: Calories
   - 🔵 Blue: Protein
   - 🟢 Green: Carbs
   - 🟣 Purple: Fat

### Step 6: Save or Generate List
- **Save Scaled Recipe**: Stores the scaled version
- **Generate Shopping List**: Copies ingredients to clipboard

## 🎨 User Interface

### Layout
```
┌─────────────────────────────────────────────┐
│  Portion Calculator                         │
│  Scale recipe portions and calculate...     │
├─────────────┬───────────────────────────────┤
│             │                               │
│  Recipes    │  Calculator                   │
│  ┌────────┐ │  ┌─────────────────────────┐ │
│  │Recipe 1│ │  │ Adjust Servings         │ │
│  └────────┘ │  │ Original: 4  Desired: 6 │ │
│  ┌────────┐ │  └─────────────────────────┘ │
│  │Recipe 2│ │                               │
│  └────────┘ │  ┌─────────────────────────┐ │
│  ┌────────┐ │  │ Scaled Ingredients      │ │
│  │Recipe 3│ │  │ • Chicken: 1.5 kg       │ │
│  └────────┘ │  │ • Rice: 600g            │ │
│             │  └─────────────────────────┘ │
│             │                               │
│             │  ┌─────────────────────────┐ │
│             │  │ Nutrition (per serving) │ │
│             │  │ 450 cal | 35g protein   │ │
│             │  └─────────────────────────┘ │
│             │                               │
│             │  [Save] [Shopping List]       │
└─────────────┴───────────────────────────────┘
```

## 🔢 Calculation Examples

### Example 1: Scaling Up
```
Original: 4 servings
Desired: 6 servings
Scale Factor: 1.5x

Ingredient: Chicken 1 kg
Scaled: 1.5 kg

Nutrition: 450 calories per serving
Scaled: 450 calories per serving (same per serving)
```

### Example 2: Scaling Down
```
Original: 4 servings
Desired: 2 servings
Scale Factor: 0.5x

Ingredient: Rice 400g
Scaled: 200g

Nutrition: 580 calories per serving
Scaled: 580 calories per serving (same per serving)
```

### Example 3: Large Scale
```
Original: 4 servings
Desired: 12 servings
Scale Factor: 3x

Ingredient: Garlic 4 cloves
Scaled: 12 cloves

Nutrition: 180 calories per serving
Scaled: 180 calories per serving (same per serving)
```

## 📋 Shopping List Format

When you click "Generate Shopping List", it creates:

```
Shopping List for Chicken Adobo (6 servings)

• 1.5 kg Chicken
• 0.75 cup Soy Sauce
• 0.38 cup Vinegar
• 12 cloves Garlic
• 4.5 pieces Bay Leaves
• 1.5 tsp Peppercorns
```

This is automatically copied to your clipboard!

## 🎯 Use Cases

### 1. Meal Prep
- Scale recipes for weekly meal prep
- Calculate exact amounts needed
- Generate shopping list for bulk buying

### 2. Party Planning
- Scale recipes for large gatherings
- Adjust from 4 to 20+ servings
- Ensure enough food for everyone

### 3. Portion Control
- Scale down recipes for 1-2 people
- Reduce food waste
- Perfect portions for small households

### 4. Batch Cooking
- Scale up for freezer meals
- Calculate bulk ingredient amounts
- Efficient cooking sessions

## 🔧 Technical Details

### Calculation Formula
```javascript
scaledAmount = originalAmount × (desiredServings / originalServings)
```

### Rounding
- Amounts rounded to 2 decimal places
- Nutrition values rounded to whole numbers
- Scale factor shown to 2 decimal places

### Data Storage
- Scaled recipes saved to localStorage
- Includes timestamp and scale factor
- Can be retrieved later

### Clipboard API
- Uses navigator.clipboard.writeText()
- Formats shopping list as plain text
- Works in modern browsers

## ✅ Features Checklist

- [x] Load saved recipes from Firebase
- [x] Select recipe from list
- [x] Adjust original servings
- [x] Adjust desired servings
- [x] Calculate scale factor
- [x] Scale all ingredients
- [x] Scale nutrition values
- [x] Show original vs scaled amounts
- [x] Color-coded nutrition cards
- [x] Save scaled recipe
- [x] Generate shopping list
- [x] Copy to clipboard
- [x] Reset calculator
- [x] Loading states
- [x] Empty states
- [x] Error handling
- [x] Toast notifications

## 🐛 Troubleshooting

### No Recipes Showing?
**Solution:**
1. Go to Menu Generator
2. Generate and save some recipes
3. Return to Portion Calculator
4. Recipes should now appear

### Ingredients Not Scaling?
**Check:**
- Recipe has ingredient data
- Amounts are numbers (not text)
- Units are specified

### Shopping List Not Copying?
**Check:**
- Browser supports clipboard API
- HTTPS enabled (required for clipboard)
- No browser extensions blocking clipboard

### Nutrition Values Wrong?
**Check:**
- Original recipe has nutrition data
- Values are per serving (not total)
- Calculation is correct (per serving stays same)

## 💡 Tips

### Best Practices
1. Save recipes with complete ingredient data
2. Use standard units (g, kg, cup, tbsp)
3. Include nutrition information
4. Test scale factor before cooking

### Scaling Tips
- Small adjustments (1-2x) work best
- Large scales (5x+) may need recipe adjustments
- Some ingredients don't scale linearly (spices, salt)
- Cooking times may need adjustment

### Shopping List Tips
- Copy list before leaving page
- Paste into notes app or shopping app
- Check pantry before shopping
- Round up amounts when buying

## 🎉 Summary

The Portion Calculator is now fully functional with:
- ✅ Real recipe integration
- ✅ Automatic scaling calculations
- ✅ Nutrition value updates
- ✅ Save scaled recipes
- ✅ Generate shopping lists
- ✅ Copy to clipboard

Perfect for meal prep, party planning, and portion control!

---

**Start using it:** Save recipes from Menu Generator, then scale them in Portion Calculator!
