import React, { useState } from 'react';
import { NutritionPlanData, DietPlanData, OnboardingData, DayMealPlan } from '../../types';
import {
  IndianRupee,
  ShieldAlert,
  AlertTriangle,
  Apple,
  Pill,
  Clock,
  Calendar,
  Info,
  Layers
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface DietPlanProps {
  nutrition: NutritionPlanData;
  diet: DietPlanData;
  dietType: string;
  userProfile?: OnboardingData;
}

// Default Fallback 7-Day Indian Home Food Meal Plan
const DEFAULT_SEVEN_DAY_PLAN: DayMealPlan[] = [
  {
    dayNumber: 1,
    dayName: 'Monday',
    focusTitle: 'High-Protein Vegetarian Kickoff',
    estimatedCalories: '2,550–2,650 kcal',
    estimatedProtein: '105–115 g protein',
    meals: [
      { time: '5:20 AM', mealName: 'Pre-workout', foodAndQuantity: '1 banana + 2 dates', categoryTag: 'Fruits & Dry Fruits' },
      { time: '7:15 AM', mealName: 'Post-workout breakfast', foodAndQuantity: '2–3 besan chillas (60 g besan), 50 g paneer, 150 g curd', categoryTag: 'High-Protein Breakfast' },
      { time: '10:30 AM', mealName: 'College snack', foodAndQuantity: '30 g roasted chana + 15 g peanuts + 1 guava', categoryTag: 'Healthy Snack & Fruit' },
      { time: '1:00 PM', mealName: 'College lunch', foodAndQuantity: '3 roti + moong dal (35 g dry) + 30 g dry rice + sabzi + 100 g curd', categoryTag: 'Balanced Lunch' },
      { time: '4:30 PM', mealName: 'After-college snack', foodAndQuantity: '250 ml milk + 1 banana + 15 g peanut butter', categoryTag: 'Fuel Stop' },
      { time: '7:30 PM', mealName: 'Dinner', foodAndQuantity: '40 g dry soya chunks curry + 2 roti + vegetables', categoryTag: 'Muscle Repair Dinner' },
      { time: '9:30 PM', mealName: 'Before-bed milk', foodAndQuantity: '250 ml milk', categoryTag: 'Overnight Recovery' }
    ]
  },
  {
    dayNumber: 2,
    dayName: 'Tuesday',
    focusTitle: 'Complex Carbs & Legume Recovery',
    estimatedCalories: '2,550–2,650 kcal',
    estimatedProtein: '95–105 g protein',
    meals: [
      { time: '5:20 AM', mealName: 'Pre-workout', foodAndQuantity: '1 banana + 2 dates', categoryTag: 'Fruits & Dry Fruits' },
      { time: '7:15 AM', mealName: 'Post-workout breakfast', foodAndQuantity: 'Vegetable poha (80 g dry) + 40 g peas + 15 g peanuts + 200 g curd', categoryTag: 'High-Protein Breakfast' },
      { time: '10:30 AM', mealName: 'College snack', foodAndQuantity: 'Kala chana (40 g dry before soaking) + 1 banana', categoryTag: 'Healthy Snack & Fruit' },
      { time: '1:00 PM', mealName: 'College lunch', foodAndQuantity: 'Rajma (50 g dry) + 70 g dry rice + 2 roti + salad + 100 g curd', categoryTag: 'Balanced Lunch' },
      { time: '4:30 PM', mealName: 'After-college snack', foodAndQuantity: '250 ml milk + 20 g peanuts + 10 g jaggery', categoryTag: 'Fuel Stop' },
      { time: '7:30 PM', mealName: 'Dinner', foodAndQuantity: 'Paneer bhurji (75 g paneer) + 2 roti + vegetables', categoryTag: 'Muscle Repair Dinner' },
      { time: '9:30 PM', mealName: 'Before-bed milk', foodAndQuantity: '250 ml milk', categoryTag: 'Overnight Recovery' }
    ]
  },
  {
    dayNumber: 3,
    dayName: 'Wednesday',
    focusTitle: 'Moong Chilla & Sattu Sustained Power',
    estimatedCalories: '2,500–2,650 kcal',
    estimatedProtein: '105–115 g protein',
    meals: [
      { time: '5:20 AM', mealName: 'Pre-workout', foodAndQuantity: '1 banana + 2 dates', categoryTag: 'Fruits & Dry Fruits' },
      { time: '7:15 AM', mealName: 'Post-workout breakfast', foodAndQuantity: 'Moong dal chilla (70 g dry moong) + 50 g paneer + 100 g curd', categoryTag: 'High-Protein Breakfast' },
      { time: '10:30 AM', mealName: 'College snack', foodAndQuantity: '200 ml milk + 25 g peanut chikki', categoryTag: 'Healthy Snack & Fruit' },
      { time: '1:00 PM', mealName: 'College lunch', foodAndQuantity: 'Chole (50 g dry chana) + 3 roti + 50 g dry rice + 100 g curd + salad', categoryTag: 'Balanced Lunch' },
      { time: '4:30 PM', mealName: 'After-college snack', foodAndQuantity: '1 banana + 30 g sattu drink + 10 g jaggery', categoryTag: 'Fuel Stop' },
      { time: '7:30 PM', mealName: 'Dinner', foodAndQuantity: 'Soya pulao (40 g dry soya + 60 g dry rice) + vegetables + 100 g curd', categoryTag: 'Muscle Repair Dinner' },
      { time: '9:30 PM', mealName: 'Before-bed milk', foodAndQuantity: '250 ml milk', categoryTag: 'Overnight Recovery' }
    ]
  },
  {
    dayNumber: 4,
    dayName: 'Thursday',
    focusTitle: 'Paneer Parathas & Probiotics',
    estimatedCalories: '2,550–2,650 kcal',
    estimatedProtein: '100–110 g protein',
    meals: [
      { time: '5:20 AM', mealName: 'Pre-workout', foodAndQuantity: '1 banana + 2 dates', categoryTag: 'Fruits & Dry Fruits' },
      { time: '7:15 AM', mealName: 'Post-workout breakfast', foodAndQuantity: '2 paneer parathas (90 g atta + 50 g paneer) + 150 g curd', categoryTag: 'High-Protein Breakfast' },
      { time: '10:30 AM', mealName: 'College snack', foodAndQuantity: '40 g sattu drink + 1 banana', categoryTag: 'Healthy Snack & Fruit' },
      { time: '1:00 PM', mealName: 'College lunch', foodAndQuantity: '3 roti + dal (40 g dry) + 30 g dry rice + sabzi + 200 ml chaas', categoryTag: 'Balanced Lunch' },
      { time: '4:30 PM', mealName: 'After-college snack', foodAndQuantity: '250 ml milk + 25 g roasted chana', categoryTag: 'Fuel Stop' },
      { time: '7:30 PM', mealName: 'Dinner', foodAndQuantity: 'Rajma (50 g dry) + 70 g dry rice + 150 g curd + salad', categoryTag: 'Muscle Repair Dinner' },
      { time: '9:30 PM', mealName: 'Before-bed milk', foodAndQuantity: '250 ml milk', categoryTag: 'Overnight Recovery' }
    ]
  },
  {
    dayNumber: 5,
    dayName: 'Friday',
    focusTitle: 'Micronutrient Density & Fiber Anchor',
    estimatedCalories: '2,550–2,700 kcal',
    estimatedProtein: '95–105 g protein',
    meals: [
      { time: '5:20 AM', mealName: 'Pre-workout', foodAndQuantity: '1 banana + 2 dates', categoryTag: 'Fruits & Dry Fruits' },
      { time: '7:15 AM', mealName: 'Post-workout breakfast', foodAndQuantity: 'Vegetable upma (80 g suji) + 15 g peanuts + 200 g curd', categoryTag: 'High-Protein Breakfast' },
      { time: '10:30 AM', mealName: 'College snack', foodAndQuantity: '40 g roasted chana + 1 orange', categoryTag: 'Healthy Snack & Fruit' },
      { time: '1:00 PM', mealName: 'College lunch', foodAndQuantity: 'Chana dal (45 g dry) + 3 roti + 40 g dry rice + 100 g curd + sabzi', categoryTag: 'Balanced Lunch' },
      { time: '4:30 PM', mealName: 'After-college snack', foodAndQuantity: '250 ml milk + 1 banana + 15 g peanuts', categoryTag: 'Fuel Stop' },
      { time: '7:30 PM', mealName: 'Dinner', foodAndQuantity: 'Paneer bhurji (75 g paneer) + 2 roti + vegetables', categoryTag: 'Muscle Repair Dinner' },
      { time: '9:30 PM', mealName: 'Before-bed milk', foodAndQuantity: '250 ml milk', categoryTag: 'Overnight Recovery' }
    ]
  },
  {
    dayNumber: 6,
    dayName: 'Saturday',
    focusTitle: 'Weekend Mass-Builder Split',
    estimatedCalories: '2,500–2,600 kcal',
    estimatedProtein: '105–115 g protein',
    meals: [
      { time: '5:20 AM', mealName: 'Pre-workout', foodAndQuantity: '1 banana + 2 dates', categoryTag: 'Fruits & Dry Fruits' },
      { time: '7:15 AM', mealName: 'Post-workout breakfast', foodAndQuantity: '2–3 besan chillas (60 g besan) + 50 g paneer + 100 g curd', categoryTag: 'High-Protein Breakfast' },
      { time: '10:30 AM', mealName: 'College snack', foodAndQuantity: '25 g peanuts + 1 banana', categoryTag: 'Healthy Snack & Fruit' },
      { time: '1:00 PM', mealName: 'College lunch', foodAndQuantity: '3 roti + black chana (50 g dry) + 40 g dry rice + 100 g curd + sabzi', categoryTag: 'Balanced Lunch' },
      { time: '4:30 PM', mealName: 'After-college snack', foodAndQuantity: '250 ml milk + 20 g sattu', categoryTag: 'Fuel Stop' },
      { time: '7:30 PM', mealName: 'Dinner', foodAndQuantity: 'Soya curry (40 g dry soya) + 2 roti + aloo matar', categoryTag: 'Muscle Repair Dinner' },
      { time: '9:30 PM', mealName: 'Before-bed milk', foodAndQuantity: '250 ml milk', categoryTag: 'Overnight Recovery' }
    ]
  },
  {
    dayNumber: 7,
    dayName: 'Sunday',
    focusTitle: 'Restorative Digestion & Wholesome Khichdi',
    estimatedCalories: '2,550–2,700 kcal',
    estimatedProtein: '100–110 g protein',
    meals: [
      { time: '5:20 AM', mealName: 'Pre-workout', foodAndQuantity: '1 banana + 2 dates', categoryTag: 'Fruits & Dry Fruits' },
      { time: '7:15 AM', mealName: 'Post-workout breakfast', foodAndQuantity: 'Daliya (80 g dry) cooked with 250 ml milk + 10 g nuts', categoryTag: 'High-Protein Breakfast' },
      { time: '10:30 AM', mealName: 'College snack', foodAndQuantity: '30 g roasted chana + 1 guava', categoryTag: 'Healthy Snack & Fruit' },
      { time: '1:00 PM', mealName: 'College lunch', foodAndQuantity: 'Kadhi (40 g besan + 150 g curd) + 3 roti + 40 g dry rice + salad', categoryTag: 'Balanced Lunch' },
      { time: '4:30 PM', mealName: 'After-college snack', foodAndQuantity: '250 ml milk + 1 banana + 15 g peanuts', categoryTag: 'Fuel Stop' },
      { time: '7:30 PM', mealName: 'Dinner', foodAndQuantity: 'Moong khichdi (50 g dry moong + 50 g dry rice) + 50 g paneer + 100 g curd', categoryTag: 'Muscle Repair Dinner' },
      { time: '9:30 PM', mealName: 'Before-bed milk', foodAndQuantity: '250 ml milk', categoryTag: 'Overnight Recovery' }
    ]
  }
];

const DEFAULT_BUDGET_GUIDELINES = [
  { food: 'Milk', portion: '500 ml', notes: 'Divided into afternoon snack & bedtime milk (~₹27–30/day)' },
  { food: 'Paneer / Tofu', portion: '50–75 g on selected days', notes: 'High-density casein & calcium source (~₹20–28/day)' },
  { food: 'Soya chunks', portion: '30–40 g on selected days', notes: '52% protein density at ultra-budget cost (~₹5–6/day)' },
  { food: 'Dal / chana / rajma', portion: '40–50 g dry', notes: 'Measured dry before soaking (~₹6–8/day)' },
  { food: 'Roasted chana', portion: '30–40 g', notes: 'Portable college/office snack (~₹5–7/day)' },
  { food: 'Peanuts / Peanut butter', portion: '15–25 g', notes: 'Essential healthy fats & protein (~₹3–5/day)' },
  { food: 'Curd (Dahi)', portion: '150–200 g', notes: 'Probiotic digestion & 7g protein (~₹12–15/day)' },
  { food: 'Banana / seasonal fruit', portion: '2 servings', notes: 'Glycogen energy, potassium & fiber (~₹10–15/day)' },
  { food: 'Atta, rice, vegetables', portion: 'As per plan', notes: '3–5 rotis, rice & seasonal vegetables (~₹25–30/day)' }
];

export const DietPlan: React.FC<DietPlanProps> = ({
  nutrition,
  diet,
  dietType,
  userProfile,
}) => {
  const { budget, protein, foods, feasible, reason, warnings } = diet;
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);

  const remainingBudget = Math.max(0, budget.dailyLimit - budget.estimatedCost);

  // 7-day meal plan from backend or default blueprint
  const sevenDayPlan = (diet.sevenDayMealPlan && diet.sevenDayMealPlan.length === 7)
    ? diet.sevenDayMealPlan
    : DEFAULT_SEVEN_DAY_PLAN;

  const currentDayPlan = sevenDayPlan.find((d) => d.dayNumber === selectedDayNumber) || sevenDayPlan[0];

  // Daily Meal Timings Schedule
  const mealTimings = diet.mealTimings && diet.mealTimings.length > 0
    ? diet.mealTimings
    : [
        { time: '5:20 AM', meal: 'Pre-workout', description: 'Quick-release glycogen fuel (banana + dates)' },
        { time: '7:15 AM', meal: 'Post-workout breakfast', description: 'High-protein recovery (chilla/poha + paneer/curd)' },
        { time: '10:30 AM', meal: 'College snack', description: 'Crunchy roasted chana, peanuts & fresh fruit' },
        { time: '1:00 PM', meal: 'College lunch', description: '3 rotis, dal/rajma/chole, rice, sabzi & curd' },
        { time: '4:30 PM', meal: 'After-college snack', description: 'Milk, banana & peanut butter or sattu drink' },
        { time: '7:30 PM', meal: 'Dinner', description: 'Tissue repair dinner with soya chunks/paneer, roti & veg' },
        { time: '9:30 PM', meal: 'Before-bed milk', description: 'Warm toned milk with slow-release casein protein' }
      ];

  const budgetGuidelines = diet.budgetManagement?.guidelines || DEFAULT_BUDGET_GUIDELINES;
  const budgetHeadline = diet.budgetManagement?.headline || `How to manage your ₹${budget.dailyLimit || '150–200'} daily budget`;

  const supplementBadgeText = userProfile?.supplements?.preference === 'open_to_supplements'
    ? 'Whey Supported'
    : 'No Supplements';

  const normalizedDietType = dietType.toLowerCase().replace(/_/g, ' ');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Badges Ribbon */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
              Indian Whole-Food Diet Framework
            </h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-2.5 py-0.5 rounded-md">
              {supplementBadgeText}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 bg-blue-100/80 border border-blue-200 px-2.5 py-0.5 rounded-md">
              {normalizedDietType}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-100/80 border border-amber-200 px-2.5 py-0.5 rounded-md">
              Indian Home Food
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1.5">
            Balanced 7-day whole-food meal architecture built with everyday Indian staples, fresh fruits, nuts, and affordable protein density.
          </p>
        </div>

        <div className="text-right sm:self-center shrink-0">
          <span className="text-xs text-zinc-400 font-medium">Daily Budget Allocation</span>
          <div className="text-sm sm:text-base font-bold text-emerald-800 flex items-center justify-end">
            <IndianRupee className="w-4 h-4 inline stroke-[2.5]" />
            <span>₹{budget.estimatedCost} / ₹{budget.dailyLimit} target</span>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Daily Protein Target
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">
            {protein.achievedGrams}g
            <span className="text-xs font-normal text-zinc-400 ml-1">/ {protein.targetGrams}g</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-0.5 block">
            {feasible ? '100% Target Met' : `${protein.gapGrams}g target gap`}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Daily Calorie Target
          </span>
          <div className="text-xl sm:text-2xl font-black text-zinc-900 mt-1">
            {nutrition.calorieTarget} <span className="text-xs font-normal text-zinc-400">kcal</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-0.5 block">
            BMR: {nutrition.bmr} • TDEE: {nutrition.tdee}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Estimated Daily Spend
          </span>
          <div className="text-xl sm:text-2xl font-black text-zinc-900 mt-1 flex items-center">
            <IndianRupee className="w-5 h-5 inline stroke-[2.5]" />
            <span>{budget.estimatedCost}</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-0.5 block">
            ₹{remainingBudget} remaining within limit
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Optimized Staples
          </span>
          <div className="text-xl sm:text-2xl font-black text-zinc-900 mt-1">
            {foods.length} <span className="text-xs font-normal text-zinc-400">sources</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-0.5 block">
            Ranked by cost per 10g protein
          </span>
        </div>
      </div>

      {/* Feasibility Alert */}
      {!feasible && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Budget Constraint Notice:</strong> {reason || `The daily protein target (${protein.targetGrams}g) could not be fully met within the ₹${budget.dailyLimit}/day budget with available foods. The optimizer maximized protein to ${protein.achievedGrams}g with a ${protein.gapGrams}g gap. Consider increasing your daily food budget or enabling supplements.`}
          </div>
        </div>
      )}

      {/* Warnings List */}
      {warnings && warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((w, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900"
            >
              <ShieldAlert className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 1: Daily Meal Timings */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
          <div>
            <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-700 stroke-[2.2]" />
              Your Daily Meal Timings
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Designed around your 6 AM gym session and 8 AM–4 PM college/work schedule.
            </p>
          </div>
          <Badge variant="accent" size="sm">
            7 Fuel Stops
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {mealTimings.map((timing, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 hover:border-zinc-300 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-md font-mono">
                  {timing.time}
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold uppercase">Step {idx + 1}</span>
              </div>
              <h4 className="text-sm font-bold text-zinc-900">{timing.meal}</h4>
              <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{timing.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Complete 7-Day Meal Plan */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700 stroke-[2.2]" />
              Your Complete 7-Day Meal Plan
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Every day includes a small pre-workout meal and bedtime milk. The other meals rotate to give you variety.
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-zinc-400 mr-1 hidden sm:inline">Select Day:</span>
            {sevenDayPlan.map((d) => {
              const isSelected = d.dayNumber === selectedDayNumber;
              return (
                <button
                  key={d.dayNumber}
                  type="button"
                  onClick={() => setSelectedDayNumber(d.dayNumber)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  {d.dayName.slice(0, 3)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Day Detail Card */}
        {currentDayPlan && (
          <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs overflow-hidden">
            {/* Day Header Banner */}
            <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-zinc-50 to-white">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base sm:text-lg font-extrabold text-zinc-950">
                    {currentDayPlan.dayName} – Day {currentDayPlan.dayNumber}
                  </h4>
                  <span className="text-xs text-zinc-500 font-medium">
                    • {currentDayPlan.focusTitle}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Whole-food rotations including fruits, dry fruits, lentils, dairy, and grains.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-900 bg-emerald-100/90 border border-emerald-200 px-3 py-1 rounded-lg">
                  {currentDayPlan.estimatedCalories} · {currentDayPlan.estimatedProtein}
                </span>
              </div>
            </div>

            {/* Meals Table / List */}
            <div className="divide-y divide-zinc-100">
              {currentDayPlan.meals.map((meal, mIdx) => (
                <div
                  key={mIdx}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-zinc-50/60 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 font-mono text-xs font-bold shrink-0">
                      {meal.time}
                    </span>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                          {meal.mealName}
                        </span>
                        {meal.categoryTag && (
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded">
                            {meal.categoryTag}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-zinc-900 mt-0.5 leading-snug">
                        {meal.foodAndQuantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Practical Preparation Guidance Callout */}
            <div className="p-4 sm:p-5 bg-zinc-50 border-t border-zinc-200/80 flex items-start gap-3 text-xs text-zinc-600 leading-relaxed">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p>
                <strong>Practical Preparation Notice:</strong> All calorie and protein totals are estimates, not laboratory measurements. They include approximate cooking oil and standard household recipes. Milk fat, paneer type, roti size and preparation can change the totals. Weigh dal, rice, besan, atta and soya before cooking.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: How to Manage Your Daily Budget */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-emerald-700 stroke-[2.2]" />
            {budgetHeadline}
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            You do not need expensive foods. Spend more on affordable protein sources rather than fancy health products.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-semibold">
                <th className="py-2.5 px-3 rounded-l-lg">Food Item</th>
                <th className="py-2.5 px-3">Approx. Daily Portion</th>
                <th className="py-2.5 px-3 rounded-r-lg">Portion Context &amp; Economics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              {budgetGuidelines.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-zinc-900">{item.food}</td>
                  <td className="py-2.5 px-3 text-emerald-800 font-semibold">{item.portion}</td>
                  <td className="py-2.5 px-3 text-zinc-500 text-xs">{item.notes || 'Household portion per plan'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: Optimized Protein Staples & Cost Efficiency */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider text-xs text-zinc-500 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              Optimized Protein Staples Allocation &amp; Cost Efficiency
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Deterministic allocation derived directly from FitShift&apos;s verified Indian staples dataset (<code className="font-mono text-[11px] text-zinc-600">clean_staples.csv</code>).
            </p>
          </div>
        </div>

        {foods.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-zinc-200 text-zinc-500 text-sm">
            No eligible foods could be allocated for the selected parameters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {foods.map((food, idx) => {
              const costPer10g =
                food.proteinGrams > 0
                  ? ((food.estimatedCost / food.proteinGrams) * 10).toFixed(1)
                  : 'N/A';

              return (
                <div
                  key={`${food.name}-${idx}`}
                  className="p-5 rounded-2xl bg-white border border-zinc-200/90 hover:border-zinc-300 shadow-2xs transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-100 mb-3">
                      <div className="flex items-center gap-2">
                        {food.isSupplement ? (
                          <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
                            <Pill className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                            <Apple className="w-4 h-4" />
                          </div>
                        )}
                        <h4 className="text-base font-bold text-zinc-950">{food.name}</h4>
                      </div>
                      <Badge variant={food.isSupplement ? 'outline' : 'success'} size="sm">
                        {food.isSupplement ? 'Supplement' : 'Whole Food'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center py-2 bg-zinc-50 rounded-xl mb-3">
                      <div>
                        <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Daily Portion</span>
                        <span className="text-xs font-bold text-zinc-900">{food.quantityGrams}g</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Protein</span>
                        <span className="text-xs font-bold text-emerald-800">{food.proteinGrams}g bioavailable</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <span className="text-zinc-500">
                      Efficiency: <strong>₹{costPer10g}</strong> / 10g protein
                    </span>
                    <span className="text-sm font-bold text-zinc-900 flex items-center">
                      <IndianRupee className="w-3.5 h-3.5 inline" />
                      <span>₹{food.estimatedCost} / day</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
