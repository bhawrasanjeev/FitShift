// FitShift API Client Layer
// Connects frontend to real backend endpoints (Phase 1, 3, 4, 5)

import {
  PlannedMeal,
  GroceryEntry,
  WorkoutPlanData,
  WorkoutDuration,
  TrainingEnvironment,
  FitnessGoal,
  ExperienceLevel,
  DailyMealTiming,
  DayMealPlan,
  BudgetManagementGuide
} from '../types';

export interface NutritionCalculationRequest {
  age: number;
  gender: 'male' | 'female';
  heightCm: number;
  weightKg: number;
  goal: 'muscle_gain' | 'fat_loss' | 'maintenance';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'very_active';
}

export interface NutritionCalculationResponse {
  bmr: number;
  tdee: number;
  goal: string;
  calorieTarget: number;
  proteinTargetGrams: number;
  activityLevel: string;
}

export interface DietOptimizationRequest {
  nutrition: {
    calorieTarget: number;
    proteinTargetGrams: number;
  };
  dietType: 'vegetarian' | 'eggetarian' | 'non_vegetarian';
  foodBudget: number;
  supplementPreference?: 'no_supplements' | 'open_to_supplements' | 'unsure';
  mealsPerDay?: number;
  rhythm?: unknown;
  training?: unknown;
}

export interface OptimizedFoodItem {
  name: string;
  quantityGrams: number;
  estimatedCost: number;
  proteinGrams: number;
  isSupplement?: boolean;
}

export interface DietOptimizationResponse {
  feasible: boolean;
  budget: {
    dailyLimit: number;
    estimatedCost: number;
  };
  protein: {
    targetGrams: number;
    achievedGrams: number;
    gapGrams: number;
  };
  foods: OptimizedFoodItem[];
  meals?: PlannedMeal[];
  groceryList?: GroceryEntry[];
  reason?: string;
  warnings?: string[];
  mealTimings?: DailyMealTiming[];
  sevenDayMealPlan?: DayMealPlan[];
  budgetManagement?: BudgetManagementGuide;
}

export interface WorkoutGenerationRequest {
  gender?: 'male' | 'female' | string;
  environment?: TrainingEnvironment;
  durationMinutes?: WorkoutDuration;
  weeklyFrequencyDays?: number;
  experienceLevel?: ExperienceLevel | string;
  goal?: FitnessGoal | string;
}

export interface AIStatusResponse {
  configured: boolean;
  provider: 'gemini' | 'openai' | null;
  model?: string;
  message?: string;
}

export interface AIChatResponse {
  response: string;
  provider: string;
  timestamp: string;
}

export interface HealthCheckResponse {
  success: boolean;
  message: string;
}

export interface DatasetStatusResponse {
  status: string;
  timestamp: string;
  datasets: {
    cleanStaples: { loaded: boolean; recordCount: number; valid: boolean };
    foodPrices: { loaded: boolean; recordCount: number; valid: boolean };
    exercises: { loaded: boolean; recordCount: number; valid: boolean };
    nutrition: { loaded: boolean; recordCount: number; valid: boolean };
  };
}

// Fallback base URLs if proxy is unavailable
const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
const CONFIGURED_API_BASE = metaEnv?.VITE_API_URL ? metaEnv.VITE_API_URL.replace(/\/$/, '') : '';

async function fetchFromApi(endpoint: string, options?: RequestInit): Promise<Response> {
  const url = `${CONFIGURED_API_BASE}${endpoint}`;
  try {
    return await fetch(url, options);
  } catch (initialErr) {
    // If running in development without Vite proxy, fallback to direct port 5001
    if (!CONFIGURED_API_BASE && window.location.hostname === 'localhost') {
      const fallbackUrl = `http://localhost:5001${endpoint}`;
      return await fetch(fallbackUrl, options);
    }
    throw initialErr;
  }
}

export async function checkHealth(): Promise<HealthCheckResponse> {
  const res = await fetchFromApi('/api/health');
  if (!res.ok) {
    throw new Error(`Health check failed with status: ${res.status}`);
  }
  return res.json();
}

export async function getDatasetStatus(): Promise<DatasetStatusResponse> {
  const res = await fetchFromApi('/api/data/status');
  if (!res.ok) {
    throw new Error(`Dataset status check failed with status: ${res.status}`);
  }
  const json = await res.json();
  return json.data || json;
}

export async function calculateNutrition(
  params: NutritionCalculationRequest
): Promise<NutritionCalculationResponse> {
  const res = await fetchFromApi('/api/nutrition/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.error?.message || `Nutrition calculation failed (HTTP ${res.status})`;
    throw new Error(message);
  }

  const json = await res.json();
  return json.data;
}

export async function optimizeDiet(
  params: DietOptimizationRequest
): Promise<DietOptimizationResponse> {
  const res = await fetchFromApi('/api/diet/optimize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.error?.message || `Diet optimization failed (HTTP ${res.status})`;
    throw new Error(message);
  }

  const json = await res.json();
  return json.data;
}

export async function generateWorkout(
  params: WorkoutGenerationRequest
): Promise<WorkoutPlanData> {
  const res = await fetchFromApi('/api/workouts/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.error?.message || `Workout generation failed (HTTP ${res.status})`;
    throw new Error(message);
  }

  const json = await res.json();
  return json.data;
}

export async function getAIStatus(): Promise<AIStatusResponse> {
  const res = await fetchFromApi('/api/ai/status');
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.error?.message || `AI status check failed (HTTP ${res.status})`;
    throw new Error(message);
  }
  const json = await res.json();
  return json.data;
}

export async function sendAIChat(
  query: string,
  context?: Record<string, unknown>
): Promise<AIChatResponse> {
  const res = await fetchFromApi('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, context }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      errorData.error?.message ||
      errorData.message ||
      (res.status === 503 ? 'AI service is not configured' : `AI request failed (HTTP ${res.status})`);
    throw new Error(message);
  }

  const json = await res.json();
  return json.data;
}
