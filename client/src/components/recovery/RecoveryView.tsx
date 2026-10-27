import React from 'react';
import { RecoveryGuidance } from '../../types';
import {
  Moon,
  Droplets,
  Activity,
  Smile,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export interface RecoveryViewProps {
  guidance: RecoveryGuidance[];
}

export const RecoveryView: React.FC<RecoveryViewProps> = ({ guidance }) => {
  const categoryIcons: Record<string, React.ReactNode> = {
    sleep: <Moon className="w-5 h-5 text-indigo-600" />,
    hydration: <Droplets className="w-5 h-5 text-blue-600" />,
    mobility: <Activity className="w-5 h-5 text-emerald-600" />,
    mental: <Smile className="w-5 h-5 text-amber-600" />,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
            Rest, Sleep & Tissue Repair
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Practical lifestyle habits to accelerate recovery without wearable tracking gadgets.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/70">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Rest Is An Active Discipline</span>
        </div>
      </div>

      {/* Philosophy banner */}
      <div className="p-4 rounded-2xl bg-zinc-900 text-white shadow-md flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-white/10 shrink-0 text-emerald-400">
          <Moon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-tight">
            Why Rest Multiplies Training Returns
          </h3>
          <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
            During heavy training sessions, you create micro-tears in muscle myofibrils. It is exclusively during restorative deep sleep and balanced rest days that your endocrine system releases growth hormone to rebuild those fibers thicker and more resilient.
          </p>
        </div>
      </div>

      {/* Grid of Recovery Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guidance.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                  {categoryIcons[item.category] || <Activity className="w-4 h-4" />}
                </div>
                <h4 className="text-base font-bold text-zinc-900">{item.title}</h4>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-4">
                {item.tip}
              </p>
            </div>

            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex items-start gap-2 text-xs text-zinc-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-zinc-900">Immediate Action: </strong>
                {item.actionableStep}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
