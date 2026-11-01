import { generateWorkoutSchedule } from '../algorithms/workout/workoutGenerator.js';
import { validateWorkoutInput, WorkoutValidationError } from '../validators/workout.validators.js';

export class WorkoutService {
  /**
   * Generates a deterministic workout plan from real exercises.
   * @param {object} input
   */
  generateWorkout(input = {}) {
    const validation = validateWorkoutInput(input);
    if (!validation.isValid) {
      throw new WorkoutValidationError(
        `Invalid workout input: ${validation.errors.join('; ')}`,
        validation.errors
      );
    }

    const schedule = generateWorkoutSchedule(validation.value);
    return {
      gender: validation.value.gender,
      environment: validation.value.environment,
      durationMinutes: validation.value.durationMinutes,
      weeklyFrequencyDays: validation.value.weeklyFrequencyDays,
      experienceLevel: validation.value.experienceLevel,
      goal: validation.value.goal,
      days: schedule
    };
  }
}

export const workoutService = new WorkoutService();
export default workoutService;
