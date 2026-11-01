import {
  ACTIVITY_MULTIPLIERS,
  DEFAULT_ACTIVITY_LEVEL
} from '../../config/nutrition.config.js';

/**
 * Calculates Total Daily Energy Expenditure (TDEE) from BMR and activity level.
 * 
 * Formula:
 * - TDEE = BMR × activityMultiplier
 * 
 * @param {object} params
 * @param {number} params.bmr - Unrounded or numeric BMR in kcal/day.
 * @param {string} [params.activityLevel=DEFAULT_ACTIVITY_LEVEL] - 'sedentary', 'light', 'moderate', or 'very_active'.
 * @returns {{ bmr: number, activityLevel: string, activityMultiplier: number, tdee: number }}
 */
export function calculateTDEE({ bmr, activityLevel = DEFAULT_ACTIVITY_LEVEL }) {
  if (typeof bmr !== 'number' || isNaN(bmr) || bmr <= 0) {
    throw new Error(`Invalid BMR: "${bmr}". Expected a positive number.`);
  }

  const normalizedLevel = String(activityLevel).trim().toLowerCase();
  const multiplier = ACTIVITY_MULTIPLIERS[normalizedLevel];

  if (!multiplier) {
    throw new Error(
      `Unsupported activity level: "${activityLevel}". Expected one of: ${Object.keys(ACTIVITY_MULTIPLIERS).join(', ')}.`
    );
  }

  return {
    bmr,
    activityLevel: normalizedLevel,
    activityMultiplier: multiplier,
    tdee: bmr * multiplier
  };
}

export default calculateTDEE;
