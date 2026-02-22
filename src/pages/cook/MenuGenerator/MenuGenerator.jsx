import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiPlus, FiX, FiZap, FiClock, FiUsers, FiBookmark, FiExternalLink, FiSliders } from 'react-icons/fi';
import { Circle, Star, ChefHat } from 'lucide-react';
import Button from '../../../components/common/Button/Button';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Input from '../../../components/common/Input/Input';
import Layout from '../../../components/layout/Layout/Layout';
import { searchRecipesByIngredients } from '../../../services/ai/spoonacularService';
import { createRecipe } from '../../../services/firebase/recipeService';
import { toast } from '../../../store/toastStore';

const suggestedIngredients = ['Chicken', 'Rice', 'Eggs', 'Pasta', 'Tomatoes', 'Onions', 'Garlic', 'Cheese', 'Milk', 'Butter'];

const MenuGenerator = () => {
  const location = useLocation();
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  // Filter options
  const [showFilters, setShowFilters] = useState(false);
  const [servings, setServings] = useState(4);
  const [diet, setDiet] = useState('');
  const [maxCalories, setMaxCalories] = useState('');
  const [minProtein, setMinProtein] = useState('');
  const [maxCarbs, setMaxCarbs] = useState('');

  // Check if ingredients were passed from Scanner
  useEffect(() => {
    if (location.state?.ingredients && location.state?.fromScanner) {
      const scannedIngredients = location.state.ingredients;
      setIngredients(scannedIngredients);
      
      // Show welcome message
      toast.success(`Loaded ${scannedIngredients.length} ingredients from Scanner! 📸`);
      
      // Auto-scroll to ingredients section
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [location.state]);

  const addIngredient = (ingredient) => {
    if (ingredient && !ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
    setInputValue('');
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }

    setIsGenerating(true);
    
    try {
      const options = {
        number: 4, // Limited to 4 recipes
        ranking: 1,
        diet: diet || undefined,
        maxCalories: maxCalories ? parseInt(maxCalories) : undefined,
        minProtein: minProtein ? parseInt(minProtein) : undefined,
        maxCarbs: maxCarbs ? parseInt(maxCarbs) : undefined
      };

      const generatedRecipes = await searchRecipesByIngredients(ingredients, options);
      
      setRecipes(generatedRecipes);
      toast.success(`Found ${generatedRecipes.length} delicious recipes! 🍳`);
    } catch (error) {
      console.error('Recipe generation error:', error);
      toast.error('Failed to generate recipes. Please check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRecipe = async (recipe) => {
    try {
      await createRecipe({
        title: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients.map(ing => ing.original),
        instructions: recipe.instructions,
        prepTime: `${recipe.prepTime} mins`,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        nutrition: recipe.nutrition,
        category: 'Generated',
        tags: ingredients,
        image: recipe.image,
        sourceUrl: recipe.sourceUrl
      });
      
      toast.success('Recipe saved to your collection! 📖');
    } catch (error) {
      console.error('Save recipe error:', error);
      toast.error('Failed to save recipe');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addIngredient(inputValue.trim());
    }
  };

  return (
    <Layout>
      <div className="p-6 lg:p-12 lg:py-16 max-w-[900px] mx-auto">
        {/* Header */}
        <header className="text-center mb-10 lg:mb-16 animate-fade-in-down">
          <div className="mb-6">
            <img 
              src="/sidebar_logo.png" 
              alt="Chefio Logo" 
              className="w-32 h-32 lg:w-40 lg:h-40 mx-auto object-contain"
            />
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold text-text mb-3">Ask Chefio</h1>
          <p className="text-base lg:text-lg text-text-secondary leading-relaxed max-w-[400px] lg:max-w-[500px] mx-auto">
            {location.state?.fromScanner 
              ? '✨ Ingredients loaded from Scanner! Generate recipes now.'
              : 'Add your ingredients and discover delicious recipes'
            }
          </p>
        </header>

        {/* Ingredients Section */}
        <section className="mb-10 lg:mb-16">
          <h2 className="text-lg lg:text-xl font-semibold text-text mb-6 lg:mb-8">Your Ingredients</h2>
          
          {/* Input */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Type an ingredient..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="glass"
              />
            </div>
            <Button icon={<FiPlus />} onClick={() => addIngredient(inputValue.trim())} disabled={!inputValue.trim()}>
              Add
            </Button>
          </div>

          {/* Selected Ingredients */}
          {ingredients.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-text-secondary">
                  Selected ingredients ({ingredients.length})
                </p>
                {location.state?.fromScanner && (
                  <Badge variant="success" size="small">From Scanner 📸</Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient) => (
                  <span key={ingredient} className="inline-flex items-center gap-1 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium animate-scale-in">
                    {ingredient}
                    <button onClick={() => removeIngredient(ingredient)} className="w-[18px] h-[18px] flex items-center justify-center bg-primary/20 rounded-full hover:bg-primary hover:text-white transition-colors">
                      <FiX className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          <div className="mb-8">
            <p className="text-sm text-text-tertiary mb-2">Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedIngredients.filter(s => !ingredients.includes(s)).slice(0, 6).map((suggestion) => (
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

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-primary font-medium mb-4 hover:text-primary/80 transition-colors"
          >
            <FiSliders className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters (Optional)'}
          </button>

          {/* Filters Section */}
          {showFilters && (
            <div className="mb-8 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 animate-fade-in">
              <h3 className="font-semibold text-text mb-4">Recipe Filters</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Servings */}
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-2 block">
                    Servings / Pax
                  </label>
                  <Input
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    min="1"
                    max="12"
                    variant="glass"
                    placeholder="4"
                  />
                </div>

                {/* Dietary Restriction */}
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-2 block">
                    Dietary Restriction
                  </label>
                  <select
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="">None</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="gluten free">Gluten Free</option>
                    <option value="ketogenic">Ketogenic</option>
                    <option value="paleo">Paleo</option>
                    <option value="pescetarian">Pescetarian</option>
                  </select>
                </div>

                {/* Max Calories */}
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-2 block">
                    Max Calories (per serving)
                  </label>
                  <Input
                    type="number"
                    value={maxCalories}
                    onChange={(e) => setMaxCalories(e.target.value)}
                    variant="glass"
                    placeholder="e.g., 500"
                  />
                </div>

                {/* Min Protein */}
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-2 block">
                    Min Protein (grams)
                  </label>
                  <Input
                    type="number"
                    value={minProtein}
                    onChange={(e) => setMinProtein(e.target.value)}
                    variant="glass"
                    placeholder="e.g., 20"
                  />
                </div>

                {/* Max Carbs */}
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-2 block">
                    Max Carbs (grams)
                  </label>
                  <Input
                    type="number"
                    value={maxCarbs}
                    onChange={(e) => setMaxCarbs(e.target.value)}
                    variant="glass"
                    placeholder="e.g., 50"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              {(diet || maxCalories || minProtein || maxCarbs || servings !== 4) && (
                <button
                  onClick={() => {
                    setServings(4);
                    setDiet('');
                    setMaxCalories('');
                    setMinProtein('');
                    setMaxCarbs('');
                  }}
                  className="mt-4 text-sm text-error hover:text-error/80 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Generate Button */}
          <Button fullWidth size="large" onClick={handleGenerate} loading={isGenerating} disabled={ingredients.length === 0} icon={<FiZap />} className="lg:py-6">
            {isGenerating ? 'Generating Recipes...' : 'Generate Recipes'}
          </Button>
        </section>

        {/* Results */}
        {recipes.length > 0 && (
          <section className="mb-10 lg:mb-16">
            <h2 className="text-lg lg:text-xl font-semibold text-text mb-6 lg:mb-8 flex items-center gap-2">
              Generated Recipes
              <Badge variant="primary" size="small">{recipes.length} found</Badge>
            </h2>

            <div className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-2">
              {recipes.map((recipe, index) => (
                <Card key={recipe.id} variant="glass" padding="none" hover className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Recipe Image */}
                  {recipe.image ? (
                    <div className="relative h-[160px] overflow-hidden rounded-t-xl">
                      <img 
                        src={recipe.image} 
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-success">
                        {recipe.usedIngredientCount}/{recipe.usedIngredientCount + recipe.missedIngredientCount} ingredients
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-[160px] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center rounded-t-xl">
                      <ChefHat className="w-16 h-16 text-primary" />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="text-md font-semibold text-text mb-1">{recipe.name}</h3>
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">{recipe.description}</p>
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-text-tertiary">
                      <span className="flex items-center gap-1"><FiClock /> {recipe.prepTime} mins</span>
                      <span className="flex items-center gap-1"><FiUsers /> {recipe.servings}</span>
                      <Badge variant="success" size="small">{recipe.difficulty}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" fullWidth onClick={() => setSelectedRecipe(recipe)}>
                        View Details
                      </Button>
                      <Button fullWidth icon={<FiBookmark />} onClick={() => handleSaveRecipe(recipe)}>
                        Save
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedRecipe(null)} />
            
            <div className="relative bg-white rounded-3xl p-6 lg:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
              
              {/* Recipe Image */}
              {selectedRecipe.image && (
                <div className="relative h-64 -mx-6 lg:-mx-8 -mt-6 lg:-mt-8 mb-6 overflow-hidden rounded-t-3xl">
                  <img 
                    src={selectedRecipe.image} 
                    alt={selectedRecipe.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <h2 className="text-2xl lg:text-3xl font-bold text-text mb-2">{selectedRecipe.name}</h2>
              <p className="text-text-secondary mb-6">{selectedRecipe.description}</p>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b">
                <div className="flex items-center gap-2 text-text-tertiary">
                  <FiClock className="text-primary" />
                  <span className="font-medium">{selectedRecipe.prepTime} mins</span>
                </div>
                <div className="flex items-center gap-2 text-text-tertiary">
                  <FiUsers className="text-primary" />
                  <span className="font-medium">{selectedRecipe.servings} servings</span>
                </div>
                <Badge variant="success">{selectedRecipe.difficulty}</Badge>
              </div>
              
              {/* Ingredients */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-text mb-4">Ingredients</h3>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{ing.original}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Instructions */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-text mb-4">Instructions</h3>
                <ol className="space-y-4">
                  {selectedRecipe.instructions.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full font-bold text-sm">
                        {i + 1}
                      </span>
                      <span className="text-text-secondary pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              
              {/* Nutrition */}
              {selectedRecipe.nutrition && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-text mb-4">Nutrition (per serving)</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                      <div className="text-3xl font-bold text-orange-600">
                        {selectedRecipe.nutrition.calories}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Calories</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600">
                        {selectedRecipe.nutrition.protein}g
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Protein</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-3xl font-bold text-green-600">
                        {selectedRecipe.nutrition.carbs}g
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Carbs</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <div className="text-3xl font-bold text-purple-600">
                        {selectedRecipe.nutrition.fat}g
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Fat</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex flex-col lg:flex-row gap-3">
                <Button fullWidth icon={<FiBookmark />} onClick={() => handleSaveRecipe(selectedRecipe)}>
                  Save to Collection
                </Button>
                {selectedRecipe.sourceUrl && (
                  <Button 
                    variant="outline" 
                    fullWidth 
                    icon={<FiExternalLink />}
                    onClick={() => window.open(selectedRecipe.sourceUrl, '_blank')}
                  >
                    View Original
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {recipes.length === 0 && !isGenerating && (
          <div className="text-center py-16 animate-fade-in">
            <Circle className="w-16 h-16 mx-auto mb-4 opacity-50 text-text-tertiary" />
            <p className="text-base text-text-tertiary">
              Add ingredients above and generate personalized recipes!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MenuGenerator;
