import React from 'react';
import { PersonalBasics, FitnessGoal, Gender } from '../../types';
import { SelectCard } from '../ui/SelectCard';
import { Flame, Dumbbell, Scale, HeartPulse } from 'lucide-react';

export interface PersonalBasicsStepProps {
  data: PersonalBasics;
  onChange: (updated: Partial<PersonalBasics>) => void;
}

export const PersonalBasicsStep: React.FC<PersonalBasicsStepProps> = ({
  data,
  onChange,
}) => {
  const goals: { id: FitnessGoal; title: string; description: string; icon: React.ReactNode }[] = [
    {
      id: 'muscle_gain',
      title: 'Muscle Gain & Strength',
      description: 'Progressive overload routines with protein-dense Indian whole meals.',
      icon: <Dumbbell className="w-5 h-5 text-emerald-700" />,
    },
    {
      id: 'fat_loss',
      title: 'Fat Loss & Definition',
      description: 'Preserve lean muscle while maintaining a sustainable modest calorie deficit.',
      icon: <Flame className="w-5 h-5 text-amber-600" />,
    },
    {
      id: 'weight_loss',
      title: 'Overall Weight Reduction',
      description: 'High-volume low-cost veggies, lentils, and structured consistent daily steps.',
      icon: <Scale className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'maintenance',
      title: 'Energy & Health Maintenance',
      description: 'Balanced vitality, cardiovascular health, mobility, and sustainable daily rhythm.',
      icon: <HeartPulse className="w-5 h-5 text-purple-600" />,
    },
  ];

  const genders: { id: Gender; label: string }[] = [
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
    { id: 'other', label: 'Other' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Name and Gender */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="user-name"
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2"
          >
            Your Name <span className="text-zinc-400 font-normal lowercase">(optional)</span>
          </label>
          <input
            id="user-name"
            type="text"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. Aarav, Priya"
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2">
            Gender
          </label>
          <div className="grid grid-cols-3 gap-2">
            {genders.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => onChange({ gender: g.id })}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium border text-center transition-all cursor-pointer ${
                  data.gender === g.id
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-600 font-semibold'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Numerical Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label
            htmlFor="user-age"
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2"
          >
            Age
          </label>
          <div className="relative">
            <input
              id="user-age"
              type="number"
              min="14"
              max="100"
              placeholder="e.g. 25"
              value={data.age || ''}
              onChange={(e) => onChange({ age: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 pr-14 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all shadow-2xs"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-medium pointer-events-none">
              years
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="user-height"
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2"
          >
            Height
          </label>
          <div className="relative">
            <input
              id="user-height"
              type="number"
              min="100"
              max="250"
              placeholder="e.g. 175"
              value={data.heightCm || ''}
              onChange={(e) => onChange({ heightCm: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 pr-12 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all shadow-2xs"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-medium pointer-events-none">
              cm
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="user-weight"
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2"
          >
            Current Weight
          </label>
          <div className="relative">
            <input
              id="user-weight"
              type="number"
              min="30"
              max="300"
              placeholder="e.g. 70"
              value={data.weightKg || ''}
              onChange={(e) => onChange({ weightKg: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 pr-12 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all shadow-2xs"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-medium pointer-events-none">
              kg
            </span>
          </div>
        </div>
      </div>

      {/* Primary Goal */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-3">
          Primary Fitness Goal
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {goals.map((g) => (
            <SelectCard
              key={g.id}
              title={g.title}
              description={g.description}
              icon={g.icon}
              selected={data.goal === g.id}
              onClick={() => onChange({ goal: g.id })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
