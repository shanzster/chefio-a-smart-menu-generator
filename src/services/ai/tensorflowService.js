// TensorFlow.js Food Recognition Service (100% FREE, No API Key!)
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

let mobilenetModel = null;
let cocoModel = null;
let isLoading = false;

console.log('🤖 [TENSORFLOW] Service initialized');

/**
 * Load TensorFlow models (only once)
 */
const loadModels = async () => {
  if (mobilenetModel && cocoModel) {
    console.log('✅ [TENSORFLOW] Models already loaded');
    return;
  }

  if (isLoading) {
    console.log('⏳ [TENSORFLOW] Models already loading...');
    // Wait for loading to complete
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }

  isLoading = true;
  console.log('📥 [TENSORFLOW] Loading AI models...');
  console.log('⏳ [TENSORFLOW] This may take 10-20 seconds on first load...');

  try {
    // Load MobileNet for general image classification
    console.log('🔄 [TENSORFLOW] Loading MobileNet model...');
    mobilenetModel = await mobilenet.load();
    console.log('✅ [TENSORFLOW] MobileNet loaded!');

    // Load COCO-SSD for object detection
    console.log('🔄 [TENSORFLOW] Loading COCO-SSD model...');
    cocoModel = await cocoSsd.load();
    console.log('✅ [TENSORFLOW] COCO-SSD loaded!');

    console.log('🎉 [TENSORFLOW] All models loaded successfully!');
  } catch (error) {
    console.error('❌ [TENSORFLOW] Error loading models:', error);
    throw error;
  } finally {
    isLoading = false;
  }
};

/**
 * Recognize food from image element
 */
export const recognizeFoodFromImage = async (imageElement) => {
  console.log('\n🚀 [TENSORFLOW] Starting food recognition...');
  
  try {
    // Load models if not already loaded
    await loadModels();

    console.log('🔍 [TENSORFLOW] Analyzing image...');

    // Get predictions from both models
    const [mobilenetPredictions, cocoPredictions] = await Promise.all([
      mobilenetModel.classify(imageElement, 10),
      cocoModel.detect(imageElement)
    ]);

    console.log('📊 [TENSORFLOW] MobileNet predictions:', mobilenetPredictions.length);
    console.log('📊 [TENSORFLOW] COCO-SSD detections:', cocoPredictions.length);

    // Combine and filter predictions
    const allPredictions = [];

    // Add MobileNet predictions (better for food)
    mobilenetPredictions.forEach(pred => {
      if (isFoodRelated(pred.className)) {
        allPredictions.push({
          name: formatFoodName(pred.className),
          confidence: Math.round(pred.probability * 100),
          category: categorizeFoodItem(pred.className),
          source: 'mobilenet'
        });
      }
    });

    // Add COCO-SSD predictions (good for common objects)
    cocoPredictions.forEach(pred => {
      if (isFoodRelated(pred.class) && pred.score > 0.5) {
        allPredictions.push({
          name: formatFoodName(pred.class),
          confidence: Math.round(pred.score * 100),
          category: categorizeFoodItem(pred.class),
          source: 'coco'
        });
      }
    });

    // Remove duplicates and sort by confidence
    const uniquePredictions = removeDuplicates(allPredictions);
    const sortedPredictions = uniquePredictions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);

    console.log('✅ [TENSORFLOW] Found', sortedPredictions.length, 'food items');
    console.log('🎯 [TENSORFLOW] Results:', sortedPredictions.map(p => `${p.name} (${p.confidence}%)`));

    return sortedPredictions;
  } catch (error) {
    console.error('💥 [TENSORFLOW] Recognition error:', error);
    throw error;
  }
};

/**
 * Recognize food from canvas
 */
export const recognizeFoodFromCanvas = async (canvas) => {
  console.log('🖼️ [TENSORFLOW] Converting canvas to image...');
  
  // Create image element from canvas
  const img = new Image();
  img.src = canvas.toDataURL('image/jpeg', 0.8);
  
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  console.log('✅ [TENSORFLOW] Image ready, size:', img.width, 'x', img.height);
  
  return recognizeFoodFromImage(img);
};

/**
 * Check if prediction is food-related
 */
const isFoodRelated = (className) => {
  const foodKeywords = [
    'food', 'fruit', 'vegetable', 'meat', 'fish', 'bread', 'cheese',
    'apple', 'banana', 'orange', 'tomato', 'carrot', 'potato', 'broccoli',
    'chicken', 'beef', 'pork', 'salmon', 'tuna', 'shrimp',
    'rice', 'pasta', 'noodle', 'pizza', 'burger', 'sandwich',
    'egg', 'milk', 'yogurt', 'butter', 'cream',
    'salad', 'soup', 'stew', 'curry', 'sauce',
    'cake', 'cookie', 'pie', 'dessert', 'ice cream',
    'coffee', 'tea', 'juice', 'water', 'soda'
  ];

  const lowerClassName = className.toLowerCase();
  return foodKeywords.some(keyword => lowerClassName.includes(keyword));
};

/**
 * Format food name for display
 */
const formatFoodName = (name) => {
  // Remove common prefixes/suffixes
  let formatted = name
    .replace(/^(a |an |the )/i, '')
    .replace(/, .*$/, '') // Remove everything after comma
    .trim();

  // Capitalize first letter of each word
  formatted = formatted
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return formatted;
};

/**
 * Categorize food item
 */
const categorizeFoodItem = (foodName) => {
  const name = foodName.toLowerCase();
  
  const proteins = ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'meat', 'turkey', 'lamb', 'duck', 'bacon', 'sausage', 'ham', 'egg'];
  if (proteins.some(p => name.includes(p))) return 'Protein';
  
  const vegetables = ['tomato', 'onion', 'garlic', 'carrot', 'broccoli', 'spinach', 'lettuce', 'pepper', 'cucumber', 'potato', 'cabbage', 'celery', 'mushroom', 'zucchini', 'eggplant', 'corn', 'peas', 'bean', 'salad'];
  if (vegetables.some(v => name.includes(v))) return 'Vegetable';
  
  const fruits = ['apple', 'banana', 'orange', 'grape', 'strawberry', 'lemon', 'lime', 'berry', 'mango', 'pineapple', 'watermelon', 'peach', 'pear', 'cherry', 'kiwi', 'avocado'];
  if (fruits.some(f => name.includes(f))) return 'Fruit';
  
  const grains = ['rice', 'pasta', 'bread', 'wheat', 'oat', 'quinoa', 'noodle', 'cereal', 'flour', 'tortilla', 'pizza', 'burger', 'sandwich'];
  if (grains.some(g => name.includes(g))) return 'Grain';
  
  const dairy = ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'ice cream'];
  if (dairy.some(d => name.includes(d))) return 'Dairy';
  
  return 'Other';
};

/**
 * Remove duplicate predictions
 */
const removeDuplicates = (predictions) => {
  const seen = new Map();
  
  predictions.forEach(pred => {
    const key = pred.name.toLowerCase();
    if (!seen.has(key) || seen.get(key).confidence < pred.confidence) {
      seen.set(key, pred);
    }
  });
  
  return Array.from(seen.values());
};

/**
 * Preload models (call this on app start)
 */
export const preloadModels = async () => {
  console.log('🚀 [TENSORFLOW] Preloading models...');
  try {
    await loadModels();
    console.log('✅ [TENSORFLOW] Models preloaded successfully!');
  } catch (error) {
    console.error('❌ [TENSORFLOW] Failed to preload models:', error);
  }
};
