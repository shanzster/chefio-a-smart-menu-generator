import React, { useState } from 'react';
import { Flame, Activity, TrendingUp, Heart, Zap, Download } from 'lucide-react';
import Card from '../common/Card/Card';
import Badge from '../common/Badge/Badge';
import Button from '../common/Button/Button';
import { getDailyValuePercentages } from '../../services/nutrition/usdaService';
import { exportNutritionToPDF } from '../../utils/pdfExport';
import { toast } from '../../store/toastStore';

const NutritionDetails = ({ food, quantity = 100, imageUrl = null }) => {
  const { name, nutrition, servingSize } = food;
  const [isExporting, setIsExporting] = useState(false);
  
  // Calculate nutrition based on quantity
  const multiplier = quantity / servingSize;
  const adjustedNutrition = {};
  Object.keys(nutrition).forEach(key => {
    adjustedNutrition[key] = nutrition[key] * multiplier;
  });

  const dailyValues = getDailyValuePercentages(adjustedNutrition);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportNutritionToPDF(food, quantity, imageUrl);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text mb-2">{name}</h2>
          <p className="text-base text-text-secondary">
            Nutrition Facts - Per {quantity}g
          </p>
        </div>
        <Button
          onClick={handleExportPDF}
          disabled={isExporting}
          icon={<Download className="w-4 h-4" />}
          variant="secondary"
          size="medium"
        >
          {isExporting ? 'Exporting...' : 'Export PDF'}
        </Button>
      </div>

      {/* Calories Card */}
      <Card variant="glass" className="bg-gradient-to-br from-error/5 to-error/10 border-error/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center">
              <Flame className="w-6 h-6 text-error" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Calories</p>
              <p className="text-3xl font-bold text-text">
                {Math.round(adjustedNutrition.calories)}
              </p>
            </div>
          </div>
          {dailyValues.calories && (
            <Badge variant="error" size="large">
              {dailyValues.calories}% DV
            </Badge>
          )}
        </div>
      </Card>

      {/* Macronutrients */}
      <Card variant="default">
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Macronutrients
        </h3>
        <div className="space-y-4">
          <MacroBar
            label="Protein"
            value={adjustedNutrition.protein}
            unit="g"
            percentage={dailyValues.protein}
            color="bg-primary"
          />
          <MacroBar
            label="Carbohydrates"
            value={adjustedNutrition.carbs}
            unit="g"
            percentage={dailyValues.carbs}
            color="bg-secondary"
          />
          <MacroBar
            label="Total Fat"
            value={adjustedNutrition.fat}
            unit="g"
            percentage={dailyValues.fat}
            color="bg-warning"
          />
          {adjustedNutrition.fiber > 0 && (
            <MacroBar
              label="Dietary Fiber"
              value={adjustedNutrition.fiber}
              unit="g"
              percentage={dailyValues.fiber}
              color="bg-success"
              indent
            />
          )}
          {adjustedNutrition.sugar > 0 && (
            <MacroBar
              label="Sugars"
              value={adjustedNutrition.sugar}
              unit="g"
              percentage={dailyValues.sugar}
              color="bg-error"
              indent
            />
          )}
        </div>
      </Card>

      {/* Fats Breakdown */}
      {(adjustedNutrition.saturatedFat > 0 || adjustedNutrition.transFat > 0) && (
        <Card variant="default">
          <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-warning" />
            Fats Breakdown
          </h3>
          <div className="space-y-3">
            {adjustedNutrition.saturatedFat > 0 && (
              <NutrientRow
                label="Saturated Fat"
                value={adjustedNutrition.saturatedFat}
                unit="g"
                percentage={dailyValues.saturatedFat}
              />
            )}
            {adjustedNutrition.transFat > 0 && (
              <NutrientRow
                label="Trans Fat"
                value={adjustedNutrition.transFat}
                unit="g"
              />
            )}
            {adjustedNutrition.monounsaturatedFat > 0 && (
              <NutrientRow
                label="Monounsaturated Fat"
                value={adjustedNutrition.monounsaturatedFat}
                unit="g"
              />
            )}
            {adjustedNutrition.polyunsaturatedFat > 0 && (
              <NutrientRow
                label="Polyunsaturated Fat"
                value={adjustedNutrition.polyunsaturatedFat}
                unit="g"
              />
            )}
          </div>
        </Card>
      )}

      {/* Minerals */}
      <Card variant="default">
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-success" />
          Minerals
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {adjustedNutrition.sodium > 0 && (
            <NutrientBox
              label="Sodium"
              value={adjustedNutrition.sodium}
              unit="mg"
              percentage={dailyValues.sodium}
            />
          )}
          {adjustedNutrition.potassium > 0 && (
            <NutrientBox
              label="Potassium"
              value={adjustedNutrition.potassium}
              unit="mg"
              percentage={dailyValues.potassium}
            />
          )}
          {adjustedNutrition.calcium > 0 && (
            <NutrientBox
              label="Calcium"
              value={adjustedNutrition.calcium}
              unit="mg"
              percentage={dailyValues.calcium}
            />
          )}
          {adjustedNutrition.iron > 0 && (
            <NutrientBox
              label="Iron"
              value={adjustedNutrition.iron}
              unit="mg"
              percentage={dailyValues.iron}
            />
          )}
          {adjustedNutrition.magnesium > 0 && (
            <NutrientBox
              label="Magnesium"
              value={adjustedNutrition.magnesium}
              unit="mg"
            />
          )}
          {adjustedNutrition.zinc > 0 && (
            <NutrientBox
              label="Zinc"
              value={adjustedNutrition.zinc}
              unit="mg"
            />
          )}
        </div>
      </Card>

      {/* Vitamins */}
      <Card variant="default">
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-error" />
          Vitamins
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {adjustedNutrition.vitaminA > 0 && (
            <NutrientBox
              label="Vitamin A"
              value={adjustedNutrition.vitaminA}
              unit="IU"
              percentage={dailyValues.vitaminA}
            />
          )}
          {adjustedNutrition.vitaminC > 0 && (
            <NutrientBox
              label="Vitamin C"
              value={adjustedNutrition.vitaminC}
              unit="mg"
              percentage={dailyValues.vitaminC}
            />
          )}
          {adjustedNutrition.vitaminD > 0 && (
            <NutrientBox
              label="Vitamin D"
              value={adjustedNutrition.vitaminD}
              unit="IU"
              percentage={dailyValues.vitaminD}
            />
          )}
          {adjustedNutrition.vitaminE > 0 && (
            <NutrientBox
              label="Vitamin E"
              value={adjustedNutrition.vitaminE}
              unit="mg"
            />
          )}
          {adjustedNutrition.vitaminB6 > 0 && (
            <NutrientBox
              label="Vitamin B6"
              value={adjustedNutrition.vitaminB6}
              unit="mg"
            />
          )}
          {adjustedNutrition.vitaminB12 > 0 && (
            <NutrientBox
              label="Vitamin B12"
              value={adjustedNutrition.vitaminB12}
              unit="µg"
            />
          )}
        </div>
      </Card>

      {/* Daily Value Note */}
      <p className="text-xs text-text-tertiary text-center">
        * Percent Daily Values are based on a 2,000 calorie diet.
        Your daily values may be higher or lower depending on your calorie needs.
      </p>
    </div>
  );
};

// Helper Components
const MacroBar = ({ label, value, unit, percentage, color, indent = false }) => (
  <div className={indent ? 'ml-4' : ''}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-text">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-text">
          {value.toFixed(1)}{unit}
        </span>
        {percentage && (
          <Badge variant="default" size="small">
            {percentage}%
          </Badge>
        )}
      </div>
    </div>
    {percentage && (
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    )}
  </div>
);

const NutrientRow = ({ label, value, unit, percentage }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm text-text-secondary">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-text">
        {value.toFixed(1)}{unit}
      </span>
      {percentage && (
        <span className="text-xs text-text-tertiary">
          ({percentage}% DV)
        </span>
      )}
    </div>
  </div>
);

const NutrientBox = ({ label, value, unit, percentage }) => (
  <div className="p-3 bg-gray-50 rounded-xl">
    <p className="text-xs text-text-tertiary mb-1">{label}</p>
    <p className="text-lg font-bold text-text">
      {Math.round(value)}{unit}
    </p>
    {percentage && (
      <p className="text-xs text-primary font-medium mt-1">
        {percentage}% DV
      </p>
    )}
  </div>
);

export default NutritionDetails;
