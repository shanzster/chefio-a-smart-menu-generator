import React, { useState } from 'react';
import { FiClock, FiUsers, FiZap, FiHeart, FiShare2, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Salad, Clock, Users, ChefHat, MessageSquare } from 'lucide-react';
import Button from '../../../components/common/Button/Button';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';

const recipeData = {
  id: 1,
  title: 'Blue Salad',
  description: 'A fresh and colorful salad with mixed greens, blueberries, and a light vinaigrette dressing.',
  time: '32 mins',
  servings: 2,
  calories: 230,
  difficulty: 'Easy',
  ingredients: [
    '2 cups mixed greens', '1 cup fresh blueberries', '1/2 cup crumbled feta cheese',
    '1/4 cup sliced almonds', '2 tbsp olive oil', '1 tbsp balsamic vinegar', 'Salt and pepper to taste'
  ],
  directions: [
    'Wash and dry the mixed greens, place in a large bowl.',
    'Add fresh blueberries and crumbled feta cheese.',
    'Toast the almonds in a dry pan until golden, about 2-3 minutes.',
    'In a small bowl, whisk together olive oil, balsamic vinegar, salt, and pepper.',
    'Drizzle the dressing over the salad and toss gently.',
    'Top with toasted almonds and serve immediately.'
  ],
  nutrition: { calories: 230, protein: 8, carbs: 18, fat: 15 }
};

const RecipeView = () => {
  const [liked, setLiked] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  const toggleStep = (index) => {
    setCompletedSteps(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 pt-safe">
        <Link to="/" className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-text text-xl active:scale-95 transition-transform">
          <FiArrowLeft />
        </Link>
        <div className="flex gap-2">
          <button 
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm active:scale-95 transition-all ${liked ? 'bg-error/15 text-error' : 'bg-white/80 text-text'}`}
            onClick={() => setLiked(!liked)}
          >
            <FiHeart className={liked ? 'fill-current' : ''} />
          </button>
          <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-text active:scale-95 transition-transform">
            <FiShare2 />
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="h-[280px] bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center">
        <div className="w-[140px] h-[140px] bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
          <span className="text-6xl">{recipeData.emoji}</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-10 px-6 pb-16 bg-background rounded-t-[38px]">
        {/* Title Section */}
        <div className="pt-8 mb-8">
          <Badge variant="primary" size="small">{recipeData.difficulty}</Badge>
          <h1 className="text-2xl font-bold text-text my-2">{recipeData.title}</h1>
          <p className="text-base text-text-secondary leading-relaxed mb-4">{recipeData.description}</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1 text-sm text-text-tertiary"><FiClock /> {recipeData.time}</span>
            <span className="flex items-center gap-1 text-sm text-text-tertiary"><FiUsers /> {recipeData.servings} people</span>
            <span className="flex items-center gap-1 text-sm text-text-tertiary"><FiZap /> {recipeData.calories} kcal</span>
          </div>
        </div>

        {/* Nutrition Card */}
        <Card variant="glass" className="mb-8">
          <h3 className="text-lg font-semibold text-text mb-4">Nutrition per serving</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Calories', value: recipeData.nutrition.calories },
              { label: 'Protein', value: `${recipeData.nutrition.protein}g` },
              { label: 'Carbs', value: `${recipeData.nutrition.carbs}g` },
              { label: 'Fat', value: `${recipeData.nutrition.fat}g` },
            ].map(item => (
              <div key={item.label} className="text-center">
                <span className="block text-lg font-bold text-primary">{item.value}</span>
                <span className="text-xs text-text-tertiary">{item.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Ingredients */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-text mb-4">Ingredients</h3>
          <ul className="space-y-0">
            {recipeData.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center gap-4 py-2 border-b border-black/5 last:border-b-0 text-base text-text">
                <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                {ingredient}
              </li>
            ))}
          </ul>
        </section>

        {/* Directions */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-text mb-4">Directions</h3>
          <ol className="space-y-2">
            {recipeData.directions.map((step, index) => (
              <li 
                key={index} 
                onClick={() => toggleStep(index)}
                className={`flex gap-4 p-4 bg-white rounded-lg cursor-pointer transition-all active:scale-[0.99] ${completedSteps.includes(index) ? 'opacity-60' : ''}`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-colors ${completedSteps.includes(index) ? 'bg-success text-white' : 'bg-primary text-white'}`}>
                  {index + 1}
                </span>
                <p className={`flex-1 text-base text-text leading-relaxed ${completedSteps.includes(index) ? 'line-through' : ''}`}>{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Feedback CTA */}
        <Card variant="default">
          <div className="flex gap-4 mb-4">
            <MessageSquare className="w-8 h-8 flex-shrink-0 text-primary" />
            <div>
              <h3 className="text-base font-semibold text-text mb-1">How was this recipe?</h3>
              <p className="text-sm text-text-secondary">Share your feedback with the chef!</p>
            </div>
          </div>
          <Button to="/guest/feedback" fullWidth>Leave Feedback</Button>
        </Card>
      </div>
    </div>
  );
};

export default RecipeView;
