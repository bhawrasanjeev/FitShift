/**
 * Middleware to handle unmatched routes with a consistent 404 JSON response.
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`
    }
  });
};

export default notFoundHandler;
