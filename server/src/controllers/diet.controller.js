import dietService from '../services/diet.service.js';

/**
 * Controller to handle POST /api/diet/optimize
 */
export const optimizeDiet = (req, res, next) => {
  try {
    const result = dietService.optimizeDietPlan(req.body);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};
