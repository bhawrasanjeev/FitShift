import { Router } from 'express';
import { optimizeDiet } from '../controllers/diet.controller.js';

const router = Router();

// POST /api/diet/optimize
router.post('/optimize', optimizeDiet);

export default router;
