import cleanStaplesRepository, { CleanStaplesRepository } from '../repositories/cleanStaples.repository.js';
import { optimizeDiet } from '../algorithms/diet/optimizer.js';
import { generateMealPlanAndGrocery } from '../algorithms/diet/mealPlanner.js';
import { validateDietInput, DietValidationError } from '../validators/diet.validators.js';

/**
 * Service to execute deterministic budget-aware diet, meal allocation, and grocery generation.
 */
export class DietService {
  constructor({ cleanStaples = cleanStaplesRepository } = {}) {
    this.cleanStaplesRepo = cleanStaples;
  }

  /**
   * Optimizes food combinations and allocates them into daily meals and consolidated groceries.
   * 
   * @param {object} input - User nutrition targets and diet/budget constraints.
   * @returns {object} Explainable optimization result with structured meals and groceries.
   */
  optimizeDietPlan(input) {
    const validation = validateDietInput(input);
    if (!validation.isValid) {
      throw new DietValidationError(
        `Invalid diet optimization input: ${validation.errors.join('; ')}`,
        validation.errors
      );
    }

    const {
      proteinTargetGrams,
      foodBudget,
      dietType,
      supplementPreference
    } = validation.value;

    const availableFoods = this.cleanStaplesRepo.getAll();

    const optimizationResult = optimizeDiet({
      foods: availableFoods,
      proteinTargetGrams,
      foodBudget,
      dietType,
      supplementPreference
    });

    const mealsCount = input.mealsPerDay || (input.food && input.food.mealsPerDay) || 4;
    const calorieTarget = input.nutrition?.calorieTarget || 2500;
    const rhythm = input.rhythm || input.userProfile?.rhythm || {};
    const training = input.training || input.userProfile?.training || {};

    const {
      meals,
      groceryList,
      mealTimings,
      sevenDayMealPlan,
      budgetManagement
    } = generateMealPlanAndGrocery({
      optimizedFoods: optimizationResult.foods,
      mealsPerDay: mealsCount,
      dietType,
      calorieTarget,
      proteinTargetGrams,
      foodBudget,
      rhythm,
      training
    });

    return {
      ...optimizationResult,
      meals,
      groceryList,
      mealTimings,
      sevenDayMealPlan,
      budgetManagement
    };
  }
}

export const dietService = new DietService();
export default dietService;
