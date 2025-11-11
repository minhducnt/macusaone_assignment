import { useToast } from './use-toast';
import { useCallback, useRef } from 'react';

/**
 * Enhanced toast hook with loading states, progress indicators, and better UX
 */
export function useEnhancedToast() {
  const { toast, dismiss } = useToast();
  const loadingToastsRef = useRef<Map<string, { dismiss: () => void }>>(new Map());

  /**
   * Show a loading toast
   */
  const showLoading = useCallback((title: string, description?: string) => {
    const loadingToast = toast({
      title,
      description,
      variant: 'loading',
      duration: Infinity, // Loading toasts don't auto-dismiss
    });

    loadingToastsRef.current.set(title, loadingToast);
    return loadingToast;
  }, [toast]);

  /**
   * Update a loading toast to success
   */
  const updateToSuccess = useCallback((
    loadingTitle: string,
    successTitle: string,
    successDescription?: string,
    duration: number = 4000
  ) => {
    const loadingToast = loadingToastsRef.current.get(loadingTitle);
    if (loadingToast) {
      loadingToast.update({
        title: successTitle,
        description: successDescription,
        variant: 'success',
      });

      // Auto-dismiss after success duration
      setTimeout(() => {
        loadingToast.dismiss();
        loadingToastsRef.current.delete(loadingTitle);
      }, duration);
    }
  }, []);

  /**
   * Update a loading toast to error
   */
  const updateToError = useCallback((
    loadingTitle: string,
    errorTitle: string,
    errorDescription?: string,
    duration: number = 6000
  ) => {
    const loadingToast = loadingToastsRef.current.get(loadingTitle);
    if (loadingToast) {
      loadingToast.update({
        title: errorTitle,
        description: errorDescription,
        variant: 'destructive',
      });

      // Auto-dismiss after error duration
      setTimeout(() => {
        loadingToast.dismiss();
        loadingToastsRef.current.delete(loadingTitle);
      }, duration);
    }
  }, []);

  /**
   * Dismiss a loading toast
   */
  const dismissLoading = useCallback((title: string) => {
    const loadingToast = loadingToastsRef.current.get(title);
    if (loadingToast) {
      loadingToast.dismiss();
      loadingToastsRef.current.delete(title);
    }
  }, []);

  /**
   * Show a success toast with enhanced styling
   */
  const showSuccess = useCallback((
    title: string,
    description?: string,
    duration: number = 4000
  ) => {
    return toast({
      title,
      description,
      variant: 'success',
      duration,
    });
  }, [toast]);

  /**
   * Show an error toast with enhanced styling
   */
  const showError = useCallback((
    title: string,
    description?: string,
    duration: number = 6000
  ) => {
    return toast({
      title,
      description,
      variant: 'destructive',
      duration,
    });
  }, [toast]);

  /**
   * Show a warning toast
   */
  const showWarning = useCallback((
    title: string,
    description?: string,
    duration: number = 5000
  ) => {
    return toast({
      title,
      description,
      variant: 'warning',
      duration,
    });
  }, [toast]);

  /**
   * Show an info toast
   */
  const showInfo = useCallback((
    title: string,
    description?: string,
    duration: number = 5000
  ) => {
    return toast({
      title,
      description,
      variant: 'info',
      duration,
    });
  }, [toast]);

  /**
   * Show a toast with action buttons
   */
  const showActionToast = useCallback((
    title: string,
    description: string,
    actionLabel: string,
    onAction: () => void,
    variant: 'default' | 'destructive' | 'success' | 'warning' | 'info' = 'default',
    duration: number = 8000
  ) => {
    return toast({
      title,
      description,
      variant,
      duration,
      action: (
        <button
          onClick={() => {
            onAction();
            dismiss(); // Dismiss the toast after action
          }}
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {actionLabel}
        </button>
      ),
    });
  }, [toast, dismiss]);

  /**
   * Show a confirmation toast that requires user action
   */
  const showConfirmation = useCallback((
    title: string,
    description: string,
    confirmLabel: string = 'Confirm',
    cancelLabel: string = 'Cancel',
    onConfirm: () => void,
    onCancel?: () => void,
    variant: 'default' | 'destructive' | 'warning' = 'warning'
  ) => {
    return toast({
      title,
      description,
      variant,
      duration: Infinity, // Don't auto-dismiss confirmation toasts
      action: (
        <div className="flex gap-2">
          <button
            onClick={() => {
              onConfirm();
              dismiss();
            }}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {confirmLabel}
          </button>
          <button
            onClick={() => {
              onCancel?.();
              dismiss();
            }}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium text-muted-foreground ring-offset-background transition-colors hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        </div>
      ),
    });
  }, [toast, dismiss]);

  return {
    // Basic toasts
    showSuccess,
    showError,
    showWarning,
    showInfo,

    // Loading states
    showLoading,
    updateToSuccess,
    updateToError,
    dismissLoading,

    // Advanced toasts
    showActionToast,
    showConfirmation,

    // Direct access to base toast
    toast,
    dismiss,
  };
}
