import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiStar, FiUser, FiCalendar, FiMessageSquare, FiFilter } from 'react-icons/fi';
import { MessageSquare, TrendingUp, Award } from 'lucide-react';
import Card from '../../../components/common/Card/Card';
import Layout from '../../../components/layout/Layout/Layout';
import { useAuthStore } from '../../../store/authStore';
import { getCookQRCodes, getQRFeedback } from '../../../services/firebase/qrCodeService';
import { toast } from '../../../store/toastStore';

const FeedbackDashboard = () => {
  const [searchParams] = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const [qrCodes, setQrCodes] = useState([]);
  const [groupedRecipes, setGroupedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedQR, setSelectedQR] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [viewMode, setViewMode] = useState('recipes'); // 'recipes' or 'qrcodes'

  useEffect(() => {
    const loadQRCodes = async () => {
      if (!user) return;

      try {
        const codes = await getCookQRCodes(user.uid);
        setQrCodes(codes);
        
        // Group QR codes by recipe name
        const grouped = codes.reduce((acc, qr) => {
          const recipeName = qr.recipeName || 'Untitled Recipe';
          if (!acc[recipeName]) {
            acc[recipeName] = {
              recipeName,
              recipeImage: qr.recipeImage,
              qrCodes: [],
              totalFeedback: 0,
              totalScans: 0
            };
          }
          acc[recipeName].qrCodes.push(qr);
          acc[recipeName].totalFeedback += qr.feedbackCount || 0;
          acc[recipeName].totalScans += qr.scans || 0;
          return acc;
        }, {});
        
        setGroupedRecipes(Object.values(grouped));
        
        // Check if there's a recipe ID in URL params
        const recipeId = searchParams.get('recipe');
        if (recipeId) {
          const targetQR = codes.find(c => c.id === recipeId);
          if (targetQR) {
            const recipeGroup = grouped[targetQR.recipeName];
            setSelectedRecipe(recipeGroup);
            setViewMode('qrcodes');
            setSelectedQR(targetQR);
            loadFeedback(targetQR.id);
          }
        }
      } catch (error) {
        console.error('Error loading QR codes:', error);
        toast.error('Failed to load QR codes');
      } finally {
        setLoading(false);
      }
    };

    loadQRCodes();
  }, [user, searchParams]);

  const loadFeedback = async (qrId) => {
    setLoadingFeedback(true);
    try {
      const feedbackData = await getQRFeedback(qrId);
      setFeedback(feedbackData);
      setFilteredFeedback(feedbackData);
    } catch (error) {
      console.error('Error loading feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setLoadingFeedback(false);
    }
  };

  // Apply filters whenever feedback or filters change
  useEffect(() => {
    let filtered = [...feedback];

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(f => {
        if (!f.createdAt) return false;
        const feedbackDate = f.createdAt.toDate ? f.createdAt.toDate() : new Date(f.createdAt);
        const daysDiff = (now - feedbackDate) / (1000 * 60 * 60 * 24);
        
        if (dateFilter === 'today') return daysDiff < 1;
        if (dateFilter === 'week') return daysDiff < 7;
        if (dateFilter === 'month') return daysDiff < 30;
        return true;
      });
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      const minRating = parseInt(ratingFilter);
      filtered = filtered.filter(f => (f.ratings?.overall || 0) >= minRating);
    }

    setFilteredFeedback(filtered);
  }, [feedback, dateFilter, ratingFilter]);

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setViewMode('qrcodes');
    setSelectedQR(null);
    setFeedback([]);
    setFilteredFeedback([]);
  };

  const handleBackToRecipes = () => {
    setViewMode('recipes');
    setSelectedRecipe(null);
    setSelectedQR(null);
    setFeedback([]);
    setFilteredFeedback([]);
  };

  const handleSelectQR = (qr) => {
    setSelectedQR(qr);
    loadFeedback(qr.id);
  };

  const calculateAverageRating = () => {
    if (filteredFeedback.length === 0) return 0;
    const sum = filteredFeedback.reduce((acc, f) => acc + (f.ratings?.overall || 0), 0);
    return (sum / filteredFeedback.length).toFixed(1);
  };

  const calculateCategoryAverages = () => {
    if (filteredFeedback.length === 0) return {};
    
    const categories = ['taste', 'presentation', 'creativity', 'portionSize'];
    const averages = {};
    
    categories.forEach(category => {
      const ratings = filteredFeedback.filter(f => f.ratings?.[category] > 0);
      if (ratings.length > 0) {
        const sum = ratings.reduce((acc, f) => acc + f.ratings[category], 0);
        averages[category] = (sum / ratings.length).toFixed(1);
      }
    });
    
    return averages;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  if (qrCodes.length === 0) {
    return (
      <Layout>
        <div className="p-6 lg:p-12 max-w-[1200px] mx-auto">
          <Card variant="glass" className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-text-tertiary mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-text mb-2">No QR Codes Yet</h2>
            <p className="text-text-secondary mb-6">
              Generate QR codes for your recipes to start receiving feedback
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

  const averageRating = calculateAverageRating();
  const categoryAverages = calculateCategoryAverages();

  return (
    <Layout>
      <div className="p-6 lg:p-12 max-w-[1400px] mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Feedback Dashboard</h1>
          <p className="text-text-secondary">View and analyze feedback from your guests</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Recipe Groups or QR Codes List */}
          <div className="lg:col-span-1">
            <Card variant="glass" className="p-4">
              {viewMode === 'recipes' ? (
                <>
                  <h2 className="text-lg font-semibold text-text mb-4">Your Dishes</h2>
                  <div className="space-y-2">
                    {groupedRecipes.map((recipe, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectRecipe(recipe)}
                        className="w-full text-left p-4 rounded-lg transition-all bg-white border-2 border-gray-200 hover:border-primary hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          {recipe.recipeImage && (
                            <img
                              src={recipe.recipeImage}
                              alt={recipe.recipeName}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-text truncate">{recipe.recipeName}</h3>
                            <div className="flex items-center gap-3 text-xs text-text-tertiary mt-1">
                              <span className="flex items-center gap-1">
                                <FiStar className="w-3 h-3" />
                                {recipe.totalFeedback} reviews
                              </span>
                              <span>{recipe.qrCodes.length} QR codes</span>
                            </div>
                            <div className="text-xs text-text-tertiary mt-1">
                              {recipe.totalScans} total scans
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={handleBackToRecipes}
                      className="text-primary hover:text-primary-dark transition-colors"
                    >
                      ← Back
                    </button>
                  </div>
                  <h2 className="text-lg font-semibold text-text mb-2">{selectedRecipe?.recipeName}</h2>
                  <p className="text-sm text-text-secondary mb-4">Select a QR code to view feedback</p>
                  <div className="space-y-2">
                    {selectedRecipe?.qrCodes.map((qr, index) => (
                      <button
                        key={qr.id}
                        onClick={() => handleSelectQR(qr)}
                        className={`w-full text-left p-4 rounded-lg transition-all ${
                          selectedQR?.id === qr.id
                            ? 'bg-primary/10 border-2 border-primary'
                            : 'bg-white border-2 border-gray-200 hover:border-primary'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {qr.recipeImage && (
                            <img
                              src={qr.recipeImage}
                              alt={qr.recipeName}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-text">QR Code #{index + 1}</h3>
                            <div className="flex items-center gap-3 text-xs text-text-tertiary mt-1">
                              <span className="flex items-center gap-1">
                                <FiStar className="w-3 h-3" />
                                {qr.feedbackCount || 0} reviews
                              </span>
                              <span>{qr.scans || 0} scans</span>
                            </div>
                            <div className="text-xs text-text-tertiary mt-1">
                              Created {formatDate(qr.createdAt)}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Right Content - Feedback Details */}
          <div className="lg:col-span-2 space-y-6">
            {!selectedQR && viewMode === 'recipes' ? (
              <Card variant="glass" className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-text-tertiary mx-auto mb-4 opacity-50" />
                <h2 className="text-xl font-bold text-text mb-2">Select a Dish</h2>
                <p className="text-text-secondary">
                  Choose a dish from the list to view its QR codes and feedback
                </p>
              </Card>
            ) : !selectedQR && viewMode === 'qrcodes' ? (
              <Card variant="glass" className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-text-tertiary mx-auto mb-4 opacity-50" />
                <h2 className="text-xl font-bold text-text mb-2">Select a QR Code</h2>
                <p className="text-text-secondary">
                  Choose a QR code to view its feedback
                </p>
              </Card>
            ) : selectedQR && (
              <>
                {/* Filters */}
                <Card variant="glass" className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FiFilter className="w-5 h-5 text-text" />
                    <h3 className="font-semibold text-text">Filters</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Date Range</label>
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Minimum Rating</label>
                      <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4+ Stars</option>
                        <option value="3">3+ Stars</option>
                        <option value="2">2+ Stars</option>
                        <option value="1">1+ Stars</option>
                      </select>
                    </div>
                  </div>
                  {(dateFilter !== 'all' || ratingFilter !== 'all') && (
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm text-text-secondary">
                        Showing {filteredFeedback.length} of {feedback.length} reviews
                      </p>
                      <button
                        onClick={() => {
                          setDateFilter('all');
                          setRatingFilter('all');
                        }}
                        className="text-sm text-primary hover:underline"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card variant="glass" className="p-6 text-center">
                    <Award className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-text">{averageRating}</p>
                    <p className="text-sm text-text-secondary">Average Rating</p>
                  </Card>
                  
                  <Card variant="glass" className="p-6 text-center">
                    <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-text">{filteredFeedback.length}</p>
                    <p className="text-sm text-text-secondary">Total Reviews</p>
                  </Card>
                  
                  <Card variant="glass" className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-text">{selectedQR.scans || 0}</p>
                    <p className="text-sm text-text-secondary">QR Scans</p>
                  </Card>
                </div>

                {/* Category Ratings */}
                {Object.keys(categoryAverages).length > 0 && (
                  <Card variant="glass" className="p-6">
                    <h3 className="text-lg font-semibold text-text mb-4">Category Ratings</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {categoryAverages.taste && (
                        <div>
                          <p className="text-sm text-text-secondary mb-1">Taste</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-amber-400 h-2 rounded-full"
                                style={{ width: `${(categoryAverages.taste / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-text">{categoryAverages.taste}</span>
                          </div>
                        </div>
                      )}
                      {categoryAverages.presentation && (
                        <div>
                          <p className="text-sm text-text-secondary mb-1">Presentation</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-400 h-2 rounded-full"
                                style={{ width: `${(categoryAverages.presentation / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-text">{categoryAverages.presentation}</span>
                          </div>
                        </div>
                      )}
                      {categoryAverages.creativity && (
                        <div>
                          <p className="text-sm text-text-secondary mb-1">Creativity</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-400 h-2 rounded-full"
                                style={{ width: `${(categoryAverages.creativity / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-text">{categoryAverages.creativity}</span>
                          </div>
                        </div>
                      )}
                      {categoryAverages.portionSize && (
                        <div>
                          <p className="text-sm text-text-secondary mb-1">Portion Size</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-400 h-2 rounded-full"
                                style={{ width: `${(categoryAverages.portionSize / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-text">{categoryAverages.portionSize}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Feedback List */}
                <Card variant="glass" className="p-6">
                  <h3 className="text-lg font-semibold text-text mb-4">Guest Reviews</h3>
                  
                  {loadingFeedback ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    </div>
                  ) : filteredFeedback.length === 0 ? (
                    <div className="text-center py-8">
                      <FiMessageSquare className="w-12 h-12 text-text-tertiary mx-auto mb-3 opacity-50" />
                      <p className="text-text-secondary">
                        {feedback.length === 0 ? 'No feedback yet' : 'No feedback matches your filters'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredFeedback.map((item) => (
                        <div key={item.id} className="border-b border-gray-200 pb-4 last:border-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <FiUser className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-text">{item.guestName || 'Anonymous'}</p>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <FiStar
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= (item.ratings?.overall || 0)
                                          ? 'fill-amber-400 text-amber-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-text-tertiary">
                              <FiCalendar className="w-3 h-3" />
                              {formatDate(item.createdAt)}
                            </div>
                          </div>
                          
                          {item.feedback && (
                            <p className="text-sm text-text-secondary mt-2 pl-10">
                              "{item.feedback}"
                            </p>
                          )}
                          
                          {/* Category Ratings */}
                          {(item.ratings?.taste > 0 || item.ratings?.presentation > 0 || 
                            item.ratings?.creativity > 0 || item.ratings?.portionSize > 0) && (
                            <div className="flex flex-wrap gap-3 mt-3 pl-10">
                              {item.ratings.taste > 0 && (
                                <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                                  Taste: {item.ratings.taste}/5
                                </span>
                              )}
                              {item.ratings.presentation > 0 && (
                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                  Presentation: {item.ratings.presentation}/5
                                </span>
                              )}
                              {item.ratings.creativity > 0 && (
                                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                  Creativity: {item.ratings.creativity}/5
                                </span>
                              )}
                              {item.ratings.portionSize > 0 && (
                                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                                  Portion: {item.ratings.portionSize}/5
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FeedbackDashboard;
