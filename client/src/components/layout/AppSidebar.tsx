import React from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  CalendarClock,
  ShoppingCart,
  Pill,
  MoonStar,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

export type PlanTab =
  | 'overview'
  | 'workout'
  | 'diet'
  | 'schedule'
  | 'grocery'
  | 'supplements'
  | 'recovery'
  | 'ai';

export interface AppSidebarProps {
  activeTab: PlanTab;
  onSelectTab: (tab: PlanTab) => void;
  onOpenLateTired: () => void;
  onOpenEditPlan: () => void;
  isLateTiredActive: boolean;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenLateTired,
  onOpenEditPlan,
  isLateTiredActive,
}) => {
  const navItems: { id: PlanTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'workout', label: 'Workout', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'diet', label: 'Diet', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'schedule', label: 'Daily Schedule', icon: <CalendarClock className="w-4 h-4" /> },
    { id: 'grocery', label: 'Grocery List', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'supplements', label: 'Supplements', icon: <Pill className="w-4 h-4" /> },
    { id: 'recovery', label: 'Recovery & Advice', icon: <MoonStar className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Assistant', icon: <Sparkles className="w-4 h-4" />, badge: 'AI' },
  ];

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-zinc-200/80 bg-white/70 p-4 shrink-0 min-h-[calc(100vh-4rem)]">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Plan Navigation
          </p>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200/70 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-emerald-700' : 'text-zinc-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      item.id === 'ai'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-zinc-100 text-zinc-500 font-medium'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Special Actions Box */}
        <div className="mt-auto pt-6 space-y-2 border-t border-zinc-100">
          <button
            type="button"
            onClick={onOpenLateTired}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
              isLateTiredActive
                ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-2xs'
                : 'bg-zinc-50 hover:bg-zinc-100/80 border-zinc-200/80 text-zinc-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className={`w-4 h-4 ${isLateTiredActive ? 'text-amber-600 animate-pulse' : 'text-zinc-500'}`} />
              <div>
                <p className="text-xs font-semibold">
                  {isLateTiredActive ? 'Late Mode Active' : 'Late / Tired Today?'}
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  {isLateTiredActive ? '15m gentle recovery active' : '1-click adaptive plan'}
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-white border border-zinc-200 text-zinc-600">
              {isLateTiredActive ? 'Active' : 'Adapt'}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenEditPlan}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Edit Plan Settings</span>
          </button>
        </div>
      </aside>

      {/* Mobile Horizontal Sub-Navigation */}
      <div className="lg:hidden border-b border-zinc-200/80 bg-white/90 sticky top-16 z-30 overflow-x-auto py-2 px-4 flex items-center gap-2 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={onOpenLateTired}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer border ${
            isLateTiredActive
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-zinc-50 text-zinc-700 border-zinc-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{isLateTiredActive ? 'Late Mode' : 'Late/Tired'}</span>
        </button>
      </div>
    </>
  );
};
