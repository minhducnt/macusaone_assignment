import { cache, cacheKeys } from './redis.js';
import logger from './logger.js';

class APIMonitor {
  constructor() {
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTimes: [],
      endpoints: new Map(),
      statusCodes: new Map(),
    };

    this.resetInterval = 5 * 60 * 1000; // Reset every 5 minutes
    this.maxResponseTimes = 1000; // Keep last 1000 response times

    // Auto-reset metrics periodically
    setInterval(() => {
      this.resetMetrics();
    }, this.resetInterval);
  }

  // Record API request
  recordRequest(req, res, responseTime) {
    this.metrics.requests++;

    // Record endpoint statistics
    const endpoint = `${req.method} ${req.route?.path || req.path}`;
    if (!this.metrics.endpoints.has(endpoint)) {
      this.metrics.endpoints.set(endpoint, {
        count: 0,
        totalTime: 0,
        avgTime: 0,
        errors: 0,
      });
    }

    const endpointStats = this.metrics.endpoints.get(endpoint);
    endpointStats.count++;
    endpointStats.totalTime += responseTime;
    endpointStats.avgTime = endpointStats.totalTime / endpointStats.count;

    // Record status code
    const statusCode = res.statusCode || 200;
    this.metrics.statusCodes.set(statusCode, (this.metrics.statusCodes.get(statusCode) || 0) + 1);

    // Record response time
    this.metrics.responseTimes.push(responseTime);
    if (this.metrics.responseTimes.length > this.maxResponseTimes) {
      this.metrics.responseTimes.shift(); // Remove oldest
    }

    // Record error if status code >= 400
    if (statusCode >= 400) {
      this.metrics.errors++;
      endpointStats.errors++;
    }
  }

  // Get current metrics
  getMetrics() {
    const responseTimes = [...this.metrics.responseTimes].sort((a, b) => a - b);
    const totalResponseTime = responseTimes.reduce((sum, time) => sum + time, 0);

    return {
      timestamp: new Date().toISOString(),
      period: `${this.resetInterval / 1000 / 60} minutes`,
      summary: {
        totalRequests: this.metrics.requests,
        totalErrors: this.metrics.errors,
        errorRate: this.metrics.requests > 0 ? (this.metrics.errors / this.metrics.requests * 100).toFixed(2) : 0,
        averageResponseTime: responseTimes.length > 0 ? (totalResponseTime / responseTimes.length).toFixed(2) : 0,
        medianResponseTime: responseTimes.length > 0 ? responseTimes[Math.floor(responseTimes.length / 2)] : 0,
        p95ResponseTime: responseTimes.length > 0 ? responseTimes[Math.floor(responseTimes.length * 0.95)] : 0,
        p99ResponseTime: responseTimes.length > 0 ? responseTimes[Math.floor(responseTimes.length * 0.99)] : 0,
      },
      endpoints: Object.fromEntries(this.metrics.endpoints),
      statusCodes: Object.fromEntries(this.metrics.statusCodes),
    };
  }

  // Reset metrics
  resetMetrics() {
    logger.info('Resetting API monitoring metrics');
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTimes: [],
      endpoints: new Map(),
      statusCodes: new Map(),
    };
  }

  // Cache metrics (optional)
  async cacheMetrics() {
    if (!cache) return;

    try {
      const metrics = this.getMetrics();
      await cache.set(cacheKeys.apiResponse('GET', '/metrics'), metrics, 300); // Cache for 5 minutes
    } catch (error) {
      logger.error('Failed to cache metrics:', error);
    }
  }
}

// Create singleton instance
const apiMonitor = new APIMonitor();

// Middleware to monitor API requests
export const monitorMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(...args) {
    const responseTime = Date.now() - startTime;
    apiMonitor.recordRequest(req, res, responseTime);
    originalEnd.apply(this, args);
  };

  next();
};

// Health check with metrics
export const getHealthWithMetrics = (req, res) => {
  const metrics = apiMonitor.getMetrics();

  const healthData = {
    status: 'OK',
    message: 'Server is running',
    correlationId: req.correlationId,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    port: process.env.PORT || '5000',
    jwtSecret: process.env.JWT_SECRET,
    mongodbUri: process.env.MONGODB_URI,
    metrics: {
      requests: metrics.summary.totalRequests,
      errorRate: metrics.summary.errorRate,
      avgResponseTime: metrics.summary.averageResponseTime,
    },
  };

  if (res) {
    res.json(healthData);
  }

  return healthData;
};

// Helper function to get health data for dashboard
export const getHealthData = () => {
  const metrics = apiMonitor.getMetrics();

  return {
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    metrics: {
      requests: metrics.summary.totalRequests,
      errorRate: metrics.summary.errorRate,
      avgResponseTime: metrics.summary.averageResponseTime,
    },
  };
};

// Get detailed metrics (admin only)
export const getDetailedMetrics = (req, res) => {
  const metrics = apiMonitor.getMetrics();

  res.json({
    success: true,
    correlationId: req.correlationId,
    data: {
      metrics,
    },
  });
};

// Reset metrics (admin only)
export const resetMetrics = (req, res) => {
  apiMonitor.resetMetrics();

  res.json({
    success: true,
    message: 'Metrics reset successfully',
    correlationId: req.correlationId,
  });
};

export default {
  monitorMiddleware,
  getHealthWithMetrics,
  getDetailedMetrics,
  resetMetrics,
  apiMonitor,
};
