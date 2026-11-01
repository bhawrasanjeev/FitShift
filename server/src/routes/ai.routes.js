import { Router } from 'express';
import { getAIStatus, handleAIChat } from '../controllers/ai.controller.js';

const router = Router();

router.get('/status', getAIStatus);
router.post('/chat', handleAIChat);

export default router;
