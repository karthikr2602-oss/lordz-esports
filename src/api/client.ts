/**
 * Lord Esports API Client
 * Resilient API fetcher with token management and automatic fallback support.
 */

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  fallbackData?: T
): Promise<T> {
  const token =
    localStorage.getItem("lordz_player_token") ||
    localStorage.getItem("lordz_admin_token") ||
    localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const json: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(json.message || `Request failed with status ${response.status}`);
    }

    return (json.data !== undefined ? json.data : (json as unknown as T)) as T;
  } catch (error: any) {
    // If a fallback was provided, gracefully return it
    if (fallbackData !== undefined) {
      console.warn(`[API Fallback] ${endpoint} unreachable or error: ${error?.message}. Using static fallback.`);
      return fallbackData;
    }
    throw error;
  }
}
