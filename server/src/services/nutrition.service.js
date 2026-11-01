import { calculateBMR } from '../algorithms/nutrition/bmr.js';
import { calculateTDEE } from '../algorithms/nutrition/tdee.js';
import { calculateCalorieTarget } from '../algorithms/nutrition/calorieTarget.js';
import { calculateProteinTarget } from '../algorithms/nutrition/proteinTarget.js';
import { validateNutritionInput, NutritionValidationError } from '../validators/nutrition.validators.js';

/**
 * Service to execute deterministic nutrition calculations.
 */
export class NutritionService {
  /**
   * Calculates BMR, TDEE, goal-adjusted calorie target, and daily protein requirement.
   * 
   * Flow:
   * 1. Validate and sanitize input contract
   * 2. Compute unrounded BMR (Mifflin-St Jeor)
   * 3. Compute unrounded TDEE (BMR × activity multiplier)
   * 4. Compute unrounded Calorie Target (TDEE + goal adjustment)
   * 5. Compute unrounded Protein Target (weightKg × protein multiplier)
   * 6. Round final user-facing metrics to whole integers
   * 
   * @param {object} input - Nutrition parameters.
   * @returns {{ bmr: number, tdee: number, goal: string, calorieTarget: number, proteinTargetGrams: number, activityLevel: string }}
   */
  calculateNutrition(input) {
    const validation = validateNutritionInput(input);
    if (!validation.isValid) {
      throw new NutritionValidationError(
        `Invalid nutrition input: ${validation.errors.join('; ')}`,
        validation.errors
      );
    }

    const { age, gender, heightCm, weightKg, goal, activityLevel } = validation.value;

    // 1. Calculate unrounded BMR
    const unroundedBMR = calculateBMR({ age, gender, heightCm, weightKg });

    // 2. Calculate unrounded TDEE
    const tdeeResult = calculateTDEE({ bmr: unroundedBMR, activityLevel });
    const unroundedTDEE = tdeeResult.tdee;

    // 3. Calculate unrounded Calorie Target
    const unroundedCalorieTarget = calculateCalorieTarget({ tdee: unroundedTDEE, goal });

    // 4. Calculate unrounded Protein Target
    const unroundedProteinTarget = calculateProteinTarget({ weightKg, goal });

    // 5. Return rounded final user-facing metrics
    return {
      bmr: Math.round(unroundedBMR),
      tdee: Math.round(unroundedTDEE),
      goal,
      calorieTarget: Math.round(unroundedCalorieTarget),
      proteinTargetGrams: Math.round(unroundedProteinTarget),
      activityLevel
    };
  }
}

export const nutritionService = new NutritionService();
export default nutritionService;
