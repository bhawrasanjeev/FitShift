import {
  SUPPORTED_DIET_TYPES,
  SUPPORTED_SUPPLEMENT_PREFERENCES,
  DIET_INPUT_BOUNDS
} from '../config/diet.config.js';

/**
 * Custom error class for diet optimization input validation.
 * Sets HTTP status code 400 for bad client requests.
 */
export class DietValidationError extends Error {
  constructor(message, validationErrors = []) {
    super(message);
    this.name = 'DietValidationError';
    this.statusCode = 400;
    this.status = 400;
    this.validationErrors = validationErrors;
  }
}

/**
 * Validates and sanitizes diet optimization input parameters.
 * 
 * @param {any} input - Raw input body from client request.
 * @returns {{ isValid: boolean, errors: string[], value?: { calorieTarget: number, proteinTargetGrams: number, dietType: string, foodBudget: number, supplementPreference: string } }}
 */
export function validateDietInput(input) {
  const errors = [];

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {
      isValid: false,
      errors: ['Diet optimization input must be a valid JSON object']
    };
  }

  const { nutrition, dietType, foodBudget, supplementPreference } = input;

  // --- Nutrition Object Validation ---
  if (!nutrition || typeof nutrition !== 'object' || Array.isArray(nutrition)) {
    errors.push('The "nutrition" field is required and must be an object containing "calorieTarget" and "proteinTargetGrams"');
  } else {
    // Calorie Target
    const { calorieTarget, proteinTargetGrams } = nutrition;

    if (calorieTarget === undefined || calorieTarget === null || calorieTarget === '') {
      errors.push('nutrition.calorieTarget is required');
    } else {
      const numCalories = Number(calorieTarget);
      if (!Number.isFinite(numCalories)) {
        errors.push(`nutrition.calorieTarget must be a valid number; received "${calorieTarget}"`);
      } else if (numCalories <= 0) {
        errors.push(`nutrition.calorieTarget must be a positive number; received ${numCalories}`);
      } else if (numCalories < DIET_INPUT_BOUNDS.calorieTarget.min || numCalories > DIET_INPUT_BOUNDS.calorieTarget.max) {
        errors.push(`nutrition.calorieTarget must be between ${DIET_INPUT_BOUNDS.calorieTarget.min} and ${DIET_INPUT_BOUNDS.calorieTarget.max} kcal; received ${numCalories}`);
      }
    }

    // Protein Target
    if (proteinTargetGrams === undefined || proteinTargetGrams === null || proteinTargetGrams === '') {
      errors.push('nutrition.proteinTargetGrams is required');
    } else {
      const numProtein = Number(proteinTargetGrams);
      if (!Number.isFinite(numProtein)) {
        errors.push(`nutrition.proteinTargetGrams must be a valid number; received "${proteinTargetGrams}"`);
      } else if (numProtein <= 0) {
        errors.push(`nutrition.proteinTargetGrams must be a positive number; received ${numProtein}`);
      } else if (numProtein < DIET_INPUT_BOUNDS.proteinTargetGrams.min || numProtein > DIET_INPUT_BOUNDS.proteinTargetGrams.max) {
        errors.push(`nutrition.proteinTargetGrams must be between ${DIET_INPUT_BOUNDS.proteinTargetGrams.min}g and ${DIET_INPUT_BOUNDS.proteinTargetGrams.max}g; received ${numProtein}`);
      }
    }
  }

  // --- Food Budget Validation ---
  if (foodBudget === undefined || foodBudget === null || foodBudget === '') {
    errors.push('foodBudget is required');
  } else {
    const numBudget = Number(foodBudget);
    if (!Number.isFinite(numBudget)) {
      errors.push(`foodBudget must be a valid number; received "${foodBudget}"`);
    } else if (numBudget <= 0) {
      errors.push(`foodBudget must be a positive number; received ${numBudget}`);
    } else if (numBudget < DIET_INPUT_BOUNDS.foodBudget.min || numBudget > DIET_INPUT_BOUNDS.foodBudget.max) {
      errors.push(`foodBudget must be between ₹${DIET_INPUT_BOUNDS.foodBudget.min} and ₹${DIET_INPUT_BOUNDS.foodBudget.max}; received ${numBudget}`);
    }
  }

  // --- Diet Type Validation ---
  if (!dietType || typeof dietType !== 'string' || dietType.trim() === '') {
    errors.push(`dietType is required and must be one of: ${SUPPORTED_DIET_TYPES.join(', ')}`);
  } else {
    const normalizedDiet = dietType.trim().toLowerCase();
    if (!SUPPORTED_DIET_TYPES.includes(normalizedDiet)) {
      errors.push(`Invalid dietType "${dietType}". Supported values are: ${SUPPORTED_DIET_TYPES.join(', ')}`);
    }
  }

  // --- Supplement Preference Validation ---
  let normalizedSupp = 'no_supplements';
  if (supplementPreference !== undefined && supplementPreference !== null && supplementPreference !== '') {
    if (typeof supplementPreference !== 'string') {
      errors.push(`supplementPreference must be a string; received "${supplementPreference}"`);
    } else {
      const parsedSupp = supplementPreference.trim().toLowerCase();
      if (!SUPPORTED_SUPPLEMENT_PREFERENCES.includes(parsedSupp)) {
        errors.push(`Invalid supplementPreference "${supplementPreference}". Supported values are: ${SUPPORTED_SUPPLEMENT_PREFERENCES.join(', ')}`);
      } else {
        normalizedSupp = parsedSupp;
      }
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors
    };
  }

  return {
    isValid: true,
    errors: [],
    value: {
      calorieTarget: Number(nutrition.calorieTarget),
      proteinTargetGrams: Number(nutrition.proteinTargetGrams),
      dietType: dietType.trim().toLowerCase(),
      foodBudget: Number(foodBudget),
      supplementPreference: normalizedSupp
    }
  };
}

export default validateDietInput;
