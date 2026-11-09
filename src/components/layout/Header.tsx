import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Plus,
  RefreshCw,
  Server,
  AlertTriangle,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useConfig } from '../../context/ConfigContext';
import { useAccounts } from '../../hooks/useAccounts';
import { Button } from '../common/Button';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  selectedAccountId?: string;
  onSelectAccount?: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  selectedAccountId,
  onSelectAccount,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isDemoMode, isBackendOnline, apiBaseUrl } = useConfig();
  const { accounts, refetch, isFetching } = useAccounts();

  const getPageTitle = (pathname: string): { title: string; category?: string } => {
    switch (pathname) {
      case '/':
        return { title: 'Dashboard Overview', category: 'Analytics' };
      case '/accounts':
        return { title: 'Gmail Accounts', category: 'Management' };
      case '/emails':
        return { title: 'Email Explorer', category: 'Discovery' };
      case '/analytics':
        return { title: 'Classification Analytics', category: 'Insights' };
      case '/pipeline':
        return { title: 'Pipeline Monitoring', category: 'Operations' };
      case '/settings':
        return { title: 'Settings', category: 'System' };
      default:
        return { title: 'Analytics Console' };
    }
  };

  const { title, category } = getPageTitle(location.pathname);

  return (
    <header className="h-14 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 min-w-0">
          {category && (
            <>
              <span className="hidden sm:inline-block font-normal">{category}</span>
              <span className="hidden sm:inline-block text-neutral-300 dark:text-neutral-700" aria-hidden="true">
                /
              </span>
            </>
          )}
          <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Actions, Filters, Theme, Status */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Account Selector (if on relevant pages) */}
        {onSelectAccount && accounts.length > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
            <span className="text-neutral-400">Account:</span>
            <select
              value={selectedAccountId || ''}
              onChange={(e) => onSelectAccount(e.target.value)}
              className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md px-2 py-1 text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">All Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.accountId} value={acc.accountId}>
                  {acc.email} ({acc.status})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Demo Mode / Backend Connection Banner Badge */}
        {isDemoMode ? (
          <button
            onClick={() => navigate('/settings')}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
            title="Demo data active because live backend is offline or demo mode is selected in Settings."
          >
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span>Demo Mode</span>
          </button>
        ) : (
          <div
            className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-100/70 dark:bg-neutral-800/60 rounded-md border border-neutral-200/80 dark:border-neutral-700/60"
            title={`Backend connected: ${apiBaseUrl}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isBackendOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span>{isBackendOnline ? 'Live Backend' : 'Offline'}</span>
          </div>
        )}

        {/* Refresh Queries Button */}
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
          title="Refresh account data"
          aria-label="Refresh account data"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Connect Gmail Action */}
        <Button
          size="sm"
          variant="primary"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => navigate('/accounts?connect=true')}
        >
          Connect Gmail
        </Button>
      </div>
    </header>
  );
};
