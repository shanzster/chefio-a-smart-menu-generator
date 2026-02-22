import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiUsers, FiZap, FiArrowRight, FiPlusCircle, FiBook, FiActivity, FiSearch, FiRefreshCw, FiExternalLink, FiBookmark } from 'react-icons/fi';
import { Hand, Lightbulb, Circle, Star } from 'lucide-react';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Layout from '../../../components/layout/Layout/Layout';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import { useAuthStore } from '../../../store/authStore';
import { getMealsByCategory, getMealDetails } from '../../../services/api/mealdbService';
import { saveRecipeToUser, getUserRecipes, getUserSavedRecipes } from '../../../services/firebase/recipeService';
import { getCookQRCodes } from '../../../services/firebase/qrCodeService';
import { toast } from '../../../store/toastStore';
import { getYouTubeVideoId, getYouTubeEmbedUrl } from '../../../utils/youtubeHelper';

const quickActions = [
  { icon: FiPlusCircle, label: 'Create Recipe', path: '/cook/menu-generator', color: 'bg-primary shadow-primary' },
  { icon: FiBook, label: 'My Recipes', path: '/cook/recipes', color: 'bg-secondary shadow-lg' },
  { icon: FiActivity, label: 'Nutrition', path: '/cook/nutrition', color: 'bg-success shadow-lg' },
];

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts'];

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    qrCodesShared: 0,
    recipesThisWeek: 0
  });
  
  // Cache to store recipes by category with localStorage persistence
  const [recipeCache, setRecipeCache] = useState(() => {
    try {
      const cached = localStorage.getItem('dashboard_recipe_cache');
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Cache expires after 24 hours
        const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;
        if (!isExpired) {
          return data;
        }
      }
    } catch (error) {
      console.error('Error loading cache:', error);
    }
    return {};
  });

  // Cache for recipe details with localStorage persistence
  const [detailsCache, setDetailsCache] = useState(() => {
    try {
      const cached = localStorage.getItem('dashboard_details_cache');
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Cache expires after 24 hours
        const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;
        if (!isExpired) {
          return data;
        }
      }
    } catch (error) {
      console.error('Error loading details cache:', error);
    }
    return {};
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const loadUserStats = async () => {
    if (!user) return;

    try {
      // Get created recipes (from recipes collection)
      const createdRecipes = await getUserRecipes(user.uid);
      
      // Get saved recipes (from user document)
      const savedRecipes = await getUserSavedRecipes();
      
      // Get all QR codes
      const qrCodes = await getCookQRCodes(user.uid);
      
      // Calculate recipes created this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const thisWeekRecipes = createdRecipes.filter(recipe => {
        if (!recipe.createdAt) return false;
        const createdDate = recipe.createdAt.toDate ? recipe.createdAt.toDate() : new Date(recipe.createdAt);
        return createdDate >= oneWeekAgo;
      });

      // Total recipes = created + saved
      const totalRecipes = createdRecipes.length + savedRecipes.length;

      setStats({
        totalRecipes: totalRecipes,
        totalQRCodes: qrCodes.length,
        thisWeekRecipes: thisWeekRecipes.length
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const fetchFeaturedRecipes = async (category = 'All', forceRefresh = false) => {
    // Check if we have cached recipes for this category
    if (!forceRefresh && recipeCache[category]) {
      setFeaturedRecipes(recipeCache[category]);
      return;
    }

    setIsLoadingRecipes(true);
    try {
      // Fetch 10 recipes for "All", 6 for specific categories
      const recipeCount = category === 'All' ? 10 : 6;
      const recipes = await getMealsByCategory(category, recipeCount);
      setFeaturedRecipes(recipes);
      
      // Cache the fetched recipes in state and localStorage
      const updatedCache = {
        ...recipeCache,
        [category]: recipes
      };
      setRecipeCache(updatedCache);
      
      // Persist to localStorage
      try {
        localStorage.setItem('dashboard_recipe_cache', JSON.stringify({
          data: updatedCache,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Error saving cache:', error);
      }
      
      if (forceRefresh) {
        toast.success('Recipes refreshed! 🍳');
      }
    } catch (error) {
      console.error('Error fetching featured recipes:', error);
      toast.error('Failed to load recipes. Please try again.');
      setFeaturedRecipes([]);
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  const handleRecipeClick = async (recipe) => {
    // Check if we have cached details for this recipe
    if (detailsCache[recipe.id]) {
      setSelectedRecipe(detailsCache[recipe.id]);
      return;
    }

    setIsLoadingDetails(true);
    try {
      const details = await getMealDetails(recipe.id);
      setSelectedRecipe(details);
      
      // Cache the recipe details
      const updatedCache = {
        ...detailsCache,
        [recipe.id]: details
      };
      setDetailsCache(updatedCache);
      
      // Persist to localStorage
      try {
        localStorage.setItem('dashboard_details_cache', JSON.stringify({
          data: updatedCache,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Error saving details cache:', error);
      }
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      toast.error('Failed to load recipe details');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };

  const handleSaveRecipe = async () => {
    if (!selectedRecipe || !user) return;
    
    try {
      await saveRecipeToUser(selectedRecipe);
      toast.success('Recipe saved to My Recipes! 📖');
    } catch (error) {
      console.error('Error saving recipe:', error);
      if (error.message === "Recipe already saved!") {
        toast.error('This recipe is already in your collection! 📖');
      } else {
        toast.error('Failed to save recipe. Please try again.');
      }
    }
  };

  // Load recipes on component mount (only if not cached)
  useEffect(() => {
    if (recipeCache[selectedCategory]) {
      setFeaturedRecipes(recipeCache[selectedCategory]);
    } else {
      fetchFeaturedRecipes(selectedCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // Load user stats on component mount
  useEffect(() => {
    loadUserStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        {/* Welcome Header with Stats */}
        <div className="mb-8 lg:mb-12">
          <div className="glass-enhanced rounded-3xl p-6 lg:p-8 shadow-xl border border-white/50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Greeting */}
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-lg">
                  <Hand className="w-8 h-8 lg:w-10 lg:h-10 text-primary animate-wave" />
                </div>
                <div>
                  <p className="text-sm lg:text-base text-text-secondary mb-1">{getGreeting()}</p>
                  <h1 className="text-2xl lg:text-4xl font-bold text-text">{user?.name || 'Student Chef'}</h1>
                  <p className="text-sm text-text-secondary mt-1">Ready to cook something amazing?</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 lg:gap-6">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">{stats.totalRecipes}</div>
                  <div className="text-xs text-text-secondary">Recipes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-secondary mb-1">{stats.qrCodesShared}</div>
                  <div className="text-xs text-text-secondary">Shared</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-success mb-1">{stats.recipesThisWeek}</div>
                  <div className="text-xs text-text-secondary">This Week</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 lg:mb-12">
          <div className="glass-enhanced rounded-2xl px-6 lg:px-8 py-4 lg:py-5 focus-within:bg-white/90 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 focus-within:scale-[1.01] transition-all duration-300 hover:shadow-xl border border-white/50">
            <div className="flex items-center gap-3 lg:gap-4">
              <FiSearch className="w-5 h-5 lg:w-6 lg:h-6 text-text-tertiary transition-transform hover:scale-110" />
              <input 
                type="text" 
                placeholder="Search recipes, ingredients, or nutrition info..." 
                className="flex-1 bg-transparent border-none outline-none text-base lg:text-lg text-text placeholder:text-text-tertiary"
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mb-8 lg:mb-12">
          <h2 className="text-lg lg:text-xl font-bold text-text mb-4 lg:mb-6">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-4 lg:gap-6">
            {quickActions.map((action, index) => (
              <Link 
                key={action.label} 
                to={action.path} 
                className={`group flex flex-col items-center justify-center gap-3 lg:gap-4 p-6 lg:p-8 rounded-2xl text-white no-underline active:scale-95 transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl ${action.color} animate-fade-in-up relative overflow-hidden`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <action.icon className="text-2xl lg:text-3xl transition-transform group-hover:scale-110 group-hover:rotate-3 relative z-10" />
                <span className="text-sm lg:text-base font-medium text-center relative z-10">{action.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8 lg:mb-12">
          <h2 className="text-lg lg:text-xl font-bold text-text mb-4 lg:mb-6">Browse by Category</h2>
          <div className="flex gap-2 lg:gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                className={`flex-shrink-0 px-6 lg:px-8 py-3 rounded-full text-sm lg:text-base font-medium border-2 transition-all duration-300 active:scale-95 hover:scale-105 shadow-sm ${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r from-primary to-primary-dark border-primary text-white shadow-lg shadow-primary/30' 
                    : 'bg-white/80 backdrop-blur-sm border-gray-200 text-text-secondary hover:border-primary hover:text-primary hover:bg-primary/5 hover:shadow-md'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Recipes */}
        <section className="mb-8 lg:mb-12">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-bold text-text">Featured Recipes</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchFeaturedRecipes(selectedCategory, true)}
                disabled={isLoadingRecipes}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm lg:text-base font-medium text-primary hover:bg-primary/10 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed border border-primary/20 hover:border-primary/40"
              >
                <FiRefreshCw className={`transition-transform ${isLoadingRecipes ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                Refresh
              </button>
              <Link to="/cook/browse-recipes" className="flex items-center gap-2 text-sm lg:text-base font-medium text-primary hover:gap-3 transition-all duration-300 group">
                See all <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="grid gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {isLoadingRecipes ? (
              // Loading skeleton
              Array.from({ length: selectedCategory === 'All' ? 10 : 6 }, (_, i) => i + 1).map((i) => (
                <Card 
                  key={i}
                  variant="glass" 
                  padding="none"
                  className="animate-pulse overflow-hidden border border-white/50 shadow-lg"
                >
                  <div className="relative h-[160px] lg:h-[200px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-xl" />
                  <div className="p-5 lg:p-6 bg-white/80 backdrop-blur-sm">
                    <div className="h-6 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4" />
                    <div className="flex gap-4">
                      <div className="h-4 bg-gray-200 rounded w-16" />
                      <div className="h-4 bg-gray-200 rounded w-16" />
                      <div className="h-4 bg-gray-200 rounded w-16" />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              featuredRecipes.map((recipe, index) => (
                <Card 
                  key={recipe.id} 
                  variant="glass" 
                  padding="none"
                  hover
                  className="animate-fade-in-up interactive-card overflow-hidden border border-white/50 shadow-lg hover:shadow-2xl cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleRecipeClick(recipe)}
                >
                  <div className="relative h-[160px] lg:h-[200px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-t-xl overflow-hidden group">
                    {recipe.image ? (
                      <img 
                        src={recipe.image} 
                        alt={recipe.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Star className="w-20 h-20 lg:w-24 lg:h-24 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
                      </div>
                    )}
                    <Badge variant="glass" className="absolute top-3 right-3 lg:top-4 lg:right-4 transition-all hover:scale-105 shadow-md">{recipe.difficulty}</Badge>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5 lg:p-6 bg-white/80 backdrop-blur-sm">
                    <h3 className="text-lg lg:text-xl font-semibold text-text mb-2">{recipe.name}</h3>
                    <p className="text-sm lg:text-base text-text-secondary mb-4 lg:mb-6 line-clamp-2">{recipe.description}</p>
                    <div className="flex gap-4 lg:gap-6">
                      <span className="flex items-center gap-1.5 text-xs lg:text-sm text-text-tertiary transition-colors hover:text-primary">
                        <FiClock /> {recipe.prepTime} mins
                      </span>
                      <span className="flex items-center gap-1.5 text-xs lg:text-sm text-text-tertiary transition-colors hover:text-primary">
                        <FiUsers /> {recipe.servings}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Tip Card */}
        <section>
          <Card variant="default" className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200/50 animate-fade-in-up animation-delay-400 hover-lift overflow-hidden shadow-lg hover:shadow-xl">
            <div className="flex gap-4 lg:gap-6 p-5 lg:p-6">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center flex-shrink-0 shadow-md">
                <Lightbulb className="w-7 h-7 lg:w-8 lg:h-8 text-amber-700 animate-bounce" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg lg:text-xl font-semibold text-text mb-2 flex items-center gap-2">
                  Chef's Tip of the Day
                  <Star className="w-5 h-5 text-amber-600 fill-amber-600" />
                </h3>
                <p className="text-sm lg:text-base text-text-secondary leading-relaxed">
                  Salt your pasta water until it tastes like the sea - about 1 tablespoon per liter! This is the only chance to season the pasta itself, making a huge difference in the final dish.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <Modal isOpen={!!selectedRecipe} onClose={closeModal} title={selectedRecipe.name}>
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
                        <span>{ingredient.original || ingredient.name}</span>
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

        {/* Loading Modal */}
        {isLoadingDetails && (
          <Modal isOpen={isLoadingDetails} onClose={() => {}} title="Loading Recipe...">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
              <p className="text-text-secondary">Fetching recipe details...</p>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
