/**
 * Validation for workout generation parameters.
 */
export class WorkoutValidationError extends Error {
  constructor(message, validationErrors = []) {
    super(message);
    this.name = 'WorkoutValidationError';
    this.statusCode = 400;
    this.status = 400;
    this.validationErrors = validationErrors;
  }
}

export function validateWorkoutInput(input) {
  const errors = [];

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {
      isValid: false,
      errors: ['Workout input must be a valid JSON object']
    };
  }

  const { gender, environment, durationMinutes, weeklyFrequencyDays, experienceLevel, goal } = input;

  if (gender !== undefined && !['male', 'female'].includes(String(gender).toLowerCase())) {
    errors.push('Gender must be "male" or "female"');
  }

  if (environment !== undefined && !['home', 'gym'].includes(String(environment).toLowerCase())) {
    errors.push('Environment must be "home" or "gym"');
  }

  if (durationMinutes !== undefined) {
    const numDuration = Number(durationMinutes);
    if (![20, 30, 45, 60].includes(numDuration)) {
      errors.push('Duration must be one of: 20, 30, 45, 60 minutes');
    }
  }

  if (weeklyFrequencyDays !== undefined) {
    const numFreq = Number(weeklyFrequencyDays);
    if (![3, 4, 5, 6].includes(numFreq)) {
      errors.push('Weekly frequency must be between 3 and 6 days');
    }
  }

  if (experienceLevel !== undefined) {
    const validLevels = ['beginner', 'intermediate', 'expert', 'advanced'];
    if (!validLevels.includes(String(experienceLevel).toLowerCase())) {
      errors.push(`Experience level must be one of: ${validLevels.join(', ')}`);
    }
  }

  if (goal !== undefined) {
    const validGoals = ['muscle_gain', 'fat_loss', 'weight_loss', 'maintenance'];
    if (!validGoals.includes(String(goal).toLowerCase())) {
      errors.push(`Goal must be one of: ${validGoals.join(', ')}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: {
      gender: gender && String(gender).toLowerCase() === 'female' ? 'female' : 'male',
      environment: environment ? String(environment).toLowerCase() : 'home',
      durationMinutes: durationMinutes ? Number(durationMinutes) : 45,
      weeklyFrequencyDays: weeklyFrequencyDays ? Number(weeklyFrequencyDays) : 4,
      experienceLevel: experienceLevel ? String(experienceLevel).toLowerCase() : 'intermediate',
      goal: goal === 'weight_loss' ? 'fat_loss' : (goal ? String(goal).toLowerCase() : 'muscle_gain')
    }
  };
}
