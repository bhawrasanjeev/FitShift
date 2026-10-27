import React from 'react';
import {
  OnboardingData,
  WorkoutDay,
  Meal,
  ScheduleEvent,
  TrainingEnvironment,
} from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Dumbbell,
  Clock,
  IndianRupee,
  Utensils,
  Sparkles,
  Calendar,
  Home,
  Building,
  ArrowRight,
} from 'lucide-react';
import { PlanTab } from '../layout/AppSidebar';

export interface OverviewTabProps {
  userProfile: OnboardingData;
  currentEnvironment: TrainingEnvironment;
  todayWorkout: WorkoutDay;
  todayMeals: Meal[];
  upcomingEvents: ScheduleEvent[];
  isLateTiredActive: boolean;
  onOpenLateTired: () => void;
  onNavigateTab: (tab: PlanTab) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  userProfile,
  currentEnvironment,
  todayWorkout,
  todayMeals,
  upcomingEvents,
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

  const userName = userProfile.personal.name || 'Champion';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome & Primary Parameters Banner */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full inline-block mb-2">
                Active FitShift Blueprint
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                Namaste, {userName}.
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Your routine-first roadmap aligned with your daily rhythm and food budget.
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
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>{isLateTiredActive ? 'Late Mode Active (15m Flow)' : 'Late / Tired Today?'}</span>
            </button>
          </div>

          {/* Quick Parameters Tags */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
                Primary Goal
              </span>
              <span className="text-xs sm:text-sm font-bold text-zinc-900 mt-0.5 block truncate">
                {goalTitles[userProfile.personal.goal]}
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
                    <span>Home Calisthenics</span>
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
                Food Budget
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-800 mt-0.5 flex items-center">
                <IndianRupee className="w-3.5 h-3.5 inline" />
                <span>₹{userProfile.budget.dailyBudgetRupees} / day</span>
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
                Session Duration
              </span>
              <span className="text-xs sm:text-sm font-bold text-zinc-900 mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>{userProfile.training.durationMinutes} mins</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Workout + Today's Meals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Workout Card */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Today&apos;s Training Focus</h3>
                  <span className="text-[11px] text-zinc-400">Day 1 • {todayWorkout.dayName}</span>
                </div>
              </div>
              <Badge variant="accent" size="sm">
                {isLateTiredActive ? '15m Gentle Routine' : todayWorkout.focus}
              </Badge>
            </div>

            {/* Exercise preview */}
            <div className="mt-4 space-y-2.5">
              {todayWorkout.exercises.slice(0, 2).map((ex) => (
                <div
                  key={ex.id}
                  className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-zinc-900">{ex.name}</h5>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {ex.setsReps} • {ex.equipment}
                    </p>
                  </div>
                  <Badge variant="outline" size="sm">
                    {ex.targetMuscle}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-100 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab('workout')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Full Workout Plan
            </Button>
          </div>
        </div>

        {/* Today's Meal Plan Card */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Today&apos;s Indian Food Framework</h3>
                  <span className="text-[11px] text-zinc-400">{todayMeals.length} planned meals</span>
                </div>
              </div>
              <Badge variant="success" size="sm">
                ~{todayMeals.reduce((acc, m) => acc + m.approxProteinG, 0)}g Total Protein
              </Badge>
            </div>

            {/* Meal snippet */}
            <div className="mt-4 space-y-2.5">
              {todayMeals.slice(0, 2).map((meal) => (
                <div
                  key={meal.id}
                  className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between"
                >
                  <div className="max-w-[70%]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      {meal.mealType.replace('_', ' ')}
                    </span>
                    <h5 className="text-xs font-bold text-zinc-900 truncate mt-0.5">
                      {meal.title}
                    </h5>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-zinc-800 block">
                      {meal.approxProteinG}g Pro
                    </span>
                    <span className="text-[10px] text-zinc-400">~₹{meal.approxCostRupees}</span>
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
              Full Diet & Alternatives
            </Button>
          </div>
        </div>
      </div>

      {/* Upcoming Daily Schedule Ribbon */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-zinc-900">Upcoming Timetable Anchors</h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('schedule')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View Full 24-hr Schedule</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {upcomingEvents.slice(0, 3).map((evt) => (
            <div
              key={evt.id}
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

      {/* Contextual AI Assistant Entry Point */}
      <div className="bg-emerald-50/40 rounded-2xl border border-emerald-200/80 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
            <Sparkles className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-zinc-950">
                Have questions about your {userProfile.personal.goal.replace('_', ' ')} plan?
              </h4>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                AI Context Active
              </span>
            </div>
            <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
              Ask about smart meal swaps for your ₹{userProfile.budget.dailyBudgetRupees}/day budget, form tips for your {currentEnvironment} exercises, or schedule adjustments.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onNavigateTab('ai')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="shrink-0 text-xs font-semibold"
        >
          Ask AI Assistant
        </Button>
      </div>
    </div>
  );
};
