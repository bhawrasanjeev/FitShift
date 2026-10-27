import React from 'react';
import { Dumbbell, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200/80 bg-white/70 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight text-zinc-900">
                FitShift
              </span>
            </div>
            <p className="text-sm text-zinc-500 max-w-sm leading-relaxed mb-4">
              Routine-first, budget-realistic fitness and nutrition engine designed for real Indian lives, busy schedules, and authentic whole foods.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero mandatory accounts • Food-first philosophy • Privacy respected</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Core Principles
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>Routine beats intensity</li>
              <li>Affordable Indian staples</li>
              <li>Home & Gym interoperability</li>
              <li>Zero calorie-burn anxiety</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Transparency
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              All nutritional figures and cost estimates are indicative planning models based on Indian wholesale and retail staples (Sattu, Chana, Dal, Dahi, Paneer, Eggs). Always consult a healthcare provider for medical conditions.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} FitShift Engine. Built with focus & restraint.</p>
          <div className="flex items-center gap-1 text-zinc-500">
            <span>Crafted for sustainable fitness</span>
            <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
