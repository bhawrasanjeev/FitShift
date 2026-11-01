/**
 * FitShift Nutrition Engine Configuration.
 * 
 * Centralized assumptions, multipliers, and bounds for deterministic nutrition calculations.
 * Note: These are project calculation assumptions/rules and not individualized medical advice.
 */

export const SUPPORTED_GENDERS = Object.freeze(['male', 'female']);

export const SUPPORTED_GOALS = Object.freeze([
  'muscle_gain',
  'fat_loss',
  'maintenance'
]);

export const SUPPORTED_ACTIVITY_LEVELS = Object.freeze([
  'sedentary',
  'light',
  'moderate',
  'very_active'
]);

/**
 * Standard baseline activity multiplier assumptions.
 */
export const ACTIVITY_MULTIPLIERS = Object.freeze({
  sedentary: 1.20,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725
});

/**
 * Default activity level applied when the optional activityLevel input is omitted.
 * Sedentary is chosen as the safe baseline to prevent overestimating energy expenditure.
 */
export const DEFAULT_ACTIVITY_LEVEL = 'sedentary';

/**
 * Goal-based calorie adjustments (kcal/day) added to TDEE.
 */
export const GOAL_ADJUSTMENTS = Object.freeze({
  muscle_gain: 300,
  fat_loss: -400,
  maintenance: 0
});

/**
 * Daily protein intake multipliers (grams of protein per kg of bodyweight).
 */
export const PROTEIN_MULTIPLIERS = Object.freeze({
  muscle_gain: 1.7,
  fat_loss: 1.9,
  maintenance: 1.5
});

/**
 * Realistic biological bounds for input validation.
 */
export const INPUT_BOUNDS = Object.freeze({
  age: { min: 14, max: 120 },
  heightCm: { min: 50, max: 280 },
  weightKg: { min: 20, max: 350 }
});
