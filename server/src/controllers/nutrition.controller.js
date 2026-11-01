import nutritionService from '../services/nutrition.service.js';

/**
 * Controller to handle POST /api/nutrition/calculate
 */
export const calculateNutritionPlan = (req, res, next) => {
  try {
    const result = nutritionService.calculateNutrition(req.body);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};
