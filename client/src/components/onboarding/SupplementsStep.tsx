import React from 'react';
import { Supplements, SupplementPreference } from '../../types';
import { Apple, Pill, HelpCircle, ShieldAlert, IndianRupee } from 'lucide-react';

export interface SupplementsStepProps {
  data: Supplements;
  onChange: (updated: Partial<Supplements>) => void;
}

export const SupplementsStep: React.FC<SupplementsStepProps> = ({
  data,
  onChange,
}) => {
  const options: {
    id: SupplementPreference;
    title: string;
    description: string;
    icon: React.ReactNode;
    tag?: string;
  }[] = [
    {
      id: 'no_supplements',
      title: 'No supplements — build my plan with regular food',
      description: 'Prioritize 100% kitchen staples: Sattu, Moong Dal, Kala Chana, Curd, Paneer, and Eggs. Zero powders.',
      icon: <Apple className="w-5 h-5 text-emerald-700" />,
      tag: 'Recommended Default',
    },
    {
      id: 'open_to_supplements',
      title: "Yes, I'm open to evidence-backed supplements",
      description: 'Consider practical additions like pure Creatine Monohydrate or convenient unflavoured Whey Protein.',
      icon: <Pill className="w-5 h-5 text-zinc-700" />,
    },
    {
      id: 'not_sure',
      title: 'Not sure — help me understand my options',
      description: 'FitShift will provide an educational breakdown showing food alternatives alongside supplement costs.',
      icon: <HelpCircle className="w-5 h-5 text-amber-600" />,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-3">
          Supplement Philosophy
        </label>
        <div className="space-y-3">
          {options.map((opt) => {
            const isSelected = data.preference === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ preference: opt.id })}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-4 ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-600 font-semibold shadow-xs ring-1 ring-emerald-600'
                    : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${
                    isSelected ? 'bg-emerald-100 text-emerald-900' : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {opt.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm sm:text-base font-semibold">{opt.title}</span>
                    {opt.tag && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {opt.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{opt.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conditional Monthly Supplement Budget */}
      {data.preference === 'open_to_supplements' && (
        <div className="p-5 bg-white border border-emerald-200 rounded-2xl shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <label
              htmlFor="supplement-monthly-budget"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-700"
            >
              Optional Monthly Supplement Budget Cap
            </label>
            <div className="flex items-center text-base font-bold text-emerald-700">
              <IndianRupee className="w-4 h-4 inline" />
              <span>{data.monthlyBudgetRupees || 1200}</span>
              <span className="text-xs text-zinc-400 font-normal ml-1">/ month</span>
            </div>
          </div>
          <input
            id="supplement-monthly-budget"
            type="range"
            min="400"
            max="4000"
            step="100"
            value={data.monthlyBudgetRupees || 1200}
            onChange={(e) => onChange({ monthlyBudgetRupees: Number(e.target.value) })}
            className="w-full accent-emerald-700 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-zinc-400">
            <span>₹400 (e.g. Creatine only)</span>
            <span>₹1,500 (Creatine + Basic Whey)</span>
            <span>₹4,000</span>
          </div>
        </div>
      )}

      {/* Educational Notice */}
      <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-500 leading-relaxed">
          <strong>Food-first integrity:</strong> No supplement is mandatory for fitness, muscle hypertrophy, or weight loss. We never recommend commercial powders simply because a budget exists.
        </p>
      </div>
    </div>
  );
};
