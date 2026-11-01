/**
 * FitShift Budget Diet Optimizer Configuration.
 * 
 * Centralized assumptions, thresholds, constraints, and dietary rules for
 * deterministic, budget-aware Indian-food protein optimization.
 */

export const SUPPORTED_DIET_TYPES = Object.freeze([
  'vegetarian',
  'eggetarian',
  'non_vegetarian'
]);

export const SUPPORTED_SUPPLEMENT_PREFERENCES = Object.freeze([
  'no_supplements',
  'open_to_supplements',
  'unsure'
]);

/**
 * FitShift daily food budget tiers (INR / day).
 */
export const BUDGET_TIERS = Object.freeze({
  ultra_budget: { label: 'Ultra Budget', max: 45 },
  budget: { label: 'Budget', min: 45, max: 80 },
  moderate: { label: 'Moderate', min: 80, max: 150 },
  premium: { label: 'Premium', min: 150 }
});

/**
 * Strict business rules for soya-based products.
 * - Maximum dry soya: 50g / day
 * - Disallow combining multiple soya products (e.g. chunks + granules) on the same day.
 */
export const SOYA_CONSTRAINTS = Object.freeze({
  maxDailyGrams: 50,
  disallowDuplicateSoyaProducts: true
});

/**
 * Staple carbohydrate food categories.
 * Excluded from primary concentrated protein optimization to avoid treating
 * raw grains / tubers / fruit as protein boosters.
 */
export const STAPLE_CATEGORIES = Object.freeze([
  'Grains',
  'Bakery',
  'Fruits',
  'Tubers'
]);

/**
 * Categories recognized as concentrated protein sources.
 */
export const PROTEIN_CATEGORIES = Object.freeze([
  'Legumes',
  'Dairy',
  'Plant Dairy',
  'Poultry',
  'Meat',
  'Fish',
  'Nuts & Seeds',
  'Spreads',
  'Supplements'
]);

/**
 * Practical engineering serving constraints (grams/day).
 * Used to prevent unrealistic or medically extreme allocations.
 */
export const SERVING_CONSTRAINTS = Object.freeze({
  soya: { min: 25, max: 50, step: 25 },
  whole_legumes: { min: 50, max: 100, step: 25 },
  legume_snack: { min: 30, max: 60, step: 10 },
  dairy_liquid: { min: 250, max: 500, step: 50 },
  dairy_solid: { min: 50, max: 150, step: 25 },
  eggs: { min: 100, max: 300, step: 50 }, // 1 egg ~ 50g; 2 to 6 eggs
  meat_fish: { min: 100, max: 200, step: 25 },
  nuts_spreads: { min: 25, max: 50, step: 5 },
  supplements: { min: 30, max: 60, step: 30 }, // 1 to 2 scoops
  default: { min: 30, max: 150, step: 10 }
});

/**
 * Baseline protein contribution ratio from staples.
 * Project assumption: defaults to 0 (optimized foods meet 100% of protein target).
 */
export const DEFAULT_BASELINE_PROTEIN_RATIO = 0.0;

/**
 * Realistic bounds for input validation.
 */
export const DIET_INPUT_BOUNDS = Object.freeze({
  foodBudget: { min: 1, max: 10000 },
  proteinTargetGrams: { min: 1, max: 500 },
  calorieTarget: { min: 500, max: 8000 }
});
