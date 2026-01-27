import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiStar, FiSend } from 'react-icons/fi';
import { PartyPopper, MessageSquare, Star, ThumbsUp, Smile, Meh, Frown } from 'lucide-react';
import Button from '../../../components/common/Button/Button';
import Card from '../../../components/common/Card/Card';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => setSubmitted(true), 500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center text-center p-8 bg-background animate-fade-in">
        <PartyPopper className="w-20 h-20 mb-6 text-primary animate-[bounce_0.5s_ease-out]" />
        <h1 className="text-2xl font-bold text-text mb-2">Thank you!</h1>
        <p className="text-base text-text-secondary max-w-[300px] mb-8 leading-relaxed">
          Your feedback has been sent to the chef. We appreciate you taking the time to share your thoughts!
        </p>
        <Button to="/" size="large">Back to Home</Button>
      </div>
    );
  }

  const quickTags = ['Easy to follow', 'Delicious!', 'Great photos', 'Clear instructions', 'Perfect portions'];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background p-6">
      {/* Header */}
      <header className="mb-8">
        <Link to="/guest/recipe" className="inline-flex items-center gap-1 text-text-secondary font-medium p-2 -ml-2 rounded-md hover:text-text hover:bg-black/5 transition-colors">
          <FiArrowLeft />
          <span>Back</span>
        </Link>
      </header>

      {/* Content */}
      <div className="max-w-[500px] mx-auto">
        <div className="text-center mb-10">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold text-text mb-2">Share Feedback</h1>
          <p className="text-base text-text-secondary">Let the chef know how you liked the recipe</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Rating */}
          <Card variant="glass" className="text-center p-8">
            <h3 className="text-base font-medium text-text mb-6">How would you rate this recipe?</h3>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`w-12 h-12 flex items-center justify-center text-3xl transition-all hover:scale-110 ${
                    (hoveredRating || rating) >= star ? 'text-yellow-400' : 'text-gray-200'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  <FiStar className={(hoveredRating || rating) >= star ? 'fill-current' : ''} />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-base text-text-secondary mt-4 animate-fade-in flex items-center justify-center gap-2">
                {rating === 5 && <><Star className="w-5 h-5 fill-primary text-primary" /> Amazing!</>}
                {rating === 4 && <><ThumbsUp className="w-5 h-5 text-primary" /> Great!</>}
                {rating === 3 && <><Smile className="w-5 h-5 text-primary" /> Good</>}
                {rating === 2 && <><Meh className="w-5 h-5 text-text-secondary" /> Could be better</>}
                {rating === 1 && <><Frown className="w-5 h-5 text-text-secondary" /> Not for me</>}
              </p>
            )}
          </Card>

          {/* Feedback Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Your feedback (optional)</label>
            <textarea
              placeholder="What did you like? Any suggestions?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full p-4 bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg text-base text-text placeholder:text-text-tertiary resize-y min-h-[120px] focus:outline-none focus:bg-white/85 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>

          {/* Quick Tags */}
          <div className="space-y-2">
            <p className="text-sm text-text-tertiary">Quick feedback:</p>
            <div className="flex flex-wrap gap-2">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-text-secondary hover:border-primary hover:text-primary active:scale-95 transition-all"
                  onClick={() => setFeedback(prev => prev ? `${prev}, ${tag}` : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" fullWidth size="large" icon={<FiSend />} disabled={rating === 0}>
            Submit Feedback
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
