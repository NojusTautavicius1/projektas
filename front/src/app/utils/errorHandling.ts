/**
 * Handle API errors consistently across the application
 * @param response - Fetch API response object
 * @param defaultMessage - Default error message if none provided
 * @returns Throws an error with formatted message
 */
export async function handleApiError(response: Response, defaultMessage = "An unknown error occurred"): Promise<never> {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      const message = errorData.message || errorData.error || `HTTP ${response.status}: ${defaultMessage}`;
      throw new Error(message);
    } catch (e) {
      if (e instanceof Error && e.message) {
        throw e;
      }
      throw new Error(`HTTP ${response.status}: ${defaultMessage}`);
    }
  }
  return response as never;
}

/**
 * Safely parse JSON response
 * @param response - Fetch API response object
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed JSON or fallback
 */
export async function safeJsonParse<T = any>(response: Response, fallback: T | null = null): Promise<T | null> {
  try {
    return await response.json();
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return fallback;
  }
}

/**
 * Create a fetch wrapper with error handling
 * @param url - API endpoint
 * @param options - Fetch options
 * @param errorMessage - Custom error message
 * @returns Response with error handling
 */
export async function fetchWithErrorHandling(
  url: string, 
  options: RequestInit = {}, 
  errorMessage = "Request failed"
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    await handleApiError(response, errorMessage);
    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("No connection to server. Please check your internet connection.");
    }
    throw error;
  }
}

/**
 * Extract error message from various error types
 * @param error - Any error object
 * @param defaultMessage - Default message if extraction fails
 * @returns Formatted error message
 */
export function extractErrorMessage(error: any, defaultMessage = "An error occurred"): string {
  if (!error) return defaultMessage;
  
  if (typeof error === "string") return error;
  
  if (error instanceof Error) return error.message;
  
  if (error.message) return error.message;
  
  if (error.error) return error.error;
  
  return defaultMessage;
}

export default {
  handleApiError,
  safeJsonParse,
  fetchWithErrorHandling,
  extractErrorMessage
};
