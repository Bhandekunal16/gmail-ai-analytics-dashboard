import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Mail,
  Search,
  PieChart,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Server,
  Zap,
} from 'lucide-react';
import { useAccounts } from '../../hooks/useAccounts';
import { useConfig } from '../../context/ConfigContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { accounts } = useAccounts();
  const { isDemoMode, isBackendOnline } = useConfig();

  const activeAccountsCount = accounts.filter((a) => a.status === 'ACTIVE').length;

  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/accounts', label: 'Gmail Accounts', icon: Mail, badge: accounts.length ? String(accounts.length) : undefined },
    { to: '/emails', label: 'Email Explorer', icon: Search },
    { to: '/analytics', label: 'Classification Analytics', icon: PieChart },
    { to: '/pipeline', label: 'Pipeline Monitoring', icon: Activity },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-200 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Mail className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-neutral-100 block">
                Gmail AI
              </span>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block -mt-0.5">
                Analytics Console
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors group relative ${
                  isActive
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-100'
                } ${isCollapsed ? 'justify-center px-2' : ''}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0 transition-colors" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {!isCollapsed && item.badge && (
                <span className="ml-auto text-[10px] font-mono tabular-nums px-1.5 py-0.2 bg-neutral-200/70 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Status & Environment Indicator */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 shrink-0">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-neutral-400" />
                Backend
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[10px]">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isDemoMode
                      ? 'bg-amber-500'
                      : isBackendOnline
                      ? 'bg-emerald-500'
                      : 'bg-rose-500'
                  }`}
                />
                {isDemoMode ? 'Demo Mode' : isBackendOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                Connected
              </span>
              <span className="font-mono text-[10px] tabular-nums font-semibold text-neutral-700 dark:text-neutral-300">
                {activeAccountsCount} / {accounts.length} Active
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className={`w-2 h-2 rounded-full ${
                isDemoMode
                  ? 'bg-amber-500'
                  : isBackendOnline
                  ? 'bg-emerald-500'
                  : 'bg-rose-500'
              }`}
              title={isDemoMode ? 'Demo Mode Active' : isBackendOnline ? 'Backend Online' : 'Backend Offline'}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block shrink-0 h-screen sticky top-0 z-30 transition-[width] duration-200 ${
          isCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
