# Cloudinary Integration & Enhanced QR Code Features

## Overview
Implemented Cloudinary image upload for recipes and enhanced QR code generation with Chefio branding, recipe images, and Poppins font.

## Features Implemented

### 1. Cloudinary Image Upload for Recipes

**Configuration:**
- Added Cloudinary credentials to `.env`:
  - `VITE_CLOUDINARY_CLOUD_NAME=dgwmpacf8`
  - `VITE_CLOUDINARY_UPLOAD_PRESET=dsms_avatars`

**New Files:**
- `src/services/cloudinary/imageUpload.js` - Cloudinary upload service
  - `uploadImageToCloudinary(file, folder)` - Upload image to Cloudinary
  - `validateImageFile(file)` - Validate file type and size

**Updated Files:**
- `src/components/forms/CreateRecipeForm.jsx` - Added image upload functionality
  - File upload input with drag-and-drop area
  - Image preview thumbnail
  - Upload progress indicator
  - Remove image button
  - Validation (max 5MB, JPG/PNG/GIF/WebP)
  - Images stored in `chefio/recipes` folder on Cloudinary

**User Experience:**
- Click to upload or drag-and-drop
- Real-time image preview
- Upload progress with spinner
- Success/error toast notifications
- Image thumbnail shows after upload
- Can remove and re-upload image

### 2. Enhanced QR Code Generation

**New Files:**
- `src/utils/enhancedQRGenerator.js` - Enhanced QR code generator
  - Generates 800x1200px PNG images
  - Includes Chefio branding
  - Uses Poppins font throughout
  - Displays recipe image
  - Professional layout

**QR Code Layout:**
1. **Header Section:**
   - Chefio logo (text-based, orange color #FF6B35)
   - Tagline: "Smart Recipe Sharing"

2. **Recipe Image:**
   - 300x300px rounded image
   - Centered with border
   - Fallback if no image available

3. **Recipe Information:**
   - Recipe name (bold, 32px Poppins)
   - Word-wrap for long names
   - Servings count (if available)

4. **QR Code:**
   - 350x350px QR code
   - White background with border
   - High error correction level

5. **Call to Action:**
   - "Scan to Rate & Review" (bold, 28px)
   - "Share your feedback with the cook" (20px)

**Updated Files:**
- `src/pages/cook/QRGenerator/QRGenerator.jsx`
  - Uses `generateEnhancedQRCode()` for downloads
  - Maintains existing UI and functionality
  - Downloads as `chefio-qr-{recipe-name}.png`

## Technical Details

### Image Upload Flow:
1. User selects image file
2. Validate file type and size
3. Create local preview (FileReader)
4. Upload to Cloudinary
5. Store Cloudinary URL in recipe data
6. Show success message

### QR Code Generation Flow:
1. User generates QR code
2. QR code URL created with feedback link
3. On download, enhanced generator creates canvas
4. Loads Poppins font from Google Fonts
5. Draws all elements (logo, image, QR, text)
6. Converts canvas to PNG blob
7. Downloads to user's device

### Font Loading:
- Uses Poppins font from Google Fonts
- Checks if font is loaded before rendering
- Falls back to sans-serif if unavailable
- Ensures consistent typography

### Image Handling:
- Recipe images loaded with CORS support
- Rounded corners using canvas clipping
- Graceful fallback if image fails to load
- Maintains aspect ratio

## File Structure

```
src/
├── components/
│   └── forms/
│       └── CreateRecipeForm.jsx          # Updated with image upload
├── pages/
│   └── cook/
│       └── QRGenerator/
│           └── QRGenerator.jsx           # Updated to use enhanced QR
├── services/
│   └── cloudinary/
│       └── imageUpload.js                # New: Cloudinary service
└── utils/
    └── enhancedQRGenerator.js            # New: Enhanced QR generator
```

## Environment Variables

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=dgwmpacf8
VITE_CLOUDINARY_UPLOAD_PRESET=dsms_avatars
```

## Usage

### Creating a Recipe with Image:
1. Navigate to "My Recipes"
2. Click "Create Recipe"
3. Fill in recipe details
4. Click upload area or drag image
5. Wait for upload to complete
6. See thumbnail preview
7. Submit recipe

### Generating Enhanced QR Code:
1. Navigate to "QR Share"
2. Select a recipe (with or without image)
3. Click "Generate QR Code"
4. Click "Save Image" to download
5. QR code includes Chefio branding and recipe image

## Benefits

1. **Professional Branding:**
   - Consistent Chefio branding on all QR codes
   - Poppins font matches brand identity
   - Orange accent color (#FF6B35)

2. **Visual Appeal:**
   - Recipe images make QR codes more attractive
   - Clear hierarchy and spacing
   - Print-ready quality (800x1200px)

3. **User Experience:**
   - Easy image upload with validation
   - Real-time preview
   - Professional QR codes for sharing
   - No external dependencies for QR generation

4. **Cloud Storage:**
   - Images stored on Cloudinary (not Firebase Storage)
   - Fast CDN delivery
   - Automatic optimization
   - 25GB free storage

## Future Enhancements

- Add image cropping/editing before upload
- Support multiple images per recipe
- Add Chefio logo image (currently text-based)
- QR code customization options (colors, styles)
- Batch QR code generation
- Print-optimized layouts
