import React from 'react';
import { ScheduleEvent } from '../../types';
import { Badge } from '../ui/Badge';
import {
  Clock,
  Dumbbell,
  Utensils,
  Briefcase,
  Moon,
  Sparkles,
  HeartPulse,
} from 'lucide-react';

export interface DailyScheduleViewProps {
  events: ScheduleEvent[];
  occupation: string;
}

export const DailyScheduleView: React.FC<DailyScheduleViewProps> = ({
  events,
  occupation,
}) => {
  const getEventIcon = (type: ScheduleEvent['type']) => {
    switch (type) {
      case 'workout':
        return <Dumbbell className="w-4 h-4 text-emerald-700" />;
      case 'meal':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'work':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'sleep':
        return <Moon className="w-4 h-4 text-indigo-600" />;
      case 'recovery':
        return <HeartPulse className="w-4 h-4 text-rose-500" />;
    }
  };

  const getTypeBadge = (type: ScheduleEvent['type']) => {
    switch (type) {
      case 'workout':
        return <Badge variant="accent" size="sm">Training</Badge>;
      case 'meal':
        return <Badge variant="warning" size="sm">Meal Fuel</Badge>;
      case 'work':
        return <Badge variant="neutral" size="sm">Focus / Work</Badge>;
      case 'sleep':
        return <Badge variant="default" size="sm">Rest</Badge>;
      case 'recovery':
        return <Badge variant="success" size="sm">Reset</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
              Personalized 24-Hour Rhythm
            </h2>
            <Badge variant="default" size="sm">
              {occupation.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Seamlessly integrating workout blocks and high-protein Indian meals into your schedule.
          </p>
        </div>

        <div className="text-xs text-zinc-500 bg-white px-3 py-1.5 rounded-lg border border-zinc-200 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>Calculated from your departure & wake-up inputs</span>
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-zinc-200">
        {events.map((evt) => (
          <div key={evt.id} className="relative group">
            {/* Timeline Node Dot */}
            <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-zinc-300 group-hover:border-emerald-600 flex items-center justify-center transition-colors shadow-2xs">
              {getEventIcon(evt.type)}
            </div>

            {/* Event Card */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-4 sm:p-5 shadow-2xs hover:border-zinc-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {evt.time}
                  </span>
                  {getTypeBadge(evt.type)}
                  {evt.duration && (
                    <span className="text-[11px] text-zinc-400">
                      ({evt.duration})
                    </span>
                  )}
                </div>

                <h4 className="text-sm sm:text-base font-bold text-zinc-900 mt-1">
                  {evt.title}
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              {evt.type === 'workout' && (
                <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50/80 px-3 py-1 rounded-lg border border-emerald-200/60">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Priority Block</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
