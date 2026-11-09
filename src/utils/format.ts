import { AccountStatus } from '../types/account.types';

export function getStatusTheme(status: AccountStatus): {
  label: string;
  dotColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
} {
  switch (status) {
    case 'ACTIVE':
      return {
        label: 'Active',
        dotColor: 'bg-emerald-500',
        textColor: 'text-emerald-700 dark:text-emerald-400',
        bgColor: 'bg-emerald-50/70 dark:bg-emerald-950/40',
        borderColor: 'border-emerald-200 dark:border-emerald-800/60',
      };
    case 'INACTIVE':
      return {
        label: 'Inactive',
        dotColor: 'bg-neutral-400',
        textColor: 'text-neutral-600 dark:text-neutral-400',
        bgColor: 'bg-neutral-100/70 dark:bg-neutral-800/40',
        borderColor: 'border-neutral-200 dark:border-neutral-700',
      };
    case 'EXPIRED':
      return {
        label: 'Expired',
        dotColor: 'bg-amber-500',
        textColor: 'text-amber-700 dark:text-amber-400',
        bgColor: 'bg-amber-50/70 dark:bg-amber-950/40',
        borderColor: 'border-amber-200 dark:border-amber-800/60',
      };
    case 'REVOKED':
      return {
        label: 'Revoked',
        dotColor: 'bg-rose-500',
        textColor: 'text-rose-700 dark:text-rose-400',
        bgColor: 'bg-rose-50/70 dark:bg-rose-950/40',
        borderColor: 'border-rose-200 dark:border-rose-800/60',
      };
    default:
      return {
        label: status,
        dotColor: 'bg-neutral-400',
        textColor: 'text-neutral-600 dark:text-neutral-400',
        bgColor: 'bg-neutral-100 dark:bg-neutral-800',
        borderColor: 'border-neutral-200 dark:border-neutral-700',
      };
  }
}

export const CATEGORY_PALETTE: Record<string, string> = {
  Primary: '#4f46e5', // indigo-600
  Work: '#2563eb', // blue-600
  Transactional: '#0891b2', // cyan-600
  Finance: '#059669', // emerald-600
  Promotions: '#ea580c', // orange-600
  Marketing: '#d97706', // amber-600
  Updates: '#7c3aed', // violet-600
  Social: '#db2777', // pink-600
  Spam: '#dc2626', // red-600
  Other: '#64748b', // slate-500
};

export function getCategoryColor(categoryName: string, index: number = 0): string {
  if (CATEGORY_PALETTE[categoryName]) {
    return CATEGORY_PALETTE[categoryName];
  }
  const fallbackList = [
    '#4f46e5',
    '#2563eb',
    '#0891b2',
    '#059669',
    '#ea580c',
    '#7c3aed',
    '#db2777',
    '#14b8a6',
    '#84cc16',
    '#64748b',
  ];
  return fallbackList[index % fallbackList.length];
}

export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

export function truncateText(text: string, maxLength: number = 60): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
