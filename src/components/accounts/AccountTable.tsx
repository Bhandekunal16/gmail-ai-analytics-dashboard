import React, { useState } from 'react';
import {
  RefreshCw,
  Trash2,
  Power,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { GmailAccount } from '../../types/account.types';
import { StatusBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatKolkataDateTime, formatRelativeTime } from '../../utils/date';
import { formatNumber } from '../../utils/format';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useNavigate } from 'react-router-dom';

interface AccountTableProps {
  accounts: GmailAccount[];
  onSync: (accountId: string) => Promise<any>;
  onToggleStatus: (accountId: string, newStatus: 'ACTIVE' | 'INACTIVE') => Promise<any>;
  onDelete: (accountId: string) => Promise<any>;
  isSyncing: boolean;
}

export const AccountTable: React.FC<AccountTableProps> = ({
  accounts,
  onSync,
  onToggleStatus,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<GmailAccount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSync = async (accountId: string) => {
    try {
      setSyncingId(accountId);
      const res = await onSync(accountId);
      setToastMessage(res?.message || `Synchronization completed for ${accountId}`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      alert(`Sync failed: ${err.message || err}`);
    } finally {
      setSyncingId(null);
    }
  };

  const handleToggleStatus = async (account: GmailAccount) => {
    const newStatus = account.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      setStatusUpdatingId(account.accountId);
      await onToggleStatus(account.accountId, newStatus);
    } catch (err: any) {
      alert(`Status update failed: ${err.message || err}`);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete) return;
    try {
      setIsDeleting(true);
      await onDelete(accountToDelete.accountId);
      setAccountToDelete(null);
      setToastMessage(`Account ${accountToDelete.email} removed.`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      alert(`Deletion failed: ${err.message || err}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast banner */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 font-bold ml-4"
          >
            ×
          </button>
        </div>
      )}

      {/* Accounts Table */}
      <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 text-neutral-500 dark:text-neutral-400 font-medium select-none">
              <th className="px-4 py-3">Account Email & ID</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Sync</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
            {accounts.map((acc) => {
              const isSyncingThis = syncingId === acc.accountId;
              const isUpdatingThis = statusUpdatingId === acc.accountId;

              return (
                <tr
                  key={acc.accountId}
                  className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  {/* Email & ID */}
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {acc.email}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 mt-0.5 flex items-center gap-2">
                      <span>{acc.accountId}</span>
                      {acc.messagesTotal !== undefined && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums font-mono">
                            {formatNumber(acc.messagesTotal)} emails
                          </span>
                        </>
                      )}
                    </div>
                    {acc.lastError && (
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-xs">{acc.lastError}</span>
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <StatusBadge status={acc.status} />
                  </td>

                  {/* Last Sync */}
                  <td className="px-4 py-3.5">
                    <div className="font-mono tabular-nums text-neutral-800 dark:text-neutral-200 font-medium">
                      {formatRelativeTime(acc.lastSyncTimestamp)}
                    </div>
                    <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                      {acc.lastSyncTimestamp ? formatKolkataDateTime(acc.lastSyncTimestamp) : 'Never synced'}
                    </div>
                  </td>

                  {/* Created At */}
                  <td className="px-4 py-3.5 text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
                    {formatKolkataDateTime(acc.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Explore emails */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/emails?accountId=${acc.accountId}`)}
                        title="Explore emails for this account"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Emails</span>
                      </Button>

                      {/* Manual Sync Trigger */}
                      <Button
                        variant="outline"
                        size="sm"
                        isLoading={isSyncingThis}
                        disabled={acc.status === 'EXPIRED' || acc.status === 'REVOKED' || isSyncingThis}
                        onClick={() => handleSync(acc.accountId)}
                        title="Fetch up to 50 latest messages"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingThis ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Sync</span>
                      </Button>

                      {/* Status Toggle (ACTIVE / INACTIVE) */}
                      {(acc.status === 'ACTIVE' || acc.status === 'INACTIVE') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          isLoading={isUpdatingThis}
                          onClick={() => handleToggleStatus(acc)}
                          title={acc.status === 'ACTIVE' ? 'Pause synchronization' : 'Resume synchronization'}
                          className={acc.status === 'ACTIVE' ? 'text-amber-600 hover:text-amber-700' : 'text-emerald-600 hover:text-emerald-700'}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">
                            {acc.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </span>
                        </Button>
                      )}

                      {/* Delete Account */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAccountToDelete(acc)}
                        className="text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Remove connected Gmail account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(accountToDelete)}
        onClose={() => setAccountToDelete(null)}
        onConfirm={handleConfirmDelete}
        account={accountToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
