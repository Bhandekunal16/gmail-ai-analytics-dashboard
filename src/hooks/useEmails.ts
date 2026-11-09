import { useQuery } from '@tanstack/react-query';
import { emailsApi } from '../api/emails.api';
import { EmailQueryParams } from '../types/email.types';

export function useEmails(params: EmailQueryParams, enabled: boolean = true) {
  const query = useQuery({
    queryKey: ['emails', params.accountId, params.q || '', params.pageToken || ''],
    queryFn: () => emailsApi.getEmails(params),
    enabled: enabled && Boolean(params.accountId),
    staleTime: 1000 * 20, // 20 seconds
    retry: 1,
  });

  return {
    data: query.data,
    messages: query.data?.messages || [],
    hasMore: query.data?.hasMore || false,
    nextPageToken: query.data?.nextPageToken || null,
    totalFetched: query.data?.totalFetched || 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
