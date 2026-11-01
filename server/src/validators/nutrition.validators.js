import {
  SUPPORTED_GENDERS,
  SUPPORTED_GOALS,
  SUPPORTED_ACTIVITY_LEVELS,
  DEFAULT_ACTIVITY_LEVEL,
  INPUT_BOUNDS
} from '../config/nutrition.config.js';

/**
 * Custom error class for nutrition calculation input validation.
 * Sets HTTP status code 400 for bad client requests.
 */
export class NutritionValidationError extends Error {
  constructor(message, validationErrors = []) {
    super(message);
    this.name = 'NutritionValidationError';
    this.statusCode = 400;
    this.status = 400;
    this.validationErrors = validationErrors;
  }
}

/**
 * Validates and sanitizes nutrition calculation input parameters.
 * 
 * @param {any} input - Raw input body from client request.
 * @returns {{ isValid: boolean, errors: string[], value?: { age: number, gender: string, heightCm: number, weightKg: number, goal: string, activityLevel: string } }}
 */
export function validateNutritionInput(input) {
  const errors = [];

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {
      isValid: false,
      errors: ['Nutrition input must be a valid JSON object']
    };
  }

  // --- Age validation ---
  const { age, gender, heightCm, weightKg, goal, activityLevel } = input;

  if (age === undefined || age === null || age === '') {
    errors.push('Age is required');
  } else {
    const numAge = Number(age);
    if (!Number.isFinite(numAge)) {
      errors.push(`Age must be a valid number; received "${age}"`);
    } else if (numAge <= 0) {
      errors.push(`Age must be a positive number; received ${numAge}`);
    } else if (numAge < INPUT_BOUNDS.age.min || numAge > INPUT_BOUNDS.age.max) {
      errors.push(`Age must be between ${INPUT_BOUNDS.age.min} and ${INPUT_BOUNDS.age.max} years; received ${numAge}`);
    }
  }

  // --- Gender validation ---
  if (!gender || typeof gender !== 'string' || gender.trim() === '') {
    errors.push(`Gender is required and must be one of: ${SUPPORTED_GENDERS.join(', ')}`);
  } else {
    const normalizedGender = gender.trim().toLowerCase();
    if (!SUPPORTED_GENDERS.includes(normalizedGender)) {
      errors.push(`Invalid gender "${gender}". Supported values are: ${SUPPORTED_GENDERS.join(', ')}`);
    }
  }

  // --- Height (cm) validation ---
  if (heightCm === undefined || heightCm === null || heightCm === '') {
    errors.push('Height in centimeters (heightCm) is required');
  } else {
    const numHeight = Number(heightCm);
    if (!Number.isFinite(numHeight)) {
      errors.push(`Height must be a valid number; received "${heightCm}"`);
    } else if (numHeight <= 0) {
      errors.push(`Height must be a positive number; received ${numHeight}`);
    } else if (numHeight < INPUT_BOUNDS.heightCm.min || numHeight > INPUT_BOUNDS.heightCm.max) {
      errors.push(`Height must be between ${INPUT_BOUNDS.heightCm.min} cm and ${INPUT_BOUNDS.heightCm.max} cm; received ${numHeight}`);
    }
  }

  // --- Weight (kg) validation ---
  if (weightKg === undefined || weightKg === null || weightKg === '') {
    errors.push('Weight in kilograms (weightKg) is required');
  } else {
    const numWeight = Number(weightKg);
    if (!Number.isFinite(numWeight)) {
      errors.push(`Weight must be a valid number; received "${weightKg}"`);
    } else if (numWeight <= 0) {
      errors.push(`Weight must be a positive number; received ${numWeight}`);
    } else if (numWeight < INPUT_BOUNDS.weightKg.min || numWeight > INPUT_BOUNDS.weightKg.max) {
      errors.push(`Weight must be between ${INPUT_BOUNDS.weightKg.min} kg and ${INPUT_BOUNDS.weightKg.max} kg; received ${numWeight}`);
    }
  }

  // --- Goal validation ---
  if (!goal || typeof goal !== 'string' || goal.trim() === '') {
    errors.push(`Goal is required and must be one of: ${SUPPORTED_GOALS.join(', ')}`);
  } else {
    const normalizedGoal = goal.trim().toLowerCase();
    if (!SUPPORTED_GOALS.includes(normalizedGoal)) {
      errors.push(`Invalid goal "${goal}". Supported values are: ${SUPPORTED_GOALS.join(', ')}`);
    }
  }

  // --- Activity Level validation (optional with default) ---
  let normalizedActivityLevel = DEFAULT_ACTIVITY_LEVEL;
  if (activityLevel !== undefined && activityLevel !== null && activityLevel !== '') {
    if (typeof activityLevel !== 'string') {
      errors.push(`Invalid activityLevel "${activityLevel}". Expected string from: ${SUPPORTED_ACTIVITY_LEVELS.join(', ')}`);
    } else {
      const parsedLevel = activityLevel.trim().toLowerCase();
      if (!SUPPORTED_ACTIVITY_LEVELS.includes(parsedLevel)) {
        errors.push(`Invalid activityLevel "${activityLevel}". Supported values are: ${SUPPORTED_ACTIVITY_LEVELS.join(', ')}`);
      } else {
        normalizedActivityLevel = parsedLevel;
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
      age: Number(age),
      gender: gender.trim().toLowerCase(),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      goal: goal.trim().toLowerCase(),
      activityLevel: normalizedActivityLevel
    }
  };
}

export default validateNutritionInput;
