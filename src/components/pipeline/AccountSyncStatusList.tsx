import React from 'react';
import { GmailAccount } from '../../types/account.types';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/Badge';
import { formatKolkataDateTime, formatRelativeTime } from '../../utils/date';
import { formatNumber } from '../../utils/format';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface AccountSyncStatusListProps {
  accounts: GmailAccount[];
}

export const AccountSyncStatusList: React.FC<AccountSyncStatusListProps> = ({ accounts }) => {
  return (
    <Card
      title="Account Synchronization & Error Health"
      subtitle="Per-account polling telemetry and error state tracking"
    >
      <div className="space-y-3">
        {accounts.map((acc) => (
          <div
            key={acc.accountId}
            className="p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {acc.email}
                </span>
                <StatusBadge status={acc.status} />
              </div>
              <div className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                {acc.accountId}
              </div>
              {acc.lastError && (
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-mono text-[11px]">{acc.lastError}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-right shrink-0">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Last Sync
                </span>
                <span className="font-mono tabular-nums text-neutral-800 dark:text-neutral-200 font-medium">
                  {formatRelativeTime(acc.lastSyncTimestamp)}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Total Synced
                </span>
                <span className="font-mono tabular-nums text-neutral-800 dark:text-neutral-200 font-medium">
                  {formatNumber(acc.messagesTotal || 0)} msgs
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
