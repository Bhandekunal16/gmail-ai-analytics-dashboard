export interface GmailMessage {
  id: string;
  threadId: string;
  sender: string;
  from?: string;
  to?: string;
  subject: string;
  snippet: string;
  receivedAt: string;
  date?: string;
  labels?: string[];
  sizeEstimate?: number;
  accountId?: string;
}

export interface EmailListResponse {
  messages: GmailMessage[];
  nextPageToken?: string | null;
  hasMore: boolean;
  totalFetched: number;
  accountId?: string;
}

export interface EmailQueryParams {
  accountId: string;
  q?: string;
  pageToken?: string;
  maxResults?: number;
}
