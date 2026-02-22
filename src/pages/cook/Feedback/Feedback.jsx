import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiStar, FiTrendingUp, FiFilter } from 'react-icons/fi';
import { MessageCircle, Heart, Eye } from 'lucide-react';
import Layout from '../../../components/layout/Layout/Layout';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import { useAuthStore } from '../../../store/authStore';
import { getCookQRCodes, getQRFeedback } from '../../../services/firebase/qrCodeService';
import { toast } from '../../../store/toastStore';

const Feedback = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const loadQRCodes = async () => {
      if (!user) return;

      try {
        const codes = await getCookQRCodes(user.uid);
        
        // Load feedback count for each QR code
        const codesWithFeedback = await Promise.all(
          codes.map(async (code) => {
            try {
              const feedback = await getQRFeedback(code.id);
              const avgRating = feedback.length > 0
                ? feedback.reduce((sum, f) => sum + (f.ratings?.overall || 0), 0) / feedback.length
                : 0;
              
              return {
                ...code,
                feedbackList: feedback,
                totalFeedback: feedback.length,
                avgRating: avgRating.toFixed(1)
              };
            } catch (error) {
              console.error(`Error loading feedback for ${code.id}:`, error);
              return {
                ...code,
                feedbackList: [],
                totalFeedback: 0,
                avgRating: 0
              };
            }
          })
        );

        setQrCodes(codesWithFeedback);
      } catch (error) {
        console.error('Error loading QR codes:', error);
        toast.error('Failed to load feedback data');
      } finally {
        setLoading(false);
      }
    };

    loadQRCodes();
  }, [user]);

  const filters = [
    { id: 'all', label: 'All Recipes', count: qrCodes.length },
    { id: 'highest', label: 'Highest Rated', count: qrCodes.filter(r => r.avgRating >= 4.5).length },
    { id: 'most-feedback', label: 'Most Feedback', count: qrCodes.length },
    { id: 'recent', label: 'Recent', count: qrCodes.length },
  ];

  const filteredRecipes = qrCodes.filter(recipe => {
    if (selectedFilter === 'highest') return recipe.avgRating >= 4.5;
    return true;
  }).sort((a, b) => {
    if (selectedFilter === 'most-feedback') return b.totalFeedback - a.totalFeedback;
    if (selectedFilter === 'recent') return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
    return 0;
  });

  const totalViews = qrCodes.reduce((sum, r) => sum + (r.scans || 0), 0);
  const totalFeedback = qrCodes.reduce((sum, r) => sum + r.totalFeedback, 0);
  const avgRating = qrCodes.length > 0
    ? (qrCodes.reduce((sum, r) => sum + parseFloat(r.avgRating), 0) / qrCodes.length).toFixed(1)
    : 0;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const handleRecipeClick = (recipe) => {
    // Navigate to feedback dashboard with the recipe selected
    navigate(`/cook/feedback-dashboard?recipe=${recipe.id}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading feedback...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (qrCodes.length === 0) {
    return (
      <Layout>
        <div className="p-6 lg:p-12 max-w-[1200px] mx-auto">
          <Card variant="glass" className="p-12 text-center">
            <MessageCircle className="w-16 h-16 text-text-tertiary mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-text mb-2">No Feedback Yet</h2>
            <p className="text-text-secondary mb-6">
              Generate QR codes for your recipes to start receiving feedback from guests.
            </p>
            <a
              href="/cook/qr-generator"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Generate QR Code
            </a>
          </Card>
        </div>
      </Layout>
    );
  }

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
              <div className="text-2xl font-bold text-primary mb-1">{totalViews}</div>
              <div className="text-sm text-text-secondary">Total Scans</div>
            </div>
          </Card>
          <Card variant="glass" className="border border-white/50">
            <div className="p-4">
              <div className="text-2xl font-bold text-secondary mb-1">{qrCodes.length}</div>
              <div className="text-sm text-text-secondary">QR Codes</div>
            </div>
          </Card>
          <Card variant="glass" className="border border-white/50">
            <div className="p-4">
              <div className="text-2xl font-bold text-success mb-1">{avgRating}</div>
              <div className="text-sm text-text-secondary">Avg Rating</div>
            </div>
          </Card>
          <Card variant="glass" className="border border-white/50">
            <div className="p-4">
              <div className="text-2xl font-bold text-warning mb-1">{totalFeedback}</div>
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
            <div
              key={recipe.id}
              onClick={() => handleRecipeClick(recipe)}
              className="cursor-pointer"
            >
              <Card
                variant="glass"
                hover
                className="border border-white/50 transition-all hover:shadow-lg"
              >
                <div className="p-6">
                {/* Recipe Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {recipe.recipeImage && (
                      <img
                        src={recipe.recipeImage}
                        alt={recipe.recipeName}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text mb-2">{recipe.recipeName || recipe.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <span>Created {recipe.createdAt ? new Date(recipe.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                        <span>•</span>
                        <span>{recipe.scans || 0} scans</span>
                      </div>
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
                      <Eye className="w-4 h-4" />
                      <span className="text-lg font-bold">{recipe.scans || 0}</span>
                    </div>
                    <div className="text-xs text-green-800">Scans</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <FiTrendingUp className="w-4 h-4" />
                      <span className="text-lg font-bold">{recipe.avgRating}</span>
                    </div>
                    <div className="text-xs text-purple-800">Rating</div>
                  </div>
                </div>

                {/* Recent Feedback Preview */}
                {recipe.feedbackList && recipe.feedbackList.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-text">Recent Feedback</h4>
                    {recipe.feedbackList.slice(0, 2).map((feedback) => (
                      <div key={feedback.id} className="p-3 bg-white/50 rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium text-text text-sm">{feedback.guestName || 'Anonymous'}</div>
                            <div className="flex items-center gap-1 mt-1">
                              {renderStars(feedback.ratings?.overall || 0)}
                            </div>
                          </div>
                          <span className="text-xs text-text-tertiary">
                            {feedback.createdAt ? new Date(feedback.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        {feedback.feedback && (
                          <p className="text-sm text-text-secondary line-clamp-2">"{feedback.feedback}"</p>
                        )}
                      </div>
                    ))}
                    {recipe.totalFeedback > 2 && (
                      <div className="text-sm font-medium text-primary">
                        View all {recipe.totalFeedback} feedback →
                      </div>
                    )}
                  </div>
                )}

                {recipe.totalFeedback === 0 && (
                  <div className="text-center py-4 text-text-tertiary text-sm">
                    No feedback yet. Share your QR code to get started!
                  </div>
                )}
              </div>
            </Card>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
