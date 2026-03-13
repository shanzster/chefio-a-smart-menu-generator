import React, { useState, useEffect } from 'react';
import { FiUsers, FiPlus, FiMinus, FiRefreshCw } from 'react-icons/fi';
import { Calculator, Sparkles } from 'lucide-react';
import Layout from '../../../components/layout/Layout/Layout';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Button from '../../../components/common/Button/Button';
import { useAuthStore } from '../../../store/authStore';
import { getUserRecipes, getUserSavedRecipes } from '../../../services/firebase/recipeService';
import { toast } from '../../../store/toastStore';

const PortionCalculator = () => {
  const user = useAuthStore((state) => state.user);
  const [originalServings, setOriginalServings] = useState(4);
  const [desiredServings, setDesiredServings] = useState(6);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user's saved recipes
  useEffect(() => {
    const loadRecipes = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch both user-created recipes and saved recipes
        const [userRecipes, savedRecipes] = await Promise.all([
          getUserRecipes(),
          getUserSavedRecipes()
        ]);
        
        // Merge both arrays
        const allRecipes = [...userRecipes, ...savedRecipes];
        
        // Transform recipes to calculator format
        const formattedRecipes = allRecipes.map(recipe => ({
          id: recipe.id,
          name: recipe.name,
          originalServings: recipe.servings || 4,
          ingredients: (recipe.ingredients || []).map(ing => {
            // Extract numeric amount
            let amount = 0;
            if (ing.amount !== undefined && ing.amount !== null) {
              amount = parseFloat(ing.amount);
            }
            
            // If amount is still NaN or 0, try to extract from original string
            if (isNaN(amount) || amount === 0) {
              const original = ing.original || '';
              const match = original.match(/^(\d+\.?\d*)/);
              if (match) {
                amount = parseFloat(match[1]);
              } else {
                amount = 1; // Default to 1 if no number found
              }
            }
            
            return {
              name: ing.name || ing.original || 'Unknown ingredient',
              amount: amount,
              unit: ing.unit || '',
              original: ing.original || `${ing.amount || ''} ${ing.unit || ''} ${ing.name || ''}`.trim()
            };
          }),
          nutrition: recipe.nutrition || {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
          }
        }));

        setRecipes(formattedRecipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
        toast.error('Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [user]);

  const calculateScaledAmount = (originalAmount, originalServ, desiredServ) => {
    // Handle non-numeric amounts
    if (!originalAmount || isNaN(parseFloat(originalAmount))) {
      return originalAmount; // Return as-is if not a number
    }
    
    const numericAmount = parseFloat(originalAmount);
    const scaleFactor = desiredServ / originalServ;
    const scaled = numericAmount * scaleFactor;
    return Math.round(scaled * 100) / 100; // Round to 2 decimal places
  };

  const calculateScaledNutrition = (originalValue, originalServ, desiredServ) => {
    if (!originalValue || isNaN(originalValue)) {
      return 0;
    }
    const scaleFactor = desiredServ / originalServ;
    return Math.round(originalValue * scaleFactor);
  };

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
    setOriginalServings(recipe.originalServings);
    setDesiredServings(recipe.originalServings);
  };

  const resetCalculator = () => {
    if (selectedRecipe) {
      setOriginalServings(selectedRecipe.originalServings);
      setDesiredServings(selectedRecipe.originalServings);
    }
  };

  const handleSaveScaledRecipe = () => {
    if (!selectedRecipe) return;

    const scaledIngredients = selectedRecipe.ingredients.map(ing => ({
      name: ing.name,
      amount: calculateScaledAmount(ing.amount, originalServings, desiredServings),
      unit: ing.unit
    }));

    const scaledNutrition = {
      calories: calculateScaledNutrition(selectedRecipe.nutrition.calories, originalServings, desiredServings),
      protein: calculateScaledNutrition(selectedRecipe.nutrition.protein, originalServings, desiredServings),
      carbs: calculateScaledNutrition(selectedRecipe.nutrition.carbs, originalServings, desiredServings),
      fat: calculateScaledNutrition(selectedRecipe.nutrition.fat, originalServings, desiredServings)
    };

    // Create canvas for PNG generation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const width = 800;
    const lineHeight = 35;
    const padding = 40;
    const headerHeight = 180;
    const nutritionHeight = 120;
    const ingredientsHeight = scaledIngredients.length * lineHeight;
    const height = headerHeight + ingredientsHeight + nutritionHeight + padding * 3;
    
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Header background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, headerHeight);
    gradient.addColorStop(0, '#f97316');
    gradient.addColorStop(1, '#ea580c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, headerHeight);

    // Recipe name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(selectedRecipe.name, width / 2, 60);

    // Servings info
    ctx.font = '24px Arial';
    ctx.fillText(`${desiredServings} Servings`, width / 2, 100);

    // Scale factor badge
    const scaleFactor = (desiredServings / originalServings).toFixed(2);
    ctx.font = '18px Arial';
    ctx.fillText(`Scaled ${scaleFactor}x from ${originalServings} servings`, width / 2, 135);

    // Prep time and difficulty
    if (selectedRecipe.prepTime || selectedRecipe.difficulty) {
      ctx.font = '16px Arial';
      const info = [];
      if (selectedRecipe.prepTime) info.push(`⏱️ ${selectedRecipe.prepTime} mins`);
      if (selectedRecipe.difficulty) info.push(`📊 ${selectedRecipe.difficulty}`);
      ctx.fillText(info.join('  •  '), width / 2, 160);
    }

    // Ingredients section
    let currentY = headerHeight + padding;
    
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Ingredients', padding, currentY);
    currentY += 40;

    // Ingredients list
    ctx.font = '18px Arial';
    scaledIngredients.forEach((ing) => {
      const text = `• ${ing.amount} ${ing.unit} ${ing.name}`;
      ctx.fillText(text, padding + 10, currentY);
      currentY += lineHeight;
    });

    // Nutrition section
    currentY += padding;
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Nutrition (per serving)', padding, currentY);
    currentY += 40;

    // Nutrition boxes
    const boxWidth = (width - padding * 2 - 30) / 4;
    const boxHeight = 60;
    const boxY = currentY - 10;

    // Calories
    ctx.fillStyle = '#fff7ed';
    ctx.fillRect(padding, boxY, boxWidth, boxHeight);
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2;
    ctx.strokeRect(padding, boxY, boxWidth, boxHeight);
    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(scaledNutrition.calories.toString(), padding + boxWidth / 2, boxY + 30);
    ctx.font = '14px Arial';
    ctx.fillText('Calories', padding + boxWidth / 2, boxY + 50);

    // Protein
    ctx.fillStyle = '#eff6ff';
    ctx.fillRect(padding + boxWidth + 10, boxY, boxWidth, boxHeight);
    ctx.strokeStyle = '#3b82f6';
    ctx.strokeRect(padding + boxWidth + 10, boxY, boxWidth, boxHeight);
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`${scaledNutrition.protein}g`, padding + boxWidth + 10 + boxWidth / 2, boxY + 30);
    ctx.font = '14px Arial';
    ctx.fillText('Protein', padding + boxWidth + 10 + boxWidth / 2, boxY + 50);

    // Carbs
    ctx.fillStyle = '#f0fdf4';
    ctx.fillRect(padding + (boxWidth + 10) * 2, boxY, boxWidth, boxHeight);
    ctx.strokeStyle = '#22c55e';
    ctx.strokeRect(padding + (boxWidth + 10) * 2, boxY, boxWidth, boxHeight);
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`${scaledNutrition.carbs}g`, padding + (boxWidth + 10) * 2 + boxWidth / 2, boxY + 30);
    ctx.font = '14px Arial';
    ctx.fillText('Carbs', padding + (boxWidth + 10) * 2 + boxWidth / 2, boxY + 50);

    // Fat
    ctx.fillStyle = '#faf5ff';
    ctx.fillRect(padding + (boxWidth + 10) * 3, boxY, boxWidth, boxHeight);
    ctx.strokeStyle = '#a855f7';
    ctx.strokeRect(padding + (boxWidth + 10) * 3, boxY, boxWidth, boxHeight);
    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`${scaledNutrition.fat}g`, padding + (boxWidth + 10) * 3 + boxWidth / 2, boxY + 30);
    ctx.font = '14px Arial';
    ctx.fillText('Fat', padding + (boxWidth + 10) * 3 + boxWidth / 2, boxY + 50);

    // Footer
    ctx.font = 'italic 14px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'center';
    ctx.fillText('Generated by Chefio - Your Smart Kitchen Companion', width / 2, height - 20);

    // Convert to PNG and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `recipe-${selectedRecipe.name.replace(/\s+/g, '-').toLowerCase()}-${desiredServings}servings.png`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('Scaled recipe downloaded as PNG! 📄');
    }, 'image/png');
  };

  const handleGenerateShoppingList = () => {
    if (!selectedRecipe) return;

    const scaledIngredients = selectedRecipe.ingredients.map(ing => ({
      name: ing.name,
      amount: calculateScaledAmount(ing.amount, originalServings, desiredServings),
      unit: ing.unit
    }));

    // Create canvas for PNG generation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const width = 800;
    const lineHeight = 40;
    const padding = 40;
    const headerHeight = 120;
    const height = headerHeight + (scaledIngredients.length * lineHeight) + padding * 2;
    
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Header background
    const gradient = ctx.createLinearGradient(0, 0, width, headerHeight);
    gradient.addColorStop(0, '#f97316');
    gradient.addColorStop(1, '#ea580c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, headerHeight);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Shopping List', width / 2, 50);

    // Recipe name and servings
    ctx.font = '20px Arial';
    ctx.fillText(`${selectedRecipe.name} (${desiredServings} servings)`, width / 2, 90);

    // Ingredients
    ctx.fillStyle = '#1f2937';
    ctx.textAlign = 'left';
    ctx.font = '18px Arial';
    
    scaledIngredients.forEach((ing, index) => {
      const y = headerHeight + padding + (index * lineHeight);
      
      // Checkbox
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      ctx.strokeRect(padding, y - 20, 24, 24);
      
      // Ingredient text
      const text = `${ing.amount} ${ing.unit} ${ing.name}`;
      ctx.fillText(text, padding + 40, y);
    });

    // Footer
    ctx.font = 'italic 14px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'center';
    ctx.fillText('Generated by Chefio', width / 2, height - 20);

    // Convert to PNG and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `shopping-list-${selectedRecipe.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('Shopping list downloaded as PNG! 📋');
    }, 'image/png');
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text">Portion Calculator</h1>
              <p className="text-base text-text-secondary">Scale recipe portions and calculate nutritional values</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recipe Selection */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-text mb-4">Select Recipe</h2>
            
            {loading ? (
              <Card variant="glass" className="border border-white/50">
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-sm text-text-secondary">Loading recipes...</p>
                </div>
              </Card>
            ) : recipes.length === 0 ? (
              <Card variant="glass" className="border border-white/50">
                <div className="p-8 text-center">
                  <Calculator className="w-12 h-12 text-text-tertiary mx-auto mb-3 opacity-50" />
                  <h3 className="font-semibold text-text mb-2">No Saved Recipes</h3>
                  <p className="text-sm text-text-secondary mb-4">
                    Save recipes from Menu Generator to use the Portion Calculator
                  </p>
                  <Button to="/menu-generator" size="small" variant="outline">
                    Go to Menu Generator
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {recipes.map((recipe) => (
                  <Card
                    key={recipe.id}
                    variant="glass"
                    hover
                    className={`cursor-pointer border transition-all ${
                      selectedRecipe?.id === recipe.id
                        ? 'border-primary bg-primary/5'
                        : 'border-white/50'
                    }`}
                    onClick={() => handleRecipeSelect(recipe)}
                  >
                    <div className="p-4">
                      <h3 className="font-semibold text-text mb-2">{recipe.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <FiUsers className="w-4 h-4" />
                        <span>{recipe.originalServings} servings</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Calculator */}
          <div className="lg:col-span-2 space-y-6">
            {!selectedRecipe ? (
              <Card variant="glass" className="border border-white/50">
                <div className="p-12 text-center">
                  <Calculator className="w-16 h-16 text-text-tertiary mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-text mb-2">Select a Recipe</h3>
                  <p className="text-text-secondary">Choose a recipe from the list to start calculating portions</p>
                </div>
              </Card>
            ) : (
              <>
                {/* Servings Input */}
                <Card variant="glass" className="border border-white/50">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-text">Adjust Servings</h3>
                      <button
                        onClick={resetCalculator}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <FiRefreshCw className="w-4 h-4" />
                        Reset
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Original Servings */}
                      <div>
                        <label className="block text-sm font-medium text-text mb-3">Original Servings</label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setOriginalServings(Math.max(1, originalServings - 1))}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <div className="flex-1 text-center">
                            <div className="text-3xl font-bold text-primary">{originalServings}</div>
                            <div className="text-xs text-text-secondary">people</div>
                          </div>
                          <button
                            onClick={() => setOriginalServings(originalServings + 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Desired Servings */}
                      <div>
                        <label className="block text-sm font-medium text-text mb-3">Desired Servings</label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setDesiredServings(Math.max(1, desiredServings - 1))}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                          >
                            <FiMinus className="w-4 h-4 text-primary" />
                          </button>
                          <div className="flex-1 text-center">
                            <div className="text-3xl font-bold text-primary">{desiredServings}</div>
                            <div className="text-xs text-text-secondary">people</div>
                          </div>
                          <button
                            onClick={() => setDesiredServings(desiredServings + 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                          >
                            <FiPlus className="w-4 h-4 text-primary" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Scale Factor */}
                    <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-text">Scale Factor</span>
                        <span className="text-lg font-bold text-primary">
                          {(desiredServings / originalServings).toFixed(2)}x
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Scaled Ingredients */}
                <Card variant="glass" className="border border-white/50">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Scaled Ingredients
                    </h3>
                    <div className="space-y-3">
                      {selectedRecipe.ingredients.map((ingredient, index) => {
                        const hasValidAmount = ingredient.amount && !isNaN(ingredient.amount);
                        const scaledAmount = hasValidAmount 
                          ? calculateScaledAmount(ingredient.amount, originalServings, desiredServings)
                          : null;
                        
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-colors"
                          >
                            <span className="font-medium text-text">{ingredient.name}</span>
                            <div className="flex items-center gap-3">
                              {hasValidAmount ? (
                                <>
                                  <span className="text-sm text-text-secondary line-through">
                                    {ingredient.amount} {ingredient.unit}
                                  </span>
                                  <Badge variant="primary" size="medium">
                                    {scaledAmount} {ingredient.unit}
                                  </Badge>
                                </>
                              ) : (
                                <Badge variant="secondary" size="medium">
                                  {ingredient.original || 'As needed'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>

                {/* Scaled Nutrition */}
                <Card variant="glass" className="border border-white/50">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-text mb-4">Nutritional Values (per serving)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                          {calculateScaledNutrition(selectedRecipe.nutrition.calories, originalServings, desiredServings)}
                        </div>
                        <div className="text-xs text-orange-800">Calories</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {calculateScaledNutrition(selectedRecipe.nutrition.protein, originalServings, desiredServings)}g
                        </div>
                        <div className="text-xs text-blue-800">Protein</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {calculateScaledNutrition(selectedRecipe.nutrition.carbs, originalServings, desiredServings)}g
                        </div>
                        <div className="text-xs text-green-800">Carbs</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {calculateScaledNutrition(selectedRecipe.nutrition.fat, originalServings, desiredServings)}g
                        </div>
                        <div className="text-xs text-purple-800">Fat</div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    fullWidth
                    onClick={handleSaveScaledRecipe}
                  >
                    Save Scaled Recipe
                  </Button>
                  <Button 
                    fullWidth
                    onClick={handleGenerateShoppingList}
                  >
                    Generate Shopping List
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PortionCalculator;
