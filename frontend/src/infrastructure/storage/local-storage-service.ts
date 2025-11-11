import { User, AuthTokens } from '../../domain/entities/user-entity';

/**
 * Infrastructure Service: Local Storage
 * Handles browser local storage and session storage operations
 */
export class LocalStorageService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'auth_user';
  private static readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';
  private static readonly THEME_KEY = 'theme';

  /**
   * Token operations
   */
  static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.warn('Failed to store token:', error);
    }
  }

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.warn('Failed to retrieve token:', error);
      return null;
    }
  }

  static removeToken(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.warn('Failed to remove token:', error);
    }
  }

  /**
   * User operations
   */
  static setUser(user: User): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user.toObject()));
    } catch (error) {
      console.warn('Failed to store user:', error);
    }
  }

  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      if (!userData) return null;

      const userObj = JSON.parse(userData);
      return User.fromObject(userObj);
    } catch (error) {
      console.warn('Failed to retrieve user:', error);
      return null;
    }
  }

  static removeUser(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.warn('Failed to remove user:', error);
    }
  }

  /**
   * Refresh token operations
   */
  static setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.warn('Failed to store refresh token:', error);
    }
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.warn('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  static removeRefreshToken(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.warn('Failed to remove refresh token:', error);
    }
  }

  /**
   * Theme operations
   */
  static setTheme(theme: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.THEME_KEY, theme);
    } catch (error) {
      console.warn('Failed to store theme:', error);
    }
  }

  static getTheme(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(this.THEME_KEY);
    } catch (error) {
      console.warn('Failed to retrieve theme:', error);
      return null;
    }
  }

  /**
   * Clear all authentication data
   */
  static clearAuthData(): void {
    this.removeToken();
    this.removeUser();
    this.removeRefreshToken();
  }

  /**
   * Clear all data
   */
  static clearAll(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}
