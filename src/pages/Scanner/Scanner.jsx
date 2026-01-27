import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCamera, FiX, FiCheck, FiArrowLeft, FiPlus } from 'react-icons/fi';
import { ArrowLeft, ChefHat, Camera, Drumstick, Apple, Carrot, Wheat, Milk, Egg } from 'lucide-react';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';

// Icon mapping for ingredients
const getIngredientIcon = (category) => {
  const iconMap = {
    'Protein': Drumstick,
    'Vegetable': Carrot,
    'Grain': Wheat,
    'Dairy': Milk,
    'Fruit': Apple
  };
  return iconMap[category] || Apple;
};

// Mock ingredient recognition database
const ingredientDatabase = {
  'chicken': { name: 'Chicken', category: 'Protein', description: 'Lean poultry meat' },
  'tomato': { name: 'Tomato', category: 'Vegetable', description: 'Red, juicy fruit' },
  'onion': { name: 'Onion', category: 'Vegetable', description: 'Bulb vegetable' },
  'garlic': { name: 'Garlic', category: 'Vegetable', description: 'Aromatic bulb' },
  'carrot': { name: 'Carrot', category: 'Vegetable', description: 'Orange root vegetable' },
  'potato': { name: 'Potato', category: 'Vegetable', description: 'Starchy tuber' },
  'broccoli': { name: 'Broccoli', category: 'Vegetable', description: 'Green cruciferous vegetable' },
  'rice': { name: 'Rice', category: 'Grain', description: 'White grain' },
  'pasta': { name: 'Pasta', category: 'Grain', description: 'Italian noodles' },
  'egg': { name: 'Egg', category: 'Protein', description: 'Chicken egg' },
  'cheese': { name: 'Cheese', category: 'Dairy', description: 'Dairy product' },
  'milk': { name: 'Milk', category: 'Dairy', description: 'Dairy beverage' },
  'bread': { name: 'Bread', category: 'Grain', description: 'Baked bread' },
  'apple': { name: 'Apple', category: 'Fruit', description: 'Red or green fruit' },
  'banana': { name: 'Banana', category: 'Fruit', description: 'Yellow curved fruit' },
};

const Scanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedIngredients, setScannedIngredients] = useState([]);
  const [currentScan, setCurrentScan] = useState(null);
  const [manualInput, setManualInput] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startScanning = async () => {
    setIsScanning(true); // Set state first to render video element
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsScanning(false); // Reset state on error
      // Fallback to manual input
      alert('Camera access denied. Please use manual input below.');
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
    setCurrentScan(null);
  };

  const captureAndIdentify = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    // Simulate AI recognition - in real app, this would call an API
    const ingredients = Object.keys(ingredientDatabase);
    const randomIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];
    const identified = ingredientDatabase[randomIngredient];

    setCurrentScan(identified);
  };

  const confirmIngredient = () => {
    if (currentScan && !scannedIngredients.find(i => i.name === currentScan.name)) {
      setScannedIngredients([...scannedIngredients, currentScan]);
    }
    setCurrentScan(null);
  };

  const removeIngredient = (name) => {
    setScannedIngredients(scannedIngredients.filter(i => i.name !== name));
  };

  const addManualIngredient = () => {
    const normalized = manualInput.toLowerCase().trim();
    if (ingredientDatabase[normalized] && !scannedIngredients.find(i => i.name === ingredientDatabase[normalized].name)) {
      setScannedIngredients([...scannedIngredients, ingredientDatabase[normalized]]);
      setManualInput('');
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/72 backdrop-blur-lg border-b border-black/5 pt-safe">
        <div className="flex items-center justify-between h-14 px-4 max-w-[1200px] mx-auto">
          <Link to="/" className="flex items-center gap-2 text-text hover:text-primary transition-colors">
            <FiArrowLeft />
            <span className="font-semibold">Back</span>
          </Link>
          <span className="text-xl font-bold text-text flex items-center gap-2">
            <ChefHat className="w-6 h-6" />
            Scanner
          </span>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      <div className="p-6 max-w-[600px] mx-auto">
        {/* Scanner Section */}
        <section className="mb-8">
          <h1 className="text-2xl font-bold text-text mb-2">Ingredient Scanner</h1>
          <p className="text-base text-text-secondary mb-6">
            Perfect for aspiring chefs! Scan ingredients to identify them instantly.
          </p>

          {/* Camera View */}
          <Card variant="glass" className="overflow-hidden">
            {isScanning ? (
              <div className="space-y-4">
                {/* Video Preview Area */}
                <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Scanning overlay with frame */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-64 h-64">
                      {/* Corner brackets */}
                      <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-lg" />
                      
                      {/* Scanning line animation */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
                      </div>
                    </div>
                  </div>

                  {/* Instruction overlay */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                    <Camera className="w-4 h-4 inline mr-2" />
                    Position ingredient in frame
                  </div>
                </div>

                {/* Controls */}
                <div className="flex gap-3 p-4">
                  <button
                    onClick={captureAndIdentify}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all"
                  >
                    <FiCamera className="text-xl" />
                    Capture & Identify
                  </button>
                  <button
                    onClick={stopScanning}
                    className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-text font-semibold hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
                  <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
                    <Camera className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">Ready to Scan</h3>
                <p className="text-sm text-text-secondary mb-6 max-w-[300px] mx-auto">
                  Point your camera at an ingredient to identify it instantly
                </p>
                <Button size="large" icon={<FiCamera />} onClick={startScanning} className="shadow-lg">
                  Start Camera
                </Button>
              </div>
            )}
          </Card>

          {/* Identified Ingredient Confirmation */}
          {currentScan && (
            <Card variant="default" className="mt-4 animate-scale-in border-2 border-success/20 bg-success/5">
              <div className="flex items-center gap-4 p-2">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-success/10 to-success/20 flex items-center justify-center flex-shrink-0">
                  {(() => {
                    const IngredientIcon = getIngredientIcon(currentScan.category);
                    return <IngredientIcon className="w-8 h-8 text-success" />;
                  })()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-text">{currentScan.name}</h3>
                    <Badge variant="success" size="small">Identified!</Badge>
                  </div>
                  <p className="text-sm text-text-secondary mb-2">{currentScan.description}</p>
                  <Badge variant="primary" size="small">{currentScan.category}</Badge>
                </div>
                <button
                  onClick={confirmIngredient}
                  className="w-12 h-12 bg-success rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl active:scale-95 transition-all"
                  title="Add to list"
                >
                  <FiCheck className="text-xl" />
                </button>
                <button
                  onClick={() => setCurrentScan(null)}
                  className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-text-tertiary hover:bg-gray-200 active:scale-95 transition-all"
                  title="Discard"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </Card>
          )}

          {/* Manual Input */}
          <div className="mt-6">
            <p className="text-sm font-medium text-text mb-3">Or type manually:</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type ingredient name (e.g., chicken, tomato)..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addManualIngredient()}
                className="flex-1 px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-base text-text placeholder:text-text-tertiary focus:outline-none focus:bg-white/85 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
              <Button icon={<FiPlus />} onClick={addManualIngredient} disabled={!manualInput.trim()}>
                Add
              </Button>
            </div>
            <p className="text-xs text-text-tertiary mt-2">
              Available: chicken, tomato, onion, garlic, carrot, potato, broccoli, rice, pasta, egg, cheese, milk, bread, apple, banana
            </p>
          </div>
        </section>

        {/* Scanned Ingredients List */}
        {scannedIngredients.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-text mb-4">
              Scanned Ingredients ({scannedIngredients.length})
            </h2>
            <div className="space-y-2">
              {scannedIngredients.map((ing, index) => {
                const IngredientIcon = getIngredientIcon(ing.category);
                return (
                  <Card 
                    key={ing.name} 
                    variant="default" 
                    padding="medium"
                    className="flex items-center gap-4 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <IngredientIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-text">{ing.name}</h3>
                      <p className="text-sm text-text-secondary">{ing.description}</p>
                    </div>
                    <Badge variant="primary" size="small">{ing.category}</Badge>
                    <button
                      onClick={() => removeIngredient(ing.name)}
                      className="w-8 h-8 flex items-center justify-center text-text-tertiary hover:text-error active:scale-95"
                    >
                      <FiX />
                    </button>
                  </Card>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-2">
              <Link to="/menu-generator" className="flex-1">
                <Button fullWidth size="large">
                  Generate Recipes
                </Button>
              </Link>
              <Link to="/nutrition" className="flex-1">
                <Button variant="outline" fullWidth size="large">
                  Analyze Nutrition
                </Button>
              </Link>
            </div>
          </section>
        )}

        {/* Empty State */}
        {scannedIngredients.length === 0 && !isScanning && !currentScan && (
          <Card variant="glass" className="text-center py-12">
            <Carrot className="w-14 h-14 mx-auto mb-4 opacity-50 text-text-tertiary" />
            <h3 className="text-lg font-semibold text-text mb-2">No ingredients scanned yet</h3>
            <p className="text-sm text-text-secondary">
              Start scanning or manually add ingredients to get started
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Scanner;






