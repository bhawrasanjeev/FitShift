import React from 'react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  ArrowRight,
  UtensilsCrossed,
  Sparkles,
  Clock,
  IndianRupee,
  Home,
  ShieldCheck,
  Apple,
  ShoppingCart,
  Moon,
  ChevronRight,
} from 'lucide-react';

export interface LandingPageProps {
  onStartOnboarding: () => void;
  onViewSamplePlan?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOnboarding,
}) => {
  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-6 animate-in fade-in duration-500">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Routine-First, Budget-Realistic Fitness</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-zinc-950 tracking-tight max-w-4xl mx-auto leading-[1.08]">
            Fitness that <span className="text-emerald-700 underline decoration-emerald-200 decoration-4 underline-offset-8">fits your life</span>.
          </h1>

          {/* Supporting Copy */}
          <p className="mt-6 text-base sm:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Personalized workouts, Indian-food-based nutrition and realistic daily routines, built around your schedule, resources and budget.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={onStartOnboarding}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto text-base font-semibold px-8 py-4 shadow-md"
            >
              Create My Plan
            </Button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center font-medium rounded-lg text-base px-6 py-3.5 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 border border-zinc-200/80 transition-all"
            >
              Explore How It Works
            </a>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              No login or account required
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              Indian grocery economics
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Home className="w-4 h-4 text-emerald-600" />
              Home & Gym ready
            </span>
          </div>

          {/* Hero Interface Preview Card */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-2xl p-4 sm:p-6 text-left">
              {/* Fake App Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-xs font-mono text-zinc-400">
                    fitshift.app/demo-preview
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Home &bull; 45m &bull; Pure Veg &bull; ₹65/day
                  </span>
                </div>
              </div>

              {/* Sample 2-column preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Workout Card */}
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                      Day 1 Push Session
                    </span>
                    <Badge variant="accent" size="sm">Home Calisthenics</Badge>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-zinc-200/60 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">Controlled Tempo Push-Ups</h4>
                      <p className="text-[11px] text-zinc-500">3 sets &times; 12–15 reps &bull; Mat / Books</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700">60s rest</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-zinc-200/60 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">Pike Push-ups (Elevated Angle)</h4>
                      <p className="text-[11px] text-zinc-500">3 sets &times; 8–10 reps &bull; Shoulders & Core</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700">75s rest</span>
                  </div>
                </div>

                {/* Diet Card */}
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                      Sample Meal Architecture
                    </span>
                    <Badge variant="success" size="sm">₹22 Breakfast</Badge>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-zinc-200/60">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900">Chana Sattu Buttermilk & Sprouts</h4>
                        <p className="text-[11px] text-zinc-500 mt-0.5">40g Sattu, 200ml Curd Chaas, 50g Moong</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-800">21g Pro</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-zinc-200/60">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900">Kala Chana Curry & 2 Phulkas</h4>
                        <p className="text-[11px] text-zinc-500 mt-0.5">Desi black chickpeas, 2 rotis, dahi, cucumber</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-800">24g Pro</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
            FitShift Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight mt-3">
            Designed for the reality of your day, not an idealized fitness vacuum.
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 mt-3 leading-relaxed">
            Most fitness apps fail Indians because they assume a Western supermarket diet, 90 minutes of daily leisure, and expensive gym subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Routine-First Planning</h3>
              <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
                Workouts adapt to your exact college, office, or commute hours. Choose between 20, 30, 45, or 60-minute sessions that slip smoothly into your day.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Affordable Indian Nutrition</h3>
              <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
                Prioritizes high-protein staple foods like Sattu, Soya Chunks, Kala Chana, Moong Dal, Curd, and Eggs starting under ₹45/day. Zero exotic berries.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Home & Gym Switching</h3>
              <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
                Toggle your entire weekly plan between living-room calisthenics and gym machines with one click. Predefined movement parity included.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Apple className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Food-First Philosophy</h3>
              <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
                Supplements are strictly optional convenience tools. We never mandate protein powders or market expensive formulas to meet your goals.
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Automatic Grocery List</h3>
              <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
                Generates a categorized weekly shopping checklist from your meals. Copy to clipboard for Blinkit, Zepto, or local sabzi mandi shopping.
              </p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Moon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Late / Tired Adaptive Mode</h3>
              <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
                Had an exhausting day at office? Tap one button to convert today into a 15-minute gentle mobility session and an earlier sleep schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-900 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-white/10 px-3 py-1 rounded-full">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4">
              From routine chaos to a crystal-clear plan in 2 minutes.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl font-black text-emerald-400">01</span>
              <h4 className="text-base font-bold mt-2">Tell us about yourself</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Basic metrics and primary goal (muscle hypertrophy, fat loss, or daily energy).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl font-black text-emerald-400">02</span>
              <h4 className="text-base font-bold mt-2">Share your daily rhythm</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Work/college departure, return times, sleep hours, and available workout window.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl font-black text-emerald-400">03</span>
              <h4 className="text-base font-bold mt-2">Set your goal & budget</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Pick a comfortable food spend tier (&lt;₹45, ₹45–₹80, or ₹80–₹150/day).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl font-black text-emerald-400">04</span>
              <h4 className="text-base font-bold mt-2">Get your FitShift plan</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Instant interactive blueprint: exercises, meal alternatives, and groceries.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-400">
              Zero login wall &bull; Direct instant generated plan
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={onStartOnboarding}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="bg-emerald-600 hover:bg-emerald-500 text-white border-none"
            >
              Start Your Plan Now
            </Button>
          </div>
        </div>
      </section>

      {/* Indian Staples Showcase */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-zinc-200/90 shadow-2xs">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
              Whole Food First
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-zinc-950 mt-2">
              Why Indian Food Builds Elite Strength
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 leading-relaxed">
              When paired properly to complete the essential amino acid spectrum, traditional Indian staples offer unbeatable value and clean digestion.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60">
              <h5 className="font-bold text-sm text-zinc-900">Roasted Sattu</h5>
              <p className="text-xs text-emerald-700 font-semibold mt-0.5">20g protein / 100g</p>
              <p className="text-[11px] text-zinc-500 mt-1">Instant buttermilk drink with natural magnesium.</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60">
              <h5 className="font-bold text-sm text-zinc-900">Soya Chunks</h5>
              <p className="text-xs text-emerald-700 font-semibold mt-0.5">52g protein / 100g</p>
              <p className="text-[11px] text-zinc-500 mt-1">World&apos;s highest density plant protein at ~₹0.6/gram.</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60">
              <h5 className="font-bold text-sm text-zinc-900">Kala Chana</h5>
              <p className="text-xs text-emerald-700 font-semibold mt-0.5">19g protein / 100g</p>
              <p className="text-[11px] text-zinc-500 mt-1">Sustained glycemic energy and dietary fiber.</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60">
              <h5 className="font-bold text-sm text-zinc-900">Dahi & Paneer</h5>
              <p className="text-xs text-emerald-700 font-semibold mt-0.5">18g protein / 100g</p>
              <p className="text-[11px] text-zinc-500 mt-1">Natural gut microbiome probiotics & slow-release casein.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight">
          Ready to build a routine you won&apos;t abandon by February?
        </h2>
        <p className="mt-4 text-sm sm:text-base text-zinc-600 max-w-xl mx-auto">
          FitShift generates your personalized workout split, meal framework, and shopping restock in seconds.
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={onStartOnboarding}
            rightIcon={<ChevronRight className="w-5 h-5" />}
            className="px-8 py-4 font-bold text-base shadow-lg"
          >
            Create My FitShift Plan
          </Button>
        </div>
      </section>
    </div>
  );
};
