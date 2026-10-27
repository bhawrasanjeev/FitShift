import React, { useState } from 'react';
import { WorkoutDay, Exercise, TrainingEnvironment } from '../../types';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseDetailsModal } from './ExerciseDetailsModal';
import { SegmentedControl } from '../ui/SegmentedControl';
import {
  Home,
  Building,
  Coffee,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

export interface WorkoutPlanProps {
  workoutDays: WorkoutDay[];
  currentEnvironment: TrainingEnvironment;
  onEnvironmentChange: (env: TrainingEnvironment) => void;
  onSwapExercise: (dayNumber: number, exerciseId: string) => void;
}

export const WorkoutPlan: React.FC<WorkoutPlanProps> = ({
  workoutDays,
  currentEnvironment,
  onEnvironmentChange,
  onSwapExercise,
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [activeModalExercise, setActiveModalExercise] = useState<Exercise | null>(null);

  const currentDay =
    workoutDays.find((d) => d.dayNumber === selectedDayNumber) || workoutDays[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Home/Gym Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
            Weekly Training Architecture
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Built for steady progressive stimulus without joint burnout or unnecessary complexity.
          </p>
        </div>

        {/* Working Home / Gym Segmented Control */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500 hidden sm:inline">
            Environment:
          </span>
          <SegmentedControl<TrainingEnvironment>
            options={[
              {
                value: 'home',
                label: 'Home Routine',
                icon: <Home className="w-3.5 h-3.5" />,
              },
              {
                value: 'gym',
                label: 'Gym Routine',
                icon: <Building className="w-3.5 h-3.5" />,
              },
            ]}
            value={currentEnvironment}
            onChange={(newEnv) => onEnvironmentChange(newEnv)}
          />
        </div>
      </div>

      {/* Notice Banner about Home/Gym Parity */}
      <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-2.5 text-xs text-zinc-600">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p leading-relaxed>
          <strong>Environment context:</strong> Switching between Home and Gym updates mechanical load and setup requirements. While both stimulate muscle hypertrophy effectively, they utilize different leverage and equipment paths.
        </p>
      </div>

      {/* Day Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
        {workoutDays.map((day) => {
          const isSelected = day.dayNumber === selectedDayNumber;
          return (
            <button
              key={day.dayNumber}
              type="button"
              onClick={() => setSelectedDayNumber(day.dayNumber)}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-600 font-semibold shadow-xs ring-1 ring-emerald-600'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Day {day.dayNumber}
                </span>
                {day.isRestDay && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-zinc-100 text-zinc-500 font-medium">
                    Rest
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-sm font-bold text-left truncate">{day.dayName}</div>
              <div className="text-[10px] text-zinc-500 text-left mt-1 line-clamp-1">
                {day.isRestDay ? 'Recovery' : day.focus}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Content */}
      <div className="bg-zinc-50/60 rounded-2xl border border-zinc-200/90 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                {currentDay.dayName}
              </span>
              <h3 className="text-lg font-bold text-zinc-900">{currentDay.focus}</h3>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {currentDay.isRestDay
                ? 'Scheduled biological restoration day to repair muscle tissue and reset cortisol.'
                : `Targeted session structured around your ${currentEnvironment === 'home' ? 'home setup' : 'gym facility'}.`}
            </p>
          </div>

          {!currentDay.isRestDay && (
            <div className="flex items-center gap-3 text-xs font-medium text-zinc-600 bg-white px-3 py-1.5 rounded-lg border border-zinc-200">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                ~{currentDay.estimatedMinutes} minutes
              </span>
              <span>•</span>
              <span>{currentDay.exercises.length} Core Movements</span>
            </div>
          )}
        </div>

        {/* If Rest Day */}
        {currentDay.isRestDay ? (
          <div className="py-12 px-4 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <Coffee className="w-7 h-7 stroke-[1.8]" />
            </div>
            <h4 className="text-base font-bold text-zinc-900 mb-1">
              Active Recovery & Cellular Rest
            </h4>
            <p className="text-xs text-zinc-600 leading-relaxed mb-6">
              {currentDay.restDayGuidance ||
                'Hydrate thoroughly with water and electrolytes. Aim for an easy 20-minute evening stroll and unhurried sleep.'}
            </p>
            <div className="p-3 bg-white border border-zinc-200 rounded-xl text-left text-xs text-zinc-600 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Coach insight:</strong> Muscles grow during downtime through protein synthesis, not while breaking fibers during a workout.
              </span>
            </div>
          </div>
        ) : (
          /* Exercise List */
          <div className="mt-6 space-y-4">
            {currentDay.exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onViewDetails={(ex) => setActiveModalExercise(ex)}
                onSwapAlternative={(exId) => onSwapExercise(currentDay.dayNumber, exId)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Exercise Details Modal */}
      <ExerciseDetailsModal
        exercise={activeModalExercise}
        isOpen={!!activeModalExercise}
        onClose={() => setActiveModalExercise(null)}
        onSelectAlternative={(exId) => {
          onSwapExercise(currentDay.dayNumber, exId);
        }}
      />
    </div>
  );
};
