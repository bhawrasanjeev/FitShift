/**
 * Central error handling middleware.
 * Formats uncaught application errors into consistent JSON responses.
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  const response = {
    success: false,
    error: {
      message
    }
  };

  // Only expose stack trace in non-production environments
  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
