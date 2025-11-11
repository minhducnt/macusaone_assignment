import { LoginUseCase } from '../../application/use-cases/auth/login-use-case.js';
import { RegisterUseCase } from '../../application/use-cases/auth/register-use-case.js';
import { VerifyEmailUseCase } from '../../application/use-cases/auth/verify-email-use-case.js';

/**
 * Auth Controller
 * Handles HTTP requests for authentication
 */
export class AuthController {
  constructor(loginUseCase, registerUseCase, verifyEmailUseCase) {
    this.loginUseCase = loginUseCase;
    this.registerUseCase = registerUseCase;
    this.verifyEmailUseCase = verifyEmailUseCase;
  }

  async register(req, res) {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      const result = await this.registerUseCase.execute({
        email,
        password,
        firstName,
        lastName,
        role
      });

      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          user: result.user,
          tokens: result.tokens
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await this.loginUseCase.execute({ email, password });

      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.body;

      const result = await this.verifyEmailUseCase.execute({ token });

      res.json({
        success: true,
        message: result.message,
        data: result.user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getStatus(req, res) {
    try {
      // Check if user is authenticated (user attached by optional auth middleware)
      if (req.user) {
        res.json({
          success: true,
          data: {
            user: {
              id: req.user._id,
              email: req.user.email,
              firstName: req.user.firstName,
              lastName: req.user.lastName,
              role: req.user.role,
              avatar: req.user.avatar || null,
              isEmailVerified: req.user.isEmailVerified,
              createdAt: req.user.createdAt
            },
            isAuthenticated: true
          }
        });
      } else {
        res.json({
          success: true,
          data: {
            user: null,
            isAuthenticated: false
          }
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get auth status'
      });
    }
  }

  async getProfile(req, res) {
    try {
      // User info is already attached by auth middleware
      const user = req.user;

      res.json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: user.avatar || null, // Avatar field for future Google OAuth or uploaded images
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get profile'
      });
    }
  }

  async logout(req, res) {
    try {
      // In a stateless JWT system, logout is handled client-side
      // by removing the token. We could implement token blacklisting here.
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }
}
