import app from './app.js';
import config from './config/env.js';

const server = app.listen(config.port, () => {
  console.log(`[FitShift API] Server running in ${config.nodeEnv} mode on port ${config.port}`);
  console.log(`[FitShift API] Health endpoint available at http://localhost:${config.port}/api/health`);
  console.log(`[FitShift API] Dataset status endpoint available at http://localhost:${config.port}/api/data/status`);
  console.log(`[FitShift API] Nutrition calculation endpoint available at http://localhost:${config.port}/api/nutrition/calculate`);
  console.log(`[FitShift API] Diet optimization endpoint available at http://localhost:${config.port}/api/diet/optimize`);
  console.log(`[FitShift API] Configured CORS origin: ${config.clientUrl}`);
});

server.on('error', (error) => {
  console.error('[FitShift API] Fatal server startup error:', error.message);
  process.exit(1);
});

export default server;
