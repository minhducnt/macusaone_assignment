import { User, AuthResult, AuthTokens } from '../entities/user-entity';

/**
 * Domain Repository Interface: Authentication
 * Defines the contract for authentication data operations
 */
export interface IAuthRepository {
  /**
   * Authenticate user with email and password
   */
  login(email: string, password: string): Promise<AuthResult>;

  /**
   * Register new user
   */
  register(name: string, email: string, password: string, role?: string): Promise<AuthResult>;

  /**
   * Logout current user
   */
  logout(): Promise<void>;

  /**
   * Get current authentication status
   */
  getAuthStatus(): Promise<AuthResult>;

  /**
   * Refresh authentication tokens
   */
  refreshToken(): Promise<AuthTokens>;

  /**
   * Verify email with token
   */
  verifyEmail(token: string): Promise<void>;

  /**
   * Request password reset
   */
  requestPasswordReset(email: string): Promise<void>;

  /**
   * Reset password with token
   */
  resetPassword(token: string, newPassword: string): Promise<void>;

  /**
   * Change current user's password
   */
  changePassword(currentPassword: string, newPassword: string): Promise<void>;

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<{ name: string; email: string }>): Promise<User>;
}

/**
 * Domain Repository Interface: User Management
 * Defines the contract for user data operations
 */
export interface IUserRepository {
  /**
   * Get user by ID
   */
  getUserById(id: string): Promise<User | null>;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Update user information
   */
  updateUser(user: User): Promise<User>;

  /**
   * Delete user account
   */
  deleteUser(id: string): Promise<void>;

  /**
   * Get users by role
   */
  getUsersByRole(role: string): Promise<User[]>;

  /**
   * Search users
   */
  searchUsers(query: string): Promise<User[]>;
}
