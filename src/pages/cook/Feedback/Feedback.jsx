import React, { useState } from 'react';
import { FiMessageSquare, FiStar, FiThumbsUp, FiThumbsDown, FiFilter, FiTrendingUp } from 'react-icons/fi';
import { MessageCircle, Heart } from 'lucide-react';
import Layout from '../../../components/layout/Layout/Layout';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';

const Feedback = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Mock feedback data
  const sharedRecipes = [
    {
      id: 1,
      name: 'Chicken Adobo',
      sharedDate: '2026-02-01',
      views: 245,
      saves: 89,
      avgRating: 4.8,
      totalFeedback: 34,
      feedbacks: [
        {
          id: 1,
          user: 'Maria Santos',
          rating: 5,
          comment: 'Amazing recipe! My family loved it. The flavors were perfect.',
          date: '2026-02-03',
          helpful: 12,
        },
        {
          id: 2,
          user: 'Juan Dela Cruz',
          rating: 5,
          comment: 'Best adobo recipe I\'ve tried. Very authentic taste!',
          date: '2026-02-02',
          helpful: 8,
        },
        {
          id: 3,
          user: 'Ana Reyes',
          rating: 4,
          comment: 'Great recipe! I added a bit more vinegar for extra tang.',
          date: '2026-02-02',
          helpful: 5,
        },
      ]
    },
    {
      id: 2,
      name: 'Pasta Carbonara',
      sharedDate: '2026-01-28',
      views: 189,
      saves: 67,
      avgRating: 4.6,
      totalFeedback: 28,
      feedbacks: [
        {
          id: 4,
          user: 'Carlo Mendoza',
          rating: 5,
          comment: 'Creamy and delicious! Restaurant quality.',
          date: '2026-01-30',
          helpful: 15,
        },
        {
          id: 5,
          user: 'Lisa Garcia',
          rating: 4,
          comment: 'Very good! I used turkey bacon and it still turned out great.',
          date: '2026-01-29',
          helpful: 7,
        },
      ]
    },
    {
      id: 3,
      name: 'Vegetable Stir Fry',
      sharedDate: '2026-01-25',
      views: 156,
      saves: 45,
      avgRating: 4.3,
      totalFeedback: 19,
      feedbacks: [
        {
          id: 6,
          user: 'Pedro Ramos',
          rating: 4,
          comment: 'Healthy and tasty! Perfect for weeknight dinners.',
          date: '2026-01-27',
          helpful: 6,
        },
        {
          id: 7,
          user: 'Sofia Cruz',
          rating: 5,
          comment: 'Love this recipe! So easy and quick to make.',
          date: '2026-01-26',
          helpful: 4,
        },
      ]
    },
  ];

  const filters = [
    { id: 'all', label: 'All Recipes', count: sharedRecipes.length },
    { id: 'highest', label: 'Highest Rated', count: sharedRecipes.filter(r => r.avgRating >= 4.5).length },
    { id: 'most-viewed', label: 'Most Viewed', count: sharedRecipes.length },
    { id: 'recent', label: 'Recent', count: sharedRecipes.length },
  ];

  const filteredRecipes = sharedRecipes.filter(recipe => {
    if (selectedFilter === 'highest') return recipe.avgRating >= 4.5;
    return true;
  }).sort((a, b) => {
    if (selectedFilter === 'most-viewed') return b.views - a.views;
    if (selectedFilter === 'recent') return new Date(b.sharedDate) - new Date(a.sharedDate);
    return 0;
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text">Feedback</h1>
              <p className="text-base text-text-secondary">View feedback on your shared recipes</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card variant="glass" className="border border-white/50">
            <div className="p-4">
              <div className="text-2xl font-bold text-primary mb-1">
                {sharedRecipes.reduce((sum, r) => sum + r.views, 0)}
              </div>
              <div className="text-sm text-text-secondary">Total Views</div>
            </div>
          </Card>
          <Card variant="glass" className="border border-white/50">
            <div className="p-4">
              <div className="text-2xl font-bold text-secondary mb-1">
                {sharedRecipes.reduce((sum, r) => sum + r.saves, 0)}
              </div>
              <div className="text-sm text-text-secondary">Total Saves</div>
            </div>
          </Card>
          <Card variant="glass" className="border border-white/50">
            <div className="p-4">
              <div className="text-2xl font-bold text-success mb-1">
                {(sharedRecipes.reduce((sum, r) => sum + r.avgRating, 0) / sharedRecipes.length).toFixed(1)}
              </div>
              <div className="text-sm text-text-secondary">Avg Rating</div>
            </div>
          </Card>
          <Card variant="glass" className="border border-white/50">
            <div className="p-4">
              <div className="text-2xl font-bold text-warning mb-1">
                {sharedRecipes.reduce((sum, r) => sum + r.totalFeedback, 0)}
              </div>
              <div className="text-sm text-text-secondary">Total Feedback</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <FiFilter className="w-5 h-5 text-text-tertiary flex-shrink-0" />
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white/80 text-text-secondary hover:bg-white border border-gray-200'
                }`}
              >
                {filter.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedFilter === filter.id ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recipe List */}
        <div className="space-y-6">
          {filteredRecipes.map((recipe) => (
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
                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <span>Shared on {new Date(recipe.sharedDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{recipe.views} views</span>
                      <span>•</span>
                      <span>{recipe.saves} saves</span>
                    </div>
                  </div>
                  <Badge variant="success" size="large">
                    <div className="flex items-center gap-1">
                      <FiStar className="w-4 h-4 fill-current" />
                      {recipe.avgRating}
                    </div>
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <FiMessageSquare className="w-4 h-4" />
                      <span className="text-lg font-bold">{recipe.totalFeedback}</span>
                    </div>
                    <div className="text-xs text-blue-800">Feedback</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                      <FiTrendingUp className="w-4 h-4" />
                      <span className="text-lg font-bold">{recipe.views}</span>
                    </div>
                    <div className="text-xs text-green-800">Views</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <Heart className="w-4 h-4" />
                      <span className="text-lg font-bold">{recipe.saves}</span>
                    </div>
                    <div className="text-xs text-purple-800">Saves</div>
                  </div>
                </div>

                {/* Recent Feedback Preview */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-text">Recent Feedback</h4>
                  {recipe.feedbacks.slice(0, 2).map((feedback) => (
                    <div key={feedback.id} className="p-3 bg-white/50 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-text text-sm">{feedback.user}</div>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(feedback.rating)}
                          </div>
                        </div>
                        <span className="text-xs text-text-tertiary">
                          {new Date(feedback.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary">{feedback.comment}</p>
                    </div>
                  ))}
                  {recipe.feedbacks.length > 2 && (
                    <button className="text-sm font-medium text-primary hover:underline">
                      View all {recipe.totalFeedback} feedback →
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Detailed Feedback Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedRecipe(null)} />
            
            <Card variant="glass" className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/50">
              <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-text mb-2">{selectedRecipe.name}</h2>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {renderStars(Math.round(selectedRecipe.avgRating))}
                      </div>
                      <span className="text-lg font-bold text-primary">{selectedRecipe.avgRating}</span>
                      <span className="text-sm text-text-secondary">({selectedRecipe.totalFeedback} reviews)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* All Feedback */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text">All Feedback</h3>
                  {selectedRecipe.feedbacks.map((feedback) => (
                    <div key={feedback.id} className="p-4 bg-white/50 rounded-xl border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-text mb-1">{feedback.user}</div>
                          <div className="flex items-center gap-1">
                            {renderStars(feedback.rating)}
                          </div>
                        </div>
                        <span className="text-sm text-text-tertiary">
                          {new Date(feedback.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-text-secondary mb-3">{feedback.comment}</p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors">
                          <FiThumbsUp className="w-4 h-4" />
                          Helpful ({feedback.helpful})
                        </button>
                        <button className="flex items-center gap-2 text-sm text-text-secondary hover:text-error transition-colors">
                          <FiThumbsDown className="w-4 h-4" />
                          Not Helpful
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Feedback;
