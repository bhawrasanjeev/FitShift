import React from 'react';
import { Dumbbell, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export interface NavbarProps {
  currentView: 'landing' | 'onboarding' | 'plan';
  onNavigate: (view: 'landing' | 'onboarding' | 'plan') => void;
  hasPlan?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  hasPlan = false,
}) => {
  const scrollToSection = (id: string) => {
    if (currentView !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-[#FAFAFA]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-800 transition-colors">
            <Dumbbell className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-zinc-900">
                FitShift
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-sm">
                Engine
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-normal hidden sm:block -mt-0.5">
              Routine-first, budget-realistic fitness
            </p>
          </div>
        </button>

        {/* Center Links (Landing Mode) */}
        {currentView === 'landing' && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-zinc-900 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('faq')}
              className="hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Indian Staples
            </button>
          </nav>
        )}

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {hasPlan && currentView !== 'plan' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('plan')}
            >
              View My Plan
            </Button>
          )}

          {currentView !== 'onboarding' ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('onboarding')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create My Plan
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('landing')}
            >
              Back to Home
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
