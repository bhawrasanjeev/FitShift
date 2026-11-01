import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { generateWorkoutSchedule } from '../src/algorithms/workout/workoutGenerator.js';

describe('Workout Engine & Real Exercise Dataset Tests', () => {
  describe('Workout Generator Unit Tests', () => {
    test('should generate a 7-day schedule with real exercises for home environment', () => {
      const schedule = generateWorkoutSchedule({
        environment: 'home',
        durationMinutes: 45,
        weeklyFrequencyDays: 4,
        goal: 'muscle_gain'
      });

      assert.equal(schedule.length, 7);

      const activeDays = schedule.filter(d => !d.isRestDay);
      assert.equal(activeDays.length, 4, 'Should have exactly 4 training days');

      const restDays = schedule.filter(d => d.isRestDay);
      assert.equal(restDays.length, 3, 'Should have exactly 3 rest days');

      // Verify every exercise comes from the real dataset and has valid properties
      for (const day of activeDays) {
        assert.ok(day.exercises.length >= 3, 'Each session should have exercises');
        for (const ex of day.exercises) {
          assert.ok(typeof ex.id === 'string' && ex.id.length > 0);
          assert.ok(typeof ex.name === 'string' && ex.name.length > 0);
          assert.ok(typeof ex.targetMuscle === 'string');
          assert.ok(typeof ex.setsReps === 'string');
          assert.ok(typeof ex.restSeconds === 'number');
          assert.equal(ex.environment, 'home');
          assert.ok(ex.equipment === 'body only' || ex.equipment === 'bands' || ex.equipment === null);
          if (ex.thumbnailUrl) {
            assert.ok(ex.thumbnailUrl.startsWith('https://raw.githubusercontent.com/yuhonas/free-exercise-db/'));
          }
          assert.ok(Array.isArray(ex.instructions));
          assert.ok(ex.alternative, 'Should have an alternative exercise');
        }
      }
    });

    test('should generate gym workout with weighted equipment (barbells, dumbbells, cables)', () => {
      const schedule = generateWorkoutSchedule({
        environment: 'gym',
        durationMinutes: 60,
        weeklyFrequencyDays: 5,
        goal: 'fat_loss'
      });

      assert.equal(schedule.length, 7);
      const activeDays = schedule.filter(d => !d.isRestDay);
      assert.equal(activeDays.length, 5);

      const allExercises = activeDays.flatMap(d => d.exercises);
      const hasGymGear = allExercises.some(ex =>
        ['barbell', 'dumbbell', 'cable', 'machine', 'e-z curl bar'].includes(ex.equipment)
      );
      assert.ok(hasGymGear, 'Gym routine should include gym-specific equipment');
    });

    test('should differentiate male vs female intermediate 2-muscle splits', () => {
      // 1. Male Intermediate: Chest+Tri, Back+Bi, Legs+Calves, Shoulders+Abs/Forearms
      const malePlan = generateWorkoutSchedule({
        gender: 'male',
        experienceLevel: 'intermediate',
        weeklyFrequencyDays: 4,
        environment: 'gym'
      });
      const maleActiveDays = malePlan.filter(d => !d.isRestDay);
      assert.equal(maleActiveDays.length, 4);

      const maleFocuses = maleActiveDays.map(d => d.focus);
      assert.ok(maleFocuses.some(f => f.includes('Chest & Triceps')), 'Male should have Chest & Triceps session');
      assert.ok(maleFocuses.some(f => f.includes('Back & Biceps')), 'Male should have Back & Biceps session');
      assert.ok(maleFocuses.some(f => f.includes('Shoulders')), 'Male should have Shoulders & Abs/Forearms session');
      assert.ok(maleFocuses.some(f => f.includes('Legs')), 'Male should have Legs session');

      // Verify Chest & Triceps day has both chest and tricep exercises
      const chestTriDay = maleActiveDays.find(d => d.focus.includes('Chest & Triceps'));
      const hasChest = chestTriDay.exercises.some(e => e.targetMuscle.includes('chest'));
      const hasTricep = chestTriDay.exercises.some(e => e.targetMuscle.includes('triceps'));
      assert.ok(hasChest, 'Chest & Tricep day must include chest exercises');
      assert.ok(hasTricep, 'Chest & Tricep day must include tricep exercises');

      // 2. Female Intermediate: Glutes+Hamstrings, Back+Triceps, Quads+Glutes, Shoulders+Abs
      const femalePlan = generateWorkoutSchedule({
        gender: 'female',
        experienceLevel: 'intermediate',
        weeklyFrequencyDays: 4,
        environment: 'gym'
      });
      const femaleActiveDays = femalePlan.filter(d => !d.isRestDay);
      assert.equal(femaleActiveDays.length, 4);

      const femaleFocuses = femaleActiveDays.map(d => d.focus);
      assert.ok(femaleFocuses.some(f => f.includes('Glutes & Hamstrings')), 'Female should have Glutes & Hamstrings session');
      assert.ok(femaleFocuses.some(f => f.includes('Back & Triceps')), 'Female should have Back & Triceps session');
      assert.ok(femaleFocuses.some(f => f.includes('Quads & Glutes')), 'Female should have Quads & Glutes session');

      // Verify Glutes & Hamstrings day has glute and hamstring exercises
      const gluteHamDay = femaleActiveDays.find(d => d.focus.includes('Glutes & Hamstrings'));
      const hasGlute = gluteHamDay.exercises.some(e => e.targetMuscle.includes('glutes'));
      const hasHam = gluteHamDay.exercises.some(e => e.targetMuscle.includes('hamstrings'));
      assert.ok(hasGlute, 'Glutes & Hamstrings day must include glute exercises');
      assert.ok(hasHam, 'Glutes & Hamstrings day must include hamstring exercises');
    });

    test('should provide beginner foundational splits with beginner-friendly rep ranges', () => {
      const beginnerPlan = generateWorkoutSchedule({
        gender: 'male',
        experienceLevel: 'beginner',
        weeklyFrequencyDays: 3,
        environment: 'home'
      });

      const activeDays = beginnerPlan.filter(d => !d.isRestDay);
      assert.equal(activeDays.length, 3);

      for (const day of activeDays) {
        assert.ok(day.focus.includes('Foundations'), 'Beginner sessions should be foundational');
        for (const ex of day.exercises) {
          assert.equal(ex.setsReps, '3 sets × 10–12 reps', 'Beginner exercises should have 10-12 rep range');
          assert.equal(ex.restSeconds, 75, 'Beginner exercises should have 75s rest');
        }
      }
    });

    test('should scale exercise count based on durationMinutes (20m -> 3 exercises, 60m -> 6 exercises)', () => {
      const shortPlan = generateWorkoutSchedule({ durationMinutes: 20, weeklyFrequencyDays: 3 });
      const activeShort = shortPlan.filter(d => !d.isRestDay);
      assert.equal(activeShort[0].exercises.length, 3);

      const longPlan = generateWorkoutSchedule({ durationMinutes: 60, weeklyFrequencyDays: 3 });
      const activeLong = longPlan.filter(d => !d.isRestDay);
      assert.equal(activeLong[0].exercises.length, 6);
    });

    test('should ensure all alternatives are unique, not present in the same day, and have thumbnail URLs', () => {
      const schedule = generateWorkoutSchedule({
        gender: 'male',
        experienceLevel: 'intermediate',
        weeklyFrequencyDays: 5,
        environment: 'gym',
        durationMinutes: 45
      });

      const activeDays = schedule.filter(d => !d.isRestDay);
      for (const day of activeDays) {
        const dayIds = day.exercises.map(e => e.id);
        const altIds = day.exercises.map(e => e.alternative?.id);

        // 1. No exercise in the day should have an alternative that is already in today's session
        for (const altId of altIds) {
          assert.equal(
            dayIds.includes(altId),
            false,
            `Alternative ${altId} must not already be in the same day session exercises: ${dayIds.join(', ')}`
          );
        }

        // 2. No two exercises in the day should share the exact same alternative
        const uniqueAlts = new Set(altIds);
        assert.equal(uniqueAlts.size, altIds.length, 'Every exercise on a day must have a distinct alternative');

        // 3. Every alternative should have a valid thumbnail URL and instruction list
        for (const ex of day.exercises) {
          assert.ok(ex.alternative, 'Alternative must exist');
          assert.ok(typeof ex.alternative.thumbnailUrl === 'string' && ex.alternative.thumbnailUrl.startsWith('http'), 'Alternative should have a valid thumbnail URL');
          assert.ok(Array.isArray(ex.alternative.instructions), 'Alternative should have instructions array');
          assert.ok(typeof ex.alternative.targetMuscle === 'string', 'Alternative should have targetMuscle string');
        }
      }
    });
  });

  describe('Workout API Integration Tests (POST /api/workouts/generate & GET /api/workouts)', () => {
    test('POST /api/workouts/generate should return HTTP 200 with structured plan', async () => {
      const res = await request(app)
        .post('/api/workouts/generate')
        .send({
          environment: 'home',
          durationMinutes: 45,
          weeklyFrequencyDays: 4,
          experienceLevel: 'intermediate',
          goal: 'muscle_gain'
        })
        .expect(200);

      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data.days));
      assert.equal(res.body.data.days.length, 7);
      assert.equal(res.body.data.environment, 'home');
    });

    test('GET /api/workouts with query parameters should return HTTP 200', async () => {
      const res = await request(app)
        .get('/api/workouts?environment=gym&durationMinutes=30&weeklyFrequencyDays=3')
        .expect(200);

      assert.equal(res.body.success, true);
      assert.equal(res.body.data.environment, 'gym');
      assert.equal(res.body.data.durationMinutes, 30);
    });

    test('POST /api/workouts/generate should return HTTP 400 for invalid environment', async () => {
      const res = await request(app)
        .post('/api/workouts/generate')
        .send({ environment: 'outer_space' })
        .expect(400);

      assert.equal(res.body.success, false);
      assert.ok(res.body.error.message.includes('Environment'));
    });

    test('POST /api/workouts/generate should return HTTP 400 for invalid gender', async () => {
      const res = await request(app)
        .post('/api/workouts/generate')
        .send({ gender: 'alien' })
        .expect(400);

      assert.equal(res.body.success, false);
      assert.ok(res.body.error.message.includes('Gender'));
    });

    test('POST /api/workouts/generate should respect gender parameter', async () => {
      const res = await request(app)
        .post('/api/workouts/generate')
        .send({
          gender: 'female',
          experienceLevel: 'intermediate',
          weeklyFrequencyDays: 4
        })
        .expect(200);

      assert.equal(res.body.success, true);
      assert.equal(res.body.data.gender, 'female');
      const activeDays = res.body.data.days.filter((d) => !d.isRestDay);
      assert.ok(activeDays.some((d) => d.focus.includes('Glutes')));
    });
  });
});
