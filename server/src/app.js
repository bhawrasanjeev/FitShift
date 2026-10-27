import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import config from './config/env.js';
import apiRoutes from './routes/index.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Apply security headers
app.use(helmet());

// Configure CORS
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));

// Parse incoming JSON requests
app.use(express.json());

// Register API routes
app.use('/api', apiRoutes);

// Catch unknown routes with 404 JSON response
app.use(notFoundHandler);

// Central error handling middleware
app.use(errorHandler);

export default app;
