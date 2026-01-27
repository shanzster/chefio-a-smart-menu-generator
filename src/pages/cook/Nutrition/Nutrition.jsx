import React, { useState } from 'react';
import { FiSearch, FiPlus, FiX } from 'react-icons/fi';
import { UtensilsCrossed, Salad } from 'lucide-react';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import Layout from '../../../components/layout/Layout/Layout';

// Sample ingredient nutrition data
const ingredientDatabase = {
  'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, vitaminC: 0, iron: 0.7 },
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, vitaminC: 0, iron: 0.8 },
  'tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, vitaminC: 13.7, iron: 0.3 },
  'onion': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, vitaminC: 7.4, iron: 0.2 },
  'garlic': { calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1, vitaminC: 31.2, iron: 1.7 },
  'cheese': { calories: 113, protein: 7, carbs: 0.9, fat: 9, fiber: 0, vitaminC: 0, iron: 0.1 },
  'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, vitaminC: 0, iron: 1.2 },
  'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, vitaminC: 0, iron: 1.3 },
};

const Nutrition = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [mealNutrition, setMealNutrition] = useState(null);

  const addIngredient = (ingredient) => {
    const normalized = ingredient.toLowerCase().trim();
    if (normalized && ingredientDatabase[normalized] && !ingredients.find(i => i.name === normalized)) {
      setIngredients([...ingredients, { name: normalized, ...ingredientDatabase[normalized] }]);
      setInputValue('');
      calculateMealNutrition();
    }
  };

  const removeIngredient = (name) => {
    setIngredients(ingredients.filter(i => i.name !== name));
    calculateMealNutrition();
  };

  const calculateMealNutrition = () => {
    if (ingredients.length === 0) {
      setMealNutrition(null);
      return;
    }
    
    const totals = ingredients.reduce((acc, ing) => ({
      calories: acc.calories + ing.calories,
      protein: acc.protein + ing.protein,
      carbs: acc.carbs + ing.carbs,
      fat: acc.fat + ing.fat,
      fiber: acc.fiber + ing.fiber,
      vitaminC: acc.vitaminC + ing.vitaminC,
      iron: acc.iron + ing.iron,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, vitaminC: 0, iron: 0 });
    
    setMealNutrition(totals);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addIngredient(inputValue.trim());
    }
  };

  const suggestedIngredients = Object.keys(ingredientDatabase);

  return (
    <Layout>
      <div className="p-6 lg:p-12 lg:py-16 max-w-[1000px] mx-auto">
        {/* Header */}
        <header className="mb-8 lg:mb-12">
          <h1 className="text-2xl lg:text-4xl font-bold text-text mb-3">Nutrition Analysis</h1>
          <p className="text-base lg:text-lg text-text-secondary">
            Analyze nutritional values of ingredients and complete meals
          </p>
        </header>

        {/* Add Ingredients */}
        <section className="mb-8 lg:mb-12">
          <h2 className="text-lg lg:text-xl font-semibold text-text mb-6 lg:mb-8">Add Ingredients</h2>
          
          <div className="flex gap-2 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Type ingredient name (e.g., chicken, rice, tomato)..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="glass"
                icon={<FiSearch />}
              />
            </div>
            <Button icon={<FiPlus />} onClick={() => addIngredient(inputValue)} disabled={!inputValue.trim()}>
              Add
            </Button>
          </div>

          {/* Selected Ingredients */}
          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {ingredients.map((ing) => (
                <span key={ing.name} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium animate-scale-in">
                  {ing.name}
                  <button onClick={() => removeIngredient(ing.name)} className="w-5 h-5 flex items-center justify-center bg-primary/20 rounded-full hover:bg-primary hover:text-white transition-colors">
                    <FiX className="text-xs" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Suggestions */}
          <div>
            <p className="text-sm text-text-tertiary mb-2">Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedIngredients
                .filter(s => !ingredients.find(i => i.name === s))
                .slice(0, 8)
                .map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => addIngredient(suggestion)}
                    className="px-4 py-1 bg-white border border-gray-200 rounded-full text-sm text-text-secondary hover:border-primary hover:text-primary active:scale-95 transition-all"
                  >
                    + {suggestion}
                  </button>
                ))}
            </div>
          </div>
        </section>

        {/* Individual Ingredient Details */}
        {selectedIngredient && (
          <Card variant="glass" className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text capitalize">{selectedIngredient.name}</h3>
              <button onClick={() => setSelectedIngredient(null)} className="text-text-tertiary hover:text-text">
                <FiX />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(selectedIngredient).filter(([key]) => key !== 'name').map(([key, value]) => (
                <div key={key} className="text-center">
                  <span className="block text-lg font-bold text-primary">{value}</span>
                  <span className="text-xs text-text-tertiary capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Meal Nutrition Summary */}
        {mealNutrition && (
          <Card variant="glass" className="mb-8 lg:mb-12 p-6 lg:p-8">
            <h3 className="text-lg lg:text-xl font-semibold text-text mb-6 lg:mb-8">Complete Meal Nutrition</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <span className="block text-2xl font-bold text-primary mb-1">{Math.round(mealNutrition.calories)}</span>
                <span className="text-sm text-text-tertiary">Calories</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-primary mb-1">{mealNutrition.protein.toFixed(1)}g</span>
                <span className="text-sm text-text-tertiary">Protein</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-primary mb-1">{mealNutrition.carbs.toFixed(1)}g</span>
                <span className="text-sm text-text-tertiary">Carbs</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-primary mb-1">{mealNutrition.fat.toFixed(1)}g</span>
                <span className="text-sm text-text-tertiary">Fat</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-black/5">
              <div className="text-center">
                <span className="block text-lg font-semibold text-text mb-1">{mealNutrition.fiber.toFixed(1)}g</span>
                <span className="text-xs text-text-tertiary">Fiber</span>
              </div>
              <div className="text-center">
                <span className="block text-lg font-semibold text-text mb-1">{mealNutrition.vitaminC.toFixed(1)}mg</span>
                <span className="text-xs text-text-tertiary">Vitamin C</span>
              </div>
              <div className="text-center">
                <span className="block text-lg font-semibold text-text mb-1">{mealNutrition.iron.toFixed(1)}mg</span>
                <span className="text-xs text-text-tertiary">Iron</span>
              </div>
            </div>
          </Card>
        )}

        {/* Ingredient List */}
        {ingredients.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-text mb-4">Ingredient Breakdown</h2>
            <div className="space-y-2">
              {ingredients.map((ing, index) => (
                <Card 
                  key={ing.name} 
                  variant="default" 
                  padding="medium"
                  className="cursor-pointer hover-lift animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedIngredient(selectedIngredient?.name === ing.name ? null : ing)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <UtensilsCrossed className="w-6 h-6 text-primary" />
                      <div>
                        <h3 className="text-base font-semibold text-text capitalize">{ing.name}</h3>
                        <p className="text-sm text-text-secondary">
                          {ing.calories} kcal • {ing.protein}g protein • {ing.carbs}g carbs
                        </p>
                      </div>
                    </div>
                    <Badge variant="primary" size="small">View Details</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {ingredients.length === 0 && (
          <Card variant="glass" className="text-center py-16">
            <Salad className="w-16 h-16 mx-auto mb-4 opacity-50 text-text-tertiary" />
            <h3 className="text-lg font-semibold text-text mb-2">No ingredients added</h3>
            <p className="text-base text-text-tertiary">
              Add ingredients above to analyze their nutritional values
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Nutrition;
