import mongoose from 'mongoose';
import logger from './logger.js';
import { config } from './config.js';

const connectDB = async (retryCount = 0) => {
  const maxRetries = 5;
  const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff, max 30s

  try {
    logger.database(`Attempting to connect to MongoDB... (attempt ${retryCount + 1}/${maxRetries})`);

    const conn = await mongoose.connect(config.MONGODB_URI, {
      // Modern MongoDB driver configuration
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      family: 4 // Use IPv4, skip trying IPv6
    });

    logger.info(`MongoDB Connected Successfully to ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);

    // Handle connection events for better monitoring
    mongoose.connection.on('error', (error) => {
      logger.error(`MongoDB Connection Error: ${error.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB Disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB Reconnected');
    });

    return conn;
  } catch (error) {
    logger.error(`MongoDB Connection Failed (attempt ${retryCount + 1}/${maxRetries}): ${error.message}`);

    if (retryCount < maxRetries) {
      logger.warn(`Retrying MongoDB connection in ${retryDelay}ms... (${maxRetries - retryCount - 1} attempts remaining)`);
      setTimeout(() => connectDB(retryCount + 1), retryDelay);
    } else {
      logger.error(`MongoDB Connection Failed - Max retries (${maxRetries}) exceeded`);
      logger.error('CRITICAL: Database connection required for application startup - exiting');
      process.exit(1);
    }
  }
};

export default connectDB;
