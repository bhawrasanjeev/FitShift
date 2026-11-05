import rateLimit from 'express-rate-limit';

/**
 * Dedicated rate limiter for AI Chat requests.
 * Prevents Gemini/OpenAI API quota exhaustion, excessive billing, and denial-of-service.
 */
export const aiChatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'test' ? 1000 : 20, // 20 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many AI requests. Please wait a minute before sending another query.'
    }
  }
});

/**
 * Global rate limiter for general API routes.
 */
export const generalApiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 10000 : 300, // 300 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP. Please try again later.'
    }
  }
});
