export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'REVOKED';

export interface GmailAccount {
  accountId: string;
  email: string;
  status: AccountStatus;
  lastSyncTimestamp: string | null;
  createdAt: string;
  lastError?: string | null;
  syncCount?: number;
  messagesTotal?: number;
  lastMessageCount?: number;
}

export interface UpdateAccountStatusDto {
  status: 'ACTIVE' | 'INACTIVE';
}

export interface SyncAccountResponse {
  success: boolean;
  message?: string;
  accountId: string;
  totalFetched?: number;
  timestamp?: string;
}
