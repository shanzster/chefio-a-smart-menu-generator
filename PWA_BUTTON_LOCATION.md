# 📍 "Add to Home Screen" Button Location

## Where to Find It

The "Add to Home Screen" button is located in the **hero section** of the landing page, right below the main call-to-action buttons.

## Visual Layout

```
┌─────────────────────────────────────────────────────┐
│                   LANDING PAGE                       │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │         HERO SECTION                        │    │
│  │                                             │    │
│  │  For Students & Aspiring Chefs              │    │
│  │                                             │    │
│  │  Turn Ingredients Into Masterpieces         │    │
│  │                                             │    │
│  │  Your smart kitchen companion...            │    │
│  │                                             │    │
│  │  ┌──────────────────┐  ┌─────────────────┐ │    │
│  │  │ Start Cooking Now│  │ Create Account  │ │    │
│  │  └──────────────────┘  └─────────────────┘ │    │
│  │                                             │    │
│  │         ┌─────────────────────────┐         │    │
│  │         │ 📥 Add to Home Screen 📱│  ← HERE │    │
│  │         └─────────────────────────┘         │    │
│  │                                             │    │
│  │  10K+ Recipes | 5K+ Users | 50K+ Meals     │    │
│  │                                             │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│  [Features Section]                                  │
│  [How It Works Section]                              │
│  [Use Cases Section]                                 │
│  ...                                                 │
└─────────────────────────────────────────────────────┘
```

## Button Appearance

### When Installable (Shows)
```
┌─────────────────────────────────────┐
│  📥  Add to Home Screen  📱         │
└─────────────────────────────────────┘
```
- Outline style (white background, orange border)
- Download icon on left
- Smartphone icon on right
- Hover effect: scales up slightly

### When Already Installed (Hidden)
The button completely disappears if:
- App is already installed
- Running in standalone mode
- User has dismissed install prompt

### When Not Installable Yet (Hidden)
The button is hidden if:
- Browser doesn't support PWA
- PWA criteria not met
- beforeinstallprompt event hasn't fired

## Code Location

### Component
```
src/components/common/AddToHomeButton/AddToHomeButton.jsx
```

### Usage in Landing Page
```jsx
// src/pages/Landing/Landing.jsx

<div className="flex flex-col sm:flex-row gap-4">
  <Button to="/menu-generator" size="large">
    Start Cooking Now
  </Button>
  <Button to="/register" variant="glass" size="large">
    Create Account
  </Button>
</div>

{/* Add to Home Screen Button */}
<div className="mt-4">
  <AddToHomeButton variant="outline" size="medium" />
</div>
```

## Customization

### Change Position
Move the button by editing `src/pages/Landing/Landing.jsx`:

```jsx
// Move to top (before main buttons)
<AddToHomeButton variant="outline" size="medium" />
<div className="flex flex-col sm:flex-row gap-4">
  <Button>Start Cooking Now</Button>
  <Button>Create Account</Button>
</div>

// Move to bottom (after stats)
<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Stats */}
</div>
<div className="mt-8">
  <AddToHomeButton variant="outline" size="medium" />
</div>
```

### Change Style
```jsx
// Primary style (orange background)
<AddToHomeButton variant="primary" size="medium" />

// Glass style (frosted glass effect)
<AddToHomeButton variant="glass" size="medium" />

// Outline style (current - white with orange border)
<AddToHomeButton variant="outline" size="medium" />
```

### Change Size
```jsx
// Small
<AddToHomeButton variant="outline" size="small" />

// Medium (current)
<AddToHomeButton variant="outline" size="medium" />

// Large
<AddToHomeButton variant="outline" size="large" />
```

## User Flow

### Desktop
1. User visits landing page
2. Scrolls to hero section
3. Sees "Add to Home Screen" button
4. Clicks button
5. Browser shows install prompt
6. User clicks "Install"
7. App installs to desktop/taskbar
8. Button disappears

### Mobile
1. User visits landing page
2. Sees "Add to Home Screen" button in hero
3. Clicks button
4. Browser shows install prompt
5. User clicks "Add" or "Install"
6. App installs to home screen
7. Button disappears
8. App icon appears on home screen

## Testing

### Check if Button Appears
1. Open http://localhost:5174
2. Look in hero section below main buttons
3. Should see button with download and phone icons

### Check Console Logs
```javascript
// Open DevTools Console
📱 [PWA] beforeinstallprompt event fired  // Button will show
✅ [PWA] App installed successfully        // Button will hide
```

### Force Button to Show (Testing)
If button doesn't appear, check:
1. Not already installed (check standalone mode)
2. HTTPS or localhost
3. Manifest loads correctly
4. Service worker active
5. Browser supports PWA

## Responsive Design

### Desktop (lg screens)
- Button centered below main CTAs
- Medium size
- Full width on small screens

### Mobile (sm screens)
- Button stacks below main buttons
- Full width
- Touch-friendly size

### Tablet (md screens)
- Button centered
- Medium size
- Comfortable spacing

## Accessibility

- ✅ Keyboard accessible (Tab to focus, Enter to click)
- ✅ Screen reader friendly (descriptive text)
- ✅ High contrast (orange on white)
- ✅ Touch target size (44x44px minimum)
- ✅ Focus indicator (visible outline)

## Browser Compatibility

| Browser | Button Shows | Install Works |
|---------|--------------|---------------|
| Chrome Desktop | ✅ | ✅ |
| Chrome Android | ✅ | ✅ |
| Edge Desktop | ✅ | ✅ |
| Edge Android | ✅ | ✅ |
| Safari iOS | ❌ | ⚠️ Manual |
| Firefox Desktop | ⚠️ Limited | ⚠️ Limited |
| Samsung Internet | ✅ | ✅ |

## Summary

The "Add to Home Screen" button is:
- ✅ Located in hero section
- ✅ Below main CTA buttons
- ✅ Only shows when installable
- ✅ Hides when already installed
- ✅ Fully responsive
- ✅ Accessible
- ✅ Easy to customize

---

**Need to change it?** Edit `src/pages/Landing/Landing.jsx` around line 350-360.
