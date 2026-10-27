import React from 'react';
import {
  FoodPreferences,
  DietType,
  CookingSituation,
  IndianFoodStyle,
} from '../../types';
import { Leaf, Egg, Drumstick, ChefHat, Utensils, Check } from 'lucide-react';

export interface FoodPreferencesStepProps {
  data: FoodPreferences;
  onChange: (updated: Partial<FoodPreferences>) => void;
}

export const FoodPreferencesStep: React.FC<FoodPreferencesStepProps> = ({
  data,
  onChange,
}) => {
  const diets: { id: DietType; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'pure_veg',
      label: 'Pure Vegetarian',
      desc: 'Dairy, pulses, sattu, soya, paneer & whole grains. Zero eggs/meat.',
      icon: <Leaf className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 'eggetarian',
      label: 'Eggetarian',
      desc: 'Vegetarian staples plus whole eggs and egg whites for budget protein.',
      icon: <Egg className="w-5 h-5 text-amber-600" />,
    },
    {
      id: 'non_veg',
      label: 'Non-Vegetarian',
      desc: 'Eggs, chicken, fish combined with traditional dal, roti and sabzi.',
      icon: <Drumstick className="w-5 h-5 text-rose-600" />,
    },
  ];

  const cookingSituations: { id: CookingSituation; title: string; desc: string }[] = [
    {
      id: 'hostel_mess',
      title: 'Hostel / PG / Office Mess',
      desc: 'Limited or no kitchen access. Plan relies on mess foods, fruits & no-cook add-ons.',
    },
    {
      id: 'family_provided',
      title: 'Family / Tiffin-Provided',
      desc: 'Eating standard home-cooked meals with simple high-protein portions added.',
    },
    {
      id: 'self_cooking',
      title: 'Self-Cooking / Meal Prep',
      desc: 'Full kitchen access to prepare custom stir-fries, sattu shakes, or meal batches.',
    },
  ];

  const mealCounts = [3, 4, 5];

  const indianStyles: { id: IndianFoodStyle; title: string; desc: string }[] = [
    { id: 'simple_homestyle', title: 'Simple Ghar-ka-Khana', desc: 'Minimal oil, yellow dal, roti, seasonal sabzi, dahi' },
    { id: 'high_protein_everyday', title: 'High-Protein Focus', desc: 'Sattu, soya chunks, kala chana, eggs/paneer with every meal' },
    { id: 'north_indian', title: 'North Indian Regional', desc: 'Rajma, chole, paneer, paratha adjustments, curd chaas' },
    { id: 'south_indian', title: 'South Indian Regional', desc: 'Idli/dosa with sambar, curd rice, sundal, rasam, egg roasts' },
  ];

  const commonStaples = [
    'Roti (Phulka)',
    'Yellow Moong Dal',
    'Chana Sattu',
    'Kala Chana',
    'Fresh Dahi / Curd',
    'Soya Chunks',
    'Boiled Eggs',
    'Fresh Paneer',
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Diet Type */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-3">
          Dietary Baseline
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {diets.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onChange({ dietType: d.id })}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                data.dietType === d.id
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-600 font-semibold shadow-xs'
                  : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-zinc-100/80">{d.icon}</div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                    data.dietType === d.id ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-zinc-300'
                  }`}
                >
                  {data.dietType === d.id && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold">{d.label}</div>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{d.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cooking Setup (Kitchen vs Mess) */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-3 flex items-center gap-1.5">
          <ChefHat className="w-4 h-4 text-emerald-700" />
          <span>Cooking & Kitchen Access</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cookingSituations.map((sit) => (
            <button
              key={sit.id}
              type="button"
              onClick={() => onChange({ cookingSituation: sit.id })}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                data.cookingSituation === sit.id
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-600 font-semibold shadow-2xs'
                  : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              <div className="text-sm font-semibold mb-1">{sit.title}</div>
              <p className="text-xs text-zinc-500 leading-relaxed">{sit.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Meals Per Day */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2.5 flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-zinc-500" />
            <span>Preferred Meals Per Day</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {mealCounts.map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onChange({ mealsPerDay: num })}
                className={`py-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  data.mealsPerDay === num
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-600 font-semibold shadow-2xs'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                <div className="text-sm font-bold">{num} Meals</div>
                <div className="text-[10px] text-zinc-400">
                  {num === 3 ? 'Classic' : num === 4 ? '+ Workout snack' : 'Small & frequent'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2.5">
            Preferred Indian Style
          </label>
          <select
            value={data.indianFoodStyle}
            onChange={(e) => onChange({ indianFoodStyle: e.target.value as IndianFoodStyle })}
            aria-label="Preferred Indian Style"
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all shadow-2xs cursor-pointer"
          >
            {indianStyles.map((st) => (
              <option key={st.id} value={st.id}>
                {st.title} — {st.desc}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-zinc-400 mt-1">Adapts recipe spices and pantry list</p>
        </div>
      </div>

      {/* Familiar Indian Staples Banner */}
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
          Staples Built Into Your Plan
        </div>
        <div className="flex flex-wrap gap-1.5">
          {commonStaples.map((staple) => (
            <span
              key={staple}
              className="text-xs px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-700 font-medium"
            >
              {staple}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
