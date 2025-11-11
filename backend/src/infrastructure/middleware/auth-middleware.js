import { TokenService } from '../../shared/services/token-service.js';
import { UserRepository } from '../repositories/user-repository.js';
import UserModel from '../models/user-model.js';

/**
 * Authentication Middleware
 * Handles JWT token verification and user authentication
 */
export class AuthMiddleware {
  constructor() {
    this.tokenService = new TokenService();
    this.userRepository = new UserRepository(UserModel);
  }

  /**
   * Authenticate user using JWT token
   */
  authenticate = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access token is required'
        });
      }

      // Verify token
      const decoded = this.tokenService.verifyToken(token);

      // Find user
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  };

  /**
   * Authorize admin users only
   */
  requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    next();
  };

  /**
   * Authorize manager and admin users
   */
  requireManager = (req, res, next) => {
    if (!['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Manager access required'
      });
    }
    next();
  };

  /**
   * Authorize based on resource ownership or admin access
   */
  authorizeSelfOrAdmin = (req, res, next) => {
    const resourceId = req.params.id;
    const isOwner = req.user._id.toString() === resourceId;
    const isAdmin = req.user.role === 'admin';
    const isManager = req.user.role === 'manager';

    if (!isOwner && !isAdmin && !isManager) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    next();
  };

  /**
   * Optional authentication - doesn't fail if no token
   */
  optionalAuth = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;

      if (token) {
        const decoded = this.tokenService.verifyToken(token);
        const user = await this.userRepository.findById(decoded.userId);

        if (user && user.isActive) {
          req.user = user;
        }
      }
    } catch (error) {
      // Silently ignore auth errors for optional auth
    }

    next();
  };
}

// Export middleware functions
const authMiddleware = new AuthMiddleware();

export const authenticate = authMiddleware.authenticate;
export const requireAdmin = authMiddleware.requireAdmin;
export const requireManager = authMiddleware.requireManager;
export const authorizeSelfOrAdmin = authMiddleware.authorizeSelfOrAdmin;
export const optionalAuth = authMiddleware.optionalAuth;
