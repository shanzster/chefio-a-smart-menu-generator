# PWA Setup Guide for Chefio

## ✅ What's Been Configured

### 1. PWA Plugin Configuration
- ✅ Installed `vite-plugin-pwa` and `workbox-window`
- ✅ Configured in `vite.config.js` with auto-update registration
- ✅ Service worker with caching strategies for API calls and assets

### 2. Manifest File
- ✅ Created `public/manifest.json` with app metadata
- ✅ Configured app name, description, theme colors
- ✅ Added icon references (72x72 to 512x512)
- ✅ Set display mode to "standalone" for app-like experience

### 3. Add to Home Button Component
- ✅ Created `src/components/common/AddToHomeButton/AddToHomeButton.jsx`
- ✅ Detects PWA install prompt availability
- ✅ Shows/hides based on installation status
- ✅ Handles beforeinstallprompt event
- ✅ Added to Landing page hero section

### 4. Caching Strategy
- ✅ NetworkFirst for Spoonacular API (24-hour cache)
- ✅ CacheFirst for Firebase Storage (30-day cache)
- ✅ Automatic caching of all static assets

## 📋 What You Need to Do

### Step 1: Generate App Icons

You have two options:

#### Option A: Use the Icon Generator (Easiest)
1. Open `scripts/generate-icons.html` in your browser
2. Click "Generate Icons" button
3. Right-click each icon and save to `public/icons/` folder:
   - `icon-72x72.png`
   - `icon-96x96.png`
   - `icon-128x128.png`
   - `icon-144x144.png`
   - `icon-152x152.png`
   - `icon-192x192.png`
   - `icon-384x384.png`
   - `icon-512x512.png`

#### Option B: Use Your Own Icons
1. Create a `public/icons/` folder
2. Add your custom icons with the exact filenames above
3. Ensure they're PNG format with transparent backgrounds
4. Recommended: Use your Chefio logo/branding

### Step 2: Add Favicon (Optional)
```
public/
  ├── favicon.ico
  └── icons/
      ├── icon-72x72.png
      ├── icon-96x96.png
      └── ...
```

### Step 3: Test PWA Installation

#### Desktop (Chrome/Edge)
1. Run `npm run dev`
2. Open http://localhost:5174
3. Look for install icon in address bar (⊕ or computer icon)
4. Or check DevTools > Application > Manifest

#### Mobile (Android)
1. Deploy to a server with HTTPS (required for PWA)
2. Open in Chrome/Edge
3. Look for "Add to Home Screen" banner
4. Or tap browser menu > "Install app" or "Add to Home screen"

#### Mobile (iOS)
1. Open in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. Note: iOS has limited PWA support

### Step 4: Verify Service Worker
1. Open DevTools > Application > Service Workers
2. Should see "activated and running"
3. Check Cache Storage for cached assets

## 🎯 Features Enabled

### Offline Support
- App shell cached for offline access
- Previously viewed recipes available offline
- Graceful fallback when offline

### Install Prompt
- "Add to Home Screen" button in hero section
- Only shows when PWA is installable
- Hides after installation
- Auto-detects if already installed

### App-Like Experience
- Standalone display mode (no browser UI)
- Custom splash screen (auto-generated from icons)
- Theme color matches Chefio branding (#f97316)
- Portrait orientation optimized

### Performance
- API responses cached for faster loading
- Images cached for 30 days
- Static assets cached indefinitely
- Auto-updates when new version deployed

## 🔧 Configuration Files

### vite.config.js
```javascript
VitePWA({
  registerType: 'autoUpdate',
  manifest: { /* app metadata */ },
  workbox: { /* caching strategies */ }
})
```

### public/manifest.json
```json
{
  "name": "Chefio - Smart Menu Generator",
  "short_name": "Chefio",
  "display": "standalone",
  "theme_color": "#f97316"
}
```

## 📱 Testing Checklist

- [ ] Icons generated and placed in `public/icons/`
- [ ] Dev server running (`npm run dev`)
- [ ] Manifest loads without errors (DevTools > Application > Manifest)
- [ ] Service worker registers (DevTools > Application > Service Workers)
- [ ] "Add to Home" button appears on landing page
- [ ] Install prompt works when clicked
- [ ] Button disappears after installation
- [ ] App opens in standalone mode after installation
- [ ] Offline mode works (disable network in DevTools)

## 🚀 Deployment Notes

### Requirements for PWA
1. **HTTPS Required**: PWAs only work on HTTPS (except localhost)
2. **Valid Manifest**: Must be accessible and valid JSON
3. **Service Worker**: Must register successfully
4. **Icons**: At least 192x192 and 512x512 required

### Deployment Platforms
- **Vercel**: Automatic HTTPS, perfect for PWAs
- **Netlify**: Automatic HTTPS, easy deployment
- **Firebase Hosting**: Built-in HTTPS support
- **GitHub Pages**: Supports HTTPS with custom domains

### Build Command
```bash
npm run build
```

The PWA will be fully functional in production build.

## 🐛 Troubleshooting

### "Add to Home" button doesn't appear
- Check if already installed (standalone mode)
- Ensure HTTPS (or localhost)
- Check browser console for errors
- Verify manifest.json loads correctly

### Service worker not registering
- Check browser console for errors
- Verify vite.config.js syntax
- Clear browser cache and reload
- Check DevTools > Application > Service Workers

### Icons not showing
- Verify files exist in `public/icons/`
- Check exact filenames match manifest.json
- Ensure PNG format
- Check file permissions

### Install prompt not firing
- Some browsers require user engagement first
- Try after scrolling or clicking
- Check if browser supports PWA
- Verify manifest is valid

## 📚 Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

## 🎉 Next Steps

1. Generate icons using the HTML tool
2. Test installation on desktop
3. Deploy to production with HTTPS
4. Test on mobile devices
5. Share the installable app with users!

---

**Note**: The "Add to Home Screen" button will only appear when:
- App is not already installed
- Browser supports PWA installation
- All PWA requirements are met (HTTPS, manifest, service worker)
