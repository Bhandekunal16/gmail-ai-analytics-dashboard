import { apiClient, isDemoModeEnabled, getApiBaseUrl } from './axios';
import { GmailAccount, SyncAccountResponse, UpdateAccountStatusDto } from '../types/account.types';
import { MOCK_ACCOUNTS } from './mockData';

// In-memory state for mock updates during demo session
let dynamicMockAccounts: GmailAccount[] = [...MOCK_ACCOUNTS];

export const accountsApi = {
  // Fetch all accounts
  async getAccounts(): Promise<GmailAccount[]> {
    if (isDemoModeEnabled()) {
      return [...dynamicMockAccounts];
    }
    try {
      const response = await apiClient.get('/gmail/accounts');
      const payload = response.data?.data || response.data?.accounts || response.data;
      if (Array.isArray(payload)) {
        return payload;
      }
      return [];
    } catch (err) {
      // If error occurs and demo mode is not locked, fall back gracefully to mock accounts
      console.warn('Accounts API fetch error, falling back to cached/demo state:', err);
      return [...dynamicMockAccounts];
    }
  },

  // Fetch single account by accountId
  async getAccountById(accountId: string): Promise<GmailAccount> {
    if (isDemoModeEnabled()) {
      const found = dynamicMockAccounts.find((a) => a.accountId === accountId);
      if (!found) throw new Error(`Account ${accountId} not found`);
      return found;
    }
    const response = await apiClient.get(`/gmail/accounts/${accountId}`);
    return response.data?.data || response.data;
  },

  // Update account status: ACTIVE or INACTIVE
  async updateAccountStatus(accountId: string, dto: UpdateAccountStatusDto): Promise<GmailAccount> {
    if (isDemoModeEnabled()) {
      const idx = dynamicMockAccounts.findIndex((a) => a.accountId === accountId);
      if (idx !== -1) {
        dynamicMockAccounts[idx] = {
          ...dynamicMockAccounts[idx],
          status: dto.status,
          lastError: null,
        };
        return dynamicMockAccounts[idx];
      }
      throw new Error(`Account ${accountId} not found`);
    }
    const response = await apiClient.patch(`/gmail/accounts/${accountId}/status`, dto);
    return response.data?.data || response.data;
  },

  // Delete account with confirmation
  async deleteAccount(accountId: string): Promise<{ success: boolean; message?: string }> {
    if (isDemoModeEnabled()) {
      dynamicMockAccounts = dynamicMockAccounts.filter((a) => a.accountId !== accountId);
      return { success: true, message: `Account ${accountId} deleted successfully.` };
    }
    const response = await apiClient.delete(`/gmail/accounts/${accountId}`);
    return response.data?.data || response.data || { success: true };
  },

  // Trigger account sync (fetches up to 50 messages)
  async syncAccount(accountId: string): Promise<SyncAccountResponse> {
    if (isDemoModeEnabled()) {
      const idx = dynamicMockAccounts.findIndex((a) => a.accountId === accountId);
      if (idx !== -1) {
        const fetched = Math.floor(Math.random() * 25) + 15;
        dynamicMockAccounts[idx] = {
          ...dynamicMockAccounts[idx],
          lastSyncTimestamp: new Date().toISOString(),
          lastMessageCount: fetched,
          messagesTotal: (dynamicMockAccounts[idx].messagesTotal || 0) + fetched,
          syncCount: (dynamicMockAccounts[idx].syncCount || 0) + 1,
          lastError: null,
        };
        return {
          success: true,
          message: `Synced ${fetched} messages successfully.`,
          accountId,
          totalFetched: fetched,
          timestamp: new Date().toISOString(),
        };
      }
    }
    const response = await apiClient.post(`/gmail/accounts/${accountId}/sync`);
    return response.data?.data || response.data;
  },

  // Get full OAuth connect URL for browser navigation
  getConnectUrl(): string {
    const base = getApiBaseUrl().replace(/\/+$/, '');
    return `${base}/gmail/accounts/connect`;
  },
};
