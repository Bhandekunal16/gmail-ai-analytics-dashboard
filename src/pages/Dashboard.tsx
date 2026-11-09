import React, { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useClassificationSummary } from '../hooks/useClassification';
import { getKolkataDateString, getRecentKolkataDates } from '../utils/date';
import { KpiGrid } from '../components/dashboard/KpiGrid';
import { CategoryDonutChart } from '../components/dashboard/CategoryDonutChart';
import { CategoryBarChart } from '../components/dashboard/CategoryBarChart';
import { SubcategoryBreakdown } from '../components/dashboard/SubcategoryBreakdown';
import { AccountComparisonChart } from '../components/dashboard/AccountComparisonChart';
import { LoadingSkeleton, CardSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Mail, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(getKolkataDateString());

  const { accounts, isLoading: accountsLoading, error: accountsError, refetch: refetchAccounts } = useAccounts();
  const {
    summary,
    categories,
    totalClassified,
    isLoading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useClassificationSummary(selectedDate, selectedAccountId || undefined);

  const recentDates = getRecentKolkataDates(5);

  const handleRefreshAll = () => {
    refetchAccounts();
    refetchSummary();
  };

  if (accountsLoading && summaryLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Executive Analytics Overview
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real-time multi-account Gmail ingestion & Neo4j classification metrics
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Account Filter */}
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="text-xs font-mono bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Accounts ({accounts.length})</option>
            {accounts.map((acc) => (
              <option key={acc.accountId} value={acc.accountId}>
                {acc.email} ({acc.status})
              </option>
            ))}
          </select>

          {/* Date Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2 py-1">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <input
              type="date"
              value={selectedDate}
              max={getKolkataDateString()}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-mono bg-transparent text-neutral-800 dark:text-neutral-200 focus:outline-hidden cursor-pointer"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshAll}
            title="Refresh metrics"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <KpiGrid
        accounts={accounts}
        totalClassified={totalClassified}
        totalCategories={categories.length}
        reportDate={selectedDate}
      />

      {/* Empty State when no accounts exist */}
      {accounts.length === 0 && !accountsLoading && (
        <EmptyState
          icon={<Mail className="w-6 h-6" />}
          title="No Gmail Accounts Connected"
          description="Connect your first Gmail account using Google OAuth to begin automatic email ingestion and AI classification."
          actionLabel="Connect Gmail Account"
          onAction={() => navigate('/accounts?connect=true')}
        />
      )}

      {/* Analytics Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Donut Chart: Classification Distribution */}
        <CategoryDonutChart
          categories={categories}
          totalClassified={totalClassified}
        />

        {/* 2. Bar Chart: Category-Wise Volume */}
        <CategoryBarChart categories={categories} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Subcategory Breakdown */}
        <SubcategoryBreakdown categories={categories} allSubcategories={summary?.allSubcategories} />

        {/* 4. Account-Wise Comparison */}
        <AccountComparisonChart accounts={accounts} />
      </div>
    </div>
  );
};
