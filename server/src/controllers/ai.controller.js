import aiService, { AIServiceNotConfiguredError } from '../services/ai.service.js';

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

    const result = await aiService.generateResponse(query, context);
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
