import { Router } from 'express';
import { getAIStatus, handleAIChat } from '../controllers/ai.controller.js';
import { aiChatRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/status', getAIStatus);
router.post('/chat', aiChatRateLimiter, handleAIChat);

export default router;
