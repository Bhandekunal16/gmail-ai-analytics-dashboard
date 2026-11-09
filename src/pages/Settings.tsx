import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import {
  Server,
  Key,
  Shield,
  Activity,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sun,
  Moon,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const {
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
  } = useConfig();

  const { theme, toggleTheme } = useTheme();

  const [inputUrl, setInputUrl] = useState(apiBaseUrl);
  const [inputToken, setInputToken] = useState(adminApiToken);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiBaseUrl(inputUrl);
    setAdminApiToken(inputToken);
    setSaveSuccess(true);
    await checkBackendHealth();
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleToggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Environment & Integration Settings
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Configure backend API endpoints, admin security tokens, and environment mode
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Configuration saved successfully. Connection refreshed.</span>
        </div>
      )}

      {/* Backend API Configuration Form */}
      <form onSubmit={handleSave}>
        <Card
          title="Backend API Connection"
          subtitle="Configure connectivity to the Node.js / Express reverse proxy server"
          headerAction={
            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={isCheckingHealth}
              onClick={() => checkBackendHealth()}
              leftIcon={<Activity className="w-3.5 h-3.5" />}
            >
              Test Connection
            </Button>
          }
        >
          <div className="space-y-4">
            {/* Health status banner */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 text-xs">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-neutral-400" />
                <span className="text-neutral-600 dark:text-neutral-400">Connection Status:</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {isBackendOnline ? 'Online (Responding)' : 'Offline / Unreachable'}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isBackendOnline ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                {isBackendOnline ? 'HTTP 200' : 'No response'}
              </span>
            </div>

            {/* API Base URL */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Backend Base URL
              </label>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="http://localhost:8002"
                className="w-full text-xs font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-neutral-500">
                Default: <code className="font-mono">http://localhost:8002</code>. Matches the existing Express reverse proxy server.
              </p>
            </div>

            {/* Admin API Token */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Admin API Token (<code className="font-mono">X-Admin-Token</code>)
              </label>
              <input
                type="password"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="Enter secret token if ADMIN_API_TOKEN protection is enabled..."
                className="w-full text-xs font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-neutral-500">
                Transmitted in request headers via <code className="font-mono">X-Admin-Token</code>. Leave empty if your local backend does not enforce token protection.
              </p>
            </div>

            {/* Form Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <Button type="button" variant="ghost" size="sm" onClick={resetToDefaults}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset to Defaults
              </Button>

              <Button type="submit" variant="primary" size="sm">
                Save & Apply Settings
              </Button>
            </div>
          </div>
        </Card>
      </form>

      {/* Demo Mode / Fallback Toggle */}
      <Card
        title="Environment Mode"
        subtitle="Toggle between live backend queries and realistic demonstration seed state"
      >
        <div className="flex items-center justify-between p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 block">
              Offline Demo Mode
            </span>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md leading-relaxed">
              When enabled, the frontend serves rich sample accounts, classified emails, and Neo4j summaries even when the local backend server is stopped.
            </p>
          </div>

          <button
            onClick={handleToggleDemoMode}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              isDemoMode ? 'bg-indigo-600' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                isDemoMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Theme & Display Preferences */}
      <Card
        title="Appearance & Theme"
        subtitle="Manage color theme and accessibility preferences"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 block">
              Active Color Scheme
            </span>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Currently using <strong>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</strong>.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            leftIcon={theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          >
            Switch to {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
        </div>
      </Card>

      {/* API Reference Contract */}
      <Card
        title="API Endpoints Reference"
        subtitle="Active endpoints integrated by the React frontend"
      >
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-12 gap-2 py-1.5 border-b border-neutral-100 dark:border-neutral-800 text-[11px] font-mono">
            <span className="col-span-2 text-emerald-600 font-semibold">GET</span>
            <span className="col-span-6 text-neutral-800 dark:text-neutral-200">/gmail/accounts</span>
            <span className="col-span-4 text-neutral-400 text-right">Fetch connected accounts</span>
          </div>

          <div className="grid grid-cols-12 gap-2 py-1.5 border-b border-neutral-100 dark:border-neutral-800 text-[11px] font-mono">
            <span className="col-span-2 text-emerald-600 font-semibold">GET</span>
            <span className="col-span-6 text-neutral-800 dark:text-neutral-200">/gmail/accounts/connect</span>
            <span className="col-span-4 text-neutral-400 text-right">Google OAuth redirect</span>
          </div>

          <div className="grid grid-cols-12 gap-2 py-1.5 border-b border-neutral-100 dark:border-neutral-800 text-[11px] font-mono">
            <span className="col-span-2 text-amber-600 font-semibold">PATCH</span>
            <span className="col-span-6 text-neutral-800 dark:text-neutral-200">/gmail/accounts/:id/status</span>
            <span className="col-span-4 text-neutral-400 text-right">Toggle ACTIVE/INACTIVE</span>
          </div>

          <div className="grid grid-cols-12 gap-2 py-1.5 border-b border-neutral-100 dark:border-neutral-800 text-[11px] font-mono">
            <span className="col-span-2 text-rose-600 font-semibold">DELETE</span>
            <span className="col-span-6 text-neutral-800 dark:text-neutral-200">/gmail/accounts/:id</span>
            <span className="col-span-4 text-neutral-400 text-right">Remove account</span>
          </div>

          <div className="grid grid-cols-12 gap-2 py-1.5 border-b border-neutral-100 dark:border-neutral-800 text-[11px] font-mono">
            <span className="col-span-2 text-indigo-600 font-semibold">POST</span>
            <span className="col-span-6 text-neutral-800 dark:text-neutral-200">/gmail/accounts/:id/sync</span>
            <span className="col-span-4 text-neutral-400 text-right">Trigger account sync</span>
          </div>

          <div className="grid grid-cols-12 gap-2 py-1.5 border-b border-neutral-100 dark:border-neutral-800 text-[11px] font-mono">
            <span className="col-span-2 text-emerald-600 font-semibold">GET</span>
            <span className="col-span-6 text-neutral-800 dark:text-neutral-200">/emails?accountId=...&q=...</span>
            <span className="col-span-4 text-neutral-400 text-right">Search & browse messages</span>
          </div>

          <div className="grid grid-cols-12 gap-2 py-1.5 text-[11px] font-mono">
            <span className="col-span-2 text-emerald-600 font-semibold">GET</span>
            <span className="col-span-6 text-neutral-800 dark:text-neutral-200">/emails/classificationSummary/:date</span>
            <span className="col-span-4 text-neutral-400 text-right">Neo4j + Mongo summaries</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
