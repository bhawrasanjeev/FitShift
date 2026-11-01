import React, { useState } from 'react';
import { Exercise } from '../../types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Dumbbell,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ImageOff,
  Flame,
} from 'lucide-react';

export interface ExerciseDetailsModalProps {
  exercise: Exercise | null;
  exerciseIndex?: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAlternative: (currentId: string, exerciseIndex?: number) => void;
}

export const ExerciseDetailsModal: React.FC<ExerciseDetailsModalProps> = ({
  exercise,
  exerciseIndex,
  isOpen,
  onClose,
  onSelectAlternative,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Reset image status whenever active exercise or its thumbnail changes
  React.useEffect(() => {
    setImageFailed(false);
  }, [exercise?.id, exercise?.thumbnailUrl]);

  if (!exercise) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={exercise.name}
      description={`Target: ${exercise.targetMuscle} • Equipment: ${exercise.equipment}`}
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              onSelectAlternative(exercise.id, exerciseIndex !== null && exerciseIndex !== undefined ? exerciseIndex : undefined);
              onClose();
            }}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Switch to {exercise.alternative.name}
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Got It
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Exercise Media Display */}
        <div className="relative w-full h-56 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-200 flex items-center justify-center">
          {!imageFailed && exercise.thumbnailUrl ? (
            <img
              key={exercise.thumbnailUrl || exercise.id}
              src={exercise.thumbnailUrl}
              alt={exercise.name}
              onError={() => setImageFailed(true)}
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-400 p-4 text-center">
              <ImageOff className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs font-semibold text-zinc-300">
                Visual Exercise Form Guide
              </p>
              <p className="text-[11px] text-zinc-500 max-w-xs mt-1">
                Maintain neutral cervical spine and fluid cadence through both eccentric and concentric phases.
              </p>
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="neutral" size="sm">
              {exercise.environment === 'home' ? 'Home Equipment' : 'Gym Equipment'}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg">
            <span className="flex items-center gap-1.5 font-medium">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
              {exercise.setsReps}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              {exercise.restSeconds}s Rest Between Sets
            </span>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-3 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Execution Technique
          </h4>
          <ol className="space-y-2 text-xs sm:text-sm text-zinc-700">
            {exercise.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-600 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Common Mistakes */}
        {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Common Form Mistakes to Avoid
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-950/90 list-disc list-inside">
              {exercise.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="leading-relaxed">
                  {mistake}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Alternative Exercise Callout */}
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-emerald-700" />
              Direct Paired Alternative
            </h4>
            <Badge variant="outline" size="sm">
              {exercise.alternative.environment.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm font-bold text-zinc-900">{exercise.alternative.name}</p>
          <p className="text-xs text-zinc-500 mt-1">{exercise.alternative.note}</p>
        </div>
      </div>
    </Modal>
  );
};
