import React, { useState } from 'react';
import { FiSearch, FiCheck, FiX, FiAlertCircle, FiChevronRight } from 'react-icons/fi';
import { ChefHat, Sparkles } from 'lucide-react';
import Layout from '../../../components/layout/Layout/Layout';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';

const RecipeFinder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [userIngredients, setUserIngredients] = useState([
    'Chicken', 'Onion', 'Garlic', 'Tomato', 'Rice'
  ]);

  // Mock recipe data
  const recipes = [
    {
      id: 1,
      name: 'Chicken Adobo',
      description: 'Classic Filipino braised chicken dish',
      prepTime: '45 mins',
      servings: 4,
      difficulty: 'Easy',
      requiredIngredients: ['Chicken', 'Soy Sauce', 'Vinegar', 'Garlic', 'Bay Leaves', 'Peppercorns'],
      optionalIngredients: ['Potato', 'Egg'],
      alternatives: [
        { id: 2, name: 'Chicken Tinola', reason: 'Uses similar base ingredients' }
      ]
    },
    {
      id: 2,
      name: 'Chicken Tinola',
      description: 'Filipino ginger chicken soup',
      prepTime: '40 mins',
      servings: 4,
      difficulty: 'Easy',
      requiredIngredients: ['Chicken', 'Ginger', 'Onion', 'Garlic', 'Green Papaya', 'Spinach'],
      optionalIngredients: ['Fish Sauce'],
      alternatives: []
    },
    {
      id: 3,
      name: 'Chicken Curry',
      description: 'Creamy and aromatic curry',
      prepTime: '50 mins',
      servings: 4,
      difficulty: 'Medium',
      requiredIngredients: ['Chicken', 'Curry Powder', 'Coconut Milk', 'Onion', 'Garlic', 'Potato'],
      optionalIngredients: ['Carrot', 'Bell Pepper'],
      alternatives: [
        { id: 1, name: 'Chicken Adobo', reason: 'Simpler preparation' }
      ]
    },
  ];

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const checkIngredientAvailability = (ingredient) => {
    return userIngredients.some(userIng => 
      userIng.toLowerCase() === ingredient.toLowerCase()
    );
  };

  const getMissingIngredients = (recipe) => {
    return recipe.requiredIngredients.filter(ing => !checkIngredientAvailability(ing));
  };

  const getMatchPercentage = (recipe) => {
    const available = recipe.requiredIngredients.filter(ing => checkIngredientAvailability(ing)).length;
    return Math.round((available / recipe.requiredIngredients.length) * 100);
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
          <div className="glass-enhanced rounded-2xl px-6 py-4 border border-white/50 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
            <div className="flex items-center gap-3">
              <FiSearch className="w-5 h-5 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search for a recipe (e.g., Chicken Adobo, Pasta, Curry)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-base text-text placeholder:text-text-tertiary"
              />
            </div>
          </div>
        </div>

        {/* Your Ingredients */}
        <Card variant="glass" className="mb-8 border border-white/50">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary" />
              Your Available Ingredients
            </h3>
            <div className="flex flex-wrap gap-2">
              {userIngredients.map((ingredient, index) => (
                <Badge key={index} variant="primary" size="medium">
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Recipe Results */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-text">
            {searchQuery ? `Search Results (${filteredRecipes.length})` : 'All Recipes'}
          </h2>

          {filteredRecipes.length === 0 ? (
            <Card variant="glass" className="border border-white/50">
              <div className="p-12 text-center">
                <FiSearch className="w-16 h-16 text-text-tertiary mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-text mb-2">No recipes found</h3>
                <p className="text-text-secondary">Try searching for a different recipe</p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredRecipes.map((recipe) => {
                const missingIngredients = getMissingIngredients(recipe);
                const matchPercentage = getMatchPercentage(recipe);
                const canMake = missingIngredients.length === 0;

                return (
                  <Card
                    key={recipe.id}
                    variant="glass"
                    hover
                    className="border border-white/50 cursor-pointer"
                    onClick={() => setSelectedRecipe(recipe)}
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

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedRecipe(null)} />
            
            <Card variant="glass" className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/50">
              <div className="p-6 lg:p-8">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>

                {/* Recipe Details */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-text mb-2">{selectedRecipe.name}</h2>
                  <p className="text-text-secondary mb-4">{selectedRecipe.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">{selectedRecipe.prepTime}</Badge>
                    <Badge variant="default">{selectedRecipe.servings} servings</Badge>
                    <Badge variant="primary">{selectedRecipe.difficulty}</Badge>
                  </div>
                </div>

                {/* Required Ingredients */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-text mb-3">Required Ingredients</h3>
                  <div className="space-y-2">
                    {selectedRecipe.requiredIngredients.map((ingredient, index) => {
                      const hasIngredient = checkIngredientAvailability(ingredient);
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
                            {ingredient}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Ingredients */}
                {selectedRecipe.optionalIngredients.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-text mb-3">Optional Ingredients</h3>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <p className="text-sm text-blue-800 mb-2">
                        <FiAlertCircle className="inline w-4 h-4 mr-1" />
                        These ingredients are optional. The dish can be made without them.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecipe.optionalIngredients.map((ingredient, index) => (
                          <Badge key={index} variant="default" size="small">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Alternative Recipes */}
                {selectedRecipe.alternatives.length > 0 && getMissingIngredients(selectedRecipe).length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI Recommended Alternatives
                    </h3>
                    <div className="space-y-3">
                      {selectedRecipe.alternatives.map((alt) => (
                        <div
                          key={alt.id}
                          className="p-4 bg-primary/5 border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer"
                          onClick={() => {
                            const altRecipe = recipes.find(r => r.id === alt.id);
                            if (altRecipe) setSelectedRecipe(altRecipe);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-text mb-1">{alt.name}</h4>
                              <p className="text-sm text-text-secondary">{alt.reason}</p>
                            </div>
                            <FiChevronRight className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  fullWidth
                  size="large"
                  onClick={() => setSelectedRecipe(null)}
                >
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RecipeFinder;
