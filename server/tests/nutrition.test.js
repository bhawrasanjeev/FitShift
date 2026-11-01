import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

import { calculateBMR } from '../src/algorithms/nutrition/bmr.js';
import { calculateTDEE } from '../src/algorithms/nutrition/tdee.js';
import { calculateCalorieTarget } from '../src/algorithms/nutrition/calorieTarget.js';
import { calculateProteinTarget } from '../src/algorithms/nutrition/proteinTarget.js';
import {
  ACTIVITY_MULTIPLIERS,
  DEFAULT_ACTIVITY_LEVEL,
  GOAL_ADJUSTMENTS,
  PROTEIN_MULTIPLIERS
} from '../src/config/nutrition.config.js';
import { validateNutritionInput } from '../src/validators/nutrition.validators.js';
import nutritionService from '../src/services/nutrition.service.js';

describe('FitShift Core Nutrition Engine - Phase 4 Tests', () => {
  describe('1. BMR Calculation (Mifflin-St Jeor)', () => {
    it('should correctly calculate unrounded BMR for male profiles', () => {
      // Male formula: (10 × 70) + (6.25 × 178) - (5 × 22) + 5 = 700 + 1112.5 - 110 + 5 = 1707.5
      const bmr = calculateBMR({ age: 22, gender: 'male', heightCm: 178, weightKg: 70 });
      assert.equal(bmr, 1707.5);

      // Another male profile: (10 × 85) + (6.25 × 180) - (5 × 30) + 5 = 850 + 1125 - 150 + 5 = 1830
      const bmr2 = calculateBMR({ age: 30, gender: 'male', heightCm: 180, weightKg: 85 });
      assert.equal(bmr2, 1830);
    });

    it('should correctly calculate unrounded BMR for female profiles', () => {
      // Female formula: (10 × 60) + (6.25 × 165) - (5 × 25) - 161 = 600 + 1031.25 - 125 - 161 = 1345.25
      const bmr = calculateBMR({ age: 25, gender: 'female', heightCm: 165, weightKg: 60 });
      assert.equal(bmr, 1345.25);

      // Another female profile: (10 × 55) + (6.25 × 160) - (5 × 40) - 161 = 550 + 1000 - 200 - 161 = 1189
      const bmr2 = calculateBMR({ age: 40, gender: 'female', heightCm: 160, weightKg: 55 });
      assert.equal(bmr2, 1189);
    });

    it('should be case-insensitive for gender input', () => {
      const maleLower = calculateBMR({ age: 25, gender: 'male', heightCm: 175, weightKg: 75 });
      const maleUpper = calculateBMR({ age: 25, gender: 'MALE', heightCm: 175, weightKg: 75 });
      assert.equal(maleLower, maleUpper);
    });

    it('should throw an error for unsupported gender', () => {
      assert.throws(
        () => calculateBMR({ age: 25, gender: 'other', heightCm: 175, weightKg: 75 }),
        /Unsupported gender/
      );
    });
  });

  describe('2. TDEE Calculation', () => {
    const testBmr = 1700;

    it('should calculate TDEE accurately for all 4 supported activity levels', () => {
      // sedentary: 1.20
      const sedentary = calculateTDEE({ bmr: testBmr, activityLevel: 'sedentary' });
      assert.equal(sedentary.activityMultiplier, ACTIVITY_MULTIPLIERS.sedentary);
      assert.equal(sedentary.tdee, 1700 * 1.20);
      assert.equal(sedentary.activityLevel, 'sedentary');

      // light: 1.375
      const light = calculateTDEE({ bmr: testBmr, activityLevel: 'light' });
      assert.equal(light.activityMultiplier, ACTIVITY_MULTIPLIERS.light);
      assert.equal(light.tdee, 1700 * 1.375);

      // moderate: 1.55
      const moderate = calculateTDEE({ bmr: testBmr, activityLevel: 'moderate' });
      assert.equal(moderate.activityMultiplier, ACTIVITY_MULTIPLIERS.moderate);
      assert.equal(moderate.tdee, 1700 * 1.55);

      // very_active: 1.725
      const veryActive = calculateTDEE({ bmr: testBmr, activityLevel: 'very_active' });
      assert.equal(veryActive.activityMultiplier, ACTIVITY_MULTIPLIERS.very_active);
      assert.equal(veryActive.tdee, 1700 * 1.725);
    });

    it('should default to sedentary when activity level is omitted', () => {
      const res = calculateTDEE({ bmr: testBmr });
      assert.equal(res.activityLevel, DEFAULT_ACTIVITY_LEVEL);
      assert.equal(res.activityMultiplier, 1.20);
      assert.equal(res.tdee, 1700 * 1.20);
    });

    it('should throw an error for invalid activity level', () => {
      assert.throws(
        () => calculateTDEE({ bmr: testBmr, activityLevel: 'extreme' }),
        /Unsupported activity level/
      );
    });

    it('should throw an error for non-positive or invalid BMR', () => {
      assert.throws(() => calculateTDEE({ bmr: -500 }), /Invalid BMR/);
      assert.throws(() => calculateTDEE({ bmr: 0 }), /Invalid BMR/);
      assert.throws(() => calculateTDEE({ bmr: NaN }), /Invalid BMR/);
    });
  });

  describe('3. Goal-Based Calorie Adjustments', () => {
    const testTdee = 2500;

    it('should apply +300 kcal for muscle_gain', () => {
      const target = calculateCalorieTarget({ tdee: testTdee, goal: 'muscle_gain' });
      assert.equal(target, testTdee + GOAL_ADJUSTMENTS.muscle_gain);
      assert.equal(target, 2800);
    });

    it('should apply -400 kcal for fat_loss', () => {
      const target = calculateCalorieTarget({ tdee: testTdee, goal: 'fat_loss' });
      assert.equal(target, testTdee + GOAL_ADJUSTMENTS.fat_loss);
      assert.equal(target, 2100);
    });

    it('should apply 0 kcal adjustment for maintenance', () => {
      const target = calculateCalorieTarget({ tdee: testTdee, goal: 'maintenance' });
      assert.equal(target, testTdee + GOAL_ADJUSTMENTS.maintenance);
      assert.equal(target, 2500);
    });

    it('should throw an error for unsupported goal', () => {
      assert.throws(
        () => calculateCalorieTarget({ tdee: testTdee, goal: 'recomp' }),
        /Unsupported goal/
      );
    });
  });

  describe('4. Daily Protein Target Calculations', () => {
    const testWeight = 70;

    it('should calculate 1.7 g/kg for muscle_gain', () => {
      const protein = calculateProteinTarget({ weightKg: testWeight, goal: 'muscle_gain' });
      assert.equal(protein, testWeight * PROTEIN_MULTIPLIERS.muscle_gain);
      assert.equal(protein, 119);
    });

    it('should calculate 1.9 g/kg for fat_loss', () => {
      const protein = calculateProteinTarget({ weightKg: testWeight, goal: 'fat_loss' });
      assert.equal(protein, testWeight * PROTEIN_MULTIPLIERS.fat_loss);
      assert.equal(protein, 133);
    });

    it('should calculate 1.5 g/kg for maintenance', () => {
      const protein = calculateProteinTarget({ weightKg: testWeight, goal: 'maintenance' });
      assert.equal(protein, testWeight * PROTEIN_MULTIPLIERS.maintenance);
      assert.equal(protein, 105);
    });

    it('should throw an error for unsupported goal or non-positive weight', () => {
      assert.throws(
        () => calculateProteinTarget({ weightKg: testWeight, goal: 'bulking' }),
        /Unsupported goal/
      );
      assert.throws(
        () => calculateProteinTarget({ weightKg: -70, goal: 'muscle_gain' }),
        /Invalid weightKg/
      );
    });
  });

  describe('5. Input Validation Rules', () => {
    const validPayload = {
      age: 22,
      gender: 'male',
      heightCm: 178,
      weightKg: 70,
      goal: 'muscle_gain',
      activityLevel: 'moderate'
    };

    it('should validate and normalize valid input', () => {
      const result = validateNutritionInput(validPayload);
      assert.equal(result.isValid, true);
      assert.equal(result.errors.length, 0);
      assert.deepEqual(result.value, {
        age: 22,
        gender: 'male',
        heightCm: 178,
        weightKg: 70,
        goal: 'muscle_gain',
        activityLevel: 'moderate'
      });
    });

    it('should assign default activity level when optional activityLevel is omitted', () => {
      const { activityLevel, ...payloadWithoutActivity } = validPayload;
      const result = validateNutritionInput(payloadWithoutActivity);
      assert.equal(result.isValid, true);
      assert.equal(result.value.activityLevel, DEFAULT_ACTIVITY_LEVEL);
    });

    it('should reject missing required fields', () => {
      assert.equal(validateNutritionInput({ ...validPayload, age: undefined }).isValid, false);
      assert.equal(validateNutritionInput({ ...validPayload, gender: '' }).isValid, false);
      assert.equal(validateNutritionInput({ ...validPayload, heightCm: null }).isValid, false);
      assert.equal(validateNutritionInput({ ...validPayload, weightKg: undefined }).isValid, false);
      assert.equal(validateNutritionInput({ ...validPayload, goal: '' }).isValid, false);
    });

    it('should reject non-numeric and negative values', () => {
      assert.equal(validateNutritionInput({ ...validPayload, age: 'twenty' }).isValid, false);
      assert.equal(validateNutritionInput({ ...validPayload, age: -5 }).isValid, false);
      assert.equal(validateNutritionInput({ ...validPayload, age: 0 }).isValid, false);

      assert.equal(validateNutritionInput({ ...validPayload, heightCm: -180 }).isValid, false);
      assert.equal(validateNutritionInput({ ...validPayload, heightCm: 0 }).isValid, false);

      assert.equal(validateNutritionInput({ ...validPayload, weightKg: -70 }).isValid, false);
      assert.equal(validateNutritionInput({ ...validPayload, weightKg: 0 }).isValid, false);
    });

    it('should reject unrealistic biological values', () => {
      // Age out of bounds (14 to 120)
      assert.equal(validateNutritionInput({ ...validPayload, age: 10 }).isValid, false);
      assert.equal(validateNutritionInput({ ...validPayload, age: 130 }).isValid, false);

      // Height out of bounds (50 to 280)
      assert.equal(validateNutritionInput({ ...validPayload, heightCm: 30 }).isValid, false);
      assert.equal(validateNutritionInput({ ...validPayload, heightCm: 300 }).isValid, false);

      // Weight out of bounds (20 to 350)
      assert.equal(validateNutritionInput({ ...validPayload, weightKg: 10 }).isValid, false);
      assert.equal(validateNutritionInput({ ...validPayload, weightKg: 400 }).isValid, false);
    });

    it('should reject invalid gender, goal, or activityLevel enums', () => {
      assert.equal(validateNutritionInput({ ...validPayload, gender: 'robot' }).isValid, false);
      assert.equal(validateNutritionInput({ ...validPayload, goal: 'get_huge' }).isValid, false);
      assert.equal(validateNutritionInput({ ...validPayload, activityLevel: 'olympic' }).isValid, false);
    });

    it('should reject non-object body or null', () => {
      assert.equal(validateNutritionInput(null).isValid, false);
      assert.equal(validateNutritionInput('string').isValid, false);
      assert.equal(validateNutritionInput([1, 2, 3]).isValid, false);
    });
  });

  describe('6. Nutrition Service Pipeline & Final Integer Rounding', () => {
    it('should execute end-to-end calculation and round only final user-facing metrics', () => {
      // Input: male, 22, 178cm, 70kg, muscle_gain, moderate
      // BMR = 1707.5 -> rounded = 1708
      // TDEE = 1707.5 * 1.55 = 2646.625 -> rounded = 2647
      // CalorieTarget = 2646.625 + 300 = 2946.625 -> rounded = 2947
      // ProteinTarget = 70 * 1.7 = 119 -> rounded = 119
      const result = nutritionService.calculateNutrition({
        age: 22,
        gender: 'male',
        heightCm: 178,
        weightKg: 70,
        goal: 'muscle_gain',
        activityLevel: 'moderate'
      });

      assert.deepEqual(result, {
        bmr: 1708,
        tdee: 2647,
        goal: 'muscle_gain',
        calorieTarget: 2947,
        proteinTargetGrams: 119,
        activityLevel: 'moderate'
      });

      // Verify all numerical values are integers
      assert.equal(Number.isInteger(result.bmr), true);
      assert.equal(Number.isInteger(result.tdee), true);
      assert.equal(Number.isInteger(result.calorieTarget), true);
      assert.equal(Number.isInteger(result.proteinTargetGrams), true);
    });

    it('should correctly calculate female fat_loss profile with default sedentary activity', () => {
      // Female, 25, 165cm, 60kg, fat_loss, activityLevel omitted
      // BMR = 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25 -> 1345
      // TDEE = 1345.25 * 1.20 = 1614.3 -> 1614
      // CalorieTarget = 1614.3 - 400 = 1214.3 -> 1214
      // ProteinTarget = 60 * 1.9 = 114 -> 114
      const result = nutritionService.calculateNutrition({
        age: 25,
        gender: 'female',
        heightCm: 165,
        weightKg: 60,
        goal: 'fat_loss'
      });

      assert.deepEqual(result, {
        bmr: 1345,
        tdee: 1614,
        goal: 'fat_loss',
        calorieTarget: 1214,
        proteinTargetGrams: 114,
        activityLevel: 'sedentary'
      });
    });
  });

  describe('7. API Integration Tests (POST /api/nutrition/calculate)', () => {
    it('should return HTTP 200 with calculated targets for a valid request', async () => {
      const res = await request(app)
        .post('/api/nutrition/calculate')
        .send({
          age: 22,
          gender: 'male',
          heightCm: 178,
          weightKg: 70,
          goal: 'muscle_gain',
          activityLevel: 'moderate'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      assert.equal(res.body.success, true);
      assert.deepEqual(res.body.data, {
        bmr: 1708,
        tdee: 2647,
        goal: 'muscle_gain',
        calorieTarget: 2947,
        proteinTargetGrams: 119,
        activityLevel: 'moderate'
      });
    });

    it('should return HTTP 200 with default sedentary activity when activityLevel is omitted', async () => {
      const res = await request(app)
        .post('/api/nutrition/calculate')
        .send({
          age: 30,
          gender: 'female',
          heightCm: 160,
          weightKg: 55,
          goal: 'maintenance'
        })
        .expect(200);

      assert.equal(res.body.success, true);
      assert.equal(res.body.data.activityLevel, 'sedentary');
      assert.equal(res.body.data.goal, 'maintenance');
    });

    it('should return HTTP 400 with clean error message when missing required fields', async () => {
      const res = await request(app)
        .post('/api/nutrition/calculate')
        .send({
          age: 22,
          gender: 'male'
          // missing heightCm, weightKg, goal
        })
        .expect('Content-Type', /json/)
        .expect(400);

      assert.equal(res.body.success, false);
      assert.ok(res.body.error);
      assert.match(res.body.error.message, /Height in centimeters/);
      assert.match(res.body.error.message, /Weight in kilograms/);
      assert.match(res.body.error.message, /Goal is required/);
    });

    it('should return HTTP 400 for negative or non-numeric values', async () => {
      const res = await request(app)
        .post('/api/nutrition/calculate')
        .send({
          age: -25,
          gender: 'female',
          heightCm: 'tall',
          weightKg: -60,
          goal: 'fat_loss'
        })
        .expect(400);

      assert.equal(res.body.success, false);
      assert.ok(res.body.error);
      assert.match(res.body.error.message, /Age must be a positive number/);
      assert.match(res.body.error.message, /Height must be a valid number/);
    });

    it('should return HTTP 400 for unsupported goal', async () => {
      const res = await request(app)
        .post('/api/nutrition/calculate')
        .send({
          age: 25,
          gender: 'male',
          heightCm: 175,
          weightKg: 75,
          goal: 'bulk_up'
        })
        .expect(400);

      assert.equal(res.body.success, false);
      assert.match(res.body.error.message, /Invalid goal/);
    });

    it('should return HTTP 400 for unsupported activity level', async () => {
      const res = await request(app)
        .post('/api/nutrition/calculate')
        .send({
          age: 25,
          gender: 'male',
          heightCm: 175,
          weightKg: 75,
          goal: 'muscle_gain',
          activityLevel: 'insane'
        })
        .expect(400);

      assert.equal(res.body.success, false);
      assert.match(res.body.error.message, /Invalid activityLevel/);
    });

    it('should return HTTP 400 for empty request body', async () => {
      const res = await request(app)
        .post('/api/nutrition/calculate')
        .send({})
        .expect(400);

      assert.equal(res.body.success, false);
      assert.ok(res.body.error);
    });

    it('should never expose stack traces in client response', async () => {
      const res = await request(app)
        .post('/api/nutrition/calculate')
        .send({ age: -10 })
        .expect(400);

      assert.equal(res.body.error.stack, undefined);
    });
  });
});
