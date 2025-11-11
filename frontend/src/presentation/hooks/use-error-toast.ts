import { useToast } from './use-toast';

/**
 * Custom hook for showing error toasts with user-friendly messages
 */
export function useErrorToast() {
  const { toast } = useToast();

  const showError = (
    title: string,
    error: any,
    duration: number = 6000
  ) => {
    console.error(`${title}:`, error); // Debug logging

    // Provide user-friendly error messages
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error?.message) {
      const message = error.message.toLowerCase();

      // Handle specific error cases
      if (message.includes('invalid credentials') || message.includes('invalid email or password')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (message.includes('account is deactivated')) {
        errorMessage = 'Your account has been deactivated. Please contact support.';
      } else if (message.includes('please verify your email')) {
        errorMessage = 'Please verify your email address before logging in.';
      } else if (message.includes('email already registered') || message.includes('email already exists')) {
        errorMessage = 'This email is already registered. Please use a different email or try logging in.';
      } else if (message.includes('invalid email format')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (message.includes('password must be') || message.includes('password does not meet')) {
        errorMessage = 'Password does not meet security requirements. Please use a stronger password.';
      } else if (message.includes('first name') || message.includes('last name')) {
        errorMessage = 'Please provide both first and last names.';
      } else if (message.includes('network error') || message.includes('connection')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (message.includes('too many attempts') || message.includes('rate limit')) {
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
      } else if (message.includes('unauthorized') || message.includes('not authorized')) {
        errorMessage = 'You are not authorized to perform this action.';
      } else if (message.includes('not found')) {
        errorMessage = 'The requested resource was not found.';
      } else if (message.includes('server error') || message.includes('internal server')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (message.includes('validation error')) {
        errorMessage = 'Please check your input and try again.';
      } else {
        // Use the original error message if it's user-friendly and not too technical
        const originalMessage = error.message;
        if (originalMessage.length < 100 && !originalMessage.includes('stack') && !originalMessage.includes('Error:')) {
          errorMessage = originalMessage;
        }
      }
    }

    toast({
      title,
      description: errorMessage,
      variant: 'destructive',
      duration,
    });
  };

  const showNetworkError = () => {
    showError(
      'Connection Error',
      { message: 'Network error - please check your connection' },
      5000
    );
  };

  const showServerError = () => {
    showError(
      'Server Error',
      { message: 'Server error - please try again later' },
      5000
    );
  };

  const showValidationError = (message: string = 'Please check your input and try again') => {
    showError(
      'Validation Error',
      { message },
      4000
    );
  };

  return {
    showError,
    showNetworkError,
    showServerError,
    showValidationError,
  };
}
