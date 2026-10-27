import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { lateTiredExercises } from '../../data/mockPlan';
import {
  Sparkles,
  Moon,
  Clock,
  Dumbbell,
  RefreshCw,
} from 'lucide-react';

export interface LateTiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  isActive: boolean;
  onToggleActive: (active: boolean) => void;
}

export const LateTiredModal: React.FC<LateTiredModalProps> = ({
  isOpen,
  onClose,
  isActive,
  onToggleActive,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isActive ? 'Late / Tired Routine is Active' : 'Had a Late or Tiring Day?'}
      description="One-click adjustment that shifts today's heavy demands into a soothing 15-minute mobility reset."
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          {isActive ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onToggleActive(false);
                onClose();
              }}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Return to Regular Plan
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Dismiss
            </Button>
          )}

          {!isActive ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onToggleActive(true);
                onClose();
              }}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}
              className="bg-amber-600 hover:bg-amber-700 text-white border-amber-700"
            >
              Activate 15m Gentle Routine
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={onClose}>
              Keep Active Today
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-5">
        {/* Banner */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${isActive ? 'bg-amber-50 border-amber-200 text-amber-950' : 'bg-zinc-50 border-zinc-200 text-zinc-800'}`}>
          <Moon className={`w-5 h-5 shrink-0 mt-0.5 ${isActive ? 'text-amber-600' : 'text-zinc-600'}`} />
          <div>
            <h4 className="text-sm font-bold">
              {isActive ? 'Adaptive Low-Intensity Mode Active' : 'Preserve the Habit Without the Exhaustion'}
            </h4>
            <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
              When work runs late or biological energy is depleted, pushing for personal records damages recovery. Instead, this 15-minute decompression maintains consistency without central nervous system burnout.
            </p>
          </div>
        </div>

        {/* Changes Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white border border-zinc-200 rounded-xl">
            <div className="font-semibold text-zinc-900 flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Reduced Duration</span>
            </div>
            <p className="text-zinc-500">
              Down from 45 mins to an unhurried 15-minute parasympathetic flow.
            </p>
          </div>

          <div className="p-3 bg-white border border-zinc-200 rounded-xl">
            <div className="font-semibold text-zinc-900 flex items-center gap-1.5 mb-1">
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Suggested Sleep Shift</span>
            </div>
            <p className="text-zinc-500">
              Shift tonight&apos;s bedtime 30–45 minutes earlier to recover cortisol baseline.
            </p>
          </div>
        </div>

        {/* Gentle movements preview */}
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2.5 flex items-center gap-1.5">
            <Dumbbell className="w-3.5 h-3.5 text-emerald-700" />
            <span>Gentle Replacement Movements (No Equipment)</span>
          </h5>

          <div className="space-y-2">
            {lateTiredExercises.map((ex) => (
              <div
                key={ex.id}
                className="p-3 rounded-xl border border-zinc-200 bg-white flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-zinc-900">{ex.name}</div>
                  <div className="text-[11px] text-zinc-500">{ex.setsReps} • {ex.targetMuscle}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60">
                  Easy Flow
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
