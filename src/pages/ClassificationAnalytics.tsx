import React, { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useClassificationSummary } from '../hooks/useClassification';
import { getKolkataDateString } from '../utils/date';
import { DateAccountPicker } from '../components/analytics/DateAccountPicker';
import { CategoryDonutChart } from '../components/dashboard/CategoryDonutChart';
import { CategoryBarChart } from '../components/dashboard/CategoryBarChart';
import { SubcategoryBreakdown } from '../components/dashboard/SubcategoryBreakdown';
import { EmailReferencesTable } from '../components/analytics/EmailReferencesTable';
import { LoadingSkeleton, CardSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { formatNumber } from '../utils/format';
import { PieChart, RefreshCw, Layers, Database, AlertCircle } from 'lucide-react';

export const ClassificationAnalytics: React.FC = () => {
  const { accounts } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(getKolkataDateString());

  const {
    summary,
    categories,
    emailReferences,
    totalClassified,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useClassificationSummary(selectedDate, selectedAccountId || undefined);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Classification Analytics
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Hierarchical category & subcategory breakdown from Neo4j knowledge clusters and MongoDB references
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
        </div>
      </div>

      {/* Account & Date Filters */}
      <DateAccountPicker
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        onSelectAccount={setSelectedAccountId}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* Summary Stat Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            Total Classified Emails
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 mt-1">
            {formatNumber(totalClassified)}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">
            Date partition: {selectedDate} (IST)
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            Top-Level Categories
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400 mt-1">
            {formatNumber(categories.length)}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">
            Indexed in Neo4j summary graph
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            Classified Email References
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
            {formatNumber(emailReferences.length)}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">
            Linked to MongoDB message bodies
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Failed to load classification analytics: {error.message}</span>
        </div>
      ) : totalClassified === 0 ? (
        <EmptyState
          icon={<PieChart className="w-6 h-6" />}
          title="No Classification Summary"
          description={`No classification records found for ${selectedDate}. Try selecting another date or ensure the Python classification pipeline has processed this date.`}
        />
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryDonutChart categories={categories} totalClassified={totalClassified} />
            <CategoryBarChart categories={categories} />
          </div>

          {/* Subcategories Breakdown */}
          <SubcategoryBreakdown categories={categories} />

          {/* Email References Table */}
          <EmailReferencesTable emailReferences={emailReferences} categories={categories} />
        </>
      )}
    </div>
  );
};
