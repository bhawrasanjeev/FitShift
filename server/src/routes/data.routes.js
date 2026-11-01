import { Router } from 'express';
import { getDataStatus } from '../controllers/data.controller.js';

const router = Router();

// GET /api/data/status
router.get('/status', getDataStatus);

export default router;
