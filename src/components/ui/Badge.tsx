import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  const variantStyles = {
    default: 'bg-zinc-100 text-zinc-700 border border-zinc-200/80',
    accent: 'bg-emerald-50 text-emerald-800 border border-emerald-200/70',
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    neutral: 'bg-zinc-900 text-zinc-100',
    outline: 'bg-transparent text-zinc-600 border border-zinc-300',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full whitespace-nowrap transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
