import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiPlus, FiClock, FiUsers, FiHeart, FiTrash2, FiEdit, FiX, FiExternalLink, FiBookmark } from 'react-icons/fi';
import { Circle, Leaf, Star } from 'lucide-react';
import Button from '../../../components/common/Button/Button';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Layout from '../../../components/layout/Layout/Layout';
import Modal from '../../../components/common/Modal/Modal';
import CreateRecipeForm from '../../../components/forms/CreateRecipeForm';
import { useAuthStore } from '../../../store/authStore';
import { getUserRecipes, getUserSavedRecipes, deleteRecipe, removeSavedRecipe, createRecipe } from '../../../services/firebase/recipeService';
import { toast } from '../../../store/toastStore';
import { getYouTubeVideoId, getYouTubeEmbedUrl } from '../../../utils/youtubeHelper';

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts'];

const Recipes = () => {
  const user = useAuthStore((state) => state.user);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedPrepTime, setSelectedPrepTime] = useState(null);

  const fetchRecipes = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Fetch both types of recipes
      const [userRecipes, savedRecipes] = await Promise.all([
        getUserRecipes(),
        getUserSavedRecipes()
      ]);
      
      // Mark recipes with their source for proper deletion
      const recipesWithSource = userRecipes.map(r => ({ ...r, source: 'recipes' }));
      const savedWithSource = savedRecipes.map(r => ({ ...r, source: 'saved' }));
      
      // Merge both arrays
      const allRecipes = [...recipesWithSource, ...savedWithSource];
      
      setRecipes(allRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error('Failed to load recipes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipe) => {
    if (!user) return;
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    
    try {
      // Delete from the correct location based on source
      if (recipe.source === 'recipes') {
        await deleteRecipe(recipe.id);
      } else {
        await removeSavedRecipe(recipe.id);
      }
      
      setRecipes(recipes.filter(r => r.id !== recipe.id));
      toast.success('Recipe deleted! 🗑️');
      setSelectedRecipe(null);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  const handleCreateRecipe = async (recipeData) => {
    if (!user) return;
    setIsCreating(true);
    
    try {
      await createRecipe(recipeData);
      await fetchRecipes(); // Refresh the list
      setShowCreateModal(false);
      toast.success('Recipe created successfully! 🎉');
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error('Failed to create recipe. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [user]);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    const matchesSearch = (
      (recipe.name || recipe.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (recipe.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Difficulty filter
    const matchesDifficulty = !selectedDifficulty || 
      (recipe.difficulty || '').toLowerCase() === selectedDifficulty.toLowerCase();
    
    // Prep time filter
    let matchesPrepTime = true;
    if (selectedPrepTime) {
      const prepTime = recipe.prepTime || recipe.cookTime || 30;
      if (selectedPrepTime === '< 15 min') {
        matchesPrepTime = prepTime < 15;
      } else if (selectedPrepTime === '15-30 min') {
        matchesPrepTime = prepTime >= 15 && prepTime <= 30;
      } else if (selectedPrepTime === '30-60 min') {
        matchesPrepTime = prepTime > 30 && prepTime <= 60;
      } else if (selectedPrepTime === '> 60 min') {
        matchesPrepTime = prepTime > 60;
      }
    }
    
    return matchesCategory && matchesSearch && matchesDifficulty && matchesPrepTime;
  });

  return (
    <Layout>
      <div className="p-6 lg:p-12 lg:py-16 max-w-[1400px] mx-auto">
        {/* Header */}
        <header className="mb-8 lg:mb-12">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold text-text mb-2">My Recipes</h1>
            <p className="text-sm lg:text-base text-text-secondary">Manage and organize your culinary creations</p>
          </div>
        </header>

        {/* Search */}
        <div className="flex gap-3 lg:gap-4 mb-8 lg:mb-10">
          <div className="flex-1 max-w-[calc(100%-120px)] lg:max-w-none flex items-center gap-3 glass-enhanced rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 focus-within:bg-white/90 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 focus-within:scale-[1.01] transition-all duration-300 hover:shadow-lg">
            <FiSearch className="text-text-tertiary text-xl lg:text-2xl flex-shrink-0" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-base lg:text-lg text-text placeholder:text-text-tertiary"
            />
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-12 h-12 lg:w-14 lg:h-14 flex-shrink-0 flex items-center justify-center rounded-full text-white bg-[#FF6B35] hover:bg-[#FF5722] hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
            aria-label="Add Recipe"
          >
            <FiPlus className="text-xl lg:text-2xl" />
          </button>
          <button 
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="w-12 h-12 lg:w-14 lg:h-14 flex-shrink-0 flex items-center justify-center rounded-full text-white bg-[#FF6B35] hover:bg-[#FF5722] hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
            aria-label="Toggle Filters"
          >
            <FiFilter className="text-xl lg:text-2xl" />
          </button>
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="glass-enhanced rounded-xl lg:rounded-2xl p-4 lg:p-6 mb-6 lg:mb-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">Filters</h3>
              <div className="flex items-center gap-2">
                {(selectedDifficulty || selectedPrepTime) && (
                  <button
                    onClick={() => {
                      setSelectedDifficulty(null);
                      setSelectedPrepTime(null);
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowFilterPanel(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FiX className="text-text-secondary" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">Difficulty</label>
                <div className="flex gap-2 flex-wrap">
                  {['Easy', 'Medium', 'Hard'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedDifficulty === diff
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 text-text-secondary hover:border-primary hover:text-primary'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">Prep Time</label>
                <div className="flex gap-2 flex-wrap">
                  {['< 15 min', '15-30 min', '30-60 min', '> 60 min'].map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedPrepTime(selectedPrepTime === time ? null : time)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedPrepTime === time
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 text-text-secondary hover:border-primary hover:text-primary'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="flex gap-2 lg:gap-3 overflow-x-auto pb-2 mb-6 lg:mb-8 scrollbar-hide lg:justify-center">
          {categories.map((category) => (
            <button
              key={category}
              className={`flex-shrink-0 px-6 lg:px-8 py-2.5 lg:py-3 rounded-full text-sm lg:text-base font-medium border-2 transition-all duration-300 active:scale-95 hover:scale-105 ${
                selectedCategory === category 
                  ? 'bg-primary border-primary text-white shadow-primary' 
                  : 'bg-white border-gray-200 text-text-secondary hover:border-primary hover:text-primary hover:bg-primary/5'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Recipe count */}
        <p className="text-sm text-text-tertiary mb-4">
          {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
        </p>

        {/* Recipe Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} variant="glass" padding="none" className="animate-pulse">
                <div className="h-[100px] md:h-[120px] bg-gray-200 rounded-t-xl" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {filteredRecipes.map((recipe, index) => (
              <Card 
                key={recipe.id}
                variant="glass"
                padding="none"
                hover
                className="animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="relative h-[100px] md:h-[120px] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center rounded-t-xl overflow-hidden">
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
                  ) : (
                    <Star className="w-12 h-12 md:w-14 md:h-14 text-primary" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-text mb-1 line-clamp-1">{recipe.name || recipe.title}</h3>
                  <div className="flex gap-4 text-xs text-text-tertiary mb-2">
                    <span className="flex items-center gap-1"><FiClock /> {recipe.prepTime || recipe.cookTime || 30} mins</span>
                    <span className="flex items-center gap-1"><FiUsers /> {recipe.servings || 4}</span>
                  </div>
                  <Badge variant="default" size="small">{recipe.difficulty || recipe.category || 'Easy'}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredRecipes.length === 0 && (
          <div className="text-center py-16">
            <FiSearch className="w-16 h-16 mx-auto mb-4 opacity-50 text-text-tertiary" />
            <h3 className="text-lg font-semibold text-text mb-2">No recipes found</h3>
            <p className="text-base text-text-tertiary">
              {searchQuery || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filters' 
                : 'Start by adding your first recipe or save recipes from Browse Recipes!'}
            </p>
          </div>
        )}

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <Modal isOpen={!!selectedRecipe} onClose={() => setSelectedRecipe(null)} title={selectedRecipe.name}>
            <div className="space-y-6 p-4 md:p-6">
              {/* Recipe Image */}
              {selectedRecipe.image && (
                <div className="relative w-full h-64 rounded-xl overflow-hidden">
                  <img 
                    src={selectedRecipe.image} 
                    alt={selectedRecipe.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Recipe Info */}
              <div className="flex flex-wrap gap-4">
                <Badge variant="primary">{selectedRecipe.difficulty}</Badge>
                <span className="flex items-center gap-2 text-text-secondary">
                  <FiClock className="text-primary" />
                  {selectedRecipe.prepTime} mins
                </span>
                <span className="flex items-center gap-2 text-text-secondary">
                  <FiUsers className="text-primary" />
                  {selectedRecipe.servings} servings
                </span>
              </div>

              {/* Description */}
              {selectedRecipe.description && (
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">Description</h3>
                  <p className="text-text-secondary leading-relaxed">{selectedRecipe.description}</p>
                </div>
              )}

              {/* Nutrition */}
              {selectedRecipe.nutrition && (
                <div>
                  <h3 className="text-lg font-semibold text-text mb-3">Nutrition (per serving)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-primary/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-primary">{selectedRecipe.nutrition.calories}</div>
                      <div className="text-xs text-text-secondary">Calories</div>
                    </div>
                    <div className="bg-success/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-success">{selectedRecipe.nutrition.protein}g</div>
                      <div className="text-xs text-text-secondary">Protein</div>
                    </div>
                    <div className="bg-warning/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-warning">{selectedRecipe.nutrition.carbs}g</div>
                      <div className="text-xs text-text-secondary">Carbs</div>
                    </div>
                    <div className="bg-error/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-error">{selectedRecipe.nutrition.fat}g</div>
                      <div className="text-xs text-text-secondary">Fat</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Ingredients */}
              {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-text mb-3">Ingredients</h3>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-2 text-text-secondary">
                        <span className="text-primary mt-1">•</span>
                        <span>{ingredient.original || ingredient.name || ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructions */}
              {selectedRecipe.instructions && selectedRecipe.instructions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-text mb-3">Instructions</h3>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-text-secondary flex-1">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* YouTube Tutorial */}
              {(() => {
                const videoId = getYouTubeVideoId(selectedRecipe.videoUrl);
                const embedUrl = getYouTubeEmbedUrl(videoId);
                
                return (
                  <div>
                    <h3 className="text-lg font-semibold text-text mb-3">Video Tutorial</h3>
                    {embedUrl ? (
                      <div className="relative w-full rounded-xl overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={embedUrl}
                          title="YouTube video tutorial"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div className="bg-gray-100 rounded-xl p-8 text-center">
                        <div className="text-4xl mb-2">📹</div>
                        <p className="text-text-secondary">No video tutorial available for this recipe</p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="error" 
                  icon={<FiTrash2 />}
                  onClick={() => handleDeleteRecipe(selectedRecipe)}
                >
                  Delete
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

        {/* Create Recipe Modal - Full Form */}
        {showCreateModal && (
          <Modal isOpen={showCreateModal} onClose={() => !isCreating && setShowCreateModal(false)} title="Create New Recipe">
            <div className="max-h-[70vh] overflow-y-auto p-4 md:p-6">
              <CreateRecipeForm
                onSubmit={handleCreateRecipe}
                onCancel={() => setShowCreateModal(false)}
                isLoading={isCreating}
              />
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default Recipes;
