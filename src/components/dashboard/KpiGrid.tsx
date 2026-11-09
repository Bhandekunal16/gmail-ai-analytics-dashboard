import React from 'react';
import { Mail, CheckCircle2, PauseCircle, AlertTriangle, Layers, Calendar, Clock, BarChart3 } from 'lucide-react';
import { GmailAccount } from '../../types/account.types';
import { formatNumber } from '../../utils/format';
import { formatKolkataDateTime, formatRelativeTime } from '../../utils/date';

interface KpiGridProps {
  accounts: GmailAccount[];
  totalClassified: number;
  totalCategories: number;
  reportDate: string;
}

export const KpiGrid: React.FC<KpiGridProps> = ({
  accounts,
  totalClassified,
  totalCategories,
  reportDate,
}) => {
  const totalConnected = accounts.length;
  const activeCount = accounts.filter((a) => a.status === 'ACTIVE').length;
  const inactiveCount = accounts.filter((a) => a.status === 'INACTIVE').length;
  const expiredOrRevokedCount = accounts.filter(
    (a) => a.status === 'EXPIRED' || a.status === 'REVOKED'
  ).length;

  // Find most recent synchronization timestamp
  const latestSyncTimestamp = accounts.reduce<string | null>((latest, acc) => {
    if (!acc.lastSyncTimestamp) return latest;
    if (!latest) return acc.lastSyncTimestamp;
    return new Date(acc.lastSyncTimestamp) > new Date(latest) ? acc.lastSyncTimestamp : latest;
  }, null);

  const stats = [
    {
      title: 'Connected Accounts',
      value: formatNumber(totalConnected),
      subtitle: `${activeCount} active · ${inactiveCount} inactive`,
      icon: Mail,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'Active Accounts',
      value: formatNumber(activeCount),
      subtitle: `${Math.round(totalConnected ? (activeCount / totalConnected) * 100 : 0)}% of total accounts`,
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Inactive / Paused',
      value: formatNumber(inactiveCount),
      subtitle: 'Manually toggled accounts',
      icon: PauseCircle,
      iconColor: 'text-neutral-500 dark:text-neutral-400',
    },
    {
      title: 'Expired / Revoked',
      value: formatNumber(expiredOrRevokedCount),
      subtitle: expiredOrRevokedCount > 0 ? 'Requires re-authorization' : 'All tokens valid',
      icon: AlertTriangle,
      iconColor: expiredOrRevokedCount > 0 ? 'text-amber-500' : 'text-neutral-400',
    },
    {
      title: 'Total Classified Emails',
      value: formatNumber(totalClassified),
      subtitle: `Report date: ${reportDate} (IST)`,
      icon: BarChart3,
      iconColor: 'text-cyan-600 dark:text-cyan-400',
    },
    {
      title: 'Identified Categories',
      value: formatNumber(totalCategories),
      subtitle: 'Neo4j classification clusters',
      icon: Layers,
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      title: 'Last Synchronization',
      value: latestSyncTimestamp ? formatRelativeTime(latestSyncTimestamp) : 'Never',
      subtitle: latestSyncTimestamp ? formatKolkataDateTime(latestSyncTimestamp) : 'No synchronization recorded',
      icon: Clock,
      iconColor: 'text-sky-600 dark:text-sky-400',
      isText: true,
    },
    {
      title: 'Classification Date',
      value: reportDate,
      subtitle: 'Asia/Kolkata timezone partition',
      icon: Calendar,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 flex flex-col justify-between transition-colors hover:border-neutral-300 dark:hover:border-neutral-700"
          >
            <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
              <span className="text-xs font-medium">{stat.title}</span>
              <Icon className={`w-4 h-4 ${stat.iconColor}`} />
            </div>

            <div>
              <div className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 tracking-tight">
                {stat.value}
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 truncate">
                {stat.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
