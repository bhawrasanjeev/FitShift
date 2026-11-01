import path from 'path';
import config from '../config/env.js';
import { loadCsvFile, DatasetNotFoundError, DatasetValidationError } from '../utils/fileLoader.js';
import { validateNutrition } from '../validators/dataset.validators.js';

/**
 * Repository for accessing the nutrition dataset.
 * Implements in-memory caching for dish nutritional information.
 */
export class NutritionRepository {
  constructor(filePath = config.dataPaths.nutrition) {
    this.filePath = filePath;
    this.data = null;
    this.status = null;
  }

  /**
   * Loads and validates the nutrition dataset into memory.
   */
  load(customPath = null) {
    if (customPath) {
      this.filePath = customPath;
    }

    try {
      const csvData = loadCsvFile(this.filePath, { asObjects: true }, 'Nutrition');
      const validation = validateNutrition(csvData);

      if (!validation.isValid) {
        this.status = {
          available: true,
          recordCount: validation.recordCount,
          valid: false,
          warnings: validation.warnings,
          errors: validation.errors
        };
        throw new DatasetValidationError(
          `Nutrition dataset failed validation: ${validation.errors.join('; ')}`,
          'Nutrition',
          validation.errors
        );
      }

      this.data = validation.records;
      this.status = {
        available: true,
        recordCount: validation.recordCount,
        valid: true,
        warnings: validation.warnings
      };

      return this.data;
    } catch (err) {
      if (err instanceof DatasetNotFoundError) {
        this.status = {
          available: false,
          recordCount: 0,
          valid: false,
          warnings: [err.message]
        };
      } else if (!this.status) {
        this.status = {
          available: true,
          recordCount: 0,
          valid: false,
          warnings: [err.message]
        };
      }
      throw err;
    }
  }

  /**
   * Ensures dataset is loaded in memory.
   */
  ensureLoaded() {
    if (this.data === null) {
      this.load();
    }
    return this.data;
  }

  /**
   * Retrieves dataset availability and validation status without throwing.
   */
  getStatus() {
    if (this.status === null) {
      try {
        this.load();
      } catch {
        // Status populated in catch block inside load()
      }
    }
    return {
      available: this.status.available,
      recordCount: this.status.recordCount,
      valid: this.status.valid,
      warnings: this.status.warnings || []
    };
  }

  /**
   * Clears in-memory cache and reloads.
   */
  reload(customPath = null) {
    this.data = null;
    this.status = null;
    return this.load(customPath);
  }

  /**
   * Returns all nutrition dish records.
   */
  getAll() {
    this.ensureLoaded();
    return [...this.data];
  }

  /**
   * Finds an exact dish by name (case-insensitive).
   * @param {string} dishName
   */
  getByDishName(dishName) {
    this.ensureLoaded();
    if (!dishName || typeof dishName !== 'string') return null;
    const normalized = dishName.trim().toLowerCase();
    return this.data.find(dish => dish.dishName.toLowerCase() === normalized) || null;
  }

  /**
   * Finds dishes by substring match (case-insensitive).
   * @param {string} query
   */
  findByDishName(query) {
    this.ensureLoaded();
    if (!query || typeof query !== 'string') return [];
    const normalized = query.trim().toLowerCase();
    return this.data.filter(dish => dish.dishName.toLowerCase().includes(normalized));
  }

  /**
   * Filters dishes by maximum calories.
   * @param {number} maxCalories
   */
  findByMaxCalories(maxCalories) {
    this.ensureLoaded();
    if (typeof maxCalories !== 'number' || isNaN(maxCalories)) return [];
    return this.data.filter(dish => dish.calories <= maxCalories);
  }

  /**
   * Filters dishes by minimum protein.
   * @param {number} minProtein
   */
  findByMinProtein(minProtein) {
    this.ensureLoaded();
    if (typeof minProtein !== 'number' || isNaN(minProtein)) return [];
    return this.data.filter(dish => dish.protein >= minProtein);
  }

  /**
   * Returns total count of loaded dishes.
   */
  count() {
    this.ensureLoaded();
    return this.data.length;
  }
}

export const nutritionRepository = new NutritionRepository();
export default nutritionRepository;
