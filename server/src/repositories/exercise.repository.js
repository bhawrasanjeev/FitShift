import path from 'path';
import config from '../config/env.js';
import { loadJsonFile, DatasetNotFoundError, DatasetValidationError } from '../utils/fileLoader.js';
import { validateExercises } from '../validators/dataset.validators.js';

/**
 * Repository for accessing exercise data.
 * Implements in-memory caching for static exercise dataset.
 */
export class ExerciseRepository {
  constructor(filePath = config.dataPaths.exercises) {
    this.filePath = filePath;
    this.data = null;
    this.status = null;
  }

  /**
   * Loads and validates the exercise dataset into memory.
   * If already loaded, returns cached data unless forceReload is true.
   */
  load(customPath = null) {
    if (customPath) {
      this.filePath = customPath;
    }

    try {
      const rawData = loadJsonFile(this.filePath, 'Exercises');
      const validation = validateExercises(rawData);

      if (!validation.isValid) {
        this.status = {
          available: true,
          recordCount: validation.recordCount,
          valid: false,
          warnings: validation.warnings,
          errors: validation.errors
        };
        throw new DatasetValidationError(
          `Exercises dataset failed validation: ${validation.errors.join('; ')}`,
          'Exercises',
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
        // Status is populated in catch block inside load()
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
   * Clears in-memory cache and reloads from disk.
   */
  reload(customPath = null) {
    this.data = null;
    this.status = null;
    return this.load(customPath);
  }

  /**
   * Returns all exercises.
   */
  getAll() {
    this.ensureLoaded();
    return [...this.data];
  }

  /**
   * Returns an exercise by its unique ID.
   * @param {string} id
   */
  getById(id) {
    this.ensureLoaded();
    if (!id || typeof id !== 'string') return null;
    const normalized = id.trim().toLowerCase();
    return this.data.find(ex => ex.id.toLowerCase() === normalized) || null;
  }

  /**
   * Filters exercises by category (e.g. 'strength', 'cardio', 'stretching').
   * @param {string} category
   */
  findByCategory(category) {
    this.ensureLoaded();
    if (!category || typeof category !== 'string') return [];
    const normalized = category.trim().toLowerCase();
    return this.data.filter(ex => ex.category === normalized);
  }

  /**
   * Filters exercises by difficulty level ('beginner', 'intermediate', 'expert').
   * @param {string} level
   */
  findByDifficulty(level) {
    this.ensureLoaded();
    if (!level || typeof level !== 'string') return [];
    const normalized = level.trim().toLowerCase();
    return this.data.filter(ex => ex.level === normalized);
  }

  /**
   * Filters exercises targeting a specific muscle.
   * @param {string} muscle
   * @param {{ includeSecondary?: boolean }} options
   */
  findByMuscle(muscle, options = {}) {
    this.ensureLoaded();
    if (!muscle || typeof muscle !== 'string') return [];
    const normalized = muscle.trim().toLowerCase();
    const includeSecondary = options.includeSecondary === true;

    return this.data.filter(ex => {
      const inPrimary = ex.primaryMuscles.includes(normalized);
      if (inPrimary) return true;
      if (includeSecondary && ex.secondaryMuscles.includes(normalized)) return true;
      return false;
    });
  }

  /**
   * Filters exercises by equipment required.
   * @param {string|null} equipment
   */
  findByEquipment(equipment) {
    this.ensureLoaded();
    if (equipment === null || equipment === undefined) {
      return this.data.filter(ex => ex.equipment === null);
    }
    const normalized = String(equipment).trim().toLowerCase();
    return this.data.filter(ex => ex.equipment && ex.equipment.toLowerCase() === normalized);
  }

  /**
   * Returns total count of loaded exercises.
   */
  count() {
    this.ensureLoaded();
    return this.data.length;
  }
}

export const exerciseRepository = new ExerciseRepository();
export default exerciseRepository;
