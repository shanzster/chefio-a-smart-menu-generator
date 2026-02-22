import React from 'react';
import { Activity, Flame, Beef, Wheat, Droplet } from 'lucide-react';
import Card from '../common/Card/Card';
import Badge from '../common/Badge/Badge';

const NutritionCard = ({ food, onSelect, showDetails = false }) => {
  const { name, brand, nutrition, servingSize, servingUnit } = food;

  return (
    <Card 
      variant="default" 
      className="hover:shadow-lg transition-all cursor-pointer"
      onClick={() => onSelect && onSelect(food)}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0">
          <Activity className="w-6 h-6 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-text mb-1 truncate">
            {name}
          </h3>
          {brand && (
            <p className="text-sm text-text-secondary mb-2">{brand}</p>
          )}

          {/* Macros Summary */}
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-error" />
              <span className="text-sm font-medium text-text">
                {Math.round(nutrition.calories)} cal
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Beef className="w-4 h-4 text-primary" />
              <span className="text-sm text-text-secondary">
                P: {nutrition.protein.toFixed(1)}g
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Wheat className="w-4 h-4 text-secondary" />
              <span className="text-sm text-text-secondary">
                C: {nutrition.carbs.toFixed(1)}g
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Droplet className="w-4 h-4 text-warning" />
              <span className="text-sm text-text-secondary">
                F: {nutrition.fat.toFixed(1)}g
              </span>
            </div>
          </div>

          {/* Serving Size */}
          <p className="text-xs text-text-tertiary">
            Per {servingSize}{servingUnit}
          </p>

          {/* Detailed Nutrition (if showDetails) */}
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                {nutrition.fiber > 0 && (
                  <div>
                    <p className="text-xs text-text-tertiary">Fiber</p>
                    <p className="text-sm font-medium text-text">{nutrition.fiber.toFixed(1)}g</p>
                  </div>
                )}
                {nutrition.sugar > 0 && (
                  <div>
                    <p className="text-xs text-text-tertiary">Sugar</p>
                    <p className="text-sm font-medium text-text">{nutrition.sugar.toFixed(1)}g</p>
                  </div>
                )}
                {nutrition.sodium > 0 && (
                  <div>
                    <p className="text-xs text-text-tertiary">Sodium</p>
                    <p className="text-sm font-medium text-text">{Math.round(nutrition.sodium)}mg</p>
                  </div>
                )}
                {nutrition.cholesterol > 0 && (
                  <div>
                    <p className="text-xs text-text-tertiary">Cholesterol</p>
                    <p className="text-sm font-medium text-text">{Math.round(nutrition.cholesterol)}mg</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Arrow indicator */}
        {onSelect && (
          <div className="text-text-tertiary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </Card>
  );
};

export default NutritionCard;
