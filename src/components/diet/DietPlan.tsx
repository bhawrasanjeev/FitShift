import React, { useState } from 'react';
import { Meal, MealAlternative, BudgetTier } from '../../types';
import { MealCard } from './MealCard';
import { MealAlternativesModal } from './MealAlternativesModal';
import { IndianRupee, ShieldAlert } from 'lucide-react';

export interface DietPlanProps {
  meals: Meal[];
  budgetTier: BudgetTier;
  targetDailyBudget: number;
  dietType: string;
  onReplaceMeal: (mealId: string, alt: MealAlternative) => void;
}

export const DietPlan: React.FC<DietPlanProps> = ({
  meals,
  budgetTier,
  targetDailyBudget,
  dietType,
  onReplaceMeal,
}) => {
  const [selectedMealForAlternatives, setSelectedMealForAlternatives] = useState<Meal | null>(null);

  const totalProtein = meals.reduce((sum, m) => sum + m.approxProteinG, 0);
  const totalCalories = meals.reduce((sum, m) => sum + m.estCalories, 0);
  const totalCost = meals.reduce((sum, m) => sum + m.approxCostRupees, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
              Indian Whole-Food Diet Framework
            </h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
              {dietType.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Built from authentic Indian staples: Sattu, Kala Chana, Moong Dal, Curd, and seasonal greens.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-zinc-400 font-medium">Daily Budget Allocation</span>
          <div className="text-sm font-bold text-emerald-800 flex items-center justify-end">
            <IndianRupee className="w-4 h-4 inline" />
            <span>₹{totalCost} / ₹{targetDailyBudget} target</span>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Total Daily Protein
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">
            ~{totalProtein}g
          </div>
          <span className="text-[10px] text-zinc-500 mt-0.5 block">
            Bioavailable whole food sources
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Approx Energy
          </span>
          <div className="text-xl sm:text-2xl font-black text-zinc-900 mt-1">
            ~{totalCalories} <span className="text-xs font-normal text-zinc-400">kcal</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-0.5 block">
            Balanced clean macros
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Estimated Daily Spend
          </span>
          <div className="text-xl sm:text-2xl font-black text-zinc-900 mt-1 flex items-center">
            <IndianRupee className="w-5 h-5 inline stroke-[2.5]" />
            <span>{totalCost}</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-0.5 block">
            Tier: {budgetTier.toUpperCase()}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Planned Meals
          </span>
          <div className="text-xl sm:text-2xl font-black text-zinc-900 mt-1">
            {meals.length} <span className="text-xs font-normal text-zinc-400">courses</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-0.5 block">
            Flexible & swappable
          </span>
        </div>
      </div>

      {/* Transparent Disclaimer Callout */}
      <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-2.5 text-xs text-zinc-600">
        <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Nutritional transparency:</strong> Calorie and protein values are educational estimates derived from standard Indian food tables (ICMR-NIN). Real preparation variance occurs based on household ghee, oil portions, and brand.
        </p>
      </div>

      {/* Meals List */}
      <div className="space-y-4">
        {meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onOpenAlternatives={(m) => setSelectedMealForAlternatives(m)}
          />
        ))}
      </div>

      {/* Alternatives Modal */}
      <MealAlternativesModal
        meal={selectedMealForAlternatives}
        isOpen={!!selectedMealForAlternatives}
        onClose={() => setSelectedMealForAlternatives(null)}
        onSelectAlternative={(mealId, alt) => {
          onReplaceMeal(mealId, alt);
        }}
      />
    </div>
  );
};
