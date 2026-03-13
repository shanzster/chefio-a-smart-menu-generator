# 🎯 Next Performance Optimizations

## Pages That Still Need Optimization

### 1. MenuGenerator.jsx ⚠️

**Current Issues:**
- 3 floating background elements with blur effects
- Multiple `animate-fade-in-up` with staggered delays
- Heavy `backdrop-blur-sm` on ingredient badges
- `animate-spin-slow` on loading state
- Multiple `animate-bounce` dots

**Recommended Fixes:**
```javascript
// Remove or simplify floating elements
// Before:
<div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float" />

// After:
<div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full" />

// Replace backdrop-blur with solid backgrounds
// Before:
<div className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full">

// After:
<div className="px-3 py-1 bg-white rounded-full">

// Memoize recipe cards
const RecipeCard = memo(({ recipe, index }) => {
  // Component code
});
```

**Estimated Impact:** 40-50% performance improvement

### 2. Scanner.jsx ⚠️

**Current Issues:**
- `backdrop-blur-sm` on overlays (very expensive during camera feed)
- `animate-scan-line` running constantly
- `animate-scale-in` on results
- Heavy camera processing + animations = lag

**Recommended Fixes:**
```javascript
// Remove backdrop-blur during camera operation
// Before:
<div className="absolute inset-0 bg-black/60 backdrop-blur-sm">

// After:
<div className="absolute inset-0 bg-black/80">

// Pause animations during camera processing
const [isProcessing, setIsProcessing] = useState(false);

// Conditionally render scan line
{!isProcessing && <div className="animate-scan-line" />}

// Lazy load TensorFlow
const loadTensorFlow = async () => {
  const tf = await import('@tensorflow/tfjs');
  const model = await import('@tensorflow-models/mobilenet');
  return { tf, model };
};
```

**Estimated Impact:** 60-70% performance improvement during scanning

### 3. Global CSS Optimizations

**File:** `src/index.css`

**Issues:**
- Too many animation keyframes
- Complex gradient animations
- Unused animation classes

**Recommended Fixes:**
```css
/* Simplify gradient animation */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Remove if not used: */
- @keyframes shimmer
- @keyframes wave
- @keyframes pulseGlow
- Multiple duplicate slide-in animations

/* Simplify float animation */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); } /* Reduced from -12px */
}
```

## 🔧 Code Splitting Strategy

### Implement Lazy Loading

**Create:** `src/utils/lazyLoad.js`
```javascript
import { lazy, Suspense } from 'react';

// Lazy load heavy components
export const Scanner = lazy(() => import('../pages/Scanner/Scanner'));
export const MenuGenerator = lazy(() => import('../pages/MenuGenerator/MenuGenerator'));

// Loading fallback
export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);
```

**Update:** `src/App.jsx`
```javascript
import { Suspense } from 'react';
import { Scanner, MenuGenerator, PageLoader } from './utils/lazyLoad';

// In routes:
<Route 
  path="/scanner" 
  element={
    <Suspense fallback={<PageLoader />}>
      <Scanner />
    </Suspense>
  } 
/>
```

**Impact:** 
- Initial bundle: 10MB → 3MB (70% reduction)
- TensorFlow only loads when needed
- Faster initial page load

## 📦 Bundle Size Optimization

### Current Bundle Analysis

Run this to see bundle size:
```bash
npm run build
```

**Expected Heavy Chunks:**
- `@tensorflow/tfjs`: ~8-10 MB ⚠️
- `firebase`: ~2-3 MB
- `framer-motion`: ~100-200 KB
- `react-icons` + `lucide-react`: ~500 KB (using both!)

### Recommendations:

1. **Lazy Load TensorFlow** (Highest Priority)
   - Only load when Scanner page opens
   - Saves 10MB on initial load

2. **Consolidate Icon Libraries**
   ```bash
   # Choose one:
   npm uninstall react-icons  # Keep lucide-react
   # OR
   npm uninstall lucide-react  # Keep react-icons
   ```

3. **Consider Removing framer-motion**
   - Check if it's actually being used
   - CSS animations are often sufficient
   - Saves 100-200 KB

4. **Tree-shake Firebase**
   ```javascript
   // Only import what you need
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';
   // Don't import entire firebase package
   ```

## 🎨 Component-Level Optimizations

### Add React.memo to Pure Components

**Example:**
```javascript
import { memo } from 'react';

// Before:
const FeatureCard = ({ feature }) => {
  return <div>...</div>;
};

// After:
const FeatureCard = memo(({ feature }) => {
  return <div>...</div>;
});

// For complex props:
const RecipeCard = memo(({ recipe }) => {
  return <div>...</div>;
}, (prevProps, nextProps) => {
  return prevProps.recipe.id === nextProps.recipe.id;
});
```

**Apply to:**
- FeatureCard
- RecipeCard
- IngredientBadge
- StatCard
- FAQItem

## 🖼️ Image Optimization

### Convert to WebP

```bash
# Install sharp for image conversion
npm install -D sharp

# Create script: scripts/convert-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const convertToWebP = async (inputPath, outputPath) => {
  await sharp(inputPath)
    .webp({ quality: 80 })
    .toFile(outputPath);
};

// Convert all PNG/JPG to WebP
```

### Add Lazy Loading

```javascript
<img 
  src="/image.webp" 
  alt="Description"
  loading="lazy"
  width="400"
  height="300"
/>
```

## 📊 Monitoring Performance

### Add Performance Monitoring

**Create:** `src/utils/performance.js`
```javascript
export const measurePerformance = (metricName, callback) => {
  const start = performance.now();
  const result = callback();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`⚡ ${metricName}: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
};

// Usage:
measurePerformance('Recipe Generation', () => {
  generateRecipes(ingredients);
});
```

### Add Web Vitals

```bash
npm install web-vitals
```

```javascript
// src/main.jsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🎯 Priority Order

### Week 1: Critical
1. ✅ Landing page (DONE)
2. ⏳ Lazy load TensorFlow
3. ⏳ Optimize MenuGenerator
4. ⏳ Optimize Scanner

### Week 2: Important
5. ⏳ Consolidate icon libraries
6. ⏳ Add React.memo to components
7. ⏳ Remove unused CSS animations
8. ⏳ Tree-shake Firebase imports

### Week 3: Nice to Have
9. ⏳ Convert images to WebP
10. ⏳ Add performance monitoring
11. ⏳ Remove framer-motion (if unused)
12. ⏳ Optimize font loading

## 📈 Expected Results

After completing all optimizations:

**Bundle Size:**
- Before: ~15 MB
- After: ~3-4 MB (70% reduction)

**Performance:**
- Initial Load: <1 second
- Time to Interactive: <2 seconds
- FPS: Consistent 60fps
- Lighthouse Score: 90+

**User Experience:**
- Instant page loads
- Smooth animations
- No lag during scrolling
- Fast camera processing

## 🔍 Testing Checklist

After each optimization:
- [ ] Test on mobile device
- [ ] Test on slow 3G network
- [ ] Run Lighthouse audit
- [ ] Check bundle size
- [ ] Verify all features work
- [ ] Test on different browsers

## 💡 Pro Tips

1. **Use Chrome DevTools Performance Tab**
   - Record while scrolling
   - Look for long tasks (>50ms)
   - Check for layout thrashing

2. **Use React DevTools Profiler**
   - Identify unnecessary re-renders
   - Find slow components
   - Optimize render times

3. **Use Bundle Analyzer**
   ```bash
   npm install -D rollup-plugin-visualizer
   ```
   Add to vite.config.js to visualize bundle

4. **Test on Real Devices**
   - Emulators don't show real performance
   - Test on low-end Android devices
   - Test on older iPhones

## 🎉 Summary

The landing page is now optimized, but there's more work to do on:
- MenuGenerator (floating animations, backdrop-blur)
- Scanner (backdrop-blur during camera, TensorFlow loading)
- Global CSS (unused animations)
- Bundle size (lazy loading, tree-shaking)

Follow the priority order above for maximum impact! 🚀
