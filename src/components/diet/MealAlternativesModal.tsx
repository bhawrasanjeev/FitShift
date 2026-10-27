import React from 'react';
import { Meal, MealAlternative } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { IndianRupee, Clock, Check } from 'lucide-react';

export interface MealAlternativesModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAlternative: (mealId: string, alt: MealAlternative) => void;
}

export const MealAlternativesModal: React.FC<MealAlternativesModalProps> = ({
  meal,
  isOpen,
  onClose,
  onSelectAlternative,
}) => {
  if (!meal) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Alternatives for ${meal.title}`}
      description="Choose a meal swap that matches your taste, kitchen setup, or grocery availability."
      maxWidth="lg"
      footer={
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Current Active Meal Banner */}
        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Current Planned Choice
          </span>
          <p className="text-sm font-bold text-zinc-900 mt-0.5">{meal.title}</p>
          <div className="flex gap-2 text-xs text-zinc-500 mt-1">
            <span>{meal.approxProteinG}g protein</span>
            <span>•</span>
            <span>~{meal.estCalories} kcal</span>
            <span>•</span>
            <span>₹{meal.approxCostRupees}</span>
          </div>
        </div>

        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 pt-1">
          Available Indian Food Swaps
        </div>

        {/* List of Alternatives */}
        <div className="space-y-3">
          {meal.alternatives.map((alt) => (
            <div
              key={alt.id}
              className="p-4 rounded-xl border border-zinc-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/20 transition-all flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h5 className="text-sm font-bold text-zinc-900">{alt.name}</h5>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="accent" size="sm">
                      {alt.approxProteinG}g Protein
                    </Badge>
                    <Badge variant="success" size="sm">
                      <IndianRupee className="w-3 h-3 inline" />
                      {alt.approxCostRupees}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                  {alt.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ~{alt.prepTimeMinutes} mins
                  </span>
                  <span>•</span>
                  <span>{alt.ingredients.join(', ')}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onSelectAlternative(meal.id, alt);
                    onClose();
                  }}
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Select This Meal
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
