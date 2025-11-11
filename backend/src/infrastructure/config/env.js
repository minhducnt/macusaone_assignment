import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment-specific configuration
const loadEnvironmentConfig = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Define environment file paths (kebab-case naming)
  const envFiles = {
    development: path.join(__dirname, '../../../env/development.env'),
    production: path.join(__dirname, '../../../env/production.env'),
    staging: path.join(__dirname, '../../../env/staging.env'),
    test: path.join(__dirname, '../../../env/development.env'), // Use dev config for tests
  };

  const envFile = envFiles[nodeEnv];

  // Check if environment file exists
  if (fs.existsSync(envFile)) {
    console.log(`Loading environment config: ${envFile} (NODE_ENV=${nodeEnv})`);
    dotenv.config({ path: envFile });
  } else {
    console.warn(`Environment file not found: ${envFile}`);
    console.warn(`Make sure you have created the environment file or set environment variables manually`);
    console.log(`Loading environment variables from system`);
    dotenv.config(); // Load from process.env
  }

  // Validate critical environment variables
  const requiredVars = ['JWT_SECRET'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    console.error(`Please check your environment configuration`);
    process.exit(1);
  }

  // Set NODE_ENV if not already set
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = nodeEnv;
  }

  // Import logger after environment is loaded to avoid circular dependencies
  import('./logger.js').then(({ default: logger }) => {
    logger.info(`Environment loaded: ${nodeEnv.toUpperCase()}`);
  }).catch(err => {
    console.log(`Environment loaded: ${nodeEnv.toUpperCase()} (logger not available)`);
  });
};

// Export the loader function
export { loadEnvironmentConfig };

// Auto-load environment configuration when this module is imported
loadEnvironmentConfig();
