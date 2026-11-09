import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tryDecodeResponsePayload } from '../utils/crypto';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// Dynamic getter for the server URL. Authentication is a short-lived session token.
export function getApiBaseUrl(): string {
  if (import.meta.env.PROD) return '';
  return localStorage.getItem('gmail_ai_api_base_url') || import.meta.env.VITE_API_BASE_URL || '';
}

export function isDemoModeEnabled(): boolean {
  const val = localStorage.getItem('gmail_ai_demo_mode');
  return val === 'true';
}

export function getApiTimeoutMs(): number {
  const saved = localStorage.getItem('gmail_ai_api_timeout');
  if (saved) {
    const parsed = parseInt(saved, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed * 1000;
  }
  const envVal = import.meta.env.VITE_API_TIMEOUT;
  if (envVal) {
    const parsed = parseInt(envVal, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed * 1000;
  }
  return 60000; // 60 seconds default to allow Gmail API batch fetch
}

export const apiClient = axios.create({
  timeout: 60000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let refreshPromise: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    const baseUrl = getApiBaseUrl().replace(/\/+$/, '');
    refreshPromise = axios
      .post<{ accessToken?: string }>(
        `${baseUrl}/auth/refresh`,
        {},
        { withCredentials: true },
      )
      .then(({ data }) => {
        if (!data.accessToken) {
          throw new Error('Refresh response did not contain an access token');
        }
        sessionStorage.setItem('gmail_ai_access_token', data.accessToken);
        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// Request interceptor: attach base URL, dynamic timeout, and the in-memory-tab session token.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.baseURL = getApiBaseUrl().replace(/\/+$/, '');
    if (!config.timeout || config.timeout === 60000) {
      config.timeout = getApiTimeoutMs();
    }
    const token = sessionStorage.getItem('gmail_ai_access_token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor: handle encrypted response or { success, data } wrapping
apiClient.interceptors.response.use(
  (response) => {
    // If response.data contains an encrypted data field or wrapper
    if (response.data) {
      response.data = tryDecodeResponsePayload(response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';
    const isPublicAuthRequest =
      /\/auth\/(?:refresh|admin\/login|otp\/request|otp\/verify)(?:$|\?)/.test(
        requestUrl,
      );

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isPublicAuthRequest
    ) {
      originalRequest._retry = true;
      try {
        const accessToken = await refreshAccessToken();
        originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);
        return apiClient(originalRequest);
      } catch {
        sessionStorage.removeItem('gmail_ai_access_token');
      }
    }

    // Enhance error message for consumer
    let friendlyMessage = error.message;
    if (error.response?.data && typeof error.response.data === 'object') {
      const dataObj = error.response.data as Record<string, unknown>;
      if (dataObj.message && typeof dataObj.message === 'string') {
        friendlyMessage = dataObj.message;
      } else if (dataObj.error && typeof dataObj.error === 'string') {
        friendlyMessage = dataObj.error;
      }
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      friendlyMessage = `Request timed out (${Math.round(getApiTimeoutMs() / 1000)}s). The Gmail AI backend might still be synchronizing or querying Gmail messages. You can increase the timeout in Settings.`;
    } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      friendlyMessage = 'Unable to connect to Gmail AI backend at ' + getApiBaseUrl() + '. Check if backend is running or toggle Demo Mode.';
    }

    return Promise.reject(new Error(friendlyMessage));
  }
);
