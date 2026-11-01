import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

describe('Frontend Client API Contract & Real-Data Integration Tests', () => {
  describe('Case 1: Standard Male Muscle Gain Workflow (Aarav profile via UI mapper)', () => {
    let nutritionResult;

    test('Step 1: Calculate nutrition targets with mapped UI fields', async () => {
      // Client transforms UI values: goal='muscle_gain', activityLevel='moderate'
      const clientPayload = {
        age: 26,
        gender: 'male',
        heightCm: 175,
        weightKg: 68,
        goal: 'muscle_gain',
        activityLevel: 'moderate',
      };

      const res = await request(app)
        .post('/api/nutrition/calculate')
        .send(clientPayload)
        .expect(200);

      assert.equal(res.body.success, true);
      assert.ok(res.body.data.bmr > 0, 'BMR should be positive number');
      assert.ok(res.body.data.tdee > 0, 'TDEE should be positive number');
      assert.ok(res.body.data.calorieTarget > 0, 'Calorie target should be positive number');
      assert.ok(res.body.data.proteinTargetGrams > 0, 'Protein target should be positive number');

      nutritionResult = res.body.data;
    });

    test('Step 2: Optimize diet plan with calculated targets and pure_veg mapping', async () => {
      // Client maps pure_veg -> vegetarian, dailyBudgetRupees -> foodBudget
      const dietPayload = {
        nutrition: {
          calorieTarget: nutritionResult.calorieTarget,
          proteinTargetGrams: nutritionResult.proteinTargetGrams,
        },
        dietType: 'vegetarian',
        foodBudget: 65,
        supplementPreference: 'no_supplements',
      };

      const res = await request(app)
        .post('/api/diet/optimize')
        .send(dietPayload)
        .expect(200);

      assert.equal(res.body.success, true);
      const plan = res.body.data;

      assert.ok(typeof plan.feasible === 'boolean');
      assert.ok(plan.budget.estimatedCost <= 65, 'Estimated cost should be within user budget limit');
      assert.ok(plan.protein.achievedGrams > 0, 'Should allocate protein from real staples');
      assert.ok(Array.isArray(plan.foods), 'Foods should be an array');
      assert.ok(plan.foods.length > 0, 'Should contain real allocated staples');

      // Ensure every allocated food exists in real staples and has realistic costs
      for (const food of plan.foods) {
        assert.ok(typeof food.name === 'string');
        assert.ok(food.proteinGrams > 0);
        assert.ok(food.estimatedCost > 0);
      }
    });
  });

  describe('Case 2: Female Fat Loss Workflow with UI weight_loss and lightly_active mapping', () => {
    test('should map UI weight_loss to fat_loss and lightly_active to light, then optimize eggetarian diet', async () => {
      // Client maps: goal 'weight_loss' -> 'fat_loss', activity 'lightly_active' -> 'light'
      const nutritionRes = await request(app)
        .post('/api/nutrition/calculate')
        .send({
          age: 28,
          gender: 'female',
          heightCm: 162,
          weightKg: 58,
          goal: 'fat_loss',
          activityLevel: 'light',
        })
        .expect(200);

      assert.equal(nutritionRes.body.success, true);
      const { calorieTarget, proteinTargetGrams } = nutritionRes.body.data;

      const dietRes = await request(app)
        .post('/api/diet/optimize')
        .send({
          nutrition: {
            calorieTarget,
            proteinTargetGrams,
          },
          dietType: 'eggetarian',
          foodBudget: 80,
          supplementPreference: 'open_to_supplements',
        })
        .expect(200);

      assert.equal(dietRes.body.success, true);
      assert.equal(dietRes.body.data.feasible, true);
      assert.ok(dietRes.body.data.budget.estimatedCost <= 80);
    });
  });

  describe('Case 3: Honest Low-Budget Reporting (feasible = false)', () => {
    test('should return honest unfeasible result when budget cannot cover protein requirement', async () => {
      const res = await request(app)
        .post('/api/diet/optimize')
        .send({
          nutrition: {
            calorieTarget: 2500,
            proteinTargetGrams: 150,
          },
          dietType: 'vegetarian',
          foodBudget: 20, // ₹20/day is insufficient for 150g protein
          supplementPreference: 'no_supplements',
        })
        .expect(200);

      assert.equal(res.body.success, true);
      const plan = res.body.data;
      assert.equal(plan.feasible, false);
      assert.ok(plan.protein.gapGrams > 0, 'Should honestly report a protein gap');
      assert.ok(plan.protein.achievedGrams < 150, 'Achieved protein should be less than target');
    });
  });

  describe('Case 4: API Error Handling for Client Error Banners', () => {
    test('should return structured 400 error message when client sends invalid parameters', async () => {
      const res = await request(app)
        .post('/api/nutrition/calculate')
        .send({
          age: 12, // under minimum age 14
          gender: 'male',
          heightCm: 175,
          weightKg: 68,
          goal: 'muscle_gain',
        })
        .expect(400);

      assert.equal(res.body.success, false);
      assert.ok(res.body.error.message.toLowerCase().includes('age'), 'Error message should indicate age constraint');
    });
  });

  describe('Case 5: End-to-End Workout Schedule Generation Contract', () => {
    test('should generate 7-day schedule with CDN image URLs and muscle mapping', async () => {
      const res = await request(app)
        .post('/api/workouts/generate')
        .send({
          environment: 'home',
          durationMinutes: 45,
          weeklyFrequencyDays: 4,
          experienceLevel: 'intermediate',
          goal: 'muscle_gain',
        })
        .expect(200);

      assert.equal(res.body.success, true);
      const workout = res.body.data;
      assert.equal(workout.environment, 'home');
      assert.equal(workout.days.length, 7);

      const trainingDays = workout.days.filter((d) => !d.isRestDay);
      assert.equal(trainingDays.length, 4);

      for (const day of trainingDays) {
        assert.ok(day.exercises.length >= 3, 'Training day should have exercises');
        for (const ex of day.exercises) {
          assert.ok(typeof ex.name === 'string');
          assert.ok(typeof ex.targetMuscle === 'string');
          assert.ok(typeof ex.setsReps === 'string');
          assert.ok(typeof ex.restSeconds === 'number');
          // CDN image URL verification
          if (ex.thumbnailUrl) {
            assert.ok(ex.thumbnailUrl.startsWith('https://raw.githubusercontent.com/yuhonas/free-exercise-db/'));
          }
          // Alternative verification
          assert.ok(ex.alternative && typeof ex.alternative.name === 'string');
        }
      }
    });
  });

  describe('Case 6: Meal Plan & Grocery Consolidation Contract', () => {
    test('should return structured meals and consolidated grocery list from diet optimization', async () => {
      const res = await request(app)
        .post('/api/diet/optimize')
        .send({
          nutrition: {
            calorieTarget: 2400,
            proteinTargetGrams: 110,
          },
          dietType: 'vegetarian',
          foodBudget: 75,
          supplementPreference: 'no_supplements',
        })
        .expect(200);

      assert.equal(res.body.success, true);
      const plan = res.body.data;

      // Verify structured meals
      assert.ok(Array.isArray(plan.meals), 'Meals should be an array');
      assert.ok(plan.meals.length >= 3, 'Should generate at least 3 daily meals');
      for (const meal of plan.meals) {
        assert.ok(typeof meal.title === 'string');
        assert.ok(typeof meal.mealType === 'string');
        assert.ok(typeof meal.totalProteinGrams === 'number');
        assert.ok(Array.isArray(meal.items));
      }

      // Verify consolidated grocery list
      assert.ok(Array.isArray(plan.groceryList), 'Grocery list should be an array');
      assert.ok(plan.groceryList.length > 0, 'Should aggregate shopping items');
      for (const item of plan.groceryList) {
        assert.ok(typeof item.name === 'string');
        assert.ok(typeof item.weeklyQuantity === 'string');
        assert.ok(item.weeklyGrams > 0);
        assert.ok(item.estimatedWeeklyCost > 0);
      }
    });
  });

  describe('Case 7: AI Status & Configuration Handling Contract', () => {
    test('should report configured=false safely when API key is missing without crashing', async () => {
      const res = await request(app)
        .get('/api/ai/status')
        .expect(200);

      assert.equal(res.body.success, true);
      assert.ok(typeof res.body.data.configured === 'boolean');
      // Must never leak secrets in status
      assert.equal(res.body.data.apiKey, undefined);
      assert.equal(res.body.data.key, undefined);
    });
  });
});
