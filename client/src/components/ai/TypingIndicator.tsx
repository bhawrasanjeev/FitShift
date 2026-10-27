import React from 'react';
import { Sparkles } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 animate-in fade-in duration-200">
      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
        <Sparkles className="w-4 h-4 text-emerald-700 animate-pulse" />
      </div>
      <div className="bg-white border border-zinc-200/90 rounded-2xl rounded-tl-sm px-4 py-3 shadow-2xs">
        <div className="flex items-center gap-1.5 h-5">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
          <span className="ml-2 text-xs text-zinc-400 font-medium">
            Formulating guidance...
          </span>
        </div>
      </div>
    </div>
  );
};
