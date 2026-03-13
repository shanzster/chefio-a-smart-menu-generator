import React, { useState, useEffect } from 'react';
import { FiSearch, FiCheck, FiX, FiAlertCircle, FiChevronRight, FiBookmark, FiClock, FiUsers, FiExternalLink } from 'react-icons/fi';
import { ChefHat, Sparkles } from 'lucide-react';
import Layout from '../../../components/layout/Layout/Layout';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import Modal from '../../../components/common/Modal/Modal';
import { searchMealsByName, getMealDetails } from '../../../services/api/mealdbService';
import { createRecipe } from '../../../services/firebase/recipeService';
import { useAuthStore } from '../../../store/authStore';
import { toast } from '../../../store/toastStore';

const RecipeFinder = () => {
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [userIngredients, setUserIngredients] = useState([
    'Chicken', 'Onion', 'Garlic', 'Tomato', 'Rice', 'Salt', 'Pepper', 'Oil'
  ]);
  const [newIngredient, setNewIngredient] = useState('');

  // Search for recipes when user types
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a recipe name to search');
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchMealsByName(searchQuery);
      setRecipes(results);
      
      if (results.length === 0) {
        toast.info('No recipes found. Try a different search term.');
      } else {
        toast.success(`Found ${results.length} recipes! 🔍`);
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
      toast.error('Failed to search recipes. Please try again.');
      setRecipes([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Enter key for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRecipeClick = async (recipe) => {
    setIsLoadingDetails(true);
    setSelectedRecipe(recipe); // Show loading state
    try {
      const details = await getMealDetails(recipe.id);
      setSelectedRecipe(details);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      toast.error('Failed to load recipe details');
      setSelectedRecipe(null);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!selectedRecipe || !user) return;
    
    try {
      await createRecipe(selectedRecipe);
      toast.success('Recipe saved to My Recipes! 📖');
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error('Failed to save recipe. Please try again.');
    }
  };

  const addIngredient = () => {
    const ingredient = newIngredient.trim();
    if (ingredient && !userIngredients.includes(ingredient)) {
      setUserIngredients([...userIngredients, ingredient]);
      setNewIngredient('');
      toast.success(`Added ${ingredient} to your ingredients!`);
    }
  };

  const removeIngredient = (ingredient) => {
    setUserIngredients(userIngredients.filter(i => i !== ingredient));
    toast.info(`Removed ${ingredient}`);
  };

  const checkIngredientAvailability = (ingredient) => {
    // Handle both string and object ingredient formats
    const ingredientName = typeof ingredient === 'string' ? ingredient : ingredient.name;
    return userIngredients.some(userIng => 
      userIng.toLowerCase().trim() === ingredientName.toLowerCase().trim()
    );
  };

  const getMissingIngredients = (recipe) => {
    if (!recipe.ingredients) return [];
    return recipe.ingredients.filter(ing => !checkIngredientAvailability(ing));
  };

  const getMatchPercentage = (recipe) => {
    if (!recipe.ingredients || recipe.ingredients.length === 0) return 0;
    const available = recipe.ingredients.filter(ing => checkIngredientAvailability(ing)).length;
    return Math.round((available / recipe.ingredients.length) * 100);
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <FiSearch className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text">Recipe Finder</h1>
              <p className="text-base text-text-secondary">Find recipes and check ingredient availability</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 glass-enhanced rounded-2xl px-6 py-4 border border-white/50 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
              <div className="flex items-center gap-3">
                <FiSearch className="w-5 h-5 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search for a recipe (e.g., Chicken Curry, Pasta, Salmon)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-transparent border-none outline-none text-base text-text placeholder:text-text-tertiary"
                />
              </div>
            </div>
            <Button 
              icon={<FiSearch />} 
              size="large"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        {/* Your Ingredients */}
        <Card variant="glass" className="mb-8 border border-white/50">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary" />
              Your Available Ingredients
            </h3>
            
            {/* Add Ingredient */}
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add an ingredient..."
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                size="small"
              />
              <Button 
                onClick={addIngredient}
                size="small"
                disabled={!newIngredient.trim()}
              >
                Add
              </Button>
            </div>

            {/* Ingredients List */}
            <div className="flex flex-wrap gap-2">
              {userIngredients.map((ingredient, index) => (
                <Badge 
                  key={index} 
                  variant="primary" 
                  size="medium"
                  className="cursor-pointer hover:bg-error/20 transition-colors group"
                  onClick={() => removeIngredient(ingredient)}
                >
                  {ingredient}
                  <FiX className="ml-1 w-3 h-3 opacity-50 group-hover:opacity-100" />
                </Badge>
              ))}
            </div>
            <p className="text-xs text-text-tertiary mt-2">Click an ingredient to remove it</p>
          </div>
        </Card>

        {/* Loading State */}
        {isSearching && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} variant="glass" className="border border-white/50">
                <div className="p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Recipe Results */}
        {!isSearching && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-text">
              {recipes.length > 0 ? `Search Results (${recipes.length})` : 'Search for Recipes'}
            </h2>

            {recipes.length === 0 ? (
            <Card variant="glass" className="border border-white/50">
              <div className="p-12 text-center">
                <FiSearch className="w-16 h-16 text-text-tertiary mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-text mb-2">No recipes found</h3>
                <p className="text-text-secondary">Try searching for a different recipe</p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {recipes.map((recipe) => {
                const missingIngredients = getMissingIngredients(recipe);
                const matchPercentage = getMatchPercentage(recipe);
                const canMake = missingIngredients.length === 0;

                return (
                  <Card
                    key={recipe.id}
                    variant="glass"
                    hover
                    className="border border-white/50 cursor-pointer"
                    onClick={() => handleRecipeClick(recipe)}
                  >
                    <div className="p-6">
                      {/* Recipe Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-text mb-2">{recipe.name}</h3>
                          <p className="text-sm text-text-secondary mb-3">{recipe.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="default" size="small">{recipe.prepTime}</Badge>
                            <Badge variant="default" size="small">{recipe.servings} servings</Badge>
                            <Badge variant="primary" size="small">{recipe.difficulty}</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Match Percentage */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-text">Ingredient Match</span>
                          <span className={`text-sm font-bold ${matchPercentage === 100 ? 'text-success' : matchPercentage >= 50 ? 'text-warning' : 'text-error'}`}>
                            {matchPercentage}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${matchPercentage === 100 ? 'bg-success' : matchPercentage >= 50 ? 'bg-warning' : 'bg-error'}`}
                            style={{ width: `${matchPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Status */}
                      {canMake ? (
                        <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-xl">
                          <FiCheck className="w-5 h-5 text-success flex-shrink-0" />
                          <span className="text-sm font-medium text-success">You can make this recipe!</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-xl">
                            <FiAlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
                            <span className="text-sm font-medium text-warning">
                              Missing {missingIngredients.length} ingredient{missingIngredients.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecipe(recipe);
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-xl transition-colors"
                          >
                            View Alternatives
                            <FiChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
          </div>
        )}

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <Modal isOpen={!!selectedRecipe} onClose={() => setSelectedRecipe(null)} title={selectedRecipe.name}>
            <div className="space-y-6 p-4 md:p-6">
              {/* Recipe Image */}
              {selectedRecipe.image && (
                <img 
                  src={selectedRecipe.image} 
                  alt={selectedRecipe.name}
                  className="w-full h-64 object-cover rounded-xl"
                />
              )}

              {/* Recipe Info */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="default"><FiClock className="inline w-4 h-4 mr-1" />{selectedRecipe.prepTime}</Badge>
                <Badge variant="default"><FiUsers className="inline w-4 h-4 mr-1" />{selectedRecipe.servings} servings</Badge>
                <Badge variant="primary">{selectedRecipe.difficulty}</Badge>
              </div>

              {/* Description */}
              {selectedRecipe.description && (
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">Description</h3>
                  <p className="text-text-secondary">{selectedRecipe.description}</p>
                </div>
              )}

              {/* Nutrition */}
              {selectedRecipe.nutrition && (
                <div>
                  <h3 className="text-lg font-semibold text-text mb-3">Nutrition Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-primary/5 rounded-xl text-center">
                      <p className="text-xs text-text-secondary mb-1">Calories</p>
                      <p className="text-lg font-bold text-primary">{selectedRecipe.nutrition.calories}</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-xl text-center">
                      <p className="text-xs text-text-secondary mb-1">Protein</p>
                      <p className="text-lg font-bold text-primary">{selectedRecipe.nutrition.protein}g</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-xl text-center">
                      <p className="text-xs text-text-secondary mb-1">Carbs</p>
                      <p className="text-lg font-bold text-primary">{selectedRecipe.nutrition.carbs}g</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-xl text-center">
                      <p className="text-xs text-text-secondary mb-1">Fat</p>
                      <p className="text-lg font-bold text-primary">{selectedRecipe.nutrition.fat}g</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ingredients */}
              {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-text mb-3">Ingredients</h3>
                  <div className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => {
                      const hasIngredient = checkIngredientAvailability(ingredient);
                      const ingredientDisplay = typeof ingredient === 'string' 
                        ? ingredient 
                        : `${ingredient.amount} ${ingredient.name}`.trim();
                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-xl ${
                            hasIngredient ? 'bg-success/10 border border-success/20' : 'bg-error/10 border border-error/20'
                          }`}
                        >
                          {hasIngredient ? (
                            <FiCheck className="w-5 h-5 text-success flex-shrink-0" />
                          ) : (
                            <FiX className="w-5 h-5 text-error flex-shrink-0" />
                          )}
                          <span className={`text-sm font-medium ${hasIngredient ? 'text-success' : 'text-error'}`}>
                            {ingredientDisplay}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Instructions */}
              {selectedRecipe.instructions && selectedRecipe.instructions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-text mb-3">Instructions</h3>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="text-text-secondary flex-1">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="primary" 
                  icon={<FiBookmark />}
                  className="flex-1"
                  onClick={handleSaveRecipe}
                >
                  Save Recipe
                </Button>
                {selectedRecipe.sourceUrl && (
                  <Button 
                    variant="secondary" 
                    icon={<FiExternalLink />}
                    onClick={() => window.open(selectedRecipe.sourceUrl, '_blank')}
                  >
                    View Source
                  </Button>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default RecipeFinder;
