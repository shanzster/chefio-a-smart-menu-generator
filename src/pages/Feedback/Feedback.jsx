import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiStar, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { ChefHat, User } from 'lucide-react';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import { getQRCodeById, saveQRFeedback, incrementScanCount } from '../../services/firebase/qrCodeService';
import { toast } from '../../store/toastStore';

const Feedback = () => {
  const { dishId } = useParams();
  const navigate = useNavigate();
  
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [ratings, setRatings] = useState({
    overall: 0,
    taste: 0,
    presentation: 0,
    creativity: 0,
    portionSize: 0
  });
  
  const [feedback, setFeedback] = useState('');
  const [guestName, setGuestName] = useState('');

  useEffect(() => {
    const loadQRCode = async () => {
      try {
        const qrData = await getQRCodeById(dishId);
        if (qrData) {
          setQrCode(qrData);
          // Increment scan count
          await incrementScanCount(dishId);
        } else {
          toast.error('Dish not found');
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (error) {
        console.error('Error loading dish:', error);
        toast.error('Failed to load dish information');
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setLoading(false);
      }
    };

    if (dishId) {
      loadQRCode();
    } else {
      toast.error('Invalid dish ID');
      navigate('/');
    }
  }, [dishId, navigate]);

  const handleRating = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (ratings.overall === 0) {
      toast.error('Please provide an overall rating');
      return;
    }

    setSubmitting(true);

    try {
      await saveQRFeedback(dishId, {
        ratings,
        feedback,
        guestName: guestName.trim() || 'Anonymous',
        submittedAt: new Date().toISOString()
      });

      setSubmitted(true);
      toast.success('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, label }) => {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-text mb-2">{label}</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="transition-all hover:scale-110 active:scale-95"
            >
              <FiStar
                className={`w-10 h-10 ${
                  star <= value
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-6">
        <Card variant="glass" className="p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading dish...</p>
        </Card>
      </div>
    );
  }

  if (!qrCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-6">
        <Card variant="glass" className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ChefHat className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-3">Dish Not Found</h2>
          <p className="text-text-secondary mb-6">
            Sorry, we couldn't find this dish. It may have been removed or the link is incorrect.
          </p>
          <Button onClick={() => navigate('/')} fullWidth>
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-6">
        <Card variant="glass" className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-3">Thank You!</h2>
          <p className="text-text-secondary mb-6">
            Your feedback has been submitted successfully. We appreciate your input!
          </p>
          <Button onClick={() => navigate('/')} fullWidth>
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-text">Rate & Review</h1>
            <p className="text-sm text-text-secondary">Share your feedback</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6">
        {/* Dish Card */}
        <Card variant="glass" className="mb-6 overflow-hidden">
          {qrCode.recipeImage && (
            <img
              src={qrCode.recipeImage}
              alt={qrCode.recipeName}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-6">
            {/* Dish Name and Cook Info */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <ChefHat className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-text mb-2">{qrCode.recipeName || qrCode.title}</h2>
                {qrCode.description && (
                  <p className="text-text-secondary text-sm mb-2">{qrCode.description}</p>
                )}
                {qrCode.cookName && (
                  <div className="flex items-center gap-2 text-sm text-text-tertiary">
                    <User className="w-4 h-4" />
                    <span>Prepared by {qrCode.cookName}</span>
                  </div>
                )}
                {qrCode.servings && (
                  <p className="text-sm text-text-tertiary mt-1">Serves {qrCode.servings}</p>
                )}
              </div>
            </div>

            {/* Nutritional Information */}
            {qrCode.nutrition && (
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h3 className="text-sm font-semibold text-text mb-3">Nutritional Information (per serving)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {qrCode.nutrition.calories && (
                    <div className="bg-amber-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-text-tertiary mb-1">Calories</p>
                      <p className="text-lg font-bold text-primary">{qrCode.nutrition.calories}</p>
                    </div>
                  )}
                  {qrCode.nutrition.protein && (
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-text-tertiary mb-1">Protein</p>
                      <p className="text-lg font-bold text-blue-600">{qrCode.nutrition.protein}</p>
                    </div>
                  )}
                  {qrCode.nutrition.carbs && (
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-text-tertiary mb-1">Carbs</p>
                      <p className="text-lg font-bold text-green-600">{qrCode.nutrition.carbs}</p>
                    </div>
                  )}
                  {qrCode.nutrition.fat && (
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-text-tertiary mb-1">Fat</p>
                      <p className="text-lg font-bold text-orange-600">{qrCode.nutrition.fat}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {qrCode.ingredients && qrCode.ingredients.length > 0 && (
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h3 className="text-sm font-semibold text-text mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {qrCode.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        {typeof ingredient === 'string' 
                          ? ingredient 
                          : ingredient.original || `${ingredient.amount || ''} ${ingredient.unit || ''} ${ingredient.name || ''}`.trim()
                        }
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructions */}
            {qrCode.instructions && qrCode.instructions.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-text mb-3">Instructions</h3>
                <ol className="space-y-3">
                  {qrCode.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3 text-sm text-text-secondary">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="flex-1 pt-0.5">
                        {typeof instruction === 'string' 
                          ? instruction 
                          : instruction.step || instruction.text || JSON.stringify(instruction)
                        }
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </Card>

        {/* Feedback Form */}
        <Card variant="glass" className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Overall Rating */}
            <div className="mb-8">
              <StarRating
                label="Overall Rating *"
                value={ratings.overall}
                onChange={(value) => handleRating('overall', value)}
              />
            </div>

            {/* Category Ratings */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-semibold text-text mb-4">Rate by Category</h3>
              
              <StarRating
                label="Taste"
                value={ratings.taste}
                onChange={(value) => handleRating('taste', value)}
              />
              
              <StarRating
                label="Presentation"
                value={ratings.presentation}
                onChange={(value) => handleRating('presentation', value)}
              />
              
              <StarRating
                label="Creativity"
                value={ratings.creativity}
                onChange={(value) => handleRating('creativity', value)}
              />
              
              <StarRating
                label="Portion Size"
                value={ratings.portionSize}
                onChange={(value) => handleRating('portionSize', value)}
              />
            </div>

            {/* Text Feedback */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text mb-2">
                Your Feedback (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts about this dish..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows="4"
                maxLength="500"
              />
              <p className="text-xs text-text-tertiary mt-1">
                {feedback.length}/500 characters
              </p>
            </div>

            {/* Guest Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text mb-2">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Enter your name or leave blank for anonymous"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                maxLength="50"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="large"
              loading={submitting}
              disabled={ratings.overall === 0}
            >
              Submit Feedback
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;
