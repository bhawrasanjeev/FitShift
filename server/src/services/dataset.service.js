import exerciseRepository, { ExerciseRepository } from '../repositories/exercise.repository.js';
import foodPriceRepository, { FoodPriceRepository } from '../repositories/foodPrice.repository.js';
import cleanStaplesRepository, { CleanStaplesRepository } from '../repositories/cleanStaples.repository.js';
import nutritionRepository, { NutritionRepository } from '../repositories/nutrition.repository.js';

/**
 * Service to orchestrate dataset loading, validation, and status reporting.
 */
export class DatasetService {
  constructor({
    exercises = exerciseRepository,
    foodPrices = foodPriceRepository,
    cleanStaples = cleanStaplesRepository,
    nutrition = nutritionRepository
  } = {}) {
    this.exerciseRepo = exercises;
    this.foodPriceRepo = foodPrices;
    this.cleanStaplesRepo = cleanStaples;
    this.nutritionRepo = nutrition;
  }

  /**
   * Preloads all datasets into memory, catching errors safely.
   */
  preloadAll() {
    const results = {};
    const repos = [
      { name: 'exercises', repo: this.exerciseRepo },
      { name: 'foodPrices', repo: this.foodPriceRepo },
      { name: 'cleanStaples', repo: this.cleanStaplesRepo },
      { name: 'nutrition', repo: this.nutritionRepo }
    ];

    repos.forEach(({ name, repo }) => {
      try {
        repo.ensureLoaded();
        results[name] = repo.getStatus();
      } catch (err) {
        results[name] = repo.getStatus();
      }
    });

    return results;
  }

  /**
   * Generates concise status summary for all datasets without exposing filesystem paths.
   * 
   * @returns {{ datasets: { exercises: object, foodPrices: object, cleanStaples: object, nutrition: object } }}
   */
  getDatasetStatus() {
    return {
      datasets: {
        exercises: this.exerciseRepo.getStatus(),
        foodPrices: this.foodPriceRepo.getStatus(),
        cleanStaples: this.cleanStaplesRepo.getStatus(),
        nutrition: this.nutritionRepo.getStatus()
      }
    };
  }
}

export const datasetService = new DatasetService();
export default datasetService;
