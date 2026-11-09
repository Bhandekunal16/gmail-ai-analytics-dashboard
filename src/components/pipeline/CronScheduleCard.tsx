import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Info, Calendar } from 'lucide-react';
import { Card } from '../common/Card';
import { PipelineStatus } from '../../types/pipeline.types';

interface CronScheduleCardProps {
  status: PipelineStatus;
}

export const CronScheduleCard: React.FC<CronScheduleCardProps> = ({ status }) => {
  return (
    <Card
      title="Scheduled Synchronization (Node-Cron)"
      subtitle="Automated background message polling schedule"
    >
      <div className="space-y-4">
        {/* Schedule Spec */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Daily Nightly Cron Trigger
              </span>
            </div>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200">
              {status.cronSchedule}
            </span>
          </div>

          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {status.cronDescription}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60 text-xs">
            <div>
              <span className="text-[11px] text-neutral-400 block">Ingestion Batch Limit:</span>
              <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                Up to {status.cronBatchLimit} messages / account
              </span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 block">Target Timezone:</span>
              <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                Asia/Kolkata (UTC +05:30)
              </span>
            </div>
          </div>
        </div>

        {/* Key Operational Distinction Notice */}
        <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block">Critical Architecture Distinction</span>
            <p className="leading-relaxed text-amber-800 dark:text-amber-300">
              The 23:00 IST cron task <strong>only ingests Gmail messages</strong> into MongoDB. It does <strong>not</strong> invoke the Python classification engine or generate Neo4j summary nodes. Classification is run independently via dedicated Python pipelines.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
