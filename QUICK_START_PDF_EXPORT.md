# Quick Start: Nutrition PDF Export

## For Users

### How to Export Nutrition to PDF:

1. **Navigate** to the Nutrition page (Cook → Nutrition)
2. **Search** for any food (e.g., "chicken breast", "apple", "brown rice")
3. **Select** a food item from the search results
4. **Adjust** the serving size using the +/- buttons
5. **Click** the "Export PDF" button in the top-right corner
6. **Done!** Your PDF will download automatically

### What You'll Get:
- Professional nutrition facts document
- Food image (if available)
- All nutritional data adjusted to your serving size
- Printable and shareable PDF file

---

## For Developers

### Quick Integration:

```javascript
import { exportNutritionToPDF } from './utils/pdfExport';

// Export nutrition data
await exportNutritionToPDF(foodObject, quantity, imageUrl);
```

### Food Object Structure:
```javascript
{
  name: "Chicken Breast",
  nutrition: {
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    // ... other nutrients
  },
  servingSize: 100
}
```

### Files to Know:
- `src/utils/pdfExport.js` - PDF generation
- `src/services/nutrition/foodImageService.js` - Image fetching
- `src/components/nutrition/NutritionDetails.jsx` - UI component

### Environment Setup:
```bash
# Install dependencies (already done)
npm install jspdf html2canvas

# Configure API keys in .env
VITE_USDA_API_KEY=your_key
VITE_SPOONACULAR_API_KEY=your_key  # Optional for images
```

---

## Troubleshooting

### PDF Not Downloading?
- Check browser download permissions
- Look for errors in browser console
- Ensure food object has required fields

### Images Not Showing?
- Verify `VITE_SPOONACULAR_API_KEY` is set
- Check API rate limits
- Images are optional - PDF works without them

### Need Help?
- See `NUTRITION_PDF_EXPORT.md` for full documentation
- Check browser console for error messages
- Verify all dependencies are installed

---

## That's It!

The feature is ready to use. No additional setup required beyond existing API keys.
