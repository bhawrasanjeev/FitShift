import React from 'react';
import {
  TrainingSetup,
  WorkoutDuration,
  PreferredWorkoutTime,
  ExperienceLevel,
} from '../../types';
import { Home, Building, Dumbbell } from 'lucide-react';

export interface TrainingSetupStepProps {
  data: TrainingSetup;
  onChange: (updated: Partial<TrainingSetup>) => void;
}

export const TrainingSetupStep: React.FC<TrainingSetupStepProps> = ({
  data,
  onChange,
}) => {
  const durations: WorkoutDuration[] = [20, 30, 45, 60];
  const frequencies = [3, 4, 5, 6];

  const times: { id: PreferredWorkoutTime; label: string; period: string }[] = [
    { id: 'morning', label: 'Morning', period: '6 AM – 9 AM' },
    { id: 'afternoon', label: 'Afternoon', period: '12 PM – 3 PM' },
    { id: 'evening', label: 'Evening', period: '5 PM – 8 PM' },
    { id: 'night', label: 'Late Night', period: '8 PM – 11 PM' },
    { id: 'flexible', label: 'Flexible', period: 'Any slot' },
  ];

  const experiences: { id: ExperienceLevel; title: string; desc: string }[] = [
    { id: 'beginner', title: 'Beginner', desc: 'New to progressive training, focusing on fundamental motor patterns' },
    { id: 'intermediate', title: 'Intermediate', desc: '6+ months of consistent training, ready for structured volume' },
    { id: 'advanced', title: 'Advanced', desc: '2+ years of lifting, tuned to targeted tempo and high intensity' },
  ];

  const homeEquipmentList = [
    { id: 'none', label: 'No Equipment (Strict Bodyweight)' },
    { id: 'dumbbells', label: 'Pair of Dumbbells' },
    { id: 'resistance_bands', label: 'Resistance Bands / Loop Bands' },
    { id: 'pull_up_bar', label: 'Doorway Pull-up Bar' },
    { id: 'yoga_mat', label: 'Yoga Mat' },
    { id: 'other', label: 'Other / Backpack with Books' },
  ];

  const toggleHomeEquipment = (eqId: string) => {
    if (eqId === 'none') {
      onChange({ homeEquipment: ['none'] });
      return;
    }
    const current = data.homeEquipment.filter((item) => item !== 'none');
    if (current.includes(eqId)) {
      const filtered = current.filter((item) => item !== eqId);
      onChange({ homeEquipment: filtered.length === 0 ? ['none'] : filtered });
    } else {
      onChange({ homeEquipment: [...current, eqId] });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Environment Choice */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-3">
          Training Environment
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={() => onChange({ environment: 'home' })}
            className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
              data.environment === 'home'
                ? 'bg-emerald-50 text-emerald-950 border-emerald-600 font-semibold shadow-xs'
                : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
            }`}
          >
            <div className={`p-2.5 rounded-lg ${data.environment === 'home' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'}`}>
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-semibold">Home Workouts</div>
              <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                Zero commute. Scaled bodyweight calisthenics, bands, or dumbbells in your living space.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange({ environment: 'gym' })}
            className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
              data.environment === 'gym'
                ? 'bg-emerald-50 text-emerald-950 border-emerald-600 font-semibold shadow-xs'
                : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
            }`}
          >
            <div className={`p-2.5 rounded-lg ${data.environment === 'gym' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'}`}>
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-semibold">Commercial / Society Gym</div>
              <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                Access to barbells, cable stations, adjustable dumbbells, and specialized machines.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Conditional Equipment Section */}
      {data.environment === 'home' ? (
        <div className="p-4 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2.5 flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4 text-emerald-700" />
            <span>Available Home Equipment (Select all that apply)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {homeEquipmentList.map((eq) => {
              const isChecked = data.homeEquipment.includes(eq.id);
              return (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => toggleHomeEquipment(eq.id)}
                  className={`p-2.5 px-3 rounded-lg border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50/80 border-emerald-600 text-emerald-900 font-semibold'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  <span>{eq.label}</span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                      isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-zinc-300'
                    }`}
                  >
                    {isChecked ? '✓' : ''}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2.5">
            Gym Equipment Setup
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onChange({ gymEquipmentLevel: 'full_gym' })}
              className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer ${
                data.gymEquipmentLevel === 'full_gym'
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <div className="font-semibold">Full Commercial Gym</div>
              <p className="text-xs text-zinc-500 mt-0.5">Barbells, squat racks, cables, and leg presses</p>
            </button>
            <button
              type="button"
              onClick={() => onChange({ gymEquipmentLevel: 'limited_gym' })}
              className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer ${
                data.gymEquipmentLevel === 'limited_gym'
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <div className="font-semibold">Society / Basic Gym</div>
              <p className="text-xs text-zinc-500 mt-0.5">Dumbbells up to 15kg, basic bench, treadmill</p>
            </button>
          </div>
        </div>
      )}

      {/* Duration and Weekly Frequency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2.5">
            Time per Workout Session
          </label>
          <div className="grid grid-cols-4 gap-2">
            {durations.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onChange({ durationMinutes: d })}
                className={`py-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  data.durationMinutes === d
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-600 font-semibold shadow-2xs'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                <div className="text-sm font-bold">{d}m</div>
                <div className="text-[10px] text-zinc-400">total</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2.5">
            Target Workout Days / Week
          </label>
          <div className="grid grid-cols-4 gap-2">
            {frequencies.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => onChange({ weeklyFrequencyDays: f })}
                className={`py-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  data.weeklyFrequencyDays === f
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-600 font-semibold shadow-2xs'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                <div className="text-sm font-bold">{f} Days</div>
                <div className="text-[10px] text-zinc-400">{7 - f} rest</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preferred Workout Time Slot */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2.5">
          Preferred Training Time
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {times.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange({ preferredTime: t.id })}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                data.preferredTime === t.id
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-600 font-semibold shadow-2xs'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              <div className="text-xs sm:text-sm font-semibold">{t.label}</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">{t.period}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2.5">
          Current Training Experience
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {experiences.map((exp) => (
            <button
              key={exp.id}
              type="button"
              onClick={() => onChange({ experienceLevel: exp.id })}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                data.experienceLevel === exp.id
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-600 font-semibold shadow-2xs'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              <div className="text-sm font-semibold mb-1">{exp.title}</div>
              <p className="text-xs text-zinc-500 leading-relaxed">{exp.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
