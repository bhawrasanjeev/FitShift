import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import config from './config/env.js';
import apiRoutes from './routes/index.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';
import { generalApiRateLimiter } from './middleware/rateLimiter.js';

const app = express();

// Apply security headers
app.use(helmet());

// Configure CORS: support multiple allowed origins, wildcards, and deployment domains
const rawClientUrls = (config.clientUrl || '*')
  .split(',')
  .map((u) => u.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // If wildcard or origin matches configured origins
    if (rawClientUrls.includes('*') || rawClientUrls.includes(origin)) {
      return callback(null, true);
    }

    // Allow localhost & 127.0.0.1 on any port for local development
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // Allow common frontend hosting platforms
    try {
      const { hostname } = new URL(origin);
      if (hostname.endsWith('.vercel.app') || hostname.endsWith('.netlify.app') || hostname.endsWith('.onrender.com')) {
        return callback(null, true);
      }
    } catch {
      // ignore URL parsing error
    }

    // If in development mode, allow
    if (config.nodeEnv !== 'production') {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true
}));

// Parse incoming JSON requests with explicit size limit to prevent payload DoS
app.use(express.json({ limit: '100kb' }));

// Global rate limiting on API endpoints
app.use('/api', generalApiRateLimiter);

// Register API routes
app.use('/api', apiRoutes);

// Catch unknown routes with 404 JSON response
app.use(notFoundHandler);

// Central error handling middleware
app.use(errorHandler);

export default app;
