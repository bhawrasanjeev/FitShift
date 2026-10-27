import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const parsedPort = parseInt(process.env.PORT, 10);
const port = !isNaN(parsedPort) && parsedPort > 0 && parsedPort <= 65535 ? parsedPort : 5000;

export const config = {
  port,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development'
};

export default config;
