/**
 * SVG to PNG Converter for PWA Icons
 * 
 * This script converts the generated SVG icons to PNG format.
 * Uses sharp library for high-quality conversion.
 * 
 * Install: npm install sharp --save-dev
 * Usage: node scripts/svg-to-png.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('🔄 Converting SVG icons to PNG...\n');

// Check if sharp is installed
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch (error) {
  console.log('❌ Sharp library not found.');
  console.log('\n📦 Please install sharp:');
  console.log('   npm install sharp --save-dev');
  console.log('\n💡 Alternative: Use the HTML generator instead:');
  console.log('   Open scripts/generate-icons.html in your browser');
  process.exit(1);
}

// Convert each SVG to PNG
for (const size of sizes) {
  const svgFile = path.join(iconsDir, `icon-${size}x${size}.svg`);
  const pngFile = path.join(iconsDir, `icon-${size}x${size}.png`);
  
  try {
    await sharp(svgFile)
      .resize(size, size)
      .png()
      .toFile(pngFile);
    
    console.log(`✅ Converted icon-${size}x${size}.png`);
  } catch (error) {
    console.log(`❌ Failed to convert icon-${size}x${size}.png:`, error.message);
  }
}

console.log('\n🎉 PNG conversion complete!');
console.log('📁 Icons saved to: public/icons/');
console.log('\n✅ PWA icons are ready to use!');
