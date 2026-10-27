import React from 'react';
import { SupplementRecommendation, SupplementPreference } from '../../types';
import { Badge } from '../ui/Badge';
import {
  Apple,
  Pill,
  ShieldCheck,
  IndianRupee,
  Clock,
  AlertCircle,
} from 'lucide-react';

export interface SupplementsViewProps {
  preference: SupplementPreference;
  monthlyBudget?: number;
  recommendations: SupplementRecommendation[];
}

export const SupplementsView: React.FC<SupplementsViewProps> = ({
  preference,
  monthlyBudget,
  recommendations,
}) => {
  const isFoodFirst = preference === 'no_supplements';

  const highProteinIndianFoods = [
    {
      name: 'Roasted Chana Sattu',
      proteinPerServing: '20g per 100g (~₹15)',
      advantage: 'Natural plant protein flour soluble in cold water or buttermilk. High fiber and minerals.',
    },
    {
      name: 'Soya Chunks (Defatted)',
      proteinPerServing: '52g per 100g (~₹16)',
      advantage: 'One of the most cost-effective protein sources on earth. Complete amino acid profile.',
    },
    {
      name: 'Fresh Curd / Dahi & Paneer',
      proteinPerServing: '18g per 100g paneer (~₹35)',
      advantage: 'Slow-digesting micellar casein protein for overnight muscle repair.',
    },
    {
      name: 'Desi Kala Chana (Black Chickpeas)',
      proteinPerServing: '19g per 100g dry (~₹10)',
      advantage: 'Sustained energy release, low glycemic index, rich in dietary zinc and iron.',
    },
    {
      name: 'Whole Eggs / Whites',
      proteinPerServing: '6g per egg (~₹7)',
      advantage: 'Highest biological value (BV 100) protein for optimal tissue repair.',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
              Supplement & Whole-Food Advisory
            </h2>
            <Badge variant={isFoodFirst ? 'accent' : 'default'} size="sm">
              {isFoodFirst ? 'Food-First Active' : 'Supplements Enabled'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Grounded in clinical sports science and realistic Indian kitchen economics.
          </p>
        </div>

        {monthlyBudget && !isFoodFirst && (
          <div className="text-right">
            <span className="text-[11px] text-zinc-400 block font-medium">Monthly Cap</span>
            <span className="text-sm font-bold text-emerald-800 flex items-center justify-end">
              <IndianRupee className="w-3.5 h-3.5 inline" />
              {monthlyBudget} / month
            </span>
          </div>
        )}
      </div>

      {/* Philosophy Banner */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
          <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-900">
            {isFoodFirst
              ? 'Your Plan is 100% Whole-Food Powered'
              : 'Food Foundation First, Supplements Second'}
          </h3>
          <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
            Supplements provide zero magical fat-loss or muscle-building properties that whole nutrition cannot supply. They exist strictly for convenience when daily schedule or kitchen access is limited.
          </p>
        </div>
      </div>

      {/* Whole Food Alternatives Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <Apple className="w-4 h-4 text-emerald-700" />
            Budget High-Protein Indian Whole Foods
          </h4>
          <span className="text-[11px] text-emerald-800 font-semibold">
            Zero powders required
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {highProteinIndianFoods.map((food, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="font-bold text-sm text-zinc-900 mb-1">{food.name}</div>
                <div className="text-xs font-semibold text-emerald-700 mb-2">
                  {food.proteinPerServing}
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">{food.advantage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Supplement Guidance if open */}
      {!isFoodFirst && (
        <div className="space-y-4 pt-4 border-t border-zinc-200">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-zinc-600" />
            <h4 className="text-sm font-bold text-zinc-900">
              Evidence-Backed Supplement Recommendations
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      {rec.productCategory}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center">
                      <IndianRupee className="w-3 h-3 inline" />
                      ~{rec.estimatedMonthlyCostRupees}/mo
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-zinc-900">{rec.productName}</h5>
                  <p className="text-xs text-zinc-600 mt-2 leading-relaxed">{rec.whyUseful}</p>

                  <div className="mt-3 p-3 bg-zinc-50 rounded-xl text-xs space-y-1.5 border border-zinc-100">
                    <div className="text-zinc-500">
                      <span className="font-semibold text-zinc-700">Food Alternative: </span>
                      {rec.foodBasedAlternative}
                    </div>
                    <div className="text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span>{rec.recommendedTiming}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-amber-700 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/70 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{rec.cautionNotice}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
