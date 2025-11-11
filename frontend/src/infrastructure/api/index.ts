// Export everything from the API layer
export * from './types';
export * from './errors';
export { httpClient, HttpClient } from './client';
export { AuthApiService, authApi } from './auth';

// Re-export commonly used types and utilities
export type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ApiError,
  ApiException
} from './types';

export {
  handleApiError,
  getErrorMessage,
  createErrorResponse,
  logApiError
} from './errors';
