import { Router } from 'express';
import { calculateNutritionPlan } from '../controllers/nutrition.controller.js';

const router = Router();

// POST /api/nutrition/calculate
router.post('/calculate', calculateNutritionPlan);

export default router;
