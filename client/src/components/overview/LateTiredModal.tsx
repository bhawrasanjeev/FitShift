import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  Sparkles,
  Moon,
  Clock,
  RefreshCw,
  Info,
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
      description="Adaptive downshift that modifies daily expectations to protect endocrine recovery."
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
              Activate Late / Tired Mode
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
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            isActive
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : 'bg-zinc-50 border-zinc-200 text-zinc-800'
          }`}
        >
          <Moon
            className={`w-5 h-5 shrink-0 mt-0.5 ${
              isActive ? 'text-amber-600' : 'text-zinc-600'
            }`}
          />
          <div>
            <h4 className="text-sm font-bold">
              {isActive
                ? 'Adaptive Low-Intensity Mode Active'
                : 'Preserve Consistency Without Exhaustion'}
            </h4>
            <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
              When work runs late or biological energy is depleted, attempting intense training raises cortisol and impairs recovery. Adaptive mode prioritizes nervous system downregulation.
            </p>
          </div>
        </div>

        {/* Changes Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white border border-zinc-200 rounded-xl">
            <div className="font-semibold text-zinc-900 flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Reduced Training Load</span>
            </div>
            <p className="text-zinc-500">
              Downshift to a 15-minute gentle mobility and spinal decompression flow.
            </p>
          </div>

          <div className="p-3 bg-white border border-zinc-200 rounded-xl">
            <div className="font-semibold text-zinc-900 flex items-center gap-1.5 mb-1">
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Sleep Shift</span>
            </div>
            <p className="text-zinc-500">
              Shift tonight&apos;s bedtime 30–45 minutes earlier to recover your cortisol baseline.
            </p>
          </div>
        </div>

        {/* Engine Notice */}
        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-2.5 text-xs text-zinc-600">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Workout Generator Integration:</strong> Automatic workout session replacement with bodyweight spinal flows will be fully linked when the Phase 6 Workout Generator is activated.
          </p>
        </div>
      </div>
    </Modal>
  );
};
