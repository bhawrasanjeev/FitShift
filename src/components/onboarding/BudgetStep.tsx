import React from 'react';
import { Budget, BudgetTier } from '../../types';
import { IndianRupee, Sparkles, Check } from 'lucide-react';

export interface BudgetStepProps {
  data: Budget;
  onChange: (updated: Partial<Budget>) => void;
}

export const BudgetStep: React.FC<BudgetStepProps> = ({
  data,
  onChange,
}) => {
  const tiers: {
    id: BudgetTier;
    title: string;
    range: string;
    avgDaily: number;
    description: string;
    samplePantry: string;
    tag?: string;
  }[] = [
    {
      id: 'ultra_budget',
      title: 'Ultra-Budget',
      range: 'Under ₹45 / day',
      avgDaily: 40,
      description: 'Built primarily around high-protein whole foods: Chana Sattu, Soya Chunks (52% protein), Yellow Moong, and seasonal sabzi.',
      samplePantry: 'Sattu buttermilk, boiled kala chana, soya chunks pulao, phulkas.',
      tag: 'Maximum Value',
    },
    {
      id: 'budget',
      title: 'Budget',
      range: '₹45 – ₹80 / day',
      avgDaily: 65,
      description: 'Adds fresh daily curd (dahi), eggs (if eggetarian), roasted peanuts, bananas, and occasional fresh paneer portions.',
      samplePantry: 'Sprouted moong chaat, eggs/paneer bhurji, curd rice, dal tadka.',
      tag: 'Most Popular',
    },
    {
      id: 'moderate',
      title: 'Moderate',
      range: '₹80 – ₹150 / day',
      avgDaily: 110,
      description: 'Enables generous daily paneer (100–150g), whole milk, chicken breast portions (non-veg), almonds, and diverse fresh greens.',
      samplePantry: 'Palak paneer, chicken curry, double egg toast, dry fruit oats.',
      tag: 'Flexible Variety',
    },
    {
      id: 'custom',
      title: 'Custom Budget',
      range: 'Set your own daily limit',
      avgDaily: data.customAmountRupees || 100,
      description: 'Specify an exact daily allowance tailored to your city, grocery delivery subscriptions, or dining preferences.',
      samplePantry: 'Scaled automatically based on your custom target.',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-3">
          Select Your Daily Food Budget Tier
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tiers.map((t) => {
            const isSelected = data.tier === t.id;
            return (
              <div
                key={t.id}
                onClick={() => {
                  onChange({
                    tier: t.id,
                    dailyBudgetRupees: t.id === 'custom' ? (data.customAmountRupees || 100) : t.avgDaily,
                  });
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50/60 border-emerald-600 shadow-xs ring-1 ring-emerald-600'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-zinc-900">{t.title}</span>
                        {t.tag && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {t.tag}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-emerald-700 mt-0.5 flex items-center">
                        <IndianRupee className="w-3.5 h-3.5 inline stroke-[2.5]" />
                        <span>{t.range}</span>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-zinc-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed mt-2">{t.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 text-[11px] text-zinc-500">
                  <span className="font-medium text-zinc-700">Includes: </span>
                  {t.samplePantry}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Budget Slider / Input */}
      {data.tier === 'custom' && (
        <div className="p-5 bg-white border border-emerald-200 rounded-2xl shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <label
              htmlFor="custom-budget-input"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-700"
            >
              Specify Your Target Daily Food Spend
            </label>
            <div className="flex items-center text-lg font-bold text-emerald-700">
              <span>₹</span>
              <input
                id="custom-budget-input"
                type="number"
                min="30"
                max="500"
                value={data.customAmountRupees || data.dailyBudgetRupees}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onChange({
                    customAmountRupees: val,
                    dailyBudgetRupees: val,
                  });
                }}
                className="w-20 px-2 py-1 ml-1 text-right font-bold text-lg border border-zinc-200 rounded-lg focus:outline-none focus:border-emerald-600"
              />
              <span className="text-xs text-zinc-400 font-normal ml-1">/ day</span>
            </div>
          </div>
          <input
            type="range"
            min="30"
            max="400"
            step="5"
            value={data.customAmountRupees || data.dailyBudgetRupees}
            onChange={(e) => {
              const val = Number(e.target.value);
              onChange({
                customAmountRupees: val,
                dailyBudgetRupees: val,
              });
            }}
            className="w-full accent-emerald-700 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-zinc-400 font-medium">
            <span>₹30/day (Minimalist)</span>
            <span>₹200/day</span>
            <span>₹400/day (Premium Whole Foods)</span>
          </div>
        </div>
      )}

      {/* Disclaimer Alert */}
      <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-500 leading-relaxed">
          <strong>Planning estimates:</strong> These cost ranges reflect raw staple purchases (groceries per 100g) in typical Indian retail and mandi markets. Cooking gas, oil, and delivery fees vary by locality.
        </p>
      </div>
    </div>
  );
};
