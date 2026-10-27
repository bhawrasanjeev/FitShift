import React from 'react';

export interface SegmentOption<T extends string | number> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

export interface SegmentedControlProps<T extends string | number> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  size = 'md',
  className = '',
}: SegmentedControlProps<T>) {
  const sizeClasses = size === 'sm' ? 'p-0.5 text-xs' : 'p-1 text-sm';
  const itemClasses = size === 'sm' ? 'py-1 px-2.5' : 'py-1.5 px-3.5';

  return (
    <div
      role="tablist"
      className={`inline-flex items-center bg-zinc-100/90 p-1 rounded-xl border border-zinc-200/80 ${sizeClasses} ${className}`}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={String(option.value)}
            role="tab"
            aria-selected={isSelected}
            type="button"
            onClick={() => onChange(option.value)}
            className={`relative flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${itemClasses} ${
              isSelected
                ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/80 font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            {option.icon && (
              <span className={isSelected ? 'text-emerald-700' : 'text-zinc-500'}>
                {option.icon}
              </span>
            )}
            <span>{option.label}</span>
            {option.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-emerald-100 text-emerald-800 font-semibold'
                    : 'bg-zinc-200 text-zinc-600'
                }`}
              >
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
