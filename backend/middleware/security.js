import logger from '../src/infrastructure/config/logger.js';
import { config } from '../src/infrastructure/config/config.js';

// Track failed login attempts (in production, use Redis or database)
const failedAttempts = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Account lockout middleware
export const accountLockout = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const attempts = failedAttempts.get(clientIP);

  if (attempts && attempts.count >= MAX_FAILED_ATTEMPTS) {
    const timeSinceLockout = Date.now() - attempts.lockoutTime;
    if (timeSinceLockout < LOCKOUT_DURATION) {
      const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLockout) / 60000); // minutes

      logger.warn('Account lockout triggered', {
        correlationId: req.correlationId,
        clientIP,
        attempts: attempts.count,
        remainingTime: `${remainingTime} minutes`
      });

      return res.status(429).json({
        success: false,
        message: `Account temporarily locked due to too many failed attempts. Try again in ${remainingTime} minutes.`,
        correlationId: req.correlationId,
        retryAfter: remainingTime * 60 // seconds
      });
    } else {
      // Reset lockout after duration
      failedAttempts.delete(clientIP);
    }
  }

  next();
};

// Track failed login attempts
export const trackFailedLogin = (req) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const attempts = failedAttempts.get(clientIP) || { count: 0, lockoutTime: null };

  attempts.count += 1;

  if (attempts.count >= MAX_FAILED_ATTEMPTS) {
    attempts.lockoutTime = Date.now();
    logger.warn('Account locked due to failed attempts', {
      correlationId: req.correlationId,
      clientIP,
      attempts: attempts.count
    });
  }

  failedAttempts.set(clientIP, attempts);

  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
    cleanupOldEntries();
  }
};

// Reset failed attempts on successful login
export const resetFailedAttempts = (req) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  failedAttempts.delete(clientIP);

  logger.info('Failed attempts reset after successful login', {
    correlationId: req.correlationId,
    clientIP
  });
};

// Security headers middleware
export const securityHeaders = (req, res, next) => {
  // Content Security Policy
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.example.com;"
  );

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  res.setHeader('Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), speaker=(), fullscreen=()'
  );

  // HSTS (HTTP Strict Transport Security) - only in production
  if (config.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  next();
};

// Request size limiter with more specific limits
export const requestSizeLimiter = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length']);

  if (contentLength && contentLength > 10 * 1024 * 1024) { // 10MB
    logger.warn('Request too large', {
      correlationId: req.correlationId,
      contentLength,
      url: req.url,
      method: req.method
    });

    return res.status(413).json({
      success: false,
      message: 'Request entity too large',
      correlationId: req.correlationId
    });
  }

  next();
};

// SQL injection and NoSQL injection prevention (additional layer)
export const injectionProtection = (req, res, next) => {
  const suspiciousPatterns = [
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i,
    /(\$where|\$regex|\$ne|\$gt|\$lt|\$in|\$nin)/i, // MongoDB operators
    /(<script|javascript:|on\w+\s*=)/i, // XSS patterns
  ];

  const checkObject = (obj, path = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof value === 'string') {
        for (const pattern of suspiciousPatterns) {
          if (pattern.test(value)) {
            logger.warn('Suspicious input detected', {
              correlationId: req.correlationId,
              field: currentPath,
              pattern: pattern.toString(),
              value: value.substring(0, 100) + (value.length > 100 ? '...' : '')
            });

            return res.status(400).json({
              success: false,
              message: 'Invalid input detected',
              correlationId: req.correlationId
            });
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        const result = checkObject(value, currentPath);
        if (result) return result;
      }
    }
    return null;
  };

  if (req.body) {
    const suspicious = checkObject(req.body);
    if (suspicious) return;
  }

  if (req.query) {
    const suspicious = checkObject(req.query);
    if (suspicious) return;
  }

  next();
};

// Rate limiting with different tiers
export const createRateLimit = (windowMs, maxRequests, message) => {
  const requests = new Map();

  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [ip, timestamps] of requests.entries()) {
      requests.set(ip, timestamps.filter(timestamp => timestamp > windowStart));
      if (requests.get(ip).length === 0) {
        requests.delete(ip);
      }
    }

    // Get current requests for this IP
    const clientRequests = requests.get(clientIP) || [];

    if (clientRequests.length >= maxRequests) {
      logger.warn('Rate limit exceeded', {
        correlationId: req.correlationId,
        clientIP,
        requestCount: clientRequests.length,
        windowMs,
        maxRequests
      });

      return res.status(429).json({
        success: false,
        message: message || 'Too many requests, please try again later',
        correlationId: req.correlationId,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    // Add current request
    clientRequests.push(now);
    requests.set(clientIP, clientRequests);

    next();
  };
};

// Clean up old failed attempt entries
const cleanupOldEntries = () => {
  const now = Date.now();
  for (const [ip, attempts] of failedAttempts.entries()) {
    if (attempts.lockoutTime && (now - attempts.lockoutTime) > LOCKOUT_DURATION * 2) {
      failedAttempts.delete(ip);
    }
  }
};
