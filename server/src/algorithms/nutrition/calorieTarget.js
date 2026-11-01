import { GOAL_ADJUSTMENTS } from '../../config/nutrition.config.js';

/**
 * Calculates daily calorie target based on TDEE and nutritional goal.
 * 
 * Rules:
 * - muscle_gain: TDEE + 300 kcal
 * - fat_loss:    TDEE - 400 kcal
 * - maintenance: TDEE + 0 kcal
 * 
 * @param {object} params
 * @param {number} params.tdee - TDEE in kcal/day.
 * @param {string} params.goal - 'muscle_gain', 'fat_loss', or 'maintenance'.
 * @returns {number} Exact unrounded calorie target in kcal/day.
 */
export function calculateCalorieTarget({ tdee, goal }) {
  if (typeof tdee !== 'number' || isNaN(tdee) || tdee <= 0) {
    throw new Error(`Invalid TDEE: "${tdee}". Expected a positive number.`);
  }

  const normalizedGoal = String(goal).trim().toLowerCase();
  const adjustment = GOAL_ADJUSTMENTS[normalizedGoal];

  if (adjustment === undefined) {
    throw new Error(
      `Unsupported goal: "${goal}". Expected one of: ${Object.keys(GOAL_ADJUSTMENTS).join(', ')}.`
    );
  }

  return tdee + adjustment;
}

export default calculateCalorieTarget;
