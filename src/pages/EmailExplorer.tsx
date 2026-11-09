import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccounts } from '../hooks/useAccounts';
import { useEmails } from '../hooks/useEmails';
import { EmailTable } from '../components/emails/EmailTable';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { Search, Mail, RefreshCw, ChevronLeft, ChevronRight, AlertCircle, Filter } from 'lucide-react';
import { formatNumber } from '../utils/format';

export const EmailExplorer: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { accounts, isLoading: accountsLoading } = useAccounts();

  // Active account selection
  const paramAccountId = searchParams.get('accountId');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    paramAccountId || (accounts.length > 0 ? accounts[0].accountId : '')
  );

  // Search query & pagination
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [submittedQuery, setSubmittedQuery] = useState<string>('');
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);
  const [pageTokenHistory, setPageTokenHistory] = useState<string[]>([]);

  // Update selected account when accounts load
  useEffect(() => {
    if (!selectedAccountId && accounts.length > 0) {
      const defaultId = paramAccountId || accounts[0].accountId;
      setSelectedAccountId(defaultId);
    }
  }, [accounts, selectedAccountId, paramAccountId]);

  // Sync state with URL search param
  const handleSelectAccount = (id: string) => {
    setSelectedAccountId(id);
    setPageToken(undefined);
    setPageTokenHistory([]);
    setSearchParams({ accountId: id });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
    setPageToken(undefined);
    setPageTokenHistory([]);
  };

  const handleQuickFilter = (queryFilter: string) => {
    setSearchQuery(queryFilter);
    setSubmittedQuery(queryFilter);
    setPageToken(undefined);
    setPageTokenHistory([]);
  };

  const {
    messages,
    hasMore,
    nextPageToken,
    totalFetched,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useEmails(
    {
      accountId: selectedAccountId,
      q: submittedQuery,
      pageToken,
    },
    Boolean(selectedAccountId)
  );

  const handleNextPage = () => {
    if (nextPageToken) {
      setPageTokenHistory((prev) => [...prev, pageToken || '']);
      setPageToken(nextPageToken);
    }
  };

  const handlePrevPage = () => {
    if (pageTokenHistory.length > 0) {
      const prevToken = pageTokenHistory[pageTokenHistory.length - 1];
      setPageTokenHistory((prev) => prev.slice(0, -1));
      setPageToken(prevToken || undefined);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Email Explorer
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Query and inspect synchronized Gmail messages via live search filters
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching || !selectedAccountId}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Account Selector & Search Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Account Selector */}
          <div className="md:col-span-4">
            <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              Selected Gmail Account
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => handleSelectAccount(e.target.value)}
              className="w-full text-xs font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              {accounts.length === 0 && <option value="">No accounts available</option>}
              {accounts.map((acc) => (
                <option key={acc.accountId} value={acc.accountId}>
                  {acc.email} ({acc.status})
                </option>
              ))}
            </select>
          </div>

          {/* Search Query Form */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-8">
            <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              Gmail Search Query (q)
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. newer_than:1d, from:stripe.com, label:IMPORTANT..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <Button type="submit" variant="primary" size="sm">
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Quick query presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="text-[11px] font-medium">Quick Filters:</span>
          {['newer_than:1d', 'newer_than:7d', 'label:INBOX', 'has:attachment', 'is:important'].map(
            (preset) => (
              <button
                key={preset}
                onClick={() => handleQuickFilter(preset)}
                className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  submittedQuery === preset
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold'
                    : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {preset}
              </button>
            )
          )}
          {submittedQuery && (
            <button
              onClick={() => handleQuickFilter('')}
              className="text-[11px] text-rose-500 hover:underline ml-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Query Results Meta */}
      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 px-1">
        <div>
          Showing <span className="font-mono tabular-nums font-semibold text-neutral-800 dark:text-neutral-200">{messages.length}</span> messages
          {totalFetched > 0 && (
            <span>
              {' '}· Batch limit <span className="font-mono tabular-nums">50</span> / request
            </span>
          )}
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={pageTokenHistory.length === 0}
            leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
          >
            Prev
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!hasMore && !nextPageToken}
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Email Table Content */}
      {isLoading ? (
        <LoadingSkeleton rows={8} />
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Error loading messages: {error.message}</span>
        </div>
      ) : messages.length === 0 ? (
        <EmptyState
          icon={<Mail className="w-6 h-6" />}
          title="No Emails Found"
          description={
            submittedQuery
              ? `No messages matched the query "${submittedQuery}". Try clearing filters or selecting another account.`
              : 'No messages have been ingested yet for this account. Run a sync from the Accounts page.'
          }
        />
      ) : (
        <EmailTable messages={messages} isLoading={isLoading} />
      )}
    </div>
  );
};
