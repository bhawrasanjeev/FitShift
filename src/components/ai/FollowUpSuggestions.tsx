import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export interface FollowUpSuggestionsProps {
  suggestions: string[];
  onSelect: (prompt: string) => void;
}

export const FollowUpSuggestions: React.FC<FollowUpSuggestionsProps> = ({
  suggestions,
  onSelect,
}) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="mt-3.5 pt-3 border-t border-zinc-100 space-y-2 animate-in fade-in duration-200">
      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-emerald-600" />
        Suggested Follow-Ups
      </span>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(suggestion)}
            className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-zinc-50 hover:bg-emerald-50 hover:border-emerald-200 border border-zinc-200/80 text-zinc-700 hover:text-emerald-900 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs group"
          >
            <span>{suggestion}</span>
            <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
};
