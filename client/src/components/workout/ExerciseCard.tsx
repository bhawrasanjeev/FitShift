import React, { useState } from 'react';
import { Exercise } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Dumbbell, Clock, RefreshCw, Eye, ImageOff } from 'lucide-react';

export interface ExerciseCardProps {
  exercise: Exercise;
  onViewDetails: (exercise: Exercise) => void;
  onSwapAlternative: (exerciseId: string) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onViewDetails,
  onSwapAlternative,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs hover:border-zinc-300 transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
      {/* Exercise Media Thumbnail & Main Info */}
      <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0 flex items-center justify-center">
          {!imageError && exercise.thumbnailUrl ? (
            <img
              src={exercise.thumbnailUrl}
              alt={exercise.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-400 p-2 text-center">
              <ImageOff className="w-5 h-5 mb-1" />
              <span className="text-[9px] font-medium uppercase tracking-wider">Demo</span>
            </div>
          )}
          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
            {exercise.environment === 'home' ? 'HOME' : exercise.environment === 'gym' ? 'GYM' : 'ANY'}
          </span>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="text-base font-bold text-zinc-900 tracking-tight">
              {exercise.name}
            </h4>
            <Badge variant="accent" size="sm">
              {exercise.targetMuscle}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-600 mt-2 flex-wrap">
            <span className="flex items-center gap-1 font-semibold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded-md">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-700" />
              {exercise.setsReps}
            </span>
            <span className="flex items-center gap-1 text-zinc-500">
              <Clock className="w-3.5 h-3.5" />
              Rest: {exercise.restSeconds}s
            </span>
          </div>

          <div className="text-[11px] text-zinc-400 mt-1.5 flex items-center gap-1">
            <span>Equipment:</span>
            <span className="text-zinc-600 font-medium">{exercise.equipment}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(exercise)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
          className="text-xs"
        >
          View Demo
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onSwapAlternative(exercise.id)}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="text-xs"
          title={`Switch to ${exercise.alternative.name}`}
        >
          Swap Alternative
        </Button>
      </div>
    </div>
  );
};
