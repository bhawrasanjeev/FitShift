import { Router } from 'express';
import { generateWorkout } from '../controllers/workout.controller.js';

const router = Router();

// Support both POST and GET for workout generation / retrieval
router.post('/generate', generateWorkout);
router.get('/', generateWorkout);

export default router;
