import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tryDecodeResponsePayload } from '../utils/crypto';

// Dynamic getter for base URL and admin token
export function getApiBaseUrl(): string {
  return localStorage.getItem('gmail_ai_api_base_url') || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';
}

export function getAdminApiToken(): string {
  return localStorage.getItem('gmail_ai_admin_token') || import.meta.env.VITE_ADMIN_API_TOKEN || '';
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
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor: attach base URL, dynamic timeout, and optional X-Admin-Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.baseURL = getApiBaseUrl().replace(/\/+$/, '');
    if (!config.timeout || config.timeout === 60000) {
      config.timeout = getApiTimeoutMs();
    }
    const token = getAdminApiToken();
    if (token) {
      config.headers.set('X-Admin-Token', token);
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
  (error: AxiosError) => {
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
