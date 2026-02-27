/**
 * Handle API errors consistently across the application
 * @param {Response} response - Fetch API response object
 * @param {string} defaultMessage - Default error message if none provided
 * @returns {Promise<never>} - Throws an error with formatted message
 */
export async function handleApiError(response, defaultMessage = "Įvyko nežinoma klaida") {
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
  return response;
}

/**
 * Safely parse JSON response
 * @param {Response} response - Fetch API response object
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {Promise<*>} - Parsed JSON or fallback
 */
export async function safeJsonParse(response, fallback = null) {
  try {
    return await response.json();
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return fallback;
  }
}

/**
 * Create a fetch wrapper with error handling
 * @param {string} url - API endpoint
 * @param {RequestInit} options - Fetch options
 * @param {string} errorMessage - Custom error message
 * @returns {Promise<Response>} - Response with error handling
 */
export async function fetchWithErrorHandling(url, options = {}, errorMessage = "Užklausa nepavyko") {
  try {
    const response = await fetch(url, options);
    await handleApiError(response, errorMessage);
    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Nėra ryšio su serveriu. Patikrinkite interneto ryšį.");
    }
    throw error;
  }
}

/**
 * Extract error message from various error types
 * @param {*} error - Any error object
 * @param {string} defaultMessage - Default message if extraction fails
 * @returns {string} - Formatted error message
 */
export function extractErrorMessage(error, defaultMessage = "Įvyko klaida") {
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
