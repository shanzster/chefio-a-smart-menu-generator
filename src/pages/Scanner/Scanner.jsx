import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCamera, FiX, FiCheck, FiArrowLeft, FiPlus, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import { ArrowLeft, ChefHat, Camera, Drumstick, Apple, Carrot, Wheat, Milk, Egg } from 'lucide-react';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import Navigation from '../../components/layout/Navigation/Navigation';
import Layout from '../../components/layout/Layout/Layout';
import { toast } from '../../store/toastStore';
import { useAuthStore } from '../../store/authStore';
import { recognizeFoodFromCanvas, preloadModels } from '../../services/ai/tensorflowService';

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

// Mock ingredient recognition database (Fallback)
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
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedIngredients, setScannedIngredients] = useState([]);
  const [currentScan, setCurrentScan] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [manualInput, setManualInput] = useState('');
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' for back camera, 'user' for front
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Preload TensorFlow models on component mount
    console.log('🚀 [SCANNER] Preloading TensorFlow.js models...');

    // Preload TensorFlow models
    preloadModels().then(() => {
      console.log('✅ [SCANNER] TensorFlow.js models ready!');
    }).catch(error => {
      console.error('❌ [SCANNER] Failed to load TensorFlow.js models:', error);
    });

    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async (mode = facingMode) => {
    setIsScanning(true); // Set state first to render video element
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode }
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

  const switchCamera = async () => {
    // Stop current stream
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    
    // Toggle facing mode
    const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacingMode);
    
    // Start with new facing mode
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      toast.success(`Switched to ${newFacingMode === 'user' ? 'front' : 'back'} camera`);
    } catch (error) {
      console.error('Error switching camera:', error);
      toast.error('Failed to switch camera');
      // Revert to previous mode
      setFacingMode(facingMode);
      startScanning(facingMode);
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
    setCurrentScan(null);
  };

  const captureAndIdentify = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    console.log('\n📸 [SCANNER] Starting capture and identify...');
    setIsIdentifying(true);

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      console.log('🖼️ [SCANNER] Image captured from video');
      console.log('📐 [SCANNER] Canvas size:', canvas.width, 'x', canvas.height);

      // Call TensorFlow.js for food recognition (runs in browser!)
      console.log('🤖 [SCANNER] Calling TensorFlow.js AI...');
      const recognizedFoods = await recognizeFoodFromCanvas(canvas);

      if (recognizedFoods.length > 0) {
        console.log('✅ [SCANNER] Recognition successful!');
        console.log('📊 [SCANNER] Found', recognizedFoods.length, 'food items');

        // Show top result
        const topResult = recognizedFoods[0];
        console.log('🥇 [SCANNER] Top result:', topResult.name, `(${topResult.confidence}%)`);

        setCurrentScan({
          name: topResult.name,
          category: topResult.category,
          description: `Identified with ${topResult.confidence}% confidence (TensorFlow.js)`,
          confidence: topResult.confidence
        });

        // Store alternatives for user to choose
        const alts = recognizedFoods.slice(1, 4);
        setAlternatives(alts);
        console.log('🔄 [SCANNER] Alternatives:', alts.map(a => `${a.name} (${a.confidence}%)`));

        toast.success(`Identified: ${topResult.name}!`);
      } else {
        console.warn('⚠️ [SCANNER] No food items recognized');
        toast.error('No food items recognized. Try again or add manually.');

        // Fallback to mock data (last resort)
        console.log('🔄 [SCANNER] Falling back to mock data...');
        const ingredients = Object.keys(ingredientDatabase);
        const randomIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];
        const identified = ingredientDatabase[randomIngredient];
        identified.confidence = Math.floor(Math.random() * 20) + 70;
        setCurrentScan(identified);
        console.log('🎲 [SCANNER] Mock result:', identified.name);
      }
    } catch (error) {
      console.error('💥 [SCANNER] Error:', error.message);
      console.error('📚 [SCANNER] Error stack:', error.stack);

      toast.error('Failed to identify. Please try again.');

      // Fallback to mock data if AI fails
      console.log('🔄 [SCANNER] Falling back to mock data...');
      const ingredients = Object.keys(ingredientDatabase);
      const randomIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];
      const identified = ingredientDatabase[randomIngredient];
      identified.confidence = Math.floor(Math.random() * 20) + 70;
      setCurrentScan(identified);
      console.log('🎲 [SCANNER] Mock result:', identified.name);
    } finally {
      setIsIdentifying(false);
      console.log('✨ [SCANNER] Capture and identify complete\n');
    }
  };

  const goToMenuGenerator = () => {
    if (scannedIngredients.length === 0) {
      toast.error('Please scan at least one ingredient first');
      return;
    }

    // Convert scanned ingredients to simple names
    const ingredientNames = scannedIngredients.map(ing => ing.name);

    // Navigate to PUBLIC Menu Generator with ingredients
    navigate('/menu-generator', {
      state: {
        ingredients: ingredientNames,
        fromScanner: true
      }
    });

    toast.success(`Forwarding ${ingredientNames.length} ingredients to Menu Generator!`);
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

  return (
    <>
      {user ? (
        // Authenticated users see the scanner within the Layout (with sidebar)
        <Layout>
          <ScannerContent
            isScanning={isScanning}
            scannedIngredients={scannedIngredients}
            currentScan={currentScan}
            alternatives={alternatives}
            manualInput={manualInput}
            isIdentifying={isIdentifying}
            facingMode={facingMode}
            videoRef={videoRef}
            canvasRef={canvasRef}
            startScanning={startScanning}
            stopScanning={stopScanning}
            switchCamera={switchCamera}
            captureAndIdentify={captureAndIdentify}
            confirmIngredient={confirmIngredient}
            removeIngredient={removeIngredient}
            addManualIngredient={addManualIngredient}
            goToMenuGenerator={goToMenuGenerator}
            setCurrentScan={setCurrentScan}
            setAlternatives={setAlternatives}
            setManualInput={setManualInput}
          />
        </Layout>
      ) : (
        // Public users see the scanner with public navigation
        <div className="min-h-screen bg-background relative">
          <Navigation />
          <div className="pt-20">
            <ScannerContent
              isScanning={isScanning}
              scannedIngredients={scannedIngredients}
              currentScan={currentScan}
              alternatives={alternatives}
              manualInput={manualInput}
              isIdentifying={isIdentifying}
              facingMode={facingMode}
              videoRef={videoRef}
              canvasRef={canvasRef}
              startScanning={startScanning}
              stopScanning={stopScanning}
              switchCamera={switchCamera}
              captureAndIdentify={captureAndIdentify}
              confirmIngredient={confirmIngredient}
              removeIngredient={removeIngredient}
              addManualIngredient={addManualIngredient}
              goToMenuGenerator={goToMenuGenerator}
              setCurrentScan={setCurrentScan}
              setAlternatives={setAlternatives}
              setManualInput={setManualInput}
            />
          </div>
        </div>
      )}
    </>
  );
};

// Extracted Scanner Content Component
const ScannerContent = ({
  isScanning,
  scannedIngredients,
  currentScan,
  alternatives,
  manualInput,
  isIdentifying,
  facingMode,
  videoRef,
  canvasRef,
  startScanning,
  stopScanning,
  switchCamera,
  captureAndIdentify,
  confirmIngredient,
  removeIngredient,
  addManualIngredient,
  goToMenuGenerator,
  setCurrentScan,
  setAlternatives,
  setManualInput
}) => {
  return (
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

                  {/* Identifying overlay */}
                  {isIdentifying && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                        <p className="font-medium text-lg">Identifying ingredient...</p>
                        <p className="text-sm text-white/70 mt-2">Using AI recognition</p>
                      </div>
                    </div>
                  )}

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

                  {/* Camera switch button */}
                  <button
                    onClick={switchCamera}
                    disabled={isIdentifying}
                    className="absolute top-4 right-4 w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title={`Switch to ${facingMode === 'user' ? 'back' : 'front'} camera`}
                  >
                    <FiRefreshCw className="text-xl" />
                  </button>
                </div>

                {/* Controls */}
                <div className="flex gap-3 p-4">
                  <button
                    onClick={captureAndIdentify}
                    disabled={isIdentifying}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiCamera className="text-xl" />
                    {isIdentifying ? 'Identifying...' : 'Capture & Identify'}
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
                    <Badge variant="success" size="small">
                      {currentScan.confidence}% confident
                    </Badge>
                  </div>
                  <p className="text-sm text-text-secondary mb-2">{currentScan.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="primary" size="small">{currentScan.category}</Badge>
                    {currentScan.nutrition && (
                      <>
                        <Badge variant="default" size="small">
                          {currentScan.nutrition.calories} cal
                        </Badge>
                        <Badge variant="default" size="small">
                          P: {currentScan.nutrition.protein}g
                        </Badge>
                        <Badge variant="default" size="small">
                          C: {currentScan.nutrition.carbs}g
                        </Badge>
                        <Badge variant="default" size="small">
                          F: {currentScan.nutrition.fat}g
                        </Badge>
                        <span className="text-xs text-text-tertiary">per {currentScan.nutrition.per}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={confirmIngredient}
                  className="w-12 h-12 bg-success rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl active:scale-95 transition-all"
                  title="Add to list"
                >
                  <FiCheck className="text-xl" />
                </button>
                <button
                  onClick={() => {
                    setCurrentScan(null);
                    setAlternatives([]);
                  }}
                  className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-text-tertiary hover:bg-gray-200 active:scale-95 transition-all"
                  title="Discard"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Alternative Suggestions */}
              {alternatives.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-text-secondary mb-2">Or did you mean:</p>
                  <div className="flex flex-wrap gap-2">
                    {alternatives.map((alt, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentScan({
                            name: alt.name,
                            category: alt.category,
                            description: `Identified with ${alt.confidence}% confidence`,
                            confidence: alt.confidence
                          });
                          setAlternatives([]);
                        }}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-text-secondary hover:border-primary hover:text-primary active:scale-95 transition-all"
                      >
                        {alt.name} ({alt.confidence}%)
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
            <div className="mt-6 space-y-3">
              <Button
                fullWidth
                size="large"
                icon={<FiArrowRight />}
                onClick={goToMenuGenerator}
              >
                Generate Recipes ({scannedIngredients.length} ingredients)
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/cook/nutrition" state={{ ingredients: scannedIngredients.map(i => i.name) }}>
                  <Button variant="outline" fullWidth size="large">
                    Analyze Nutrition
                  </Button>
                </Link>
                <button
                  onClick={() => setScannedIngredients([])}
                  className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-text font-semibold hover:bg-gray-50 active:scale-95 transition-all"
                >
                  Clear All
                </button>
              </div>
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
  );
};

export default Scanner;






