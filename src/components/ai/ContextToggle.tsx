import React from 'react';
import { OnboardingData } from '../../types';
import { Sparkles, Home, Building, IndianRupee, Clock } from 'lucide-react';

export interface ContextToggleProps {
  usePlanContext: boolean;
  onToggle: (enabled: boolean) => void;
  userProfile?: OnboardingData;
}

export const ContextToggle: React.FC<ContextToggleProps> = ({
  usePlanContext,
  onToggle,
  userProfile,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 p-4 shadow-2xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              usePlanContext
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-zinc-100 text-zinc-400'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-zinc-900">
                Use my FitShift plan as context
              </span>
              {usePlanContext && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200/80">
                  Active
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5 leading-relaxed">
              {usePlanContext
                ? 'Assistant tailors recommendations to your saved goal, diet, Indian food budget, and home/gym setup.'
                : 'Answers will be general fitness advice without referencing your saved plan.'}
            </p>
          </div>
        </div>

        {/* Tactile Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={usePlanContext}
          onClick={() => onToggle(!usePlanContext)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 self-end sm:self-center ${
            usePlanContext ? 'bg-emerald-700' : 'bg-zinc-200'
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
              usePlanContext ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Snapshot of Active Plan Context */}
      {usePlanContext && userProfile && (
        <div className="mt-3.5 pt-3 border-t border-zinc-100 flex items-center gap-2 flex-wrap text-[11px] text-zinc-600 animate-in fade-in duration-200">
          <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px] mr-1">
            Active Context:
          </span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-medium">
            Goal: {userProfile.personal.goal.replace('_', ' ')}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-medium flex items-center gap-1">
            {userProfile.training.environment === 'home' ? (
              <Home className="w-3 h-3 text-emerald-600" />
            ) : (
              <Building className="w-3 h-3 text-emerald-600" />
            )}
            {userProfile.training.environment.toUpperCase()}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-500" />
            {userProfile.training.durationMinutes}m
          </span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-medium">
            Diet: {userProfile.food.dietType.replace('_', ' ')}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/60 flex items-center">
            <IndianRupee className="w-3 h-3 inline" />
            {userProfile.budget.dailyBudgetRupees}/day
          </span>
        </div>
      )}
    </div>
  );
};
