import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import os from 'os';

import exerciseRepository, { ExerciseRepository } from '../src/repositories/exercise.repository.js';
import foodPriceRepository, { FoodPriceRepository } from '../src/repositories/foodPrice.repository.js';
import cleanStaplesRepository, { CleanStaplesRepository } from '../src/repositories/cleanStaples.repository.js';
import nutritionRepository, { NutritionRepository } from '../src/repositories/nutrition.repository.js';
import { DatasetNotFoundError, DatasetValidationError } from '../src/utils/fileLoader.js';

describe('Repository Data Access & In-Memory Layer Tests', () => {
  let tempDir;

  before(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fitshift-repo-test-'));
  });

  after(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('ExerciseRepository (Real Dataset)', () => {
    it('should load all 876 exercises into memory', () => {
      const count = exerciseRepository.count();
      assert.equal(count, 876);
      const all = exerciseRepository.getAll();
      assert.equal(all.length, 876);
    });

    it('should find exercise by ID', () => {
      const ex = exerciseRepository.getById('3_4_Sit-Up');
      assert.ok(ex);
      assert.equal(ex.name, '3/4 Sit-Up');
      assert.equal(ex.level, 'beginner');
      assert.ok(Array.isArray(ex.primaryMuscles));
      assert.ok(ex.primaryMuscles.includes('abdominals'));
    });

    it('should return null for non-existent exercise ID', () => {
      const ex = exerciseRepository.getById('non_existent_exercise_123');
      assert.equal(ex, null);
    });

    it('should filter exercises by category', () => {
      const strengthExercises = exerciseRepository.findByCategory('strength');
      assert.ok(strengthExercises.length > 0);
      assert.ok(strengthExercises.every(e => e.category === 'strength'));
    });

    it('should filter exercises by difficulty level', () => {
      const beginner = exerciseRepository.findByDifficulty('beginner');
      assert.ok(beginner.length > 0);
      assert.ok(beginner.every(e => e.level === 'beginner'));
    });

    it('should filter exercises by target muscle', () => {
      const chestPrimary = exerciseRepository.findByMuscle('chest');
      assert.ok(chestPrimary.length > 0);
      assert.ok(chestPrimary.every(e => e.primaryMuscles.includes('chest')));

      const chestWithSecondary = exerciseRepository.findByMuscle('chest', { includeSecondary: true });
      assert.ok(chestWithSecondary.length >= chestPrimary.length);
    });

    it('should filter exercises by equipment', () => {
      const dumbbell = exerciseRepository.findByEquipment('dumbbell');
      assert.ok(dumbbell.length > 0);
      assert.ok(dumbbell.every(e => e.equipment === 'dumbbell'));

      const bodyweight = exerciseRepository.findByEquipment('body only');
      assert.ok(bodyweight.length > 0);
    });

    it('should provide cached data without re-reading filesystem', () => {
      const first = exerciseRepository.getAll();
      const second = exerciseRepository.getAll();
      assert.equal(first.length, second.length);
      assert.equal(first[0].id, second[0].id);
    });
  });

  describe('FoodPriceRepository (Real Dataset)', () => {
    it('should load all 36 food price records', () => {
      const count = foodPriceRepository.count();
      assert.equal(count, 36);
      const all = foodPriceRepository.getAll();
      assert.equal(all.length, 36);
    });

    it('should find food item by ID and parse numeric fields', () => {
      const item = foodPriceRepository.getById(1);
      assert.ok(item);
      assert.equal(item.itemName, 'Soya Chunks');
      assert.equal(item.price, 139);
      assert.equal(item.proteinPer100g, 52);
    });

    it('should correctly parse high-priced items with commas and currency signs', () => {
      const whey35 = foodPriceRepository.getById(35);
      assert.ok(whey35);
      assert.equal(whey35.price, 2099);
      assert.equal(whey35.proteinPer100g, 80);

      const whey36 = foodPriceRepository.getById(36);
      assert.ok(whey36);
      assert.equal(whey36.price, 3199);
      assert.equal(whey36.proteinPer100g, 82);
    });

    it('should filter by name, category, and tier', () => {
      const wheyItems = foodPriceRepository.findByName('whey');
      assert.equal(wheyItems.length, 2);

      const dairy = foodPriceRepository.findByCategory('Dairy');
      assert.ok(dairy.length > 0);

      const ultraBudget = foodPriceRepository.findByTier('Ultra Budget');
      assert.ok(ultraBudget.length > 0);
    });
  });

  describe('CleanStaplesRepository (Real Dataset)', () => {
    it('should load all 36 clean staple records', () => {
      const count = cleanStaplesRepository.count();
      assert.equal(count, 36);
    });

    it('should verify numeric data types on clean staples', () => {
      const item = cleanStaplesRepository.getById(1);
      assert.ok(item);
      assert.equal(item.itemName, 'Soya Chunks');
      assert.equal(typeof item.packSizeG, 'number');
      assert.equal(typeof item.priceClean, 'number');
      assert.equal(typeof item.proteinClean, 'number');
      assert.equal(typeof item.costPer10gProtein, 'number');
    });

    it('should return budget-ranked items ordered by costPer10gProtein ascending', () => {
      const ranked = cleanStaplesRepository.getBudgetRanked();
      assert.equal(ranked.length, 36);

      // Verify ascending order
      for (let i = 1; i < ranked.length; i++) {
        assert.ok(
          ranked[i].costPer10gProtein >= ranked[i - 1].costPer10gProtein,
          `Item at ${i} should be >= previous item`
        );
      }

      // Soya Chunks should be first at ₹2.67 per 10g protein
      assert.equal(ranked[0].id, 1);
      assert.equal(ranked[0].itemName, 'Soya Chunks');
      assert.equal(ranked[0].costPer10gProtein, 2.67);
    });

    it('should filter budget-ranked items by tier and category', () => {
      const ultraBudgetOnly = cleanStaplesRepository.getBudgetRanked({ tier: 'ultra_budget' });
      assert.ok(ultraBudgetOnly.length > 0);
      assert.ok(ultraBudgetOnly.every(i => i.tier === 'ultra_budget'));

      const legumesOnly = cleanStaplesRepository.getBudgetRanked({ category: 'Legumes' });
      assert.ok(legumesOnly.length > 0);
      assert.ok(legumesOnly.every(i => i.category === 'Legumes'));
    });
  });

  describe('NutritionRepository (Real Dataset)', () => {
    it('should load all 1014 nutrition dish records', () => {
      const count = nutritionRepository.count();
      assert.equal(count, 1014);
    });

    it('should find dish by exact name and parse macro numbers', () => {
      const dish = nutritionRepository.getByDishName('Hot tea (Garam Chai)');
      assert.ok(dish);
      assert.equal(dish.calories, 16.14);
      assert.equal(dish.carbohydrates, 2.58);
      assert.equal(dish.protein, 0.39);
      assert.equal(dish.fats, 0.53);
    });

    it('should find dishes by partial substring search', () => {
      const biryanis = nutritionRepository.findByDishName('biryani');
      assert.ok(biryanis.length >= 2);
    });

    it('should filter dishes by maximum calories', () => {
      const lowCal = nutritionRepository.findByMaxCalories(50);
      assert.ok(lowCal.length > 0);
      assert.ok(lowCal.every(d => d.calories <= 50));
    });

    it('should filter dishes by minimum protein', () => {
      const highProtein = nutritionRepository.findByMinProtein(15);
      assert.ok(highProtein.length > 0);
      assert.ok(highProtein.every(d => d.protein >= 15));
    });
  });

  describe('Repository Error Handling with Test Fixtures', () => {
    it('should safely handle missing dataset file', () => {
      const missingPath = path.join(tempDir, 'does_not_exist.json');
      const testRepo = new ExerciseRepository(missingPath);

      const status = testRepo.getStatus();
      assert.equal(status.available, false);
      assert.equal(status.valid, false);
      assert.equal(status.recordCount, 0);

      assert.throws(() => testRepo.getAll(), DatasetNotFoundError);
    });

    it('should safely handle malformed JSON fixture', () => {
      const malformedPath = path.join(tempDir, 'malformed_exercise.json');
      fs.writeFileSync(malformedPath, '[ { "name": "Broken" } ]'); // missing id, category, level, etc.
      const testRepo = new ExerciseRepository(malformedPath);

      const status = testRepo.getStatus();
      assert.equal(status.available, true);
      assert.equal(status.valid, false);

      assert.throws(() => testRepo.getAll(), DatasetValidationError);
    });

    it('should safely handle CSV with missing required columns', () => {
      const badCsvPath = path.join(tempDir, 'bad_staples.csv');
      fs.writeFileSync(badCsvPath, 'ID,Item Name\n1,Test');
      const testRepo = new CleanStaplesRepository(badCsvPath);

      const status = testRepo.getStatus();
      assert.equal(status.available, true);
      assert.equal(status.valid, false);

      assert.throws(() => testRepo.getAll(), DatasetValidationError);
    });
  });
});
