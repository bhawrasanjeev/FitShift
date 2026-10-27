import React from 'react';
import { OnboardingData } from '../../types';
import {
  User,
  Clock,
  Dumbbell,
  Utensils,
  IndianRupee,
  Pill,
  Pencil,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/Button';

export interface ReviewStepProps {
  data: OnboardingData;
  onEditStep: (stepNumber: number) => void;
  onGeneratePlan: () => void;
  isGenerating?: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  data,
  onEditStep,
  onGeneratePlan,
  isGenerating = false,
}) => {
  const goalNames: Record<string, string> = {
    muscle_gain: 'Muscle Gain & Strength',
    fat_loss: 'Fat Loss & Lean Definition',
    weight_loss: 'Weight Reduction',
    maintenance: 'Vitality & Maintenance',
  };

  const dietNames: Record<string, string> = {
    pure_veg: 'Pure Vegetarian',
    eggetarian: 'Eggetarian',
    non_veg: 'Non-Vegetarian',
  };

  const occNames: Record<string, string> = {
    student: 'Student',
    working_professional: 'Working Professional',
    homemaker: 'Homemaker',
    business_owner: 'Business Owner',
    freelancer: 'Freelancer',
    other: 'General Schedule',
  };

  const cards = [
    {
      step: 1,
      title: 'Personal Basics & Goal',
      icon: <User className="w-4 h-4 text-emerald-700" />,
      items: [
        { label: 'Name', value: data.personal.name || 'FitShift Member' },
        { label: 'Metrics', value: `${data.personal.age} yrs • ${data.personal.heightCm} cm • ${data.personal.weightKg} kg` },
        { label: 'Primary Goal', value: goalNames[data.personal.goal] || data.personal.goal },
      ],
    },
    {
      step: 2,
      title: 'Daily Rhythm & Schedule',
      icon: <Clock className="w-4 h-4 text-emerald-700" />,
      items: [
        { label: 'Routine', value: occNames[data.rhythm.occupation] || data.rhythm.occupation },
        { label: 'Transit Hours', value: `${data.rhythm.departureTime} (Out) → ${data.rhythm.returnTime} (Home)` },
        { label: 'Sleep Rhythm', value: `${data.rhythm.sleepHours} hrs (Wake up: ${data.rhythm.wakeUpTime})` },
      ],
    },
    {
      step: 3,
      title: 'Training Setup',
      icon: <Dumbbell className="w-4 h-4 text-emerald-700" />,
      items: [
        { label: 'Environment', value: data.training.environment === 'home' ? 'Home Workouts' : 'Commercial / Society Gym' },
        { label: 'Duration & Frequency', value: `${data.training.durationMinutes} mins / session • ${data.training.weeklyFrequencyDays} days / week` },
        { label: 'Experience & Time', value: `${data.training.experienceLevel.toUpperCase()} • ${data.training.preferredTime} slots` },
      ],
    },
    {
      step: 4,
      title: 'Nutrition & Kitchen Setup',
      icon: <Utensils className="w-4 h-4 text-emerald-700" />,
      items: [
        { label: 'Diet Type', value: dietNames[data.food.dietType] },
        { label: 'Kitchen Access', value: data.food.cookingSituation.replace('_', ' ').toUpperCase() },
        { label: 'Meals / Day', value: `${data.food.mealsPerDay} meals (Style: ${data.food.indianFoodStyle.replace('_', ' ')})` },
      ],
    },
    {
      step: 5,
      title: 'Daily Food Budget',
      icon: <IndianRupee className="w-4 h-4 text-emerald-700" />,
      items: [
        { label: 'Selected Tier', value: data.budget.tier.replace('_', ' ').toUpperCase() },
        { label: 'Daily Target', value: `₹${data.budget.dailyBudgetRupees} / day (~₹${data.budget.dailyBudgetRupees * 7} / week)` },
      ],
    },
    {
      step: 6,
      title: 'Supplement Preference',
      icon: <Pill className="w-4 h-4 text-emerald-700" />,
      items: [
        {
          label: 'Preference',
          value:
            data.supplements.preference === 'no_supplements'
              ? 'Food-Only Nutrition (No Powders)'
              : data.supplements.preference === 'open_to_supplements'
              ? `Open to Supplements (Max ₹${data.supplements.monthlyBudgetRupees || 1200}/mo)`
              : 'Educational Guide Requested',
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Intro Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-emerald-950">
            Review your inputs before generating your plan
          </h4>
          <p className="text-xs text-emerald-800/90 mt-0.5 leading-relaxed">
            Every section below is fully editable. Clicking &quot;Generate My FitShift Plan&quot; will instantly construct your routine, Indian diet structure, and daily schedule.
          </p>
        </div>
      </div>

      {/* Grid of Summarized Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <div
            key={card.step}
            className="p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-zinc-100">{card.icon}</div>
                  <span className="text-xs font-semibold text-zinc-900">{card.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onEditStep(card.step)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-2">
                {card.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-baseline text-xs">
                    <span className="text-zinc-400 font-medium">{item.label}</span>
                    <span className="text-zinc-800 font-medium text-right max-w-[60%] truncate">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Primary Action Button Box */}
      <div className="pt-4 flex flex-col items-center justify-center gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={onGeneratePlan}
          isLoading={isGenerating}
          rightIcon={<Sparkles className="w-5 h-5 text-emerald-200" />}
          className="w-full sm:w-auto min-w-[280px] text-base font-semibold py-3.5 shadow-md"
        >
          Generate My FitShift Plan
        </Button>
        <p className="text-xs text-zinc-400">
          No credit card • No mandatory registration • Instant local preview
        </p>
      </div>
    </div>
  );
};
