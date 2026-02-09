import React, { useState } from 'react';
import { FiUsers, FiPlus, FiMinus, FiRefreshCw } from 'react-icons/fi';
import { Calculator, Sparkles } from 'lucide-react';
import Layout from '../../../components/layout/Layout/Layout';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Button from '../../../components/common/Button/Button';

const PortionCalculator = () => {
  const [originalServings, setOriginalServings] = useState(4);
  const [desiredServings, setDesiredServings] = useState(6);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Mock recipe data
  const recipes = [
    {
      id: 1,
      name: 'Chicken Adobo',
      originalServings: 4,
      ingredients: [
        { name: 'Chicken', amount: 1, unit: 'kg' },
        { name: 'Soy Sauce', amount: 0.5, unit: 'cup' },
        { name: 'Vinegar', amount: 0.25, unit: 'cup' },
        { name: 'Garlic', amount: 8, unit: 'cloves' },
        { name: 'Bay Leaves', amount: 3, unit: 'pieces' },
        { name: 'Peppercorns', amount: 1, unit: 'tsp' },
      ],
      nutrition: {
        calories: 450,
        protein: 35,
        carbs: 12,
        fat: 28,
      }
    },
    {
      id: 2,
      name: 'Pasta Carbonara',
      originalServings: 4,
      ingredients: [
        { name: 'Pasta', amount: 400, unit: 'g' },
        { name: 'Bacon', amount: 200, unit: 'g' },
        { name: 'Eggs', amount: 4, unit: 'pieces' },
        { name: 'Parmesan Cheese', amount: 100, unit: 'g' },
        { name: 'Black Pepper', amount: 1, unit: 'tsp' },
      ],
      nutrition: {
        calories: 580,
        protein: 28,
        carbs: 52,
        fat: 26,
      }
    },
    {
      id: 3,
      name: 'Vegetable Stir Fry',
      originalServings: 4,
      ingredients: [
        { name: 'Mixed Vegetables', amount: 500, unit: 'g' },
        { name: 'Soy Sauce', amount: 3, unit: 'tbsp' },
        { name: 'Garlic', amount: 4, unit: 'cloves' },
        { name: 'Ginger', amount: 2, unit: 'tbsp' },
        { name: 'Oil', amount: 2, unit: 'tbsp' },
      ],
      nutrition: {
        calories: 180,
        protein: 6,
        carbs: 24,
        fat: 8,
      }
    },
  ];

  const calculateScaledAmount = (originalAmount, originalServ, desiredServ) => {
    const scaleFactor = desiredServ / originalServ;
    const scaled = originalAmount * scaleFactor;
    return Math.round(scaled * 100) / 100; // Round to 2 decimal places
  };

  const calculateScaledNutrition = (originalValue, originalServ, desiredServ) => {
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
          </div>

          {/* Calculator */}
          <div className="lg:col-span-2">
            {!selectedRecipe ? (
              <Card variant="glass" className="border border-white/50">
                <div className="p-12 text-center">
                  <Calculator className="w-16 h-16 text-text-tertiary mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-text mb-2">Select a Recipe</h3>
                  <p className="text-text-secondary">Choose a recipe from the list to start calculating portions</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
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
                        const scaledAmount = calculateScaledAmount(
                          ingredient.amount,
                          originalServings,
                          desiredServings
                        );
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-colors"
                          >
                            <span className="font-medium text-text">{ingredient.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-text-secondary line-through">
                                {ingredient.amount} {ingredient.unit}
                              </span>
                              <Badge variant="primary" size="medium">
                                {scaledAmount} {ingredient.unit}
                              </Badge>
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
                <div className="flex gap-3">
                  <Button variant="outline" fullWidth>
                    Save Scaled Recipe
                  </Button>
                  <Button fullWidth>
                    Generate Shopping List
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PortionCalculator;
