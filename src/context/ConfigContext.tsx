import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/axios';

interface ConfigContextType {
  apiBaseUrl: string;
  apiTimeoutSeconds: number;
  isDemoMode: boolean;
  isBackendOnline: boolean | null;
  isCheckingHealth: boolean;
  setApiBaseUrl: (url: string) => void;
  setApiTimeoutSeconds: (seconds: number) => void;
  setIsDemoMode: (enabled: boolean) => void;
  checkBackendHealth: () => Promise<boolean>;
  resetToDefaults: () => void;
}

const DEFAULT_BASE_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_BASE_URL || '');
const DEFAULT_TIMEOUT_SECONDS = 60;

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiBaseUrl, setApiBaseUrlState] = useState<string>(() => {
    if (import.meta.env.PROD) return '';
    return localStorage.getItem('gmail_ai_api_base_url') || DEFAULT_BASE_URL;
  });


  const [apiTimeoutSeconds, setApiTimeoutSecondsState] = useState<number>(() => {
    const saved = localStorage.getItem('gmail_ai_api_timeout');
    if (saved) {
      const val = parseInt(saved, 10);
      if (!isNaN(val) && val > 0) return val;
    }
    return DEFAULT_TIMEOUT_SECONDS;
  });

  const [isDemoMode, setIsDemoModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('gmail_ai_demo_mode');
    return saved !== null ? saved === 'true' : false;
  });

  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(false);

  const setApiBaseUrl = (url: string) => {
    const nextUrl = import.meta.env.PROD ? '' : url;
    setApiBaseUrlState(nextUrl);
    if (nextUrl) {
      localStorage.setItem('gmail_ai_api_base_url', nextUrl);
    } else {
      localStorage.removeItem('gmail_ai_api_base_url');
    }
  };


  const setApiTimeoutSeconds = (seconds: number) => {
    setApiTimeoutSecondsState(seconds);
    localStorage.setItem('gmail_ai_api_timeout', String(seconds));
  };

  const setIsDemoMode = (enabled: boolean) => {
    setIsDemoModeState(enabled);
    localStorage.setItem('gmail_ai_demo_mode', String(enabled));
  };

  const checkBackendHealth = useCallback(async (): Promise<boolean> => {
    setIsCheckingHealth(true);
    try {
      const response = await apiClient.get('/auth/me', { timeout: 3000 });
      const online = response.status >= 200 && response.status < 400;
      setIsBackendOnline(online);
      setIsCheckingHealth(false);
      return online;
    } catch {
      setIsBackendOnline(false);
      setIsCheckingHealth(false);
      return false;
    }
  }, [apiBaseUrl]);

  // Initial silent check on mount
  useEffect(() => {
    let mounted = true;
    checkBackendHealth().then((online) => {
      if (mounted) {
        // If not online and user hasn't explicitly set demo mode preference, turn on demo mode gracefully
        if (!online && localStorage.getItem('gmail_ai_demo_mode') === null) {
          setIsDemoModeState(true);
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, [checkBackendHealth]);

  const resetToDefaults = () => {
    setApiBaseUrl(DEFAULT_BASE_URL);
    setApiTimeoutSeconds(DEFAULT_TIMEOUT_SECONDS);
    setIsDemoMode(false);
    checkBackendHealth();
  };

  return (
    <ConfigContext.Provider
      value={{
        apiBaseUrl,
        apiTimeoutSeconds,
        isDemoMode,
        isBackendOnline,
        isCheckingHealth,
        setApiBaseUrl,
        setApiTimeoutSeconds,
        setIsDemoMode,
        checkBackendHealth,
        resetToDefaults,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
