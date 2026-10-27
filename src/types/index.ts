// FitShift Core Types

export type FitnessGoal = 'muscle_gain' | 'fat_loss' | 'weight_loss' | 'maintenance';

export type Gender = 'male' | 'female' | 'other';

export type Occupation =
  | 'student'
  | 'working_professional'
  | 'homemaker'
  | 'business_owner'
  | 'freelancer'
  | 'other';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active';

export type TrainingEnvironment = 'home' | 'gym';

export type WorkoutDuration = 20 | 30 | 45 | 60;

export type PreferredWorkoutTime = 'morning' | 'afternoon' | 'evening' | 'night' | 'flexible';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type DietType = 'pure_veg' | 'eggetarian' | 'non_veg';

export type CookingSituation = 'hostel_mess' | 'family_provided' | 'self_cooking';

export type IndianFoodStyle =
  | 'north_indian'
  | 'south_indian'
  | 'simple_homestyle'
  | 'high_protein_everyday';

export type BudgetTier = 'ultra_budget' | 'budget' | 'moderate' | 'custom';

export type SupplementPreference =
  | 'no_supplements'
  | 'open_to_supplements'
  | 'not_sure';

export interface PersonalBasics {
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  goal: FitnessGoal;
}

export interface DailyRhythm {
  occupation: Occupation;
  departureTime: string; // e.g. "08:30"
  returnTime: string;    // e.g. "18:00"
  sleepHours: number;    // e.g. 7.5
  wakeUpTime: string;    // e.g. "06:30"
  activityLevel: ActivityLevel;
}

export interface TrainingSetup {
  environment: TrainingEnvironment;
  durationMinutes: WorkoutDuration;
  preferredTime: PreferredWorkoutTime;
  weeklyFrequencyDays: number; // 3, 4, 5, 6
  experienceLevel: ExperienceLevel;
  homeEquipment: string[]; // ['none', 'dumbbells', 'resistance_bands', 'pull_up_bar', 'yoga_mat']
  gymEquipmentLevel: 'full_gym' | 'limited_gym';
}

export interface FoodPreferences {
  dietType: DietType;
  cookingSituation: CookingSituation;
  mealsPerDay: number; // 3, 4, 5
  avoidedFoods: string[];
  allergies: string[];
  indianFoodStyle: IndianFoodStyle;
}

export interface Budget {
  tier: BudgetTier;
  dailyBudgetRupees: number;
  customAmountRupees?: number;
}

export interface Supplements {
  preference: SupplementPreference;
  monthlyBudgetRupees?: number;
}

export interface OnboardingData {
  personal: PersonalBasics;
  rhythm: DailyRhythm;
  training: TrainingSetup;
  food: FoodPreferences;
  budget: Budget;
  supplements: Supplements;
}

export interface ExerciseAlternative {
  id: string;
  name: string;
  environment: TrainingEnvironment | 'both';
  equipment: string;
  note: string;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  setsReps: string;
  restSeconds: number;
  environment: TrainingEnvironment | 'both';
  equipment: string;
  thumbnailUrl?: string;
  videoPlaceholderUrl?: string;
  instructions: string[];
  commonMistakes: string[];
  alternative: ExerciseAlternative;
}

export interface WorkoutDay {
  dayNumber: number;
  dayName: string;
  focus: string;
  isRestDay: boolean;
  estimatedMinutes: number;
  exercises: Exercise[];
  restDayGuidance?: string;
}

export interface MealAlternative {
  id: string;
  name: string;
  description: string;
  approxProteinG: number;
  estCalories: number;
  approxCostRupees: number;
  ingredients: string[];
  prepTimeMinutes: number;
}

export interface Meal {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'pre_workout' | 'post_workout' | 'dinner';
  title: string;
  description: string;
  ingredients: string[];
  approxProteinG: number;
  estCalories: number;
  approxCostRupees: number;
  prepTimeMinutes: number;
  cookingTip?: string;
  alternatives: MealAlternative[];
}

export type GroceryCategory =
  | 'Protein Staples'
  | 'Grains & Carbs'
  | 'Dairy & Fermented'
  | 'Vegetables & Greens'
  | 'Fruits & Quick Fuel'
  | 'Spices & Pantry Essentials';

export interface GroceryItem {
  id: string;
  name: string;
  category: GroceryCategory;
  estimatedQuantity: string;
  approxCostRupees: number;
  notes?: string;
  checked?: boolean;
}

export interface SupplementRecommendation {
  id: string;
  productCategory: string;
  productName: string;
  whyUseful: string;
  estimatedMonthlyCostRupees: number;
  foodBasedAlternative: string;
  recommendedTiming: string;
  cautionNotice: string;
}

export interface RecoveryGuidance {
  id: string;
  category: 'sleep' | 'hydration' | 'mobility' | 'mental';
  title: string;
  tip: string;
  actionableStep: string;
}

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  type: 'workout' | 'meal' | 'work' | 'sleep' | 'recovery';
  description: string;
  duration?: string;
}

export interface GeneratedPlan {
  userProfile: OnboardingData;
  workoutDays: WorkoutDay[];
  currentEnvironment: TrainingEnvironment;
  meals: Meal[];
  groceryItems: GroceryItem[];
  supplementRecommendations: SupplementRecommendation[];
  recoveryTips: RecoveryGuidance[];
  dailySchedule: ScheduleEvent[];
  isLateTiredModeActive: boolean;
}

// AI Assistant Types
export interface ChatMessageAction {
  label: string;
  tab: 'workout' | 'diet' | 'schedule' | 'grocery' | 'supplements' | 'recovery' | 'overview';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionLink?: ChatMessageAction;
  followUps?: string[];
  contextUsed?: {
    goal: string;
    environment: string;
    diet: string;
    dailyBudget: number;
    durationMinutes: number;
  };
}

export interface SuggestedPromptCategory {
  id: string;
  categoryName: string;
  prompts: string[];
}

