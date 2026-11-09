import React from 'react';
import { usePipeline } from '../hooks/usePipeline';
import { useAccounts } from '../hooks/useAccounts';
import { CronScheduleCard } from '../components/pipeline/CronScheduleCard';
import { TrainerEndpointProbe } from '../components/pipeline/TrainerEndpointProbe';
import { AccountSyncStatusList } from '../components/pipeline/AccountSyncStatusList';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSkeleton, CardSkeleton } from '../components/common/LoadingSkeleton';
import {
  Activity,
  Calendar,
  Layers,
  Database,
  RefreshCw,
  GitBranch,
  ArrowRight,
  Server,
} from 'lucide-react';
import { formatKolkataDate, getKolkataDateString } from '../utils/date';

export const PipelineMonitoring: React.FC = () => {
  const { pipelineStatus, isLoading: pipelineLoading, refetch: refetchPipeline } = usePipeline();
  const { accounts, isLoading: accountsLoading, refetch: refetchAccounts } = useAccounts();

  const handleRefreshAll = () => {
    refetchPipeline();
    refetchAccounts();
  };

  if (pipelineLoading || accountsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Classification Pipeline Management
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Monitor background ingestion schedules, Node-cron jobs, and model training endpoints
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Pipeline State
          </Button>
        </div>
      </div>

      {/* Architecture Flow Diagram Banner */}
      <Card
        title="Ingestion & Classification Architecture"
        subtitle="Two-stage asynchronous data processing topology"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Stage 1 */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
              <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center font-mono text-[10px]">
                1
              </span>
              <span>Gmail Ingestion (Node-cron)</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Triggers daily at 23:00 Asia/Kolkata. Fetches up to 50 new Gmail messages per active account and stores raw email headers/bodies into <strong>MongoDB</strong>.
            </p>
            <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1">
              <span>● Operational (Node.js)</span>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-xs font-semibold">
              <span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-950 flex items-center justify-center font-mono text-[10px]">
                2
              </span>
              <span>NLP Classification Engine</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Python classification script batches messages, infers primary category and subcategories, and builds relationship nodes inside <strong>Neo4j</strong>.
            </p>
            <div className="text-[11px] font-mono text-neutral-500 flex items-center gap-1 pt-1">
              <span>● Independent Python runtime</span>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-semibold">
              <span className="w-5 h-5 rounded-full bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center font-mono text-[10px]">
                3
              </span>
              <span>Classification Summary API</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Express joins Neo4j category summaries with MongoDB email references for the requested Asia/Kolkata date partition.
            </p>
            <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1">
              <span>● Operational (GET /emails/classificationSummary)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Pipeline Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cron Schedule */}
        {pipelineStatus && <CronScheduleCard status={pipelineStatus} />}

        {/* Trainer Endpoint Diagnostics & Manual Trigger */}
        <TrainerEndpointProbe />
      </div>

      {/* Account-level Sync & Error Monitoring */}
      <AccountSyncStatusList accounts={accounts} />
    </div>
  );
};
