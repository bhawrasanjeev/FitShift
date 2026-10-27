import React from 'react';
import { DailyRhythm, Occupation, ActivityLevel } from '../../types';
import {
  Briefcase,
  GraduationCap,
  Home,
  Building2,
  Laptop,
  Compass,
  Clock,
  Moon,
  Sun,
} from 'lucide-react';

export interface DailyRhythmStepProps {
  data: DailyRhythm;
  onChange: (updated: Partial<DailyRhythm>) => void;
}

export const DailyRhythmStep: React.FC<DailyRhythmStepProps> = ({
  data,
  onChange,
}) => {
  const occupations: { id: Occupation; label: string; icon: React.ReactNode }[] = [
    { id: 'student', label: 'Student', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'working_professional', label: 'Working Professional', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'homemaker', label: 'Homemaker', icon: <Home className="w-4 h-4" /> },
    { id: 'business_owner', label: 'Business Owner', icon: <Building2 className="w-4 h-4" /> },
    { id: 'freelancer', label: 'Freelancer', icon: <Laptop className="w-4 h-4" /> },
    { id: 'other', label: 'Other Rhythm', icon: <Compass className="w-4 h-4" /> },
  ];

  const activityLevels: { id: ActivityLevel; title: string; desc: string }[] = [
    { id: 'sedentary', title: 'Sedentary', desc: 'Mostly sitting (desk job, study hours, screen work)' },
    { id: 'lightly_active', title: 'Lightly Active', desc: 'Regular short walks, campus transit, stairs' },
    { id: 'moderately_active', title: 'Moderately Active', desc: 'On feet frequently, commuting, active housework' },
    { id: 'very_active', title: 'Very Active', desc: 'Heavy physical labor, sustained outdoor movements' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Occupation */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-3">
          Your Primary Routine or Occupation
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {occupations.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange({ occupation: item.id })}
              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                data.occupation === item.id
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-600 font-semibold shadow-2xs'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              <span className={data.occupation === item.id ? 'text-emerald-700' : 'text-zinc-500'}>
                {item.icon}
              </span>
              <span className="text-xs sm:text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Daily Transit & Timings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="dep-time"
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2 flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>Departure / Shift Start Time</span>
          </label>
          <input
            id="dep-time"
            type="time"
            value={data.departureTime}
            onChange={(e) => onChange({ departureTime: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all shadow-2xs"
          />
          <p className="text-[11px] text-zinc-400 mt-1">When you leave for office, college, or start focused work</p>
        </div>

        <div>
          <label
            htmlFor="ret-time"
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2 flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>Expected Return / Shift End Time</span>
          </label>
          <input
            id="ret-time"
            type="time"
            value={data.returnTime}
            onChange={(e) => onChange({ returnTime: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all shadow-2xs"
          />
          <p className="text-[11px] text-zinc-400 mt-1">When your schedule frees up for exercise, cooking, and rest</p>
        </div>
      </div>

      {/* Sleep Rhythm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="wake-time"
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2 flex items-center gap-1.5"
          >
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            <span>Typical Wake-Up Time</span>
          </label>
          <input
            id="wake-time"
            type="time"
            value={data.wakeUpTime}
            onChange={(e) => onChange({ wakeUpTime: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all shadow-2xs"
          />
        </div>

        <div>
          <label
            htmlFor="sleep-hours"
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2 flex items-center gap-1.5"
          >
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
            <span>Average Nightly Sleep (Hours)</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              id="sleep-hours"
              type="range"
              min="5"
              max="10"
              step="0.5"
              value={data.sleepHours}
              onChange={(e) => onChange({ sleepHours: Number(e.target.value) })}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <span className="font-semibold text-sm text-zinc-800 shrink-0 w-12 text-right">
              {data.sleepHours} hrs
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Recovery directly dictates maximum weekly training volume</p>
        </div>
      </div>

      {/* Daily Activity Level */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-3">
          Non-Exercise Activity Level
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {activityLevels.map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => onChange({ activityLevel: lvl.id })}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                data.activityLevel === lvl.id
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-600 font-semibold shadow-2xs'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              <div className="text-sm font-semibold mb-0.5">{lvl.title}</div>
              <div className="text-xs text-zinc-500">{lvl.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
