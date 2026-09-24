/**
 * Lord Esports API Client
 * Resilient API fetcher with token management and automatic fallback support.
 */

const defaultBase =
  typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1"
    ? "https://lordz-esportsserver.vercel.app/api"
    : "/api";

const rawBase = (import.meta.env.VITE_API_URL || defaultBase).trim().replace(/\/+$/, "");
export const API_BASE =
  rawBase.startsWith("http") && !rawBase.includes("/api")
    ? `${rawBase}/api`
    : rawBase;

export function getApiUrl(endpoint: string): string {
  if (endpoint.startsWith("http")) return endpoint;
  const clean = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE}${clean}`;
}

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
    localStorage.getItem("lordz_admin_token") ||
    localStorage.getItem("token") ||
    (import.meta.env.DEV ? "demo-admin-token" : null);

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

    const contentType = response.headers.get("content-type") || "";
    let json: ApiResponse<T>;
    if (contentType.includes("application/json")) {
      json = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Server returned status ${response.status} (${response.statusText}): ${text.slice(0, 120)}`);
    }

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
