import React, { useState } from 'react';
import {
  OnboardingData,
  TrainingEnvironment,
  NutritionPlanData,
  DietPlanData,
  WorkoutPlanData,
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
import { AIAssistantPage } from '../components/ai/AIAssistantPage';
import { generateUserSchedule } from '../utils/schedule';

export interface PlanPageProps {
  userProfile: OnboardingData;
  nutrition: NutritionPlanData;
  diet: DietPlanData;
  workout?: WorkoutPlanData | null;
  initialTab?: PlanTab;
  onReturnToHome: () => void;
  onRegeneratePlan?: (updated: OnboardingData) => void;
}

export const PlanPage: React.FC<PlanPageProps> = ({
  userProfile,
  nutrition,
  diet,
  workout,
  initialTab = 'overview',
  onReturnToHome: _onReturnToHome,
  onRegeneratePlan,
}) => {
  const [userData, setUserData] = useState<OnboardingData>(userProfile);
  const [activeTab, setActiveTab] = useState<PlanTab>(initialTab);
  const [currentEnvironment, setCurrentEnvironment] = useState<TrainingEnvironment>(
    userProfile.training.environment
  );

  // Late / Tired Mode state
  const [isLateTiredActive, setIsLateTiredActive] = useState<boolean>(false);
  const [isLateTiredModalOpen, setIsLateTiredModalOpen] = useState<boolean>(false);
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState<boolean>(false);

  const handleEnvironmentChange = (newEnv: TrainingEnvironment) => {
    setCurrentEnvironment(newEnv);
    const updated: OnboardingData = {
      ...userData,
      training: { ...userData.training, environment: newEnv },
    };
    setUserData(updated);
    if (onRegeneratePlan) {
      onRegeneratePlan(updated);
    }
  };

  const handleSavePlanSettings = (updated: OnboardingData) => {
    setUserData(updated);
    setCurrentEnvironment(updated.training.environment);
    if (onRegeneratePlan) {
      onRegeneratePlan(updated);
    }
  };

  const dailyEvents = generateUserSchedule(userData);

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
              nutrition={nutrition}
              diet={diet}
              workout={workout}
              currentEnvironment={currentEnvironment}
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
              workout={workout}
              gender={userData.personal.gender}
              currentEnvironment={currentEnvironment}
              onEnvironmentChange={handleEnvironmentChange}
              durationMinutes={userData.training.durationMinutes}
              weeklyFrequencyDays={userData.training.weeklyFrequencyDays}
              experienceLevel={userData.training.experienceLevel}
              goal={userData.personal.goal}
            />
          )}

          {activeTab === 'diet' && (
            <DietPlan
              nutrition={nutrition}
              diet={diet}
              dietType={userData.food.dietType}
              userProfile={userData}
            />
          )}

          {activeTab === 'schedule' && (
            <DailyScheduleView
              events={dailyEvents}
              occupation={userData.rhythm.occupation}
            />
          )}

          {activeTab === 'grocery' && (
            <GroceryList
              groceryList={diet.groceryList}
              foods={diet.foods}
              dailyBudgetLimit={userData.budget.dailyBudgetRupees}
            />
          )}

          {activeTab === 'supplements' && (
            <SupplementsView
              preference={userData.supplements.preference}
              monthlyBudget={userData.supplements.monthlyBudgetRupees}
              allocatedFoods={diet.foods}
            />
          )}

          {activeTab === 'recovery' && (
            <RecoveryView
              sleepHours={userData.rhythm.sleepHours}
              wakeUpTime={userData.rhythm.wakeUpTime}
            />
          )}

          {activeTab === 'ai' && (
            <AIAssistantPage
              userProfile={userData}
              onNavigateToPlanTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToPlan={() => {
                setActiveTab('overview');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
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
