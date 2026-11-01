import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateExercises,
  validateFoodPrices,
  validateCleanStaples,
  validateNutrition
} from '../src/validators/dataset.validators.js';

describe('Dataset Validators Unit Tests', () => {
  describe('validateExercises', () => {
    const validExercise = {
      id: 'Bench_Press',
      name: 'Bench Press',
      force: 'push',
      level: 'intermediate',
      mechanic: 'compound',
      equipment: 'barbell',
      primaryMuscles: ['chest'],
      secondaryMuscles: ['triceps', 'shoulders'],
      instructions: ['Lie on bench', 'Lower bar', 'Press up'],
      category: 'strength',
      images: ['Bench_Press/0.jpg']
    };

    it('should pass on valid exercise records', () => {
      const result = validateExercises([validExercise]);
      assert.equal(result.isValid, true);
      assert.equal(result.recordCount, 1);
      assert.equal(result.errors.length, 0);
      assert.equal(result.records[0].name, 'Bench Press');
      assert.equal(result.records[0].level, 'intermediate');
    });

    it('should fail if root is not an array', () => {
      const result = validateExercises({ not: 'an array' });
      assert.equal(result.isValid, false);
      assert.match(result.errors[0], /must be an array/);
    });

    it('should fail on missing required fields (id, name, category, level)', () => {
      const invalid = { ...validExercise, name: '' };
      const result = validateExercises([invalid]);
      assert.equal(result.isValid, false);
      assert.match(result.errors[0], /Missing or empty required field "name"/);
    });

    it('should fail on invalid level', () => {
      const invalid = { ...validExercise, level: 'super-hard' };
      const result = validateExercises([invalid]);
      assert.equal(result.isValid, false);
      assert.match(result.errors[0], /Invalid or missing "level"/);
    });

    it('should reject duplicate exercise IDs', () => {
      const records = [validExercise, { ...validExercise, name: 'Duplicate Exercise' }];
      const result = validateExercises(records);
      assert.equal(result.isValid, false);
      assert.match(result.errors[0], /Duplicate exercise ID/);
    });

    it('should emit warnings for empty instructions, empty images, or null equipment', () => {
      const itemWithWarnings = {
        ...validExercise,
        id: 'Custom_Push',
        equipment: null,
        instructions: [],
        images: []
      };
      const result = validateExercises([itemWithWarnings]);
      assert.equal(result.isValid, true);
      assert.ok(result.warnings.some(w => w.includes('empty instructions')));
      assert.ok(result.warnings.some(w => w.includes('empty images')));
      assert.ok(result.warnings.some(w => w.includes('unspecified equipment')));
    });
  });

  describe('validateFoodPrices', () => {
    const validHeader = ['ID', 'Item Name', 'Category', 'Serving / Pack', 'Price (₹)', 'Protein / 100g', 'Tier'];
    const validRow = {
      'ID': '1',
      'Item Name': 'Soya Chunks',
      'Category': 'Legumes',
      'Serving / Pack': '1000g',
      'Price (₹)': '₹139',
      'Protein / 100g': '52.0g',
      'Tier': 'Ultra Budget'
    };

    it('should pass on valid food price data and normalize numeric values', () => {
      const result = validateFoodPrices({
        headers: validHeader,
        rows: [validRow]
      });

      assert.equal(result.isValid, true);
      assert.equal(result.recordCount, 1);
      assert.equal(result.records[0].price, 139);
      assert.equal(result.records[0].proteinPer100g, 52.0);
    });

    it('should parse prices with commas and currency symbols correctly', () => {
      const rowWithComma = {
        ...validRow,
        'ID': '2',
        'Price (₹)': '₹2,099',
        'Protein / 100g': '80.0g'
      };
      const result = validateFoodPrices({
        headers: validHeader,
        rows: [rowWithComma]
      });

      assert.equal(result.isValid, true);
      assert.equal(result.records[0].price, 2099);
    });

    it('should fail on missing required headers', () => {
      const result = validateFoodPrices({
        headers: ['ID', 'Item Name'],
        rows: []
      });

      assert.equal(result.isValid, false);
      assert.match(result.errors[0], /missing required columns/);
    });

    it('should fail on non-numeric or negative price', () => {
      const badRow = { ...validRow, 'Price (₹)': 'not-a-number' };
      const result = validateFoodPrices({
        headers: validHeader,
        rows: [badRow]
      });

      assert.equal(result.isValid, false);
      assert.match(result.errors[0], /Invalid price/);
    });

    it('should fail on duplicate food IDs', () => {
      const result = validateFoodPrices({
        headers: validHeader,
        rows: [validRow, validRow]
      });

      assert.equal(result.isValid, false);
      assert.match(result.errors[0], /Duplicate food ID/);
    });
  });

  describe('validateCleanStaples', () => {
    const validHeader = [
      'ID', 'Item Name', 'Category', 'pack_size_g', 'price_clean',
      'protein_clean', 'price_per_100g', 'cost_per_10g_protein', 'Tier'
    ];
    const validRow = {
      'ID': '1',
      'Item Name': 'Soya Chunks',
      'Category': 'Legumes',
      'pack_size_g': '1000.0',
      'price_clean': '139.0',
      'protein_clean': '52.0',
      'price_per_100g': '13.9',
      'cost_per_10g_protein': '2.67',
      'Tier': 'ultra_budget'
    };

    it('should pass on valid clean staples data', () => {
      const result = validateCleanStaples({
        headers: validHeader,
        rows: [validRow]
      });

      assert.equal(result.isValid, true);
      assert.equal(result.recordCount, 1);
      assert.equal(result.records[0].packSizeG, 1000.0);
      assert.equal(result.records[0].priceClean, 139.0);
      assert.equal(result.records[0].costPer10gProtein, 2.67);
    });

    it('should fail if missing required columns', () => {
      const result = validateCleanStaples({
        headers: ['ID', 'Item Name'],
        rows: []
      });

      assert.equal(result.isValid, false);
      assert.match(result.errors[0], /missing required columns/);
    });

    it('should fail on invalid numeric values', () => {
      const badRow = { ...validRow, 'price_clean': '-50' };
      const result = validateCleanStaples({
        headers: validHeader,
        rows: [badRow]
      });

      assert.equal(result.isValid, false);
      assert.match(result.errors[0], /Invalid price_clean/);
    });

    it('should warn when calculated cost per 10g protein diverges significantly', () => {
      const divergingRow = { ...validRow, 'cost_per_10g_protein': '99.99' };
      const result = validateCleanStaples({
        headers: validHeader,
        rows: [divergingRow]
      });

      assert.equal(result.isValid, true);
      assert.ok(result.warnings.some(w => w.includes('cost_per_10g_protein')));
    });
  });

  describe('validateNutrition', () => {
    const validHeader = [
      'Dish Name', 'Calories (kcal)', 'Carbohydrates (g)', 'Protein (g)', 'Fats (g)',
      'Free Sugar (g)', 'Fibre (g)', 'Sodium (mg)', 'Calcium (mg)', 'Iron (mg)',
      'Vitamin C (mg)', 'Folate (µg)'
    ];
    const validRow = {
      'Dish Name': 'Hot tea (Garam Chai)',
      'Calories (kcal)': '16.14',
      'Carbohydrates (g)': '2.58',
      'Protein (g)': '0.39',
      'Fats (g)': '0.53',
      'Free Sugar (g)': '2.58',
      'Fibre (g)': '0.0',
      'Sodium (mg)': '3.12',
      'Calcium (mg)': '14.2',
      'Iron (mg)': '0.02',
      'Vitamin C (mg)': '0.5',
      'Folate (µg)': '1.8'
    };

    it('should pass on valid nutrition row', () => {
      const result = validateNutrition({
        headers: validHeader,
        rows: [validRow]
      });

      assert.equal(result.isValid, true);
      assert.equal(result.recordCount, 1);
      assert.equal(result.records[0].calories, 16.14);
      assert.equal(result.records[0].protein, 0.39);
      assert.equal(result.records[0].vitaminC, 0.5);
    });

    it('should accept missing optional Vitamin C and Folate and emit warning', () => {
      const rowMissingMicros = {
        ...validRow,
        'Dish Name': 'Tomato Pickle',
        'Vitamin C (mg)': '',
        'Folate (µg)': ''
      };
      const result = validateNutrition({
        headers: validHeader,
        rows: [rowMissingMicros]
      });

      assert.equal(result.isValid, true);
      assert.equal(result.records[0].vitaminC, null);
      assert.equal(result.records[0].folate, null);
      assert.ok(result.warnings.some(w => w.includes('missing optional Vitamin C')));
    });

    it('should fail on missing mandatory numeric fields', () => {
      const rowMissingCalories = {
        ...validRow,
        'Calories (kcal)': ''
      };
      const result = validateNutrition({
        headers: validHeader,
        rows: [rowMissingCalories]
      });

      assert.equal(result.isValid, false);
      assert.match(result.errors[0], /Missing mandatory value for "Calories \(kcal\)"/);
    });

    it('should reject duplicate dish names', () => {
      const result = validateNutrition({
        headers: validHeader,
        rows: [validRow, validRow]
      });

      assert.equal(result.isValid, false);
      assert.match(result.errors[0], /Duplicate dish name/);
    });
  });
});
