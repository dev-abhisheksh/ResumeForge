import { toast, ExternalToast } from "sonner";

/**
 * Custom options type for toast notifications.
 * Extends Sonner's ExternalToast for full flexibility.
 */
export type ToastOptions = ExternalToast;

/**
 * Production-ready reusable toast utility wrapper for ResumeForge.
 * Standardizes notification calls across the entire application.
 */
export const notify = {
  /**
   * Display a success toast notification.
   */
  success: (message: string, description?: string, options?: ToastOptions) => {
    return toast.success(message, { description, ...options });
  },

  /**
   * Display an error toast notification.
   */
  error: (message: string, description?: string, options?: ToastOptions) => {
    return toast.error(message, { description, ...options });
  },

  /**
   * Display a warning toast notification.
   */
  warning: (message: string, description?: string, options?: ToastOptions) => {
    return toast.warning(message, { description, ...options });
  },

  /**
   * Display an info toast notification.
   */
  info: (message: string, description?: string, options?: ToastOptions) => {
    return toast.info(message, { description, ...options });
  },

  /**
   * Display a loading toast notification.
   */
  loading: (message: string, description?: string, options?: ToastOptions) => {
    return toast.loading(message, { description, ...options });
  },

  /**
   * Handle an asynchronous Promise with automatic loading, success, and error states.
   */
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
    options?: ToastOptions
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      ...options,
    });
  },

  /**
   * Dismiss a specific active toast by ID or all active toasts.
   */
  dismiss: (toastId?: string | number) => {
    return toast.dismiss(toastId);
  },
};

// Re-export standard toast for direct usage
export { toast };
