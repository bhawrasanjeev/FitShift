import { useState } from 'react';
import { OnboardingData, NutritionPlanData, DietPlanData, WorkoutPlanData } from './types';
import { initialEmptyOnboardingData } from './data/initialState';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { PlanPage } from './pages/PlanPage';
import { AIAssistantPage } from './components/ai/AIAssistantPage';
import { PlanTab } from './components/layout/AppSidebar';
import { calculateNutrition, optimizeDiet, generateWorkout } from './services/api';
import { Button } from './components/ui/Button';
import { AlertCircle, RefreshCw, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'onboarding' | 'plan' | 'ai'>('landing');
  const [userData, setUserData] = useState<OnboardingData>(initialEmptyOnboardingData);
  const [hasGeneratedPlan, setHasGeneratedPlan] = useState<boolean>(false);
  const [planInitialTab, setPlanInitialTab] = useState<PlanTab>('overview');

  const [nutritionData, setNutritionData] = useState<NutritionPlanData | null>(null);
  const [dietData, setDietData] = useState<DietPlanData | null>(null);
  const [workoutData, setWorkoutData] = useState<WorkoutPlanData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchPlanFromBackend = async (data: OnboardingData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Core Nutrition Engine Call (Phase 4)
      const goal = data.personal.goal === 'weight_loss' ? 'fat_loss' : data.personal.goal;
      const gender = data.personal.gender === 'female' ? 'female' : 'male';
      const activityMap: Record<string, 'sedentary' | 'light' | 'moderate' | 'very_active'> = {
        sedentary: 'sedentary',
        lightly_active: 'light',
        moderately_active: 'moderate',
        very_active: 'very_active',
      };
      const activityLevel = activityMap[data.rhythm.activityLevel] || 'moderate';

      const nutritionRes = await calculateNutrition({
        age: Number(data.personal.age),
        gender,
        heightCm: Number(data.personal.heightCm),
        weightKg: Number(data.personal.weightKg),
        goal,
        activityLevel,
      });

      // 2. Budget Diet Optimizer Call (Phase 5)
      const dietMap: Record<string, 'vegetarian' | 'eggetarian' | 'non_vegetarian'> = {
        pure_veg: 'vegetarian',
        eggetarian: 'eggetarian',
        non_veg: 'non_vegetarian',
      };
      const dietType = dietMap[data.food.dietType] || 'vegetarian';

      const suppMap: Record<string, 'no_supplements' | 'open_to_supplements' | 'unsure'> = {
        no_supplements: 'no_supplements',
        open_to_supplements: 'open_to_supplements',
        not_sure: 'unsure',
      };
      const supplementPreference = suppMap[data.supplements.preference] || 'no_supplements';

      const dietRes = await optimizeDiet({
        nutrition: {
          calorieTarget: nutritionRes.calorieTarget,
          proteinTargetGrams: nutritionRes.proteinTargetGrams,
        },
        dietType,
        foodBudget: Number(data.budget.dailyBudgetRupees),
        supplementPreference,
        mealsPerDay: Number(data.food.mealsPerDay) || 4,
        rhythm: data.rhythm,
        training: data.training,
      });

      // 3. Deterministic Workout Generator Call (Real Data Integration)
      const workoutRes = await generateWorkout({
        gender: data.personal.gender === 'female' ? 'female' : 'male',
        environment: data.training.environment,
        durationMinutes: data.training.durationMinutes,
        weeklyFrequencyDays: data.training.weeklyFrequencyDays,
        experienceLevel: data.training.experienceLevel,
        goal: data.personal.goal,
      });

      setNutritionData(nutritionRes);
      setDietData(dietRes);
      setWorkoutData(workoutRes);
      setHasGeneratedPlan(true);
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error
          ? err.message
          : 'Unable to load plan. Please check the backend connection and try again.';
      setErrorMessage(errMessage);
      setHasGeneratedPlan(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOnboarding = () => {
    setCurrentView('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteOnboarding = async (completedData: OnboardingData) => {
    setUserData(completedData);
    setPlanInitialTab('overview');
    setCurrentView('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await fetchPlanFromBackend(completedData);
  };

  const handleCancelOnboarding = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: 'landing' | 'onboarding' | 'plan' | 'ai') => {
    if (view === 'plan') {
      setPlanInitialTab('overview');
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateFromAI = (tab: PlanTab) => {
    setPlanInitialTab(tab);
    setCurrentView('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    fetchPlanFromBackend(userData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#111827]">
      {/* Top Global Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        hasPlan={hasGeneratedPlan}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {currentView === 'landing' && (
          <LandingPage onStartOnboarding={handleStartOnboarding} />
        )}

        {currentView === 'onboarding' && (
          <OnboardingWizard
            initialData={userData}
            onComplete={handleCompleteOnboarding}
            onCancel={handleCancelOnboarding}
          />
        )}

        {currentView === 'plan' && (
          <>
            {isLoading && (
              <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-900">
                    Executing FitShift Real-Data Engines
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Computing Mifflin-St Jeor caloric target, optimizing Indian protein staples, and constructing equipment-matched workout schedule...
                  </p>
                </div>
              </div>
            )}

            {!isLoading && errorMessage && (
              <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
                <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200 p-8 shadow-xs space-y-5">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-zinc-900">
                      Unable to load plan
                    </h2>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Please check the backend connection and try again. FitShift does not fall back to fake demo data when real API services fail.
                    </p>
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-700 font-mono text-left break-words">
                      {errorMessage}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleRetry}
                      leftIcon={<RefreshCw className="w-4 h-4" />}
                      className="flex-1"
                    >
                      Retry Request
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={handleStartOnboarding}
                      className="flex-1"
                    >
                      Edit Inputs
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && !errorMessage && !hasGeneratedPlan && (
              <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
                <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200 p-8 shadow-xs space-y-5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-zinc-900">
                      No plan generated yet
                    </h2>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Complete the onboarding setup to calculate your exact caloric &amp; protein targets, Indian meal plan, and workout schedule.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleStartOnboarding}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="w-full"
                  >
                    Start Setup Wizard
                  </Button>
                </div>
              </div>
            )}

            {!isLoading && !errorMessage && hasGeneratedPlan && nutritionData && dietData && (
              <PlanPage
                key={planInitialTab}
                userProfile={userData}
                nutrition={nutritionData}
                diet={dietData}
                workout={workoutData}
                initialTab={planInitialTab}
                onReturnToHome={() => handleNavigate('landing')}
                onRegeneratePlan={(updated) => {
                  setUserData(updated);
                  fetchPlanFromBackend(updated);
                }}
              />
            )}
          </>
        )}

        {currentView === 'ai' && (
          <AIAssistantPage
            userProfile={userData}
            onNavigateToPlanTab={handleNavigateFromAI}
            onBackToPlan={() => {
              if (hasGeneratedPlan) {
                setPlanInitialTab('overview');
                setCurrentView('plan');
              } else {
                setCurrentView('landing');
              }
            }}
          />
        )}
      </div>

      {/* Global Footer (shown on landing and onboarding) */}
      {currentView !== 'plan' && <Footer />}
    </div>
  );
}

export default App;
