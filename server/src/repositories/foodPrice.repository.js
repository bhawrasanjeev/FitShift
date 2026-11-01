import path from 'path';
import config from '../config/env.js';
import { loadCsvFile, DatasetNotFoundError, DatasetValidationError } from '../utils/fileLoader.js';
import { validateFoodPrices } from '../validators/dataset.validators.js';

/**
 * Repository for accessing food price dataset.
 * Implements in-memory caching for food price data.
 */
export class FoodPriceRepository {
  constructor(filePath = config.dataPaths.foodPrices) {
    this.filePath = filePath;
    this.data = null;
    this.status = null;
  }

  /**
   * Loads and validates the food price dataset into memory.
   */
  load(customPath = null) {
    if (customPath) {
      this.filePath = customPath;
    }

    try {
      const csvData = loadCsvFile(this.filePath, { asObjects: true }, 'Food Prices');
      const fileName = path.basename(this.filePath);
      const validation = validateFoodPrices(csvData, { sourceFileName: fileName });

      if (!validation.isValid) {
        this.status = {
          available: true,
          recordCount: validation.recordCount,
          valid: false,
          warnings: validation.warnings,
          errors: validation.errors
        };
        throw new DatasetValidationError(
          `Food prices dataset failed validation: ${validation.errors.join('; ')}`,
          'Food Prices',
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
   * Returns all food price items.
   */
  getAll() {
    this.ensureLoaded();
    return [...this.data];
  }

  /**
   * Returns a food price item by ID.
   * @param {number|string} id
   */
  getById(id) {
    this.ensureLoaded();
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;
    return this.data.find(item => item.id === numericId) || null;
  }

  /**
   * Finds items by name (case-insensitive substring match).
   * @param {string} name
   */
  findByName(name) {
    this.ensureLoaded();
    if (!name || typeof name !== 'string') return [];
    const normalized = name.trim().toLowerCase();
    return this.data.filter(item => item.itemName.toLowerCase().includes(normalized));
  }

  /**
   * Filters items by category.
   * @param {string} category
   */
  findByCategory(category) {
    this.ensureLoaded();
    if (!category || typeof category !== 'string') return [];
    const normalized = category.trim().toLowerCase();
    return this.data.filter(item => item.category.toLowerCase() === normalized);
  }

  /**
   * Filters items by tier (e.g. 'Ultra Budget', 'Budget', 'Moderate', 'Premium').
   * @param {string} tier
   */
  findByTier(tier) {
    this.ensureLoaded();
    if (!tier || typeof tier !== 'string') return [];
    const normalized = tier.trim().toLowerCase();
    return this.data.filter(item => item.tier.toLowerCase() === normalized);
  }

  /**
   * Returns total count of loaded food price items.
   */
  count() {
    this.ensureLoaded();
    return this.data.length;
  }
}

export const foodPriceRepository = new FoodPriceRepository();
export default foodPriceRepository;
