import React from 'react';
import { Check } from 'lucide-react';

export interface SelectCardProps {
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  badge?: string;
  priceTag?: string;
  disabled?: boolean;
  className?: string;
}

export const SelectCard: React.FC<SelectCardProps> = ({
  title,
  description,
  selected,
  onClick,
  icon,
  badge,
  priceTag,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative text-left w-full p-4 rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
        selected
          ? 'bg-emerald-50/50 border-emerald-600 shadow-xs'
          : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50 shadow-xs'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {icon && (
            <div
              className={`p-2 rounded-lg text-lg transition-colors ${
                selected
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200/70'
              }`}
            >
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-medium text-sm sm:text-base ${selected ? 'text-emerald-950 font-semibold' : 'text-zinc-900'}`}>
                {title}
              </span>
              {badge && (
                <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs sm:text-sm text-zinc-500 mt-1 leading-relaxed">
                {description}
              </p>
            )}
            {priceTag && (
              <div className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-100/70 inline-block px-2 py-0.5 rounded-md">
                {priceTag}
              </div>
            )}
          </div>
        </div>

        <div
          className={`flex-shrink-0 w-5 h-5 rounded-full border transition-all flex items-center justify-center ${
            selected
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'border-zinc-300 bg-white group-hover:border-zinc-400'
          }`}
        >
          {selected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
        </div>
      </div>
    </button>
  );
};
