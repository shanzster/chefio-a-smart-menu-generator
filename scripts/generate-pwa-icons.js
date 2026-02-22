/**
 * Simple PWA Icon Generator for Chefio
 * 
 * This script creates placeholder icons for PWA.
 * For production, replace with your actual logo/branding.
 * 
 * Usage: node scripts/generate-pwa-icons.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log('✅ Created public/icons/ directory');
}

// Generate SVG icon
function generateSVG(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f97316;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ea580c;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.1}"/>
  
  <!-- Chef hat -->
  <g transform="translate(${size / 2}, ${size / 2})">
    <!-- Hat top (circle) -->
    <circle cx="0" cy="${-size * 0.1}" r="${size * 0.25}" fill="white"/>
    
    <!-- Hat base (rectangle) -->
    <rect x="${-size * 0.3}" y="${size * 0.05}" width="${size * 0.6}" height="${size * 0.15}" fill="white" rx="${size * 0.02}"/>
    
    <!-- Letter C -->
    <text x="0" y="${-size * 0.05}" 
          font-family="Arial, sans-serif" 
          font-size="${size * 0.35}" 
          font-weight="bold" 
          fill="#f97316" 
          text-anchor="middle" 
          dominant-baseline="middle">C</text>
  </g>
  
  <!-- Utensils decoration -->
  <g transform="translate(${size * 0.2}, ${size * 0.75})" opacity="0.3">
    <!-- Fork -->
    <path d="M 0 0 L 0 ${size * 0.15} M -${size * 0.02} 0 L -${size * 0.02} ${size * 0.08} M ${size * 0.02} 0 L ${size * 0.02} ${size * 0.08}" 
          stroke="white" stroke-width="${size * 0.015}" fill="none" stroke-linecap="round"/>
  </g>
  
  <g transform="translate(${size * 0.8}, ${size * 0.75})" opacity="0.3">
    <!-- Spoon -->
    <ellipse cx="0" cy="0" rx="${size * 0.025}" ry="${size * 0.035}" fill="white"/>
    <rect x="${-size * 0.0075}" y="${size * 0.02}" width="${size * 0.015}" height="${size * 0.13}" fill="white" rx="${size * 0.005}"/>
  </g>
</svg>`;
}

// Save SVG files
sizes.forEach(size => {
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  const svg = generateSVG(size);
  
  fs.writeFileSync(filepath, svg);
  console.log(`✅ Generated ${filename}`);
});

console.log('\n🎉 All icons generated successfully!');
console.log('\n📝 Next steps:');
console.log('1. Convert SVG icons to PNG using an online tool or image editor');
console.log('   Recommended: https://svgtopng.com/ or https://cloudconvert.com/svg-to-png');
console.log('2. Save PNG files with same names (icon-72x72.png, etc.)');
console.log('3. Or use the HTML generator: open scripts/generate-icons.html in browser');
console.log('\n💡 For production: Replace with your actual Chefio logo/branding');
