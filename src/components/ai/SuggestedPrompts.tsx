import React, { useState } from 'react';
import { SUGGESTED_PROMPT_CATEGORIES } from '../../services/aiAssistantService';
import {
  Dumbbell,
  UtensilsCrossed,
  Pill,
  Moon,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  onSelectPrompt,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('workout');

  const categoryIcons: Record<string, React.ReactNode> = {
    workout: <Dumbbell className="w-3.5 h-3.5" />,
    nutrition: <UtensilsCrossed className="w-3.5 h-3.5" />,
    supplements: <Pill className="w-3.5 h-3.5" />,
    lifestyle: <Moon className="w-3.5 h-3.5" />,
    plan: <Sparkles className="w-3.5 h-3.5" />,
  };

  const currentCategoryData =
    SUGGESTED_PROMPT_CATEGORIES.find((c) => c.id === selectedCategory) ||
    SUGGESTED_PROMPT_CATEGORIES[0];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Suggested Question Categories
        </span>
        <span className="text-[11px] text-zinc-400">Click to ask instantly</span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {SUGGESTED_PROMPT_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-300 shadow-2xs'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              <span className={isSelected ? 'text-emerald-700' : 'text-zinc-400'}>
                {categoryIcons[cat.id]}
              </span>
              <span>{cat.categoryName}</span>
            </button>
          );
        })}
      </div>

      {/* Prompt Cards for Selected Category */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {currentCategoryData.prompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="p-3.5 rounded-xl bg-white border border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50/20 text-left transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
          >
            <p className="text-xs font-medium text-zinc-800 group-hover:text-emerald-950 leading-relaxed">
              &ldquo;{prompt}&rdquo;
            </p>
            <div className="mt-3 flex items-center justify-end text-[11px] text-emerald-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Ask question</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
