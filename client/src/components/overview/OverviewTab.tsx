import React from 'react';
import {
  OnboardingData,
  TrainingEnvironment,
  NutritionPlanData,
  DietPlanData,
  WorkoutPlanData,
} from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Dumbbell,
  IndianRupee,
  Utensils,
  Sparkles,
  Calendar,
  Home,
  Building,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { PlanTab } from '../layout/AppSidebar';

export interface OverviewTabProps {
  userProfile: OnboardingData;
  nutrition: NutritionPlanData;
  diet: DietPlanData;
  workout?: WorkoutPlanData | null;
  currentEnvironment: TrainingEnvironment;
  isLateTiredActive: boolean;
  onOpenLateTired: () => void;
  onNavigateTab: (tab: PlanTab) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  userProfile,
  nutrition,
  diet,
  workout,
  currentEnvironment,
  isLateTiredActive,
  onOpenLateTired,
  onNavigateTab,
}) => {
  const goalTitles: Record<string, string> = {
    muscle_gain: 'Muscle Gain & Strength',
    fat_loss: 'Fat Loss & Lean Definition',
    weight_loss: 'Weight Reduction',
    maintenance: 'Vitality & Maintenance',
  };

  const userName = userProfile.personal.name || 'Member';
  const firstTrainingDay = workout?.days?.find((d) => !d.isRestDay) || workout?.days?.[0];

  // Computed schedule anchors from user's real rhythm
  const scheduleAnchors = [
    {
      time: userProfile.rhythm.wakeUpTime || '06:30',
      title: 'Wake Up & Circadian Hydration',
      type: 'recovery',
      description: '500ml water to break overnight dehydration.',
    },
    {
      time: userProfile.rhythm.departureTime || '08:30',
      title: 'Work / Transit Departure',
      type: 'work',
      description: 'Daily commute begins.',
    },
    {
      time: userProfile.rhythm.returnTime || '18:30',
      title: 'Return Home & Transit Transition',
      type: 'work',
      description: 'Shift from occupational focus to evening routine.',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome & Primary Parameters Banner */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full inline-block mb-2">
                Active Real-Data Blueprint
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                Namaste, {userName}.
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Your deterministic routine and nutrition blueprint derived from authentic Indian datasets.
              </p>
            </div>

            {/* Late / Tired Action Button */}
            <button
              type="button"
              onClick={onOpenLateTired}
              className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
                isLateTiredActive
                  ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600'
                  : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{isLateTiredActive ? 'Late Mode Active' : 'Late / Tired Today?'}</span>
            </button>
          </div>

          {/* Quick Parameters Tags */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
                Primary Goal
              </span>
              <span className="text-xs sm:text-sm font-bold text-zinc-900 mt-0.5 block truncate">
                {goalTitles[userProfile.personal.goal] || userProfile.personal.goal}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
                Environment
              </span>
              <span className="text-xs sm:text-sm font-bold text-zinc-900 mt-0.5 flex items-center gap-1.5">
                {currentEnvironment === 'home' ? (
                  <>
                    <Home className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Home Workouts</span>
                  </>
                ) : (
                  <>
                    <Building className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Commercial Gym</span>
                  </>
                )}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
                Daily Budget
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-800 mt-0.5 flex items-center">
                <IndianRupee className="w-3.5 h-3.5 inline" />
                <span>₹{diet.budget.estimatedCost.toFixed(1)} / ₹{diet.budget.dailyLimit}</span>
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
                Caloric Target
              </span>
              <span className="text-xs sm:text-sm font-bold text-zinc-900 mt-0.5 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>{nutrition.calorieTarget} kcal</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Diet Staples + Training Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Diet Plan Card (Real Data) */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Active Diet Optimization</h3>
                  <span className="text-[11px] text-zinc-400">{diet.foods.length} allocated staples</span>
                </div>
              </div>
              <Badge variant={diet.feasible ? 'success' : 'warning'} size="sm">
                {diet.protein.achievedGrams}g / {diet.protein.targetGrams}g Protein
              </Badge>
            </div>

            {/* Food snippets from real backend optimizer */}
            <div className="mt-4 space-y-2.5">
              {diet.foods.slice(0, 3).map((food, idx) => (
                <div
                  key={`${food.name}-${idx}`}
                  className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between"
                >
                  <div className="max-w-[70%]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      {food.isSupplement ? 'Supplement' : 'Whole Food'}
                    </span>
                    <h5 className="text-xs font-bold text-zinc-900 truncate mt-0.5">
                      {food.name} ({food.quantityGrams}g)
                    </h5>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-zinc-800 block">
                      {food.proteinGrams}g Pro
                    </span>
                    <span className="text-[10px] text-zinc-400">~₹{food.estimatedCost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-100 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab('diet')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Full Diet & Macro Details
            </Button>
          </div>
        </div>

        {/* Workout Plan Card (Real Data) */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-zinc-100 text-zinc-700">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    {firstTrainingDay ? firstTrainingDay.focus : 'Training Routine'}
                  </h3>
                  <span className="text-[11px] text-zinc-400">
                    {firstTrainingDay
                      ? `${firstTrainingDay.dayName} • ${firstTrainingDay.exercises.length} movements`
                      : 'Real Exercise Database'}
                  </span>
                </div>
              </div>
              <Badge variant="accent" size="sm">
                {workout ? `${workout.durationMinutes} Mins • ${workout.environment.toUpperCase()}` : 'Configured'}
              </Badge>
            </div>

            {firstTrainingDay && firstTrainingDay.exercises.length > 0 ? (
              <div className="mt-4 space-y-2.5">
                {firstTrainingDay.exercises.slice(0, 3).map((ex, idx) => (
                  <div
                    key={`${ex.id}-${idx}`}
                    className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between"
                  >
                    <div className="max-w-[70%]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        {ex.targetMuscle}
                      </span>
                      <h5 className="text-xs font-bold text-zinc-900 truncate mt-0.5">
                        {ex.name}
                      </h5>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-zinc-800 block">
                        {ex.setsReps}
                      </span>
                      <span className="text-[10px] text-zinc-400 capitalize">{ex.equipment}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-2 text-xs text-zinc-600">
                <p className="font-semibold text-zinc-900">
                  Equipment-matched routine ready.
                </p>
                <p className="leading-relaxed">
                  Your parameters ({userProfile.training.environment === 'home' ? 'Home' : 'Gym'}, {userProfile.training.durationMinutes} mins/session, {userProfile.training.weeklyFrequencyDays} days/week) are structured from 876 real exercises.
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-zinc-100 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab('workout')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Full Weekly Routine
            </Button>
          </div>
        </div>
      </div>

      {/* Upcoming Daily Schedule Ribbon */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-zinc-900">Daily Schedule Anchors</h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('schedule')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View Schedule Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {scheduleAnchors.map((evt, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-zinc-200/70 bg-zinc-50/60"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-emerald-800">{evt.time}</span>
                <span className="text-[10px] text-zinc-400 capitalize">{evt.type}</span>
              </div>
              <h5 className="text-xs font-bold text-zinc-900 truncate">{evt.title}</h5>
              <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">{evt.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
