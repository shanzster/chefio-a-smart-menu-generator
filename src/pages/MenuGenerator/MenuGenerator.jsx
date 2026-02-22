import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiPlus, FiX, FiZap, FiClock, FiUsers, FiLock, FiArrowRight, FiTrendingUp, FiAward, FiHeart, FiAlertCircle } from 'react-icons/fi';
import { ChefHat, Sparkles, UtensilsCrossed, User, Flame, Star, TrendingUp } from 'lucide-react';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import Input from '../../components/common/Input/Input';
import Navigation from '../../components/layout/Navigation/Navigation';
import { searchRecipesByIngredients } from '../../services/ai/spoonacularService';
import { toast } from '../../store/toastStore';
import { canGenerate, getRemainingGenerations, incrementUsage, getUsageStats } from '../../utils/rateLimiter';

const suggestedIngredients = [
  { name: 'Chicken', category: 'Protein', icon: '🍗' },
  { name: 'Rice', category: 'Grain', icon: '🍚' },
  { name: 'Eggs', category: 'Protein', icon: '🥚' },
  { name: 'Pasta', category: 'Grain', icon: '🍝' },
  { name: 'Tomatoes', category: 'Vegetable', icon: '🍅' },
  { name: 'Onions', category: 'Vegetable', icon: '🧅' },
  { name: 'Garlic', category: 'Vegetable', icon: '🧄' },
  { name: 'Cheese', category: 'Dairy', icon: '🧀' },
  { name: 'Milk', category: 'Dairy', icon: '🥛' },
  { name: 'Butter', category: 'Dairy', icon: '🧈' },
  { name: 'Beef', category: 'Protein', icon: '🥩' },
  { name: 'Fish', category: 'Protein', icon: '🐟' }
];

// No mock data needed - using real API

const MenuGenerator = () => {
  const location = useLocation();
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [usageStats, setUsageStats] = useState(getUsageStats());

  // Update usage stats on mount and after each generation
  useEffect(() => {
    setUsageStats(getUsageStats());
  }, []);

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

    // Check rate limit
    if (!canGenerate()) {
      toast.error(`You've reached your daily limit of 5 generations. Resets in ${usageStats.resetIn}`);
      return;
    }

    setIsGenerating(true);

    try {
      const options = {
        number: 4,
        ranking: 1
      };

      const generatedRecipes = await searchRecipesByIngredients(ingredients, options);

      setRecipes(generatedRecipes);

      // Increment usage and update stats
      const newUsage = incrementUsage();
      setUsageStats(getUsageStats());

      toast.success(`Found ${generatedRecipes.length} delicious recipes! (${newUsage.remaining} generations left today)`);
    } catch (error) {
      console.error('Recipe generation error:', error);
      toast.error('Failed to generate recipes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addIngredient(inputValue.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Navigation Component */}
      <Navigation />

      <div className="p-6 pt-20 max-w-[900px] mx-auto">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-20 w-40 h-40 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="relative inline-block mb-2">
            <img 
              src="/chefio.png" 
              alt="Chefio Logo" 
              className="w-48 h-48 mx-auto object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-text mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Chefio can help!
          </h1>
          <p className="text-base text-text-secondary leading-relaxed max-w-[400px] mx-auto mb-6">
            Transform your ingredients into delicious recipes with AI-powered suggestions
          </p>

          {/* Stats Bar */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FiZap className="text-primary" />
              </div>
              <span className="text-text-secondary">Instant Results</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <FiAward className="text-success" />
              </div>
              <span className="text-text-secondary">1000+ Recipes</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center">
                <FiHeart className="text-error" />
              </div>
              <span className="text-text-secondary">Free Forever</span>
            </div>
          </div>

          {/* Usage Stats for Visitors */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-sm">
            <FiAlertCircle className="text-amber-600" />
            <span className="text-amber-800 font-medium">
              {usageStats.remaining} of {usageStats.total} free generations remaining
            </span>
            {usageStats.remaining === 0 && (
              <span className="text-amber-600">• Resets in {usageStats.resetIn}</span>
            )}
          </div>
        </div>

        {/* Ingredients Section */}
        <Card variant="glass" className="mb-10 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text">Your Ingredients</h2>
                  <p className="text-xs text-text-tertiary">
                    {ingredients.length === 0 ? 'Add at least 2 ingredients' : `${ingredients.length} ingredient${ingredients.length > 1 ? 's' : ''} added`}
                  </p>
                </div>
              </div>
              {ingredients.length > 0 && (
                <button
                  onClick={() => setIngredients([])}
                  className="text-xs text-error hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Type an ingredient (e.g., Chicken, Rice)..."
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
              <div className="mb-6 p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-primary/10">
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient, index) => (
                    <span
                      key={ingredient}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm text-primary rounded-full text-sm font-medium animate-scale-in hover:shadow-md transition-all group"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <span className="text-base">{suggestedIngredients.find(s => s.name === ingredient)?.icon || '🥘'}</span>
                      {ingredient}
                      <button
                        onClick={() => removeIngredient(ingredient)}
                        className="w-5 h-5 flex items-center justify-center bg-primary/10 rounded-full hover:bg-error hover:text-white transition-all group-hover:scale-110"
                      >
                        <FiX className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Category Filter */}
            <div className="mb-6">
              <p className="text-sm font-medium text-text mb-3">Browse by category:</p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['All', 'Protein', 'Vegetable', 'Grain', 'Dairy'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-text-secondary hover:bg-primary/10 hover:text-primary'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="mb-6">
              <p className="text-sm font-medium text-text mb-3">Popular ingredients:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {suggestedIngredients
                  .filter(s => !ingredients.includes(s.name))
                  .filter(s => selectedCategory === 'All' || s.category === selectedCategory)
                  .slice(0, 9)
                  .map((suggestion) => (
                    <button
                      key={suggestion.name}
                      onClick={() => addIngredient(suggestion.name)}
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-text hover:border-primary hover:bg-primary/5 hover:scale-105 active:scale-95 transition-all group"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform">{suggestion.icon}</span>
                      <span className="font-medium">{suggestion.name}</span>
                      <FiPlus className="ml-auto text-text-tertiary group-hover:text-primary" />
                    </button>
                  ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="relative">
              {ingredients.length > 0 && ingredients.length < 2 && (
                <div className="absolute -top-8 left-0 right-0 text-center">
                  <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                    Add at least one more ingredient for better results
                  </span>
                </div>
              )}
              <Button
                fullWidth
                size="large"
                onClick={handleGenerate}
                loading={isGenerating}
                disabled={ingredients.length === 0 || !canGenerate()}
                icon={<FiZap />}
                className="bg-gradient-to-r from-primary to-secondary hover:shadow-xl"
              >
                {isGenerating
                  ? 'Generating Recipes...'
                  : !canGenerate()
                    ? `Daily Limit Reached - Resets in ${usageStats.resetIn}`
                    : `Generate Recipes (${usageStats.remaining} left today)`
                }
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        {recipes.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success/10 to-success/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text flex items-center gap-2">
                    Your Perfect Matches
                  </h2>
                  <p className="text-xs text-text-tertiary">
                    {recipes.length} recipe{recipes.length > 1 ? 's' : ''} found based on your ingredients
                  </p>
                </div>
              </div>
              <Badge variant="success" size="small" className="animate-pulse">
                <FiZap className="inline mr-1" />
                AI Generated
              </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe, index) => (
                <Card
                  key={recipe.id}
                  variant="glass"
                  padding="none"
                  hover
                  className="animate-fade-in-up group overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Recipe Image/Header */}
                  {recipe.image ? (
                    <div className="relative h-[140px] overflow-hidden">
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                      {/* Ingredient Match Badge */}
                      <div className="absolute top-3 right-3">
                        <div className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-success shadow-lg flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          {recipe.usedIngredientCount}/{recipe.usedIngredientCount + recipe.missedIngredientCount} ingredients
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-[140px] bg-gradient-to-br from-primary/10 via-secondary/10 to-amber-500/10 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <UtensilsCrossed className="w-16 h-16 text-primary/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
                    </div>
                  )}

                  {/* Recipe Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-text mb-2 group-hover:text-primary transition-colors">
                      {recipe.name}
                    </h3>
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                      {recipe.description}
                    </p>

                    {/* Tags - Show diets if available */}
                    {recipe.diets && recipe.diets.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {recipe.diets.slice(0, 2).map((diet) => (
                          <span
                            key={diet}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium capitalize"
                          >
                            {diet}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <FiClock className="w-4 h-4 mx-auto mb-1 text-text-tertiary" />
                        <div className="text-xs font-semibold text-text">{recipe.prepTime} min</div>
                      </div>
                      <div className="text-center border-x border-gray-200">
                        <FiUsers className="w-4 h-4 mx-auto mb-1 text-text-tertiary" />
                        <div className="text-xs font-semibold text-text">{recipe.servings} servings</div>
                      </div>
                      <div className="text-center">
                        <FiZap className="w-4 h-4 mx-auto mb-1 text-text-tertiary" />
                        <div className="text-xs font-semibold text-text">{recipe.nutrition?.calories || 0} cal</div>
                      </div>
                    </div>

                    <Badge variant="success" size="small" className="mb-4">
                      {recipe.difficulty}
                    </Badge>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 group-hover:border-primary group-hover:text-primary"
                        onClick={() => window.open(recipe.sourceUrl, '_blank')}
                      >
                        View Recipe
                      </Button>
                      <Link to="/register" className="flex-1">
                        <Button variant="primary" className="w-full" icon={<FiLock />}>
                          Save
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Loading State */}
        {isGenerating && (
          <Card variant="glass" className="text-center py-16 animate-fade-in">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center animate-spin-slow">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Cooking Up Something Special...</h3>
            <p className="text-base text-text-secondary max-w-[400px] mx-auto mb-6">
              Our AI chef is analyzing your ingredients and finding the perfect recipes
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </Card>
        )}

        {/* Empty state */}
        {recipes.length === 0 && !isGenerating && ingredients.length === 0 && (
          <Card variant="glass" className="text-center py-16 animate-fade-in">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
              <UtensilsCrossed className="relative w-20 h-20 mx-auto text-primary/40" />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Ready to Cook Something Amazing?</h3>
            <p className="text-base text-text-secondary max-w-[400px] mx-auto mb-6">
              Add your available ingredients above and let our AI suggest perfect recipes tailored just for you!
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-text-tertiary">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-success">✓</span>
                </div>
                <span>Personalized recipes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-success">✓</span>
                </div>
                <span>Nutrition info</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-success">✓</span>
                </div>
                <span>Step-by-step guide</span>
              </div>
            </div>
          </Card>
        )}

        {/* CTA to Sign Up */}
        {recipes.length > 0 && (
          <Card variant="default" className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-center gap-4">
              <User className="w-8 h-8 text-primary" />
              <div className="flex-1">
                <h3 className="text-base font-semibold text-text mb-1">Want to save your recipes?</h3>
                <p className="text-sm text-text-secondary mb-3">
                  Create a free account to save recipes, create meal plans, and more!
                </p>
                <Link to="/register">
                  <Button size="small" icon={<FiArrowRight />} iconPosition="right">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MenuGenerator;






