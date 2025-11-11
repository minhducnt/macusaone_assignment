// Re-export auth context from presentation layer
// This maintains the public API while keeping Clean Architecture structure
export { AuthProvider, useAuth } from '../presentation/contexts/auth-context';

