import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

import cleanStaplesRepository from '../src/repositories/cleanStaples.repository.js';
import { calculateProteinCost } from '../src/algorithms/diet/proteinCost.js';
import { filterEligibleFoods } from '../src/algorithms/diet/foodFilter.js';
import { rankFoodsByProteinCost } from '../src/algorithms/diet/foodRanker.js';
import { optimizeDiet } from '../src/algorithms/diet/optimizer.js';
import { validateDietInput } from '../src/validators/diet.validators.js';
import dietService from '../src/services/diet.service.js';

describe('FitShift Budget Diet Optimizer - Phase 5 Tests', () => {
  const allStaples = cleanStaplesRepository.getAll();

  describe('1. Protein Cost Calculation (cost_per_10g_protein)', () => {
    it('should calculate cost per 10g protein accurately', () => {
      // price: 20 per 100g, protein: 20g per 100g -> (20 / 20) * 10 = 10
      const cost1 = calculateProteinCost({ pricePer100g: 20, proteinPer100g: 20 });
      assert.equal(cost1, 10);

      // Soya chunks: price 13.9, protein 52.0 -> (13.9 / 52.0) * 10 = 2.67307... -> 2.67
      const costSoya = calculateProteinCost({ pricePer100g: 13.9, proteinPer100g: 52 });
      assert.equal(costSoya, 2.67);
    });

    it('should return Infinity for zero or negative protein', () => {
      assert.equal(calculateProteinCost({ pricePer100g: 20, proteinPer100g: 0 }), Infinity);
      assert.equal(calculateProteinCost({ pricePer100g: 20, proteinPer100g: -5 }), Infinity);
    });

    it('should return Infinity for non-numeric or missing inputs', () => {
      assert.equal(calculateProteinCost({ pricePer100g: NaN, proteinPer100g: 20 }), Infinity);
      assert.equal(calculateProteinCost({ pricePer100g: 20, proteinPer100g: null }), Infinity);
    });
  });

  describe('2. Food Eligibility Filtering', () => {
    it('should filter vegetarian foods (excluding meat, fish, and poultry/eggs)', () => {
      const vegFoods = filterEligibleFoods(allStaples, { dietType: 'vegetarian' });

      assert.ok(vegFoods.length > 0);
      assert.ok(vegFoods.every(f => f.category !== 'Meat' && f.category !== 'Fish' && f.category !== 'Poultry'));
      assert.ok(vegFoods.every(f => !f.itemName.toLowerCase().includes('chicken')));
      assert.ok(vegFoods.every(f => !f.itemName.toLowerCase().includes('egg')));
    });

    it('should filter eggetarian foods (including eggs, excluding meat and fish)', () => {
      const eggFoods = filterEligibleFoods(allStaples, { dietType: 'eggetarian' });

      assert.ok(eggFoods.length > 0);
      assert.ok(eggFoods.some(f => f.itemName.toLowerCase().includes('egg')));
      assert.ok(eggFoods.every(f => f.category !== 'Meat' && f.category !== 'Fish'));
    });

    it('should filter non-vegetarian foods (allowing meat, fish, and poultry)', () => {
      const nonVegFoods = filterEligibleFoods(allStaples, { dietType: 'non_vegetarian' });

      assert.ok(nonVegFoods.length > 0);
      assert.ok(nonVegFoods.some(f => f.category === 'Meat'));
      assert.ok(nonVegFoods.some(f => f.category === 'Fish'));
      assert.ok(nonVegFoods.some(f => f.category === 'Poultry'));
    });

    it('should exclude raw staple carbohydrate bases from concentrated protein candidate foods', () => {
      const candidates = filterEligibleFoods(allStaples, { dietType: 'non_vegetarian' });

      const excludedCategories = ['Grains', 'Bakery', 'Fruits', 'Tubers'];
      assert.ok(candidates.every(f => !excludedCategories.includes(f.category)));
      assert.ok(!candidates.some(f => f.itemName.toLowerCase().includes('white rice')));
      assert.ok(!candidates.some(f => f.itemName.toLowerCase().includes('wheat atta')));
      assert.ok(!candidates.some(f => f.itemName.toLowerCase().includes('banana')));
      assert.ok(!candidates.some(f => f.itemName.toLowerCase().includes('potato')));
    });

    it('should strictly exclude supplements when supplementPreference is "no_supplements"', () => {
      const noSupps = filterEligibleFoods(allStaples, {
        dietType: 'vegetarian',
        supplementPreference: 'no_supplements'
      });

      assert.ok(noSupps.every(f => f.category !== 'Supplements'));
      assert.ok(noSupps.every(f => !f.itemName.toLowerCase().includes('whey')));
    });

    it('should include supplements when supplementPreference is "open_to_supplements"', () => {
      const withSupps = filterEligibleFoods(allStaples, {
        dietType: 'vegetarian',
        supplementPreference: 'open_to_supplements'
      });

      assert.ok(withSupps.some(f => f.category === 'Supplements'));
      assert.ok(withSupps.some(f => f.itemName.toLowerCase().includes('whey')));
    });
  });

  describe('3. Food Ranking by Protein Cost', () => {
    it('should sort candidate foods by costPer10gProtein ascending', () => {
      const eligible = filterEligibleFoods(allStaples, { dietType: 'vegetarian' });
      const ranked = rankFoodsByProteinCost(eligible);

      for (let i = 1; i < ranked.length; i++) {
        assert.ok(
          ranked[i].costPer10gProtein >= ranked[i - 1].costPer10gProtein,
          `Item at ${i} (${ranked[i].itemName}: ${ranked[i].costPer10gProtein}) should be >= previous (${ranked[i - 1].itemName}: ${ranked[i - 1].costPer10gProtein})`
        );
      }

      // Soya Chunks should be first
      assert.equal(ranked[0].itemName, 'Soya Chunks');
      assert.equal(ranked[0].costPer10gProtein, 2.67);
    });

    it('should prioritize whole foods over supplements when supplementPreference is "unsure"', () => {
      const eligible = filterEligibleFoods(allStaples, {
        dietType: 'vegetarian',
        supplementPreference: 'unsure'
      });
      const ranked = rankFoodsByProteinCost(eligible, { supplementPreference: 'unsure' });

      // Whole foods should appear before any supplement
      const firstSuppIndex = ranked.findIndex(f => f.category === 'Supplements');
      if (firstSuppIndex !== -1) {
        for (let i = 0; i < firstSuppIndex; i++) {
          assert.notEqual(ranked[i].category, 'Supplements');
        }
      }
    });
  });

  describe('4. Business Rules: Soya Constraints', () => {
    it('should never exceed 50g dry soya in any generated plan', () => {
      const result = optimizeDiet({
        foods: allStaples,
        proteinTargetGrams: 150,
        foodBudget: 200,
        dietType: 'vegetarian'
      });

      const soyaItems = result.foods.filter(f => f.name.toLowerCase().includes('soya'));
      soyaItems.forEach(item => {
        assert.ok(
          item.quantityGrams <= 50,
          `Soya product ${item.name} quantity (${item.quantityGrams}g) exceeded 50g limit`
        );
      });
    });

    it('should never combine multiple soya products on the same day', () => {
      const result = optimizeDiet({
        foods: allStaples,
        proteinTargetGrams: 140,
        foodBudget: 150,
        dietType: 'vegetarian'
      });

      const soyaItems = result.foods.filter(f => f.name.toLowerCase().includes('soya'));
      assert.ok(
        soyaItems.length <= 1,
        `Expected at most 1 soya item, but found ${soyaItems.length}: ${soyaItems.map(s => s.name).join(', ')}`
      );
    });
  });

  describe('5. Budget & Feasibility Scenarios', () => {
    it('should successfully meet target when budget is sufficient (feasible = true)', () => {
      const result = optimizeDiet({
        foods: allStaples,
        proteinTargetGrams: 119,
        foodBudget: 80,
        dietType: 'vegetarian',
        supplementPreference: 'no_supplements'
      });

      assert.equal(result.feasible, true);
      assert.equal(result.protein.gapGrams, 0);
      assert.ok(result.protein.achievedGrams >= 119);
      assert.ok(result.budget.estimatedCost <= 80);
      assert.equal(result.reason, undefined);
      assert.ok(result.foods.length >= 2);
    });

    it('should report feasible = false with honest gap and explanation when budget is too low', () => {
      const result = optimizeDiet({
        foods: allStaples,
        proteinTargetGrams: 119,
        foodBudget: 25,
        dietType: 'vegetarian'
      });

      assert.equal(result.feasible, false);
      assert.ok(result.protein.gapGrams > 0);
      assert.ok(result.protein.achievedGrams < 119);
      assert.ok(result.budget.estimatedCost <= 25);
      assert.ok(result.reason);
      assert.match(result.reason, /Protein target cannot be reached within the provided budget/);
    });

    it('should report feasible = false when target is unrealistically high', () => {
      const result = optimizeDiet({
        foods: allStaples,
        proteinTargetGrams: 350,
        foodBudget: 50,
        dietType: 'vegetarian'
      });

      assert.equal(result.feasible, false);
      assert.ok(result.protein.gapGrams > 0);
      assert.ok(result.budget.estimatedCost <= 50);
    });

    it('should return empty plan and meaningful reason when no eligible foods exist', () => {
      const result = optimizeDiet({
        foods: [],
        proteinTargetGrams: 100,
        foodBudget: 80,
        dietType: 'vegetarian'
      });

      assert.equal(result.feasible, false);
      assert.match(result.reason, /No eligible foods available/);
      assert.equal(result.foods.length, 0);
    });
  });

  describe('6. Determinism & Variety', () => {
    it('should be completely deterministic (same input produces identical output)', () => {
      const params = {
        foods: allStaples,
        proteinTargetGrams: 119,
        foodBudget: 80,
        dietType: 'eggetarian',
        supplementPreference: 'no_supplements'
      };

      const run1 = optimizeDiet(params);
      const run2 = optimizeDiet(params);
      const run3 = optimizeDiet(params);

      assert.deepEqual(run1, run2);
      assert.deepEqual(run2, run3);
    });

    it('should provide variety across functional food groups rather than repeating 1 item', () => {
      const result = optimizeDiet({
        foods: allStaples,
        proteinTargetGrams: 100,
        foodBudget: 80,
        dietType: 'vegetarian'
      });

      assert.ok(result.foods.length >= 3, `Expected at least 3 distinct foods, got ${result.foods.length}`);
      const uniqueNames = new Set(result.foods.map(f => f.name));
      assert.equal(uniqueNames.size, result.foods.length);
    });
  });

  describe('7. Input Validation Unit Tests', () => {
    const validDietInput = {
      nutrition: {
        calorieTarget: 2947,
        proteinTargetGrams: 119
      },
      dietType: 'vegetarian',
      foodBudget: 80,
      supplementPreference: 'no_supplements'
    };

    it('should pass on valid input structure', () => {
      const validation = validateDietInput(validDietInput);
      assert.equal(validation.isValid, true);
      assert.equal(validation.errors.length, 0);
      assert.equal(validation.value.calorieTarget, 2947);
      assert.equal(validation.value.proteinTargetGrams, 119);
      assert.equal(validation.value.foodBudget, 80);
      assert.equal(validation.value.dietType, 'vegetarian');
      assert.equal(validation.value.supplementPreference, 'no_supplements');
    });

    it('should reject missing or non-object nutrition field', () => {
      assert.equal(validateDietInput({ ...validDietInput, nutrition: null }).isValid, false);
      assert.equal(validateDietInput({ ...validDietInput, nutrition: '2947' }).isValid, false);
      assert.equal(validateDietInput({ ...validDietInput, nutrition: {} }).isValid, false);
    });

    it('should reject negative, zero, or non-numeric nutrition targets', () => {
      assert.equal(validateDietInput({
        ...validDietInput,
        nutrition: { calorieTarget: -100, proteinTargetGrams: 100 }
      }).isValid, false);

      assert.equal(validateDietInput({
        ...validDietInput,
        nutrition: { calorieTarget: 2000, proteinTargetGrams: 0 }
      }).isValid, false);

      assert.equal(validateDietInput({
        ...validDietInput,
        nutrition: { calorieTarget: 'abc', proteinTargetGrams: 100 }
      }).isValid, false);
    });

    it('should reject negative, zero, or non-numeric budget', () => {
      assert.equal(validateDietInput({ ...validDietInput, foodBudget: -50 }).isValid, false);
      assert.equal(validateDietInput({ ...validDietInput, foodBudget: 0 }).isValid, false);
      assert.equal(validateDietInput({ ...validDietInput, foodBudget: 'free' }).isValid, false);
    });

    it('should reject invalid dietType and supplementPreference', () => {
      assert.equal(validateDietInput({ ...validDietInput, dietType: 'paleo' }).isValid, false);
      assert.equal(validateDietInput({ ...validDietInput, supplementPreference: 'creatine_only' }).isValid, false);
    });

    it('should reject non-object body or null', () => {
      assert.equal(validateDietInput(null).isValid, false);
      assert.equal(validateDietInput([1, 2, 3]).isValid, false);
      assert.equal(validateDietInput('string').isValid, false);
    });
  });

  describe('8. Service Layer Integration', () => {
    it('should execute end-to-end optimization using repository foods', () => {
      const result = dietService.optimizeDietPlan({
        nutrition: {
          calorieTarget: 2947,
          proteinTargetGrams: 119
        },
        dietType: 'vegetarian',
        foodBudget: 80,
        supplementPreference: 'no_supplements'
      });

      assert.ok(result);
      assert.equal(typeof result.feasible, 'boolean');
      assert.ok(result.budget);
      assert.ok(result.protein);
      assert.ok(Array.isArray(result.foods));
    });
  });

  describe('9. API Integration Tests (POST /api/diet/optimize)', () => {
    it('should return HTTP 200 with structured diet plan for valid vegetarian request', async () => {
      const res = await request(app)
        .post('/api/diet/optimize')
        .send({
          nutrition: {
            calorieTarget: 2947,
            proteinTargetGrams: 119
          },
          dietType: 'vegetarian',
          foodBudget: 80,
          supplementPreference: 'no_supplements'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      assert.equal(res.body.success, true);
      assert.equal(res.body.data.feasible, true);
      assert.equal(res.body.data.budget.dailyLimit, 80);
      assert.ok(res.body.data.budget.estimatedCost <= 80);
      assert.equal(res.body.data.protein.targetGrams, 119);
      assert.ok(res.body.data.protein.achievedGrams >= 119);
      assert.equal(res.body.data.protein.gapGrams, 0);
      assert.ok(Array.isArray(res.body.data.foods));
      assert.ok(res.body.data.foods.length > 0);

      // Verify each food has name, quantityGrams, estimatedCost, proteinGrams
      res.body.data.foods.forEach(f => {
        assert.ok(f.name);
        assert.equal(typeof f.quantityGrams, 'number');
        assert.equal(typeof f.estimatedCost, 'number');
        assert.equal(typeof f.proteinGrams, 'number');
      });

      // Verify meal timings schedule
      assert.ok(Array.isArray(res.body.data.mealTimings), 'Should include meal timings schedule');
      assert.ok(res.body.data.mealTimings.length >= 6);
      assert.ok(res.body.data.mealTimings.some(m => m.meal.includes('Pre-workout')));
      assert.ok(res.body.data.mealTimings.some(m => m.meal.includes('Before-bed milk')));

      // Verify complete 7-day meal plan
      assert.ok(Array.isArray(res.body.data.sevenDayMealPlan), 'Should include 7-day meal plan');
      assert.equal(res.body.data.sevenDayMealPlan.length, 7);
      for (const day of res.body.data.sevenDayMealPlan) {
        assert.ok(day.dayName);
        assert.ok(day.estimatedCalories);
        assert.ok(day.estimatedProtein);
        assert.ok(Array.isArray(day.meals) && day.meals.length >= 5);
        // Verify inclusion of fruits & dry fruits
        const allFoodsStr = day.meals.map(m => m.foodAndQuantity).join(' ');
        assert.ok(allFoodsStr.includes('banana') || allFoodsStr.includes('guava') || allFoodsStr.includes('orange'));
        assert.ok(allFoodsStr.includes('dates') || allFoodsStr.includes('peanuts') || allFoodsStr.includes('chana'));
      }

      // Verify budget management guide
      assert.ok(res.body.data.budgetManagement);
      assert.ok(res.body.data.budgetManagement.headline);
      assert.ok(Array.isArray(res.body.data.budgetManagement.guidelines));
      assert.ok(res.body.data.budgetManagement.guidelines.some(g => g.food.includes('Milk')));
      assert.ok(res.body.data.budgetManagement.guidelines.some(g => g.food.includes('Paneer')));
      assert.ok(res.body.data.budgetManagement.guidelines.some(g => g.food.includes('Soya')));
    });

    it('should return HTTP 200 with partial plan and reason for insufficient budget', async () => {
      const res = await request(app)
        .post('/api/diet/optimize')
        .send({
          nutrition: {
            calorieTarget: 2947,
            proteinTargetGrams: 119
          },
          dietType: 'vegetarian',
          foodBudget: 25,
          supplementPreference: 'no_supplements'
        })
        .expect(200);

      assert.equal(res.body.success, true);
      assert.equal(res.body.data.feasible, false);
      assert.ok(res.body.data.reason);
      assert.match(res.body.data.reason, /Protein target cannot be reached/);
      assert.ok(res.body.data.protein.gapGrams > 0);
      assert.ok(res.body.data.budget.estimatedCost <= 25);
    });

    it('should return HTTP 400 for missing nutrition object', async () => {
      const res = await request(app)
        .post('/api/diet/optimize')
        .send({
          dietType: 'vegetarian',
          foodBudget: 80
        })
        .expect(400);

      assert.equal(res.body.success, false);
      assert.ok(res.body.error);
      assert.match(res.body.error.message, /nutrition/);
    });

    it('should return HTTP 400 for negative budget or non-numeric target', async () => {
      const res = await request(app)
        .post('/api/diet/optimize')
        .send({
          nutrition: {
            calorieTarget: 2500,
            proteinTargetGrams: 'high'
          },
          dietType: 'vegetarian',
          foodBudget: -10
        })
        .expect(400);

      assert.equal(res.body.success, false);
      assert.match(res.body.error.message, /foodBudget must be a positive number/);
    });

    it('should return HTTP 400 for unsupported diet type', async () => {
      const res = await request(app)
        .post('/api/diet/optimize')
        .send({
          nutrition: {
            calorieTarget: 2500,
            proteinTargetGrams: 100
          },
          dietType: 'keto_meat_only',
          foodBudget: 100
        })
        .expect(400);

      assert.equal(res.body.success, false);
      assert.match(res.body.error.message, /Invalid dietType/);
    });

    it('should return HTTP 400 for empty request body', async () => {
      const res = await request(app)
        .post('/api/diet/optimize')
        .send({})
        .expect(400);

      assert.equal(res.body.success, false);
      assert.ok(res.body.error);
    });

    it('should never expose stack traces in client response', async () => {
      const res = await request(app)
        .post('/api/diet/optimize')
        .send({ foodBudget: -50 })
        .expect(400);

      assert.equal(res.body.error.stack, undefined);
    });
  });
});
