import { useState } from 'react';
import { OnboardingData } from './types';
import { defaultOnboardingData } from './data/mockPlan';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { PlanPage } from './pages/PlanPage';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'onboarding' | 'plan'>('landing');
  const [userData, setUserData] = useState<OnboardingData>(defaultOnboardingData);
  const [hasGeneratedPlan, setHasGeneratedPlan] = useState<boolean>(false);

  const handleStartOnboarding = () => {
    setCurrentView('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteOnboarding = (completedData: OnboardingData) => {
    setUserData(completedData);
    setHasGeneratedPlan(true);
    setCurrentView('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelOnboarding = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: 'landing' | 'onboarding' | 'plan') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <LandingPage
            onStartOnboarding={handleStartOnboarding}
            onViewSamplePlan={() => {
              setHasGeneratedPlan(true);
              setCurrentView('plan');
            }}
          />
        )}

        {currentView === 'onboarding' && (
          <OnboardingWizard
            initialData={userData}
            onComplete={handleCompleteOnboarding}
            onCancel={handleCancelOnboarding}
          />
        )}

        {currentView === 'plan' && (
          <PlanPage
            initialUserData={userData}
            onReturnToHome={() => handleNavigate('landing')}
          />
        )}
      </div>

      {/* Global Footer (shown on landing and onboarding) */}
      {currentView !== 'plan' && <Footer />}
    </div>
  );
}

export default App;
