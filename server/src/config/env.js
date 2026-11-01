import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env file or root .env
const serverEnvPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else {
  dotenv.config();
}

const parsedPort = parseInt(process.env.PORT, 10);
const port = !isNaN(parsedPort) && parsedPort > 0 && parsedPort <= 65535 ? parsedPort : 5000;

const defaultDataDir = path.resolve(__dirname, '../../data');
const dataDir = process.env.DATA_DIR || defaultDataDir;

/**
 * Resolves the food prices file path.
 * Checks for price_of_food_items.csv first, falling back to price.csv.
 */
function resolveFoodPricesPath(baseDir) {
  if (process.env.FOOD_PRICES_DATA_PATH) {
    return path.resolve(process.env.FOOD_PRICES_DATA_PATH);
  }
  const standardName = path.resolve(baseDir, 'raw/price_of_food_items.csv');
  if (fs.existsSync(standardName)) {
    return standardName;
  }
  return path.resolve(baseDir, 'raw/price.csv');
}

export const config = {
  port,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
  dataDir,
  dataPaths: {
    exercises: process.env.EXERCISES_DATA_PATH || path.resolve(dataDir, 'raw/exercises.json'),
    foodPrices: resolveFoodPricesPath(dataDir),
    cleanStaples: process.env.CLEAN_STAPLES_DATA_PATH || path.resolve(dataDir, 'processed/clean_staples.csv'),
    nutrition: process.env.NUTRITION_DATA_PATH || path.resolve(dataDir, 'raw/nutrition.csv')
  }
};

export default config;
