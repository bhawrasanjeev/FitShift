import { Router } from 'express';
import healthRoutes from './health.routes.js';
import dataRoutes from './data.routes.js';
import nutritionRoutes from './nutrition.routes.js';
import dietRoutes from './diet.routes.js';
import workoutRoutes from './workout.routes.js';
import aiRoutes from './ai.routes.js';

const router = Router();

// Mount feature routes
router.use('/', healthRoutes);
router.use('/data', dataRoutes);
router.use('/nutrition', nutritionRoutes);
router.use('/diet', dietRoutes);
router.use('/workouts', workoutRoutes);
router.use('/ai', aiRoutes);

export default router;
