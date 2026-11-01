import { OnboardingData } from '../types';

export const initialEmptyOnboardingData: OnboardingData = {
  personal: {
    name: '',
    age: 0,
    gender: 'male',
    heightCm: 0,
    weightKg: 0,
    goal: 'muscle_gain',
  },
  rhythm: {
    occupation: 'working_professional',
    departureTime: '08:30',
    returnTime: '18:30',
    sleepHours: 7.5,
    wakeUpTime: '06:30',
    activityLevel: 'moderately_active',
  },
  training: {
    environment: 'home',
    durationMinutes: 45,
    preferredTime: 'morning',
    weeklyFrequencyDays: 4,
    experienceLevel: 'intermediate',
    homeEquipment: ['none'],
    gymEquipmentLevel: 'full_gym',
  },
  food: {
    dietType: 'pure_veg',
    cookingSituation: 'self_cooking',
    mealsPerDay: 3,
    avoidedFoods: [],
    allergies: [],
    indianFoodStyle: 'simple_homestyle',
  },
  budget: {
    tier: 'budget',
    dailyBudgetRupees: 65,
  },
  supplements: {
    preference: 'no_supplements',
  },
};
