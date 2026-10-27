import React, { useState } from 'react';
import { OnboardingData, DietType, BudgetTier } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Home, Building, Check } from 'lucide-react';

export interface EditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: OnboardingData;
  onSave: (updated: OnboardingData) => void;
}

export const EditPlanModal: React.FC<EditPlanModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onSave,
}) => {
  const [data, setData] = useState<OnboardingData>(currentData);

  const durations = [20, 30, 45, 60] as const;
  const frequencies = [3, 4, 5, 6];

  const handleSave = () => {
    onSave(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit FitShift Parameters"
      description="Adjust your schedule, budget, or training setup. The engine updates your plan immediately."
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Apply Changes
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Environment */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2">
            Workout Environment
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                setData((prev) => ({
                  ...prev,
                  training: { ...prev.training, environment: 'home' },
                }))
              }
              className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                data.training.environment === 'home'
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-600'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <Home className="w-4 h-4 text-emerald-700" />
              <span>Home Calisthenics</span>
            </button>
            <button
              type="button"
              onClick={() =>
                setData((prev) => ({
                  ...prev,
                  training: { ...prev.training, environment: 'gym' },
                }))
              }
              className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                data.training.environment === 'gym'
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-600'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <Building className="w-4 h-4 text-emerald-700" />
              <span>Commercial Gym</span>
            </button>
          </div>
        </div>

        {/* Workout Duration & Frequency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2">
              Duration per Session
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {durations.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() =>
                    setData((prev) => ({
                      ...prev,
                      training: { ...prev.training, durationMinutes: d },
                    }))
                  }
                  className={`py-2 text-xs font-bold rounded-lg border text-center cursor-pointer ${
                    data.training.durationMinutes === d
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2">
              Weekly Days
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {frequencies.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() =>
                    setData((prev) => ({
                      ...prev,
                      training: { ...prev.training, weeklyFrequencyDays: f },
                    }))
                  }
                  className={`py-2 text-xs font-bold rounded-lg border text-center cursor-pointer ${
                    data.training.weeklyFrequencyDays === f
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  {f}d
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Diet Preference */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2">
            Diet Preference
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['pure_veg', 'eggetarian', 'non_veg'] as DietType[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() =>
                  setData((prev) => ({
                    ...prev,
                    food: { ...prev.food, dietType: d },
                  }))
                }
                className={`p-2.5 rounded-xl border text-xs font-semibold text-center capitalize cursor-pointer ${
                  data.food.dietType === d
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-600'
                    : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                {d.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Food Budget Tier */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2">
            Food Budget Tier
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['ultra_budget', 'budget', 'moderate'] as BudgetTier[]).map((b) => {
              const costs: Record<string, number> = {
                ultra_budget: 40,
                budget: 65,
                moderate: 110,
              };
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() =>
                    setData((prev) => ({
                      ...prev,
                      budget: {
                        ...prev.budget,
                        tier: b,
                        dailyBudgetRupees: costs[b],
                      },
                    }))
                  }
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center capitalize cursor-pointer ${
                    data.budget.tier === b
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-600'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  {b.replace('_', ' ')} (~₹{costs[b]}/d)
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
