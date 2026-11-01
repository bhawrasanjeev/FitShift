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

  // Only expose stack trace for 500+ server errors in development environments
  if (process.env.NODE_ENV === 'development' && statusCode >= 500 && err.stack) {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
