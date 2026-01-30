/**
 * Standardized Error Handling
 * Consistent error handling across the application
 */

import { toast } from "sonner";

export type ErrorSeverity = "info" | "warning" | "error" | "fatal";

export interface AppError {
  message: string;
  code?: string;
  severity: ErrorSeverity;
  context?: Record<string, unknown>;
}

/**
 * Handle errors consistently across the app
 * @param error The error to handle
 * @param showToast Whether to show a toast notification
 * @param logToConsole Whether to log to console
 */
export function handleError(
  error: unknown,
  showToast = true,
  logToConsole = true
): AppError {
  const appError = normalizeError(error);

  if (logToConsole) {
    console.error("[App Error]", appError);
  }

  if (showToast) {
    const toastFn = {
      info: toast.info,
      warning: toast.warning,
      error: toast.error,
      fatal: toast.error,
    }[appError.severity];

    toastFn(appError.message);
  }

  return appError;
}

/**
 * Normalize different error types to AppError
 */
function normalizeError(error: unknown): AppError {
  if (error instanceof Error) {
    return {
      message: error.message,
      severity: "error",
      context: { stack: error.stack },
    };
  }

  if (typeof error === "string") {
    return { message: error, severity: "error" };
  }

  if (error && typeof error === "object") {
    const err = error as Record<string, unknown>;
    return {
      message: String(err.message ?? err.error ?? "Unknown error"),
      code: String(err.code ?? ""),
      severity: (err.severity as ErrorSeverity) ?? "error",
      context: err,
    };
  }

  return { message: "An unexpected error occurred", severity: "error" };
}

/**
 * Async wrapper with error handling
 * @param fn Async function to wrap
 * @param errorMessage Fallback error message
 * @returns Tuple of [data, error]
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorMessage = "Operation failed"
): Promise<[T | null, AppError | null]> {
  try {
    const data = await fn();
    return [data, null];
  } catch (error) {
    const appError = handleError(error, false, true);
    const finalError = appError.message === "Unknown error" 
      ? { ...appError, message: errorMessage } 
      : appError;
    return [null, finalError];
  }
}

/**
 * Game-specific error handler with user-friendly messages
 */
export function handleGameError(error: unknown, gameName: string): void {
  const message = error instanceof Error ? error.message : String(error);
  
  // User-friendly error messages
  const friendlyMessages: Record<string, string> = {
    "Room not found": "Game session expired. Returning to lobby...",
    "Room is full": "This game is full. Try another one!",
    "Too many requests": "Slow down! Try again in a moment.",
    "Failed to fetch": "Connection issue. Check your internet.",
  };

  const userMessage = friendlyMessages[message] ?? `${gameName}: ${message}`;
  
  toast.error(userMessage);
  console.error(`[${gameName} Error]`, error);
}
