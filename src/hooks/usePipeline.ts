import { useQuery, useMutation } from '@tanstack/react-query';
import { pipelineApi } from '../api/pipeline.api';

export function usePipeline() {
  const statusQuery = useQuery({
    queryKey: ['pipeline-status'],
    queryFn: () => pipelineApi.getPipelineStatus(),
    staleTime: 1000 * 30,
    retry: 1,
  });

  const probeMutation = useMutation({
    mutationFn: () => pipelineApi.probeTrainerEndpoint(),
  });

  return {
    pipelineStatus: statusQuery.data,
    isLoading: statusQuery.isLoading,
    isFetching: statusQuery.isFetching,
    error: statusQuery.error as Error | null,
    refetch: statusQuery.refetch,
    probeTrainer: probeMutation.mutateAsync,
    isProbing: probeMutation.isPending,
    probeResult: probeMutation.data,
  };
}
