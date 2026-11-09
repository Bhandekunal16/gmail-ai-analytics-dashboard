import React, { useState } from 'react';
import { Play, ShieldAlert, CheckCircle, RefreshCw, Terminal, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { usePipeline } from '../../hooks/usePipeline';

export const TrainerEndpointProbe: React.FC = () => {
  const { pipelineStatus, probeTrainer, isProbing, probeResult } = usePipeline();
  const [lastCheckMessage, setLastCheckMessage] = useState<string | null>(null);

  const isMounted = probeResult ? probeResult.mounted : pipelineStatus?.trainerEndpointMounted;

  const handleProbe = async () => {
    try {
      const res = await probeTrainer();
      setLastCheckMessage(
        res.mounted
          ? `Status ${res.status}: Endpoint is operational.`
          : `Status ${res.status}: ${res.message}`
      );
    } catch (err: any) {
      setLastCheckMessage(`Probe failed: ${err.message || err}`);
    }
  };

  return (
    <Card
      title="Classification Pipeline Execution"
      subtitle="Python BERT/NLP classification worker interface"
      headerAction={
        <Button
          variant="outline"
          size="sm"
          isLoading={isProbing}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isProbing ? 'animate-spin' : ''}`} />}
          onClick={handleProbe}
        >
          Check Endpoint
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Endpoint State Card */}
        <div
          className={`p-4 rounded-xl border space-y-2.5 transition-colors ${
            isMounted
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
              : 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-neutral-500" />
              <span className="text-xs font-mono font-medium text-neutral-900 dark:text-neutral-100">
                POST /trainer/run
              </span>
            </div>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded ${
                isMounted
                  ? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 font-semibold'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {isMounted ? '200 OK (Mounted)' : '404 (Unmounted)'}
            </span>
          </div>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {pipelineStatus?.trainerEndpointStatusMessage ||
              'Endpoint POST /trainer/run is not currently mounted in the Express application (HTTP 404).'}
          </p>

          {lastCheckMessage && (
            <div className="text-[11px] font-mono text-neutral-500 pt-1 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>Probe response: {lastCheckMessage}</span>
            </div>
          )}
        </div>

        {/* Action Trigger Area */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div>
            <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              Manual Classification Trigger
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isMounted
                ? 'Trigger Python classification algorithm over newly ingested MongoDB email batches.'
                : 'Disabled: Backend endpoint is not mounted. The UI avoids fabricating execution state.'}
            </p>
          </div>

          <Button
            variant={isMounted ? 'primary' : 'secondary'}
            size="sm"
            disabled={!isMounted}
            leftIcon={<Play className="w-3.5 h-3.5" />}
            onClick={() => {
              if (isMounted) {
                alert('Triggering classification pipeline on backend...');
              }
            }}
          >
            {isMounted ? 'Run Classification' : 'Endpoint Not Available'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
