import { useQuery } from '@tanstack/react-query';
import { classificationApi } from '../api/classification.api';

export function useClassificationSummary(date: string, accountId?: string) {
  const query = useQuery({
    queryKey: ['classification-summary', date, accountId || 'all'],
    queryFn: () => classificationApi.getClassificationSummary(date, accountId),
    enabled: Boolean(date),
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });

  return {
    summary: query.data,
    categories: query.data?.categories || [],
    emailReferences: query.data?.emailReferences || [],
    totalClassified: query.data?.totalClassified || 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
