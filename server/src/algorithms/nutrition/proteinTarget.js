import { PROTEIN_MULTIPLIERS } from '../../config/nutrition.config.js';

/**
 * Calculates daily protein target in grams based on body weight and nutritional goal.
 * 
 * Rules:
 * - muscle_gain: weightKg × 1.7 g/kg
 * - fat_loss:    weightKg × 1.9 g/kg
 * - maintenance: weightKg × 1.5 g/kg
 * 
 * @param {object} params
 * @param {number} params.weightKg - Body weight in kilograms.
 * @param {string} params.goal - 'muscle_gain', 'fat_loss', or 'maintenance'.
 * @returns {number} Exact unrounded protein target in grams/day.
 */
export function calculateProteinTarget({ weightKg, goal }) {
  if (typeof weightKg !== 'number' || isNaN(weightKg) || weightKg <= 0) {
    throw new Error(`Invalid weightKg: "${weightKg}". Expected a positive number.`);
  }

  const normalizedGoal = String(goal).trim().toLowerCase();
  const multiplier = PROTEIN_MULTIPLIERS[normalizedGoal];

  if (multiplier === undefined) {
    throw new Error(
      `Unsupported goal: "${goal}". Expected one of: ${Object.keys(PROTEIN_MULTIPLIERS).join(', ')}.`
    );
  }

  return weightKg * multiplier;
}

export default calculateProteinTarget;
