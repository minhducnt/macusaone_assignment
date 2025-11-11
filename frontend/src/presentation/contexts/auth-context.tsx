'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../../application/services/auth-service';
import { LoginUseCase } from '../../application/use-cases/login-usecase';
import { RegisterUseCase } from '../../application/use-cases/register-usecase';
import { LogoutUseCase } from '../../application/use-cases/logout-usecase';
import { AuthRepository } from '../../infrastructure/repositories/auth-repository';
import { httpClient, authApi } from '../../infrastructure/api';
import { CookieService } from '../../infrastructure/storage/cookie-service';
import { LocalStorageService } from '../../infrastructure/storage/local-storage-service';
import { User } from '../../domain/entities/user-entity';
import { getErrorMessage } from '../../infrastructure/api';
import { logger, generateCorrelationId } from '../../shared/utils';
import { useToast } from '../hooks/use-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Initialize Clean Architecture services
  const authRepository = new AuthRepository();
  const loginUseCase = new LoginUseCase(authRepository);
  const registerUseCase = new RegisterUseCase(authRepository);
  const logoutUseCase = new LogoutUseCase(authRepository);
  const authService = new AuthService(
    authRepository,
    loginUseCase,
    registerUseCase,
    logoutUseCase
  );

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to get stored auth data
        const storedToken = CookieService.getToken() || LocalStorageService.getToken();
        const storedUser = CookieService.getUser() || LocalStorageService.getUser();

        if (storedToken) {
          setToken(storedToken);
          httpClient.setAuthToken(storedToken);
        }

        if (storedUser) {
          setUser(storedUser);
        }

        // If we have a token but no user, try to get user from API
        if (storedToken && !storedUser) {
          try {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
              setUser(currentUser);
              CookieService.setUser(currentUser);
              LocalStorageService.setUser(currentUser);
            }
          } catch (error) {
            // Token might be invalid, clear it
            console.warn('Failed to get current user:', error);
            CookieService.clearAuthCookies();
            LocalStorageService.clearAuthData();
            httpClient.setAuthToken(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Update HTTP client auth token when token changes
  useEffect(() => {
    httpClient.setAuthToken(token);
  }, [token]);

  const login = async (email: string, password: string) => {
    const correlationId = generateCorrelationId();
    const childLogger = logger.withCorrelationId(correlationId);

    try {
      childLogger.info('User login attempt', { email });

      const authResult = await authService.login(email, password);

      setToken(authResult.tokens.accessToken);

      // Store tokens
      CookieService.setToken(authResult.tokens.accessToken);
      LocalStorageService.setToken(authResult.tokens.accessToken);

      if (authResult.tokens.refreshToken) {
        LocalStorageService.setRefreshToken(authResult.tokens.refreshToken);
      }

      // Fetch fresh profile data after successful login
      try {
        childLogger.info('Fetching user profile after login');
        const profileResponse = await authApi.getProfile();

        // Transform the API response to User entity with complete profile data
        const profileUser = User.fromObject({
          id: profileResponse.id,
          name: profileResponse.firstName + ' ' + profileResponse.lastName,
          email: profileResponse.email,
          role: profileResponse.role,
          isActive: true, // Assume active if we got profile data
          avatar: profileResponse.avatar, // Include avatar if available
          lastLogin: new Date(), // Set current time as last login
          updatedAt: new Date(profileResponse.createdAt)
        });

        setUser(profileUser);
        CookieService.setUser(profileUser);
        LocalStorageService.setUser(profileUser);

        childLogger.info('User login and profile fetch successful', {
          userId: profileUser.id,
          role: profileUser.role
        });
      } catch (profileError) {
        // If profile fetch fails, fall back to login response user data
        childLogger.warn('Profile fetch failed after login, using login response data', {
          error: profileError instanceof Error ? profileError.message : String(profileError)
        });

        setUser(authResult.user);
        CookieService.setUser(authResult.user);
        LocalStorageService.setUser(authResult.user);

        childLogger.info('User login successful (fallback)', {
          userId: authResult.user.id,
          role: authResult.user.role
        });
      }
    } catch (error: any) {
      childLogger.error('User login failed', {
        error: error.message,
        email
      });
      throw new Error(getErrorMessage(error));
    }
  };

  const register = async (name: string, email: string, password: string, role?: string) => {
    try {
      const authResult = await authService.register(name, email, password, password, role);

      setToken(authResult.tokens.accessToken);

      // Store tokens
      CookieService.setToken(authResult.tokens.accessToken);
      LocalStorageService.setToken(authResult.tokens.accessToken);

      if (authResult.tokens.refreshToken) {
        LocalStorageService.setRefreshToken(authResult.tokens.refreshToken);
      }

      // Fetch fresh profile data after successful registration
      try {
        logger.info('Fetching user profile after registration');
        const profileResponse = await authApi.getProfile();

        // Transform the API response to User entity with complete profile data
        const profileUser = User.fromObject({
          id: profileResponse.id,
          name: profileResponse.firstName + ' ' + profileResponse.lastName,
          email: profileResponse.email,
          role: profileResponse.role,
          isActive: true, // Assume active if we got profile data
          avatar: profileResponse.avatar, // Include avatar if available
          lastLogin: new Date(), // Set current time as last login
          updatedAt: new Date(profileResponse.createdAt)
        });

        setUser(profileUser);
        CookieService.setUser(profileUser);
        LocalStorageService.setUser(profileUser);

        logger.info('User registration and profile fetch successful', {
          userId: profileUser.id,
          role: profileUser.role
        });
      } catch (profileError) {
        // If profile fetch fails, fall back to registration response user data
        logger.warn('Profile fetch failed after registration, using registration response data', {
          error: profileError instanceof Error ? profileError.message : String(profileError)
        });

        setUser(authResult.user);
        CookieService.setUser(authResult.user);
        LocalStorageService.setUser(authResult.user);

        logger.info('User registration successful (fallback)', {
          userId: authResult.user.id,
          role: authResult.user.role
        });
      }
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  };


  const logout = async () => {
    const correlationId = generateCorrelationId();
    const childLogger = logger.withCorrelationId(correlationId);

    try {
      childLogger.info('User logout initiated', { userId: user?.id });

      await authService.logout();

      childLogger.info('User logout successful');
    } catch (error) {
      // Logout should not fail the operation
      childLogger.warn('Logout API call failed', { error: (error as Error).message });
    } finally {
      // Always clear local state and storage
      setUser(null);
      setToken(null);
      CookieService.clearAuthCookies();
      LocalStorageService.clearAuthData();
      httpClient.setAuthToken(null);

      childLogger.info('Local logout cleanup completed');

      // Show success toast
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
        variant: "default",
      });

      router.push('/login');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
