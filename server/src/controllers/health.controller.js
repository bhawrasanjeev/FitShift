/**
 * Health check controller.
 * Verifies backend connectivity without invoking business logic or dataset access.
 */
export const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FitShift API is running'
  });
};
