import { createClient } from 'redis';
import { config } from './config.js';
import logger from './logger.js';

let redisClient = null;

// Create Redis client
const createRedisClient = () => {
  if (!config.REDIS_ENABLED) {
    logger.info('Redis is disabled, using in-memory cache');
    return null;
  }

  try {
    const clientOptions = {
      socket: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
      },
      database: config.REDIS_DB,
    };

    // Add password if provided
    if (config.REDIS_PASSWORD) {
      clientOptions.password = config.REDIS_PASSWORD;
    }

    // Use REDIS_URL if provided
    if (config.REDIS_URL) {
      clientOptions.url = config.REDIS_URL;
    }

    const client = createClient(clientOptions);

    // Handle connection events
    client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    client.on('connect', () => {
      logger.info('Connected to Redis');
    });

    client.on('ready', () => {
      logger.info('Redis client ready');
    });

    client.on('end', () => {
      logger.info('Redis connection ended');
    });

    return client;
  } catch (error) {
    logger.error('Failed to create Redis client:', error);
    return null;
  }
};

// Initialize Redis client
export const initRedis = async () => {
  if (!config.REDIS_ENABLED) {
    return false;
  }

  if (redisClient) {
    return true; // Already initialized
  }

  try {
    redisClient = createRedisClient();

    if (!redisClient) {
      return false;
    }

    await redisClient.connect();
    return true;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    redisClient = null;
    return false;
  }
};

// Get Redis client
export const getRedisClient = () => {
  return redisClient;
};

// Close Redis connection
export const closeRedis = async () => {
  if (redisClient) {
    try {
      await redisClient.quit();
      redisClient = null;
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Error closing Redis connection:', error);
    }
  }
};

// Cache operations
export const cache = {
  // Set cache value
  async set(key, value, ttl = config.REDIS_CACHE_TTL) {
    if (!redisClient) return false;

    try {
      const serializedValue = JSON.stringify(value);
      await redisClient.setEx(key, ttl, serializedValue);
      return true;
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  },

  // Get cache value
  async get(key) {
    if (!redisClient) return null;

    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  },

  // Delete cache key
  async del(key) {
    if (!redisClient) return false;

    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  },

  // Check if key exists
  async exists(key) {
    if (!redisClient) return false;

    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  },

  // Set multiple keys
  async mset(keyValuePairs, ttl = config.REDIS_CACHE_TTL) {
    if (!redisClient) return false;

    try {
      const pipeline = redisClient.multi();

      for (const [key, value] of Object.entries(keyValuePairs)) {
        const serializedValue = JSON.stringify(value);
        pipeline.setEx(key, ttl, serializedValue);
      }

      await pipeline.exec();
      return true;
    } catch (error) {
      logger.error('Cache mset error:', error);
      return false;
    }
  },

  // Clear all cache (dangerous - use with caution)
  async clear(pattern = '*') {
    if (!redisClient) return false;

    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
        logger.info(`Cleared ${keys.length} cache keys matching pattern: ${pattern}`);
      }
      return true;
    } catch (error) {
      logger.error(`Cache clear error for pattern ${pattern}:`, error);
      return false;
    }
  },

  // Get cache statistics
  async stats() {
    if (!redisClient) return null;

    try {
      const info = await redisClient.info();
      const stats = {};

      // Parse Redis info
      const lines = info.split('\r\n');
      for (const line of lines) {
        if (line.includes(':')) {
          const [key, value] = line.split(':');
          stats[key] = value;
        }
      }

      return {
        connected_clients: stats.connected_clients,
        used_memory: stats.used_memory_human,
        total_connections_received: stats.total_connections_received,
        total_commands_processed: stats.total_commands_processed,
        uptime_in_seconds: stats.uptime_in_seconds,
      };
    } catch (error) {
      logger.error('Failed to get cache stats:', error);
      return null;
    }
  }
};

// Cache key generators
export const cacheKeys = {
  user: (userId) => `user:${userId}`,
  userProfile: (userId) => `user:profile:${userId}`,
  userFiles: (userId, page = 1, limit = 10) => `user:files:${userId}:${page}:${limit}`,
  file: (fileId) => `file:${fileId}`,
  apiResponse: (method, url, query = '') => `api:${method}:${url}:${query}`,
  userStats: (userId) => `user:stats:${userId}`,
  fileStats: (userId) => `file:stats:${userId}`,
};

// Cache TTL constants
export const cacheTTL = {
  userData: config.CACHE_USER_DATA_TTL,
  fileData: config.CACHE_FILE_DATA_TTL,
  apiResponse: config.CACHE_API_RESPONSE_TTL,
};

export default {
  initRedis,
  getRedisClient,
  closeRedis,
  cache,
  cacheKeys,
  cacheTTL,
};
