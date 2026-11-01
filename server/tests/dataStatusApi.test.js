import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { DatasetService } from '../src/services/dataset.service.js';
import { ExerciseRepository } from '../src/repositories/exercise.repository.js';
import { FoodPriceRepository } from '../src/repositories/foodPrice.repository.js';
import { CleanStaplesRepository } from '../src/repositories/cleanStaples.repository.js';
import { NutritionRepository } from '../src/repositories/nutrition.repository.js';

describe('Dataset Status API Tests (GET /api/data/status)', () => {
  it('should return HTTP 200 with structured validation status for all 4 datasets', async () => {
    const res = await request(app)
      .get('/api/data/status')
      .expect('Content-Type', /json/)
      .expect(200);

    assert.equal(res.body.success, true);
    assert.ok(res.body.data);
    assert.ok(res.body.data.datasets);

    const { exercises, foodPrices, cleanStaples, nutrition } = res.body.data.datasets;

    // Check Exercises dataset
    assert.equal(exercises.available, true);
    assert.equal(exercises.recordCount, 876);
    assert.equal(exercises.valid, true);
    assert.ok(Array.isArray(exercises.warnings));

    // Check Food Prices dataset
    assert.equal(foodPrices.available, true);
    assert.equal(foodPrices.recordCount, 36);
    assert.equal(foodPrices.valid, true);
    assert.ok(Array.isArray(foodPrices.warnings));

    // Check Clean Staples dataset
    assert.equal(cleanStaples.available, true);
    assert.equal(cleanStaples.recordCount, 36);
    assert.equal(cleanStaples.valid, true);
    assert.ok(Array.isArray(cleanStaples.warnings));

    // Check Nutrition dataset
    assert.equal(nutrition.available, true);
    assert.equal(nutrition.recordCount, 1014);
    assert.equal(nutrition.valid, true);
    assert.ok(Array.isArray(nutrition.warnings));
  });

  it('should not expose server filesystem paths in API response', async () => {
    const res = await request(app)
      .get('/api/data/status')
      .expect(200);

    const responseText = JSON.stringify(res.body);
    assert.equal(responseText.includes('/Users/'), false);
    assert.equal(responseText.includes('server/data'), false);
    assert.equal(responseText.includes('\\Users\\'), false);
  });

  it('should not expose full datasets or raw records in status response', async () => {
    const res = await request(app)
      .get('/api/data/status')
      .expect(200);

    const datasets = res.body.data.datasets;
    Object.values(datasets).forEach((ds) => {
      assert.equal(ds.records, undefined);
      assert.equal(ds.data, undefined);
      assert.equal(ds.items, undefined);
    });
  });

  it('should report failure safely without crashing if a dataset is missing', () => {
    const mockService = new DatasetService({
      exercises: new ExerciseRepository('/non/existent/path/exercises.json'),
      foodPrices: new FoodPriceRepository('/non/existent/path/prices.csv'),
      cleanStaples: new CleanStaplesRepository('/non/existent/path/staples.csv'),
      nutrition: new NutritionRepository('/non/existent/path/nutrition.csv')
    });

    const status = mockService.getDatasetStatus();
    assert.equal(status.datasets.exercises.available, false);
    assert.equal(status.datasets.exercises.valid, false);
    assert.equal(status.datasets.exercises.recordCount, 0);

    assert.equal(status.datasets.foodPrices.available, false);
    assert.equal(status.datasets.cleanStaples.available, false);
    assert.equal(status.datasets.nutrition.available, false);
  });
});
