# Install Button Usage Guide

## How to Use the Install Button

The `AddToHomeButton` component is already integrated into your landing pages. Here's how it works:

## Current Implementation

The button is already placed in:
- `src/pages/Landing/Landing.jsx`
- `src/pages/Landing/LandingOptimized.jsx`

Example usage:
```jsx
import AddToHomeButton from '../../components/common/AddToHomeButton/AddToHomeButton';

<AddToHomeButton 
  variant="glass" 
  size="large"
  customText="Install the App"
/>
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `'primary'` | Button style: `'primary'`, `'glass'`, `'outline'` |
| `size` | string | `'medium'` | Button size: `'small'`, `'medium'`, `'large'` |
| `className` | string | `''` | Additional CSS classes |
| `customText` | string | `'Install App'` | Custom button text |
| `subtitle` | string | `null` | Optional subtitle below button |

## Variants

### Primary (Default)
```jsx
<AddToHomeButton variant="primary" />
```
- Orange gradient background
- White text
- Shadow effect

### Glass
```jsx
<AddToHomeButton variant="glass" />
```
- Glassmorphism effect
- Semi-transparent background
- Blur effect

### Outline
```jsx
<AddToHomeButton variant="outline" />
```
- Transparent background
- Orange border
- Hover fills with orange

## Sizes

### Small
```jsx
<AddToHomeButton size="small" />
```
- Height: 36px
- Padding: 16px
- Font: 14px

### Medium (Default)
```jsx
<AddToHomeButton size="medium" />
```
- Height: 48px
- Padding: 24px
- Font: 16px

### Large
```jsx
<AddToHomeButton size="large" />
```
- Height: 56px
- Padding: 32px
- Font: 18px

## Behavior

### When Clicked:

1. **If browser supports native install prompt** (Chrome, Edge, Android):
   - Shows browser's native "Install" dialog
   - User clicks "Install" or "Cancel"
   - App installs immediately if accepted

2. **If browser doesn't support native prompt** (iOS Safari):
   - Shows modal with step-by-step instructions
   - Instructions are platform-specific
   - User follows manual installation steps

3. **After installation**:
   - Button automatically hides
   - App icon appears on home screen/desktop
   - App can be launched like a native app

## Platform-Specific Instructions

### iOS Safari
1. Tap Share button (square with arrow)
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" to confirm

### Android Chrome
1. Tap menu button (⋮)
2. Select "Install app" or "Add to Home screen"
3. Tap "Install" to confirm

### Desktop Chrome/Edge
1. Look for install icon (⊕) in address bar
2. Or open menu > "Install Chefio"
3. Click "Install" to confirm

## Testing

### Test on Different Platforms:

1. **Desktop Chrome**:
   ```
   Open http://localhost:5174
   Click "Install App" button
   Should show native install prompt
   ```

2. **Android Chrome**:
   ```
   Open app on phone
   Click "Install App" button
   Should show "Add to Home screen" prompt
   ```

3. **iOS Safari**:
   ```
   Open app on iPhone/iPad
   Click "Install App" button
   Should show modal with instructions
   ```

### Check Installation Status:

```javascript
// In browser console
window.matchMedia('(display-mode: standalone)').matches
// Returns true if app is installed
```

### Check Service Worker:

```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(console.log)
// Shows registered service workers
```

## Customization Examples

### With Custom Text and Subtitle
```jsx
<AddToHomeButton 
  variant="primary"
  size="large"
  customText="Get the App"
  subtitle="Works offline!"
/>
```

### With Custom Styling
```jsx
<AddToHomeButton 
  variant="outline"
  size="medium"
  className="my-custom-class hover:shadow-2xl"
  customText="Download Now"
/>
```

### Multiple Buttons (Different Styles)
```jsx
{/* Hero section */}
<AddToHomeButton 
  variant="glass"
  size="large"
  customText="Install the App"
/>

{/* Footer */}
<AddToHomeButton 
  variant="outline"
  size="medium"
  customText="Get Chefio"
/>
```

## Troubleshooting

### Button Not Showing:
- App might already be installed
- Check if component is imported correctly
- Verify service worker is registered

### Install Prompt Not Appearing:
- Must be served over HTTPS (or localhost)
- User must have visited site at least once
- Some browsers don't support PWA install
- Check browser console for errors

### Modal Not Showing on iOS:
- Must use Safari browser (not Chrome on iOS)
- Check if Modal component is imported
- Verify component state management

## Best Practices

1. **Placement**: Put button in prominent locations (hero, footer)
2. **Timing**: Show after user has engaged with app
3. **Context**: Explain benefits before showing button
4. **Frequency**: Don't spam users with install prompts
5. **Feedback**: Show success message after installation

## Analytics (Future Enhancement)

Track install button interactions:
```javascript
// When button is clicked
analytics.track('install_button_clicked', {
  platform: 'ios' | 'android' | 'desktop',
  variant: 'primary' | 'glass' | 'outline'
});

// When install is completed
analytics.track('app_installed', {
  platform: 'ios' | 'android' | 'desktop',
  source: 'native_prompt' | 'manual_instructions'
});
```

## Accessibility

The button includes:
- Proper ARIA labels
- Keyboard navigation support
- Focus states
- Screen reader friendly text
- High contrast colors

## Browser Compatibility

✅ **Full Support**:
- Chrome 40+ (Desktop & Mobile)
- Edge 79+
- Opera 27+
- Samsung Internet 4+

⚠️ **Partial Support**:
- Safari iOS 11.3+ (manual only)
- Firefox (limited)

❌ **No Support**:
- Internet Explorer
- Safari Desktop
