import path from 'path';
import config from '../config/env.js';
import { loadCsvFile, DatasetNotFoundError, DatasetValidationError } from '../utils/fileLoader.js';
import { validateCleanStaples } from '../validators/dataset.validators.js';

/**
 * Repository for accessing the cleaned staple food dataset.
 * Primary source for the Phase 4/5 food-budget optimizer.
 */
export class CleanStaplesRepository {
  constructor(filePath = config.dataPaths.cleanStaples) {
    this.filePath = filePath;
    this.data = null;
    this.status = null;
  }

  /**
   * Loads and validates the clean staples dataset into memory.
   */
  load(customPath = null) {
    if (customPath) {
      this.filePath = customPath;
    }

    try {
      const csvData = loadCsvFile(this.filePath, { asObjects: true }, 'Clean Staples');
      const validation = validateCleanStaples(csvData);

      if (!validation.isValid) {
        this.status = {
          available: true,
          recordCount: validation.recordCount,
          valid: false,
          warnings: validation.warnings,
          errors: validation.errors
        };
        throw new DatasetValidationError(
          `Clean staples dataset failed validation: ${validation.errors.join('; ')}`,
          'Clean Staples',
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
   * Returns all clean staple food items.
   */
  getAll() {
    this.ensureLoaded();
    return [...this.data];
  }

  /**
   * Returns a clean staple item by ID.
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
   * Filters items by budget tier ('ultra_budget', 'budget', 'moderate', 'premium').
   * @param {string} tier
   */
  findByTier(tier) {
    this.ensureLoaded();
    if (!tier || typeof tier !== 'string') return [];
    const normalized = tier.trim().toLowerCase();
    return this.data.filter(item => item.tier === normalized);
  }

  /**
   * Returns items ranked by cost per 10g protein (ascending), suitable for budget optimizer.
   * @param {object} [options={}]
   * @param {string} [options.tier] - Optional tier filter.
   * @param {string} [options.category] - Optional category filter.
   * @param {number} [options.maxCostPer10gProtein] - Max cost ceiling.
   */
  getBudgetRanked(options = {}) {
    this.ensureLoaded();
    let items = [...this.data];

    if (options.tier) {
      const normalizedTier = options.tier.trim().toLowerCase();
      items = items.filter(item => item.tier === normalizedTier);
    }

    if (options.category) {
      const normalizedCat = options.category.trim().toLowerCase();
      items = items.filter(item => item.category.toLowerCase() === normalizedCat);
    }

    if (typeof options.maxCostPer10gProtein === 'number' && !isNaN(options.maxCostPer10gProtein)) {
      items = items.filter(item => item.costPer10gProtein <= options.maxCostPer10gProtein);
    }

    return items.sort((a, b) => a.costPer10gProtein - b.costPer10gProtein);
  }

  /**
   * Returns total count of loaded clean staples.
   */
  count() {
    this.ensureLoaded();
    return this.data.length;
  }
}

export const cleanStaplesRepository = new CleanStaplesRepository();
export default cleanStaplesRepository;
