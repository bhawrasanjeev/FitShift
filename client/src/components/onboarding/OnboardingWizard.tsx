import React, { useState } from 'react';
import { OnboardingData } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { PersonalBasicsStep } from './PersonalBasicsStep';
import { DailyRhythmStep } from './DailyRhythmStep';
import { TrainingSetupStep } from './TrainingSetupStep';
import { FoodPreferencesStep } from './FoodPreferencesStep';
import { BudgetStep } from './BudgetStep';
import { SupplementsStep } from './SupplementsStep';
import { ReviewStep } from './ReviewStep';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export interface OnboardingWizardProps {
  initialData: OnboardingData;
  onComplete: (data: OnboardingData) => void;
  onCancel: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  initialData,
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<OnboardingData>(initialData);
  const [step1Error, setStep1Error] = useState<string | null>(null);

  const totalSteps = 7;

  const stepMeta = [
    {
      step: 1,
      title: "Let's start with you.",
      subtitle: 'Your physical metrics and primary fitness target provide the baseline for training intensity and protein requirements.',
    },
    {
      step: 2,
      title: 'Fit fitness into your day.',
      subtitle: 'Tell us about your daily work and sleep rhythm so workouts sit comfortably into your natural timetable.',
    },
    {
      step: 3,
      title: 'How do you want to move?',
      subtitle: 'Choose where and how you like to exercise. We construct realistic volume whether at home or in a gym.',
    },
    {
      step: 4,
      title: 'Build your plan around real food.',
      subtitle: 'Authentic Indian whole foods—roti, dal, sattu, chana, dahi, and paneer—tailored to your kitchen situation.',
    },
    {
      step: 5,
      title: 'Your goals. Your budget.',
      subtitle: 'Select a comfortable daily grocery spend. Fitness nutrition should never strain your personal finances.',
    },
    {
      step: 6,
      title: 'Food first. Your choice.',
      subtitle: 'Whole foods are always sufficient. Supplements remain strictly optional convenience tools.',
    },
    {
      step: 7,
      title: 'Your plan starts here.',
      subtitle: 'Verify your lifestyle parameters below. Click generate to construct your customized routine and meal framework.',
    },
  ];

  const currentMeta = stepMeta[currentStep - 1];

  const isStep1Valid =
    formData.personal.age >= 14 &&
    formData.personal.age <= 100 &&
    formData.personal.heightCm >= 100 &&
    formData.personal.heightCm <= 250 &&
    formData.personal.weightKg >= 30 &&
    formData.personal.weightKg <= 300;

  const handleNext = () => {
    if (currentStep === 1) {
      if (!isStep1Valid) {
        setStep1Error('Please enter a valid age (14–100), height (100–250 cm), and current weight (30–300 kg).');
        return;
      }
      setStep1Error(null);
    }
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep1Error(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCancel();
    }
  };

  const handleGenerate = () => {
    onComplete(formData);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Wizard Header Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-zinc-500 font-medium mb-3">
          <span className="flex items-center gap-1.5 text-emerald-800 font-semibold uppercase tracking-wider text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            FitShift Onboarding
          </span>
          <span className="bg-zinc-100 px-2.5 py-1 rounded-full text-zinc-600 font-medium">
            Step {currentStep} of {totalSteps}
          </span>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <div className="mt-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
            {currentMeta.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 leading-relaxed">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Dynamic Step Content */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs mb-8">
        {currentStep === 1 && (
          <div className="space-y-4">
            <PersonalBasicsStep
              data={formData.personal}
              onChange={(updated) => {
                setStep1Error(null);
                setFormData((prev) => ({
                  ...prev,
                  personal: { ...prev.personal, ...updated },
                }));
              }}
            />
            {step1Error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {step1Error}
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <DailyRhythmStep
            data={formData.rhythm}
            onChange={(updated) =>
              setFormData((prev) => ({
                ...prev,
                rhythm: { ...prev.rhythm, ...updated },
              }))
            }
          />
        )}

        {currentStep === 3 && (
          <TrainingSetupStep
            data={formData.training}
            onChange={(updated) =>
              setFormData((prev) => ({
                ...prev,
                training: { ...prev.training, ...updated },
              }))
            }
          />
        )}

        {currentStep === 4 && (
          <FoodPreferencesStep
            data={formData.food}
            onChange={(updated) =>
              setFormData((prev) => ({
                ...prev,
                food: { ...prev.food, ...updated },
              }))
            }
          />
        )}

        {currentStep === 5 && (
          <BudgetStep
            data={formData.budget}
            onChange={(updated) =>
              setFormData((prev) => ({
                ...prev,
                budget: { ...prev.budget, ...updated },
              }))
            }
          />
        )}

        {currentStep === 6 && (
          <SupplementsStep
            data={formData.supplements}
            onChange={(updated) =>
              setFormData((prev) => ({
                ...prev,
                supplements: { ...prev.supplements, ...updated },
              }))
            }
          />
        )}

        {currentStep === 7 && (
          <ReviewStep
            data={formData}
            onEditStep={(step) => setCurrentStep(step)}
            onGeneratePlan={handleGenerate}
            isGenerating={false}
          />
        )}
      </div>

      {/* Footer Navigation Controls (Steps 1 to 6) */}
      {currentStep < 7 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={handleBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="min-w-[130px]"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
};
