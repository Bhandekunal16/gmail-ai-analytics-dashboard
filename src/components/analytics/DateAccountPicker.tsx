import React from 'react';
import { Calendar, User, Filter } from 'lucide-react';
import { GmailAccount } from '../../types/account.types';
import { getRecentKolkataDates, getKolkataDateString } from '../../utils/date';

interface DateAccountPickerProps {
  accounts: GmailAccount[];
  selectedAccountId: string;
  onSelectAccount: (accountId: string) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const DateAccountPicker: React.FC<DateAccountPickerProps> = ({
  accounts,
  selectedAccountId,
  onSelectAccount,
  selectedDate,
  onSelectDate,
}) => {
  const recentDates = getRecentKolkataDates(7);

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
      {/* Left: Account filter */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <User className="w-4 h-4 text-neutral-400" />
          <span className="font-medium">Filter Account:</span>
        </div>
        <select
          value={selectedAccountId}
          onChange={(e) => onSelectAccount(e.target.value)}
          className="text-xs font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All Accounts (Combined)</option>
          {accounts.map((acc) => (
            <option key={acc.accountId} value={acc.accountId}>
              {acc.email} ({acc.status})
            </option>
          ))}
        </select>
      </div>

      {/* Right: Date selector with IST notice */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <Calendar className="w-4 h-4 text-neutral-400" />
          <span className="font-medium">Report Date (IST):</span>
        </div>

        {/* Quick date pills / segmented tabs */}
        <div className="hidden sm:flex items-center gap-1 p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          {recentDates.slice(0, 3).map((d, idx) => (
            <button
              key={d}
              onClick={() => onSelectDate(d)}
              className={`px-2.5 py-1 text-xs font-mono tabular-nums rounded-md transition-colors cursor-pointer ${
                selectedDate === d
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              {idx === 0 ? 'Today' : idx === 1 ? 'Yesterday' : d.split('-').slice(1).join('/')}
            </button>
          ))}
        </div>

        {/* Direct custom date input */}
        <input
          type="date"
          value={selectedDate}
          max={getKolkataDateString()}
          onChange={(e) => onSelectDate(e.target.value)}
          className="text-xs font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};
