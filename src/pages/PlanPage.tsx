import React, { useState } from 'react';
import {
  OnboardingData,
  TrainingEnvironment,
  WorkoutDay,
  Meal,
  MealAlternative,
} from '../types';
import { AppSidebar, PlanTab } from '../components/layout/AppSidebar';
import { PageContainer } from '../components/layout/PageContainer';
import { OverviewTab } from '../components/overview/OverviewTab';
import { WorkoutPlan } from '../components/workout/WorkoutPlan';
import { DietPlan } from '../components/diet/DietPlan';
import { DailyScheduleView } from '../components/schedule/DailyScheduleView';
import { GroceryList } from '../components/grocery/GroceryList';
import { SupplementsView } from '../components/supplements/SupplementsView';
import { RecoveryView } from '../components/recovery/RecoveryView';
import { LateTiredModal } from '../components/overview/LateTiredModal';
import { EditPlanModal } from '../components/overview/EditPlanModal';
import {
  generateWorkoutSchedule,
  generateMockMeals,
  generateDailySchedule,
  mockGroceryList,
  mockSupplementRecommendations,
  mockRecoveryGuidance,
  lateTiredExercises,
} from '../data/mockPlan';

export interface PlanPageProps {
  initialUserData: OnboardingData;
  onReturnToHome: () => void;
}

export const PlanPage: React.FC<PlanPageProps> = ({
  initialUserData,
}) => {
  const [userData, setUserData] = useState<OnboardingData>(initialUserData);
  const [activeTab, setActiveTab] = useState<PlanTab>('overview');
  const [currentEnvironment, setCurrentEnvironment] = useState<TrainingEnvironment>(
    initialUserData.training.environment
  );

  // Generate initial workout schedule
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>(() =>
    generateWorkoutSchedule(
      initialUserData.training.environment,
      initialUserData.training.weeklyFrequencyDays,
      initialUserData.training.durationMinutes
    )
  );

  // Generate initial meals
  const [meals, setMeals] = useState<Meal[]>(() =>
    generateMockMeals(initialUserData.food.dietType, initialUserData.budget.tier)
  );

  // Late / Tired Mode state
  const [isLateTiredActive, setIsLateTiredActive] = useState<boolean>(false);
  const [isLateTiredModalOpen, setIsLateTiredModalOpen] = useState<boolean>(false);
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState<boolean>(false);

  // Handle environment switch (Home <-> Gym)
  const handleEnvironmentChange = (newEnv: TrainingEnvironment) => {
    setCurrentEnvironment(newEnv);
    setUserData((prev) => ({
      ...prev,
      training: { ...prev.training, environment: newEnv },
    }));
    // Regenerate workout days with new environment exercises
    const newSchedule = generateWorkoutSchedule(
      newEnv,
      userData.training.weeklyFrequencyDays,
      userData.training.durationMinutes
    );
    setWorkoutDays(newSchedule);
  };

  // Handle individual exercise swap
  const handleSwapExercise = (dayNumber: number, exerciseId: string) => {
    setWorkoutDays((prev) =>
      prev.map((day) => {
        if (day.dayNumber !== dayNumber) return day;
        const updatedExercises = day.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          // Swap with its alternative
          return {
            ...ex,
            id: ex.alternative.id,
            name: ex.alternative.name,
            equipment: ex.alternative.equipment,
            environment: ex.alternative.environment,
            alternative: {
              id: ex.id,
              name: ex.name,
              equipment: ex.equipment,
              environment: ex.environment as TrainingEnvironment,
              note: `Direct alternative to ${ex.alternative.name}`,
            },
          };
        });
        return { ...day, exercises: updatedExercises };
      })
    );
  };

  // Handle meal replacement
  const handleReplaceMeal = (mealId: string, alternative: MealAlternative) => {
    setMeals((prev) =>
      prev.map((m) => {
        if (m.id !== mealId) return m;
        // Swap active meal with alternative
        const oldActiveAsAlt: MealAlternative = {
          id: m.id,
          name: m.title,
          description: m.description,
          approxProteinG: m.approxProteinG,
          estCalories: m.estCalories,
          approxCostRupees: m.approxCostRupees,
          ingredients: m.ingredients,
          prepTimeMinutes: m.prepTimeMinutes,
        };

        const remainingAlts = m.alternatives.filter((a) => a.id !== alternative.id);

        return {
          ...m,
          title: alternative.name,
          description: alternative.description,
          approxProteinG: alternative.approxProteinG,
          estCalories: alternative.estCalories,
          approxCostRupees: alternative.approxCostRupees,
          ingredients: alternative.ingredients,
          prepTimeMinutes: alternative.prepTimeMinutes,
          alternatives: [oldActiveAsAlt, ...remainingAlts],
        };
      })
    );
  };

  // Handle user saving edited parameters from EditPlanModal
  const handleSavePlanSettings = (updated: OnboardingData) => {
    setUserData(updated);
    setCurrentEnvironment(updated.training.environment);
    setWorkoutDays(
      generateWorkoutSchedule(
        updated.training.environment,
        updated.training.weeklyFrequencyDays,
        updated.training.durationMinutes
      )
    );
    setMeals(generateMockMeals(updated.food.dietType, updated.budget.tier));
  };

  // Computed today's workout
  const todayWorkoutOriginal = workoutDays[0] || {
    dayNumber: 1,
    dayName: 'Monday',
    focus: 'Push & Core Foundations',
    isRestDay: false,
    estimatedMinutes: 45,
    exercises: [],
  };

  const todayWorkout: WorkoutDay = isLateTiredActive
    ? {
        ...todayWorkoutOriginal,
        focus: '15-Min Low-Intensity Spinal & Hip Reset',
        estimatedMinutes: 15,
        exercises: lateTiredExercises,
      }
    : todayWorkoutOriginal;

  // Compute daily schedule
  const dailyEvents = generateDailySchedule(userData);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      {/* Sidebar Navigation */}
      <AppSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLateTired={() => setIsLateTiredModalOpen(true)}
        onOpenEditPlan={() => setIsEditPlanModalOpen(true)}
        isLateTiredActive={isLateTiredActive}
      />

      {/* Main Tab Content */}
      <main className="flex-1 bg-[#FAFAFA] min-w-0">
        <PageContainer maxWidth="xl" className="py-6 sm:py-8">
          {activeTab === 'overview' && (
            <OverviewTab
              userProfile={userData}
              currentEnvironment={currentEnvironment}
              todayWorkout={todayWorkout}
              todayMeals={meals}
              upcomingEvents={dailyEvents}
              isLateTiredActive={isLateTiredActive}
              onOpenLateTired={() => setIsLateTiredModalOpen(true)}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'workout' && (
            <WorkoutPlan
              workoutDays={
                isLateTiredActive
                  ? [todayWorkout, ...workoutDays.slice(1)]
                  : workoutDays
              }
              currentEnvironment={currentEnvironment}
              onEnvironmentChange={handleEnvironmentChange}
              onSwapExercise={handleSwapExercise}
            />
          )}

          {activeTab === 'diet' && (
            <DietPlan
              meals={meals}
              budgetTier={userData.budget.tier}
              targetDailyBudget={userData.budget.dailyBudgetRupees}
              dietType={userData.food.dietType}
              onReplaceMeal={handleReplaceMeal}
            />
          )}

          {activeTab === 'schedule' && (
            <DailyScheduleView
              events={dailyEvents}
              occupation={userData.rhythm.occupation}
            />
          )}

          {activeTab === 'grocery' && (
            <GroceryList items={mockGroceryList} />
          )}

          {activeTab === 'supplements' && (
            <SupplementsView
              preference={userData.supplements.preference}
              monthlyBudget={userData.supplements.monthlyBudgetRupees}
              recommendations={mockSupplementRecommendations}
            />
          )}

          {activeTab === 'recovery' && (
            <RecoveryView guidance={mockRecoveryGuidance} />
          )}
        </PageContainer>
      </main>

      {/* Late / Tired Adaptive Modal */}
      <LateTiredModal
        isOpen={isLateTiredModalOpen}
        onClose={() => setIsLateTiredModalOpen(false)}
        isActive={isLateTiredActive}
        onToggleActive={(active) => setIsLateTiredActive(active)}
      />

      {/* Edit Plan Modal */}
      <EditPlanModal
        isOpen={isEditPlanModalOpen}
        onClose={() => setIsEditPlanModalOpen(false)}
        currentData={userData}
        onSave={handleSavePlanSettings}
      />
    </div>
  );
};
