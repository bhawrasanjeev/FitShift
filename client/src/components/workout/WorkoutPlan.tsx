import React, { useState } from 'react';
import { TrainingEnvironment, WorkoutPlanData, WorkoutDay, Exercise } from '../../types';
import { SegmentedControl } from '../ui/SegmentedControl';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseDetailsModal } from './ExerciseDetailsModal';
import { Badge } from '../ui/Badge';
import {
  Home,
  Building,
  Dumbbell,
  Clock,
  Calendar,
  Sparkles,
  Info,
  Flame,
  Layers,
} from 'lucide-react';

export interface WorkoutPlanProps {
  workout?: WorkoutPlanData | null;
  gender?: 'male' | 'female' | string;
  currentEnvironment: TrainingEnvironment;
  onEnvironmentChange: (env: TrainingEnvironment) => void;
  durationMinutes?: number;
  weeklyFrequencyDays?: number;
  experienceLevel?: string;
  goal?: string;
}

export const WorkoutPlan: React.FC<WorkoutPlanProps> = ({
  workout = null,
  gender = 'male',
  currentEnvironment,
  onEnvironmentChange,
  durationMinutes = 45,
  weeklyFrequencyDays = 4,
  experienceLevel = 'intermediate',
  goal = 'muscle_gain',
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [activeExerciseModal, setActiveExerciseModal] = useState<{ exercise: Exercise; index: number } | null>(null);
  const [daysSchedule, setDaysSchedule] = useState<WorkoutDay[]>(workout?.days || []);

  // Sync if workout prop changes
  React.useEffect(() => {
    if (workout?.days) {
      setDaysSchedule(workout.days);
    }
  }, [workout]);

  const currentDay = daysSchedule.find((d) => d.dayNumber === selectedDayNumber) || daysSchedule[0];

  const handleSwapAlternative = (exerciseId: string, exerciseIndex?: number) => {
    setDaysSchedule((prevDays) =>
      prevDays.map((day) => {
        if (day.dayNumber !== selectedDayNumber) return day;

        const updatedExercises = day.exercises.map((ex, idx) => {
          const isMatch = exerciseIndex !== undefined ? idx === exerciseIndex : ex.id === exerciseId;
          if (!isMatch) return ex;

          // Swap main exercise and alternative with full preservation of images, instructions, and metadata
          const alt = ex.alternative;
          const newMain: Exercise = {
            id: alt.id,
            name: alt.name,
            targetMuscle: alt.targetMuscle || ex.targetMuscle,
            setsReps: ex.setsReps,
            restSeconds: ex.restSeconds,
            environment: alt.environment === 'both' ? 'home' : alt.environment,
            equipment: alt.equipment,
            thumbnailUrl: alt.thumbnailUrl || ex.thumbnailUrl,
            instructions: alt.instructions && alt.instructions.length > 0
              ? alt.instructions
              : ex.instructions,
            commonMistakes: alt.commonMistakes && alt.commonMistakes.length > 0
              ? alt.commonMistakes
              : ex.commonMistakes,
            alternative: {
              id: ex.id,
              name: ex.name,
              targetMuscle: ex.targetMuscle,
              environment: ex.environment,
              equipment: ex.equipment,
              note: `Direct paired movement for ${alt.name}.`,
              thumbnailUrl: ex.thumbnailUrl,
              instructions: ex.instructions,
              commonMistakes: ex.commonMistakes,
            },
          };

          return newMain;
        });

        return { ...day, exercises: updatedExercises };
      })
    );
  };

  const isFemale = (gender || workout?.gender || 'male') === 'female';
  const effectiveLevel = (experienceLevel || workout?.experienceLevel || 'intermediate').toLowerCase();

  const goalLabels: Record<string, string> = {
    muscle_gain: 'Hypertrophy & Strength',
    fat_loss: 'Fat Loss & Conditioning',
    weight_loss: 'Weight Management',
    maintenance: 'Functional Maintenance',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Environment Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
              Weekly Training Architecture
            </h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
              {goalLabels[goal] || goal}
            </span>
            <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
              isFemale
                ? 'text-purple-800 bg-purple-100/80 border border-purple-200'
                : 'text-blue-800 bg-blue-100/80 border border-blue-200'
            }`}>
              {isFemale ? 'Female Glute & Posterior Focus' : 'Male Hypertrophy Split'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            {effectiveLevel === 'beginner'
              ? 'Foundational multi-joint motor pattern progression structured from 876 verified exercises.'
              : isFemale
              ? 'Targeted 2-muscle antagonistic & posterior chain splits (Glutes+Hamstrings, Back+Triceps, Quads+Glutes, Shoulders+Abs).'
              : 'Targeted 2-muscle synergistic splits (Chest+Triceps, Back+Biceps, Legs+Calves, Shoulders+Abs/Forearms).'}
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

      {/* Routine KPIs & Parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Weekly Frequency
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">
            {weeklyFrequencyDays} <span className="text-xs font-normal text-zinc-400">days / wk</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-0.5 block">
            {7 - weeklyFrequencyDays} planned rest days
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Session Duration
          </span>
          <div className="text-xl sm:text-2xl font-black text-zinc-900 mt-1">
            {durationMinutes} <span className="text-xs font-normal text-zinc-400">mins</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-0.5 block">
            Periodized rest &amp; sets
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Level &amp; Split
          </span>
          <div className="text-xl sm:text-2xl font-black text-zinc-900 mt-1 capitalize truncate">
            {effectiveLevel}
          </div>
          <span className="text-[10px] text-zinc-500 mt-0.5 block">
            {effectiveLevel === 'beginner' ? 'Foundations' : '2-Muscle Daily Split'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block flex items-center gap-1">
            <Dumbbell className="w-3.5 h-3.5" /> Equipment Filter
          </span>
          <div className="text-xl sm:text-2xl font-black text-zinc-900 mt-1 capitalize">
            {currentEnvironment === 'home' ? 'Bodyweight' : 'Full Gym'}
          </div>
          <span className="text-[10px] text-zinc-500 mt-0.5 block">
            {currentEnvironment === 'home' ? 'Calisthenics & Bands' : 'Barbells, Cables & Machines'}
          </span>
        </div>
      </div>

      {/* Dataset & Architecture Notice */}
      <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-2.5 text-xs text-zinc-600">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Biomechanical Architecture:</strong> {isFemale
            ? 'Routines emphasize posterior chain adaptation (glutes, hamstrings, hip abductors) and postural core definition without excessive trap/neck fatigue.'
            : 'Routines prioritize progressive push/pull muscle pairs (chest+triceps, back+biceps, shoulders+abs/forearms) with compound mass-builders first.'} Generated deterministically from FitShift&apos;s 876-exercise database.
        </p>
      </div>

      {/* 7-Day Week Tabs */}
      {daysSchedule.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {daysSchedule.map((day) => {
              const isSelected = day.dayNumber === selectedDayNumber;
              return (
                <button
                  key={day.dayNumber}
                  type="button"
                  onClick={() => setSelectedDayNumber(day.dayNumber)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                      : 'bg-white text-zinc-600 border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <span>{day.dayName.slice(0, 3)}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                      day.isRestDay
                        ? isSelected
                          ? 'bg-zinc-800 text-zinc-300'
                          : 'bg-zinc-100 text-zinc-500'
                        : isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {day.isRestDay ? 'Rest' : 'Train'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Day Detail Card */}
          {currentDay && (
            <div className="space-y-4">
              {/* Day Header Banner */}
              <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-zinc-950">
                      {currentDay.dayName} • {currentDay.focus}
                    </h3>
                    <Badge variant={currentDay.isRestDay ? 'outline' : 'success'} size="sm">
                      {currentDay.isRestDay ? 'Active Recovery' : `${currentDay.estimatedMinutes} Mins`}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {currentDay.isRestDay
                      ? currentDay.restDayGuidance || 'Allow micro-tears to repair and replenish muscle glycogen stores.'
                      : `${currentDay.exercises.length} compound and targeted movements mapped to your ${currentEnvironment} setup.`}
                  </p>
                </div>

                {!currentDay.isRestDay && (
                  <div className="text-xs text-zinc-500 flex items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-zinc-800">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      {currentDay.exercises.length} Exercises
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      ~{currentDay.estimatedMinutes} Mins
                    </span>
                  </div>
                )}
              </div>

              {/* Day Content: Exercises or Rest Day Card */}
              {currentDay.isRestDay ? (
                <div className="bg-white rounded-2xl border border-zinc-200/90 p-8 text-center space-y-4 shadow-2xs">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto shadow-2xs">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h4 className="text-base font-bold text-zinc-900">
                      Planned Recovery &amp; Muscle Repair Day
                    </h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {currentDay.restDayGuidance || 'Rest days are when muscular adaptation and central nervous system regeneration occur. Focus on adequate hydration, quality sleep, and meeting your daily protein target.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left pt-2">
                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs">
                      <span className="font-bold text-zinc-800 block">Hydration Goal</span>
                      <span className="text-zinc-500 mt-0.5 block">Drink 2.5–3.5L of water to facilitate cellular recovery.</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs">
                      <span className="font-bold text-zinc-800 block">Protein Adherence</span>
                      <span className="text-zinc-500 mt-0.5 block">Keep your daily protein intake consistent with training days.</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs">
                      <span className="font-bold text-zinc-800 block">Gentle Mobility</span>
                      <span className="text-zinc-500 mt-0.5 block">15–20 minutes light walking or restorative stretching.</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentDay.exercises.map((exercise, idx) => (
                    <ExerciseCard
                      key={`${exercise.id}-${idx}`}
                      exercise={exercise}
                      exerciseIndex={idx}
                      onViewDetails={(ex) => setActiveExerciseModal({ exercise: ex, index: idx })}
                      onSwapAlternative={(id, index) => handleSwapAlternative(id, index)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty State fallback if no schedule exists */}
      {(!daysSchedule || daysSchedule.length === 0) && (
        <div className="bg-white rounded-3xl border border-zinc-200/90 p-8 sm:p-12 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 text-zinc-600 flex items-center justify-center mx-auto shadow-2xs">
            <Dumbbell className="w-8 h-8 stroke-[1.8]" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
              No workout schedule generated
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Complete the onboarding setup to generate your custom weekly workout schedule.
            </p>
          </div>
        </div>
      )}

      {/* Exercise Details Modal */}
      <ExerciseDetailsModal
        exercise={activeExerciseModal ? activeExerciseModal.exercise : null}
        exerciseIndex={activeExerciseModal ? activeExerciseModal.index : null}
        isOpen={!!activeExerciseModal}
        onClose={() => setActiveExerciseModal(null)}
        onSelectAlternative={(id, index) => {
          handleSwapAlternative(id, index);
          setActiveExerciseModal(null);
        }}
      />
    </div>
  );
};
