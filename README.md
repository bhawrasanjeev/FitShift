# FitShift

> **Routine-First, Budget-Realistic Fitness & Nutrition Engine**

FitShift is a React-based fitness and nutrition planning web application crafted for real Indian lives, busy schedules, and authentic whole foods.

---

## 🌟 Key Pillars & Visual Identity

- **Design Reference:** Apple’s whitespace and typography, Linear’s restraint and micro-interactions, Vercel’s contrast and developer polish.
- **Color Tokens:**
  - Background: Warm off-white (`#FAFAFA`, `#F4F4F6`, `#FFFFFF`)
  - Typography: Charcoal / near-black (`#111827`, `#0F172A`)
  - Accent: Forest & emerald green (`#15803D`, `#166534`, `#047857`)
  - Borders: Subtle 1px lines (`#E5E7EB`)
- **Philosophy:**
  - **Planning, Not Tracking:** Zero calorie-burn counters, streak anxiety, or wearable integration overhead.
  - **No Authentication Barriers:** No login, registration, password setups, or subscription gates.
  - **Food-First Integrity:** Supplements remain strictly optional convenience tools. High-protein Indian staples (Chana Sattu, Soya Chunks, Kala Chana, Moong Dal, Dahi, Paneer, Eggs) form the daily foundation.
  - **Home & Gym Parity:** Instant 1-click segmented toggle between home bodyweight/dumbbell movements and gym barbell/cable stations.
  - **Late / Tired Today:** A 1-click adaptive plan that converts demanding sessions into an unhurried 15-minute mobility flow and suggests an earlier bedtime.

---

## 🏗️ Architecture & Component Directory

```text
src/
├── app/
│   └── App.tsx                      # Root application & view router
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx               # Brand wordmark, navigation links, CTA
│   │   ├── Footer.tsx               # Core principles & transparency disclaimer
│   │   ├── AppSidebar.tsx           # Compact plan navigation & special action triggers
│   │   └── PageContainer.tsx        # Responsive layout wrapper
│   ├── ui/
│   │   ├── Button.tsx               # Tactile, accessible button with loading states
│   │   ├── SelectCard.tsx           # Interactive option cards with check indicators
│   │   ├── ProgressBar.tsx          # Animated step progress bar
│   │   ├── SegmentedControl.tsx     # Apple/Linear style sliding tab toggle
│   │   ├── Modal.tsx                # Accessible dialog with backdrop blur & ESC key support
│   │   └── Badge.tsx                # Subtle metric and status pills
│   ├── onboarding/
│   │   ├── OnboardingWizard.tsx     # 7-step wizard controller with step counter
│   │   ├── PersonalBasicsStep.tsx   # Step 1: Metrics & primary fitness goal
│   │   ├── DailyRhythmStep.tsx      # Step 2: Occupation, transit hours, sleep rhythm
│   │   ├── TrainingSetupStep.tsx    # Step 3: Home/Gym, durations, frequency, equipment
│   │   ├── FoodPreferencesStep.tsx  # Step 4: Diet, kitchen access, Indian food styles
│   │   ├── BudgetStep.tsx           # Step 5: Ultra-Budget, Budget, Moderate, Custom
│   │   ├── SupplementsStep.tsx      # Step 6: Food-first default & optional budget
│   │   └── ReviewStep.tsx           # Step 7: Summary review with granular edit links
│   ├── workout/
│   │   ├── WorkoutPlan.tsx          # Weekly calendar split & Home/Gym switcher
│   │   ├── ExerciseCard.tsx         # Exercise item with demonstration thumbnail & fallback
│   │   └── ExerciseDetailsModal.tsx # Step instructions, mistakes to avoid, alternatives
│   ├── diet/
│   │   ├── DietPlan.tsx             # Daily Indian meal courses & macro summary
│   │   ├── MealCard.tsx             # Meal title, prep time, ingredients, cooking tips
│   │   └── MealAlternativesModal.tsx# Instant meal swaps with protein/cost comparison
│   ├── grocery/
│   │   └── GroceryList.tsx          # Categorized shopping list & clipboard copy
│   ├── supplements/
│   │   └── SupplementsView.tsx      # Whole-food staples vs evidence-backed recommendations
│   ├── recovery/
│   │   └── RecoveryView.tsx         # Sleep, hydration, desk posture & mobility advice
│   ├── schedule/
│   │   └── DailyScheduleView.tsx    # 24-hour chronological timeline
│   └── overview/
│       ├── OverviewTab.tsx          # Plan welcome, today's workout/meals, late button
│       ├── LateTiredModal.tsx       # 15m gentle recovery routine activator
│       └── EditPlanModal.tsx        # Fast settings editor to reconfigure plan
├── data/
│   └── mockPlan.ts                  # Realistic Indian food datasets & exercise mappings
├── types/
│   └── index.ts                     # Strict TypeScript data models
├── index.css                        # Tailwind v4, custom scrollbar & motion tokens
└── main.tsx                         # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation & Run

```bash
# 1. Clone or navigate to the workspace
cd FitShift_Demo

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev

# 4. Production build & typecheck
npm run build
```

---

## 🇮🇳 Indian Whole-Food Staples Featured

| Staple | Protein Density | Est. Cost | Key Advantage |
| :--- | :--- | :--- | :--- |
| **Chana Sattu** | ~20g per 100g | ₹15 | Soluble roasted gram flour, gut-friendly buttermilk drink |
| **Soya Chunks** | ~52g per 100g | ₹16 | World's highest density plant protein at ~₹0.62 per gram |
| **Kala Chana** | ~19g per 100g | ₹10 | Desi black chickpeas, sustained energy & dietary fiber |
| **Fresh Dahi & Paneer** | 18g per 100g paneer | ₹35 | Slow-digesting casein for overnight cellular repair |
| **Moong Dal** | ~24g per 100g | ₹14 | Light on digestion, restorative amino acid profile |
| **Eggs (if Eggetarian)** | 6g per egg | ~₹7 | BV 100 gold-standard bioavailable protein |

---

## 📱 Responsive & Accessible Design

- Fully responsive from 320px mobile screens to large desktop monitors.
- Keyboard navigation with visible focus outlines (`focus-visible:ring-emerald-600`).
- Dialog accessibility (`aria-modal="true"`, `Escape` listener, body scroll lock).
- Full `@media (prefers-reduced-motion: reduce)` support.
