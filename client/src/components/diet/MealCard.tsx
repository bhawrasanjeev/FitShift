import React from 'react';
import { Meal } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Utensils,
  Clock,
  IndianRupee,
  RefreshCw,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

export interface MealCardProps {
  meal: Meal;
  onOpenAlternatives: (meal: Meal) => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  onOpenAlternatives,
}) => {
  const typeLabels: Record<string, string> = {
    breakfast: 'Morning Breakfast',
    lunch: 'Balanced Mid-Day Lunch',
    pre_workout: 'Pre-Workout Fuel',
    post_workout: 'Post-Workout Recovery',
    dinner: 'Evening Restorative Dinner',
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 shadow-xs hover:border-zinc-300 transition-all space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
            {typeLabels[meal.mealType] || meal.mealType}
          </span>
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            ~{meal.prepTimeMinutes} mins prep
          </span>
        </div>

        {/* Nutritional & Cost Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="accent" size="sm" className="font-bold">
            {meal.approxProteinG}g Protein
          </Badge>
          <Badge variant="default" size="sm">
            ~{meal.estCalories} kcal
          </Badge>
          <Badge variant="success" size="sm" className="font-semibold">
            <IndianRupee className="w-3 h-3 inline" />
            {meal.approxCostRupees}
          </Badge>
        </div>
      </div>

      {/* Meal Title and Description */}
      <div>
        <h4 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
          {meal.title}
        </h4>
        <p className="text-xs sm:text-sm text-zinc-600 mt-1 leading-relaxed">
          {meal.description}
        </p>
      </div>

      {/* Ingredients Pills */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1">
          <Utensils className="w-3 h-3 text-zinc-500" />
          <span>Core Ingredients</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {meal.ingredients.map((ing, idx) => (
            <span
              key={idx}
              className="text-xs px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200/80 text-zinc-700 font-medium"
            >
              {ing}
            </span>
          ))}
        </div>
      </div>

      {/* Cooking Tip */}
      {meal.cookingTip && (
        <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs text-amber-950 flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold text-amber-900">Kitchen tip: </span>
            {meal.cookingTip}
          </p>
        </div>
      )}

      {/* Alternatives Button */}
      <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
        <span className="text-xs text-zinc-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          {meal.alternatives.length} verified alternatives available
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenAlternatives(meal)}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="text-xs"
        >
          View / Replace Meal
        </Button>
      </div>
    </div>
  );
};
