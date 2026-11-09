import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '../api/accounts.api';
import { UpdateAccountStatusDto } from '../types/account.types';

export const ACCOUNTS_QUERY_KEY = ['gmail-accounts'];

export function useAccounts() {
  const queryClient = useQueryClient();

  const accountsQuery = useQuery({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn: () => accountsApi.getAccounts(),
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ accountId, dto }: { accountId: string; dto: UpdateAccountStatusDto }) =>
      accountsApi.updateAccountStatus(accountId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (accountId: string) => accountsApi.deleteAccount(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });

  const syncAccountMutation = useMutation({
    mutationFn: (accountId: string) => accountsApi.syncAccount(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
  });

  return {
    accounts: accountsQuery.data || [],
    isLoading: accountsQuery.isLoading,
    isFetching: accountsQuery.isFetching,
    error: accountsQuery.error as Error | null,
    refetch: accountsQuery.refetch,
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
    deleteAccount: deleteAccountMutation.mutateAsync,
    isDeleting: deleteAccountMutation.isPending,
    syncAccount: syncAccountMutation.mutateAsync,
    isSyncing: syncAccountMutation.isPending,
    getConnectUrl: accountsApi.getConnectUrl,
  };
}
