import workoutService from '../services/workout.service.js';

export const generateWorkout = (req, res, next) => {
  try {
    const input = req.method === 'GET' ? req.query : req.body;
    const result = workoutService.generateWorkout(input);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};
