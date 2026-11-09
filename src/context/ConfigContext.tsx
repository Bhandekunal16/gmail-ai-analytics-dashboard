import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface ConfigContextType {
  apiBaseUrl: string;
  adminApiToken: string;
  isDemoMode: boolean;
  isBackendOnline: boolean | null;
  isCheckingHealth: boolean;
  setApiBaseUrl: (url: string) => void;
  setAdminApiToken: (token: string) => void;
  setIsDemoMode: (enabled: boolean) => void;
  checkBackendHealth: () => Promise<boolean>;
  resetToDefaults: () => void;
}

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';
const DEFAULT_TOKEN = import.meta.env.VITE_ADMIN_API_TOKEN || '';

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiBaseUrl, setApiBaseUrlState] = useState<string>(() => {
    return localStorage.getItem('gmail_ai_api_base_url') || DEFAULT_BASE_URL;
  });

  const [adminApiToken, setAdminApiTokenState] = useState<string>(() => {
    return localStorage.getItem('gmail_ai_admin_token') || DEFAULT_TOKEN;
  });

  const [isDemoMode, setIsDemoModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('gmail_ai_demo_mode');
    return saved !== null ? saved === 'true' : false;
  });

  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(false);

  const setApiBaseUrl = (url: string) => {
    setApiBaseUrlState(url);
    localStorage.setItem('gmail_ai_api_base_url', url);
  };

  const setAdminApiToken = (token: string) => {
    setAdminApiTokenState(token);
    localStorage.setItem('gmail_ai_admin_token', token);
  };

  const setIsDemoMode = (enabled: boolean) => {
    setIsDemoModeState(enabled);
    localStorage.setItem('gmail_ai_demo_mode', String(enabled));
  };

  const checkBackendHealth = useCallback(async (): Promise<boolean> => {
    setIsCheckingHealth(true);
    try {
      // Test either /gmail/accounts or /health
      const headers: Record<string, string> = {};
      if (adminApiToken) {
        headers['X-Admin-Token'] = adminApiToken;
      }
      const response = await axios.get(`${apiBaseUrl.replace(/\/+$/, '')}/gmail/accounts`, {
        headers,
        timeout: 3000,
      });
      const online = response.status >= 200 && response.status < 400;
      setIsBackendOnline(online);
      setIsCheckingHealth(false);
      return online;
    } catch {
      setIsBackendOnline(false);
      setIsCheckingHealth(false);
      return false;
    }
  }, [apiBaseUrl, adminApiToken]);

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
    setAdminApiToken(DEFAULT_TOKEN);
    setIsDemoMode(false);
    checkBackendHealth();
  };

  return (
    <ConfigContext.Provider
      value={{
        apiBaseUrl,
        adminApiToken,
        isDemoMode,
        isBackendOnline,
        isCheckingHealth,
        setApiBaseUrl,
        setAdminApiToken,
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
