import aiService, { AIServiceNotConfiguredError } from '../services/ai.service.js';

function sanitizeContext(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }
  const clean = {};
  if (typeof raw.goal === 'string') {
    clean.goal = raw.goal.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().slice(0, 50);
  }
  if (typeof raw.environment === 'string') {
    const envNorm = raw.environment.trim().toLowerCase();
    clean.environment = ['gym', 'home'].includes(envNorm) ? envNorm : 'home';
  }
  if (typeof raw.diet === 'string') {
    clean.diet = raw.diet.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().slice(0, 50);
  }
  if (raw.dailyBudget !== undefined) {
    const num = Number(raw.dailyBudget);
    if (Number.isFinite(num) && num > 0 && num <= 10000) {
      clean.dailyBudget = Math.round(num);
    }
  }
  if (raw.durationMinutes !== undefined) {
    const num = Number(raw.durationMinutes);
    if (Number.isFinite(num) && num > 0 && num <= 240) {
      clean.durationMinutes = Math.round(num);
    }
  }
  return Object.keys(clean).length > 0 ? clean : null;
}

export const getAIStatus = (req, res) => {
  const status = aiService.getStatus();
  res.status(200).json({
    success: true,
    data: status
  });
};

export const handleAIChat = async (req, res, next) => {
  try {
    const { query, context } = req.body || {};

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return res.status(400).json({
        success: false,
        error: { message: 'Query string is required' }
      });
    }

    if (query.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        error: { message: 'Query string cannot exceed 1000 characters' }
      });
    }

    const cleanContext = sanitizeContext(context);
    const result = await aiService.generateResponse(query, cleanContext);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    if (err instanceof AIServiceNotConfiguredError) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured',
        error: { message: err.message }
      });
    }
    next(err);
  }
};
