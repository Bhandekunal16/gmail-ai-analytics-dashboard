import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccounts } from '../hooks/useAccounts';
import { AccountTable } from '../components/accounts/AccountTable';
import { ConnectAccountModal } from '../components/accounts/ConnectAccountModal';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { Plus, Mail, RefreshCw, Shield, AlertCircle } from 'lucide-react';

export const Accounts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    accounts,
    isLoading,
    isFetching,
    error,
    refetch,
    syncAccount,
    updateStatus,
    deleteAccount,
    isSyncing,
    getConnectUrl,
  } = useAccounts();

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // If navigated with ?connect=true, open modal automatically
  useEffect(() => {
    if (searchParams.get('connect') === 'true') {
      setIsConnectModalOpen(true);
      searchParams.delete('connect');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Gmail Account Management
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage multi-account OAuth connections, synchronization schedules, and credentials
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsConnectModalOpen(true)}
          >
            Connect Gmail Account
          </Button>
        </div>
      </div>

      {/* Security Banner */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            OAuth 2.0 refresh and access tokens are secured server-side in MongoDB. No private credentials or tokens are exposed to the browser.
          </span>
        </div>
        <span className="font-mono text-[11px] text-neutral-500 shrink-0 hidden md:inline">
          Scope: read-only
        </span>
      </div>

      {/* Content State */}
      {isLoading ? (
        <LoadingSkeleton rows={6} />
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Failed to load accounts: {error.message}</span>
        </div>
      ) : accounts.length === 0 ? (
        <EmptyState
          icon={<Mail className="w-6 h-6" />}
          title="No Gmail Accounts Connected"
          description="Click below to authorize your first Gmail inbox with Google OAuth 2.0."
          actionLabel="Connect Gmail Account"
          onAction={() => setIsConnectModalOpen(true)}
        />
      ) : (
        <AccountTable
          accounts={accounts}
          onSync={syncAccount}
          onToggleStatus={(accountId, status) => updateStatus({ accountId, dto: { status } })}
          onDelete={deleteAccount}
          isSyncing={isSyncing}
        />
      )}

      {/* Connect Account Modal */}
      <ConnectAccountModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        connectUrl={getConnectUrl()}
      />
    </div>
  );
};
