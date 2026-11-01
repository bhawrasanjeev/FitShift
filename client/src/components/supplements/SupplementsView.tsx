import React from 'react';
import { SupplementPreference, OptimizedFood } from '../../types';
import { Badge } from '../ui/Badge';
import {
  Apple,
  Pill,
  ShieldCheck,
  IndianRupee,
} from 'lucide-react';

export interface SupplementsViewProps {
  preference: SupplementPreference;
  monthlyBudget?: number;
  allocatedFoods?: OptimizedFood[];
}

export const SupplementsView: React.FC<SupplementsViewProps> = ({
  preference,
  monthlyBudget,
  allocatedFoods = [],
}) => {
  const isFoodFirst = preference === 'no_supplements';
  const activeSupplements = allocatedFoods.filter((f) => f.isSupplement);

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
              {isFoodFirst ? 'Food-First Active' : 'Supplements Allowed'}
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
              ₹{monthlyBudget} / month
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
              : 'Whole Food Foundation First, Convenience Supplements Second'}
          </h3>
          <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
            Whole food staples provide superior satiety, micronutrients, and economic efficiency. Supplements exist strictly as convenience options when daily cooking or digestion capacity is constrained.
          </p>
        </div>
      </div>

      {/* Optimizer Supplements Status */}
      {!isFoodFirst && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-zinc-700" />
            <h4 className="text-sm font-bold text-zinc-900">
              Diet Optimizer Allocation
            </h4>
          </div>

          {activeSupplements.length === 0 ? (
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-600 space-y-1">
              <p className="font-semibold text-zinc-800">
                No supplements were required for your target.
              </p>
              <p>
                The Budget Diet Optimizer satisfied your daily protein requirement completely using whole food staples within your budget limit.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeSupplements.map((sup, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-purple-950">{sup.name}</h5>
                    <span className="text-xs font-bold text-purple-900">
                      ₹{sup.estimatedCost}/day
                    </span>
                  </div>
                  <p className="text-xs text-purple-800 mt-1">
                    Portion: {sup.quantityGrams}g delivering {sup.proteinGrams}g protein.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Whole Food Alternatives Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <Apple className="w-4 h-4 text-emerald-700" />
            Primary High-Protein Indian Whole Food Staples
          </h4>
          <span className="text-[11px] text-emerald-800 font-semibold">
            Nutritional Reference
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
    </div>
  );
};
