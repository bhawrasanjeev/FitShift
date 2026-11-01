import React from 'react';
import {
  Moon,
  Droplets,
  Activity,
  Smile,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export interface RecoveryViewProps {
  sleepHours?: number;
  wakeUpTime?: string;
}

export const RecoveryView: React.FC<RecoveryViewProps> = ({
  sleepHours = 7.5,
  wakeUpTime = '06:30',
}) => {
  const recoveryPillars = [
    {
      id: 'sleep',
      category: 'sleep',
      icon: <Moon className="w-5 h-5 text-indigo-600" />,
      title: 'Sleep & Endocrine Repair',
      tip: `Your configured target is ${sleepHours} hours of sleep, waking up at ${wakeUpTime}. Deep non-REM sleep is when human growth hormone (HGH) peaks to repair muscle tissue broken down during exercise.`,
      actionableStep: `Aim to be in bed ${Math.round(sleepHours + 0.5)} hours before ${wakeUpTime} to account for natural sleep latency.`,
    },
    {
      id: 'hydration',
      category: 'hydration',
      icon: <Droplets className="w-5 h-5 text-blue-600" />,
      title: 'Daily Hydration & Electrolyte Balance',
      tip: 'In Indian climates, sub-clinical dehydration reduces workout performance and increases perceived exertion. Drinking water with meals and having buttermilk or lemon water maintains fluid balance.',
      actionableStep: 'Drink 500ml water within 20 minutes of waking up, and keep a 1-liter bottle at your desk throughout the day.',
    },
    {
      id: 'mobility',
      category: 'mobility',
      icon: <Activity className="w-5 h-5 text-emerald-600" />,
      title: 'Spinal Decompression & Posture Reset',
      tip: 'Extended desk sitting causes anterior pelvic tilt and tight hip flexors. 5 minutes of daily joint mobility restores synovial fluid without needing dedicated gym equipment.',
      actionableStep: 'Perform 60 seconds of deep bodyweight squats (Malasana) and 10 Cat-Cow spinal flows after work transit.',
    },
    {
      id: 'mental',
      category: 'mental',
      icon: <Smile className="w-5 h-5 text-amber-600" />,
      title: 'Cortisol Management & Nervous System Recovery',
      tip: 'Chronic professional stress keeps the sympathetic nervous system elevated, which impairs glycogen replenishment and muscle protein synthesis.',
      actionableStep: 'Take a 10-minute device-free walk after dinner to downregulate nervous system arousal before bedtime.',
    },
  ];

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
            During training sessions, you create micro-tears in muscle myofibrils. It is exclusively during restorative deep sleep and balanced rest days that your endocrine system releases growth hormone to rebuild those fibers thicker and more resilient.
          </p>
        </div>
      </div>

      {/* Grid of Recovery Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recoveryPillars.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                  {item.icon}
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
