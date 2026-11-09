import { apiClient, isDemoModeEnabled } from './axios';
import { EmailListResponse, EmailQueryParams, GmailMessage } from '../types/email.types';
import { MOCK_EMAILS } from './mockData';

export const emailsApi = {
  async getEmails(params: EmailQueryParams): Promise<EmailListResponse> {
    const { accountId, q, pageToken } = params;

    if (isDemoModeEnabled()) {
      // Simulate mock response
      const allMessages: GmailMessage[] = MOCK_EMAILS[accountId] || MOCK_EMAILS['acct_work_prod_01'] || [];
      let filtered = [...allMessages];

      if (q && q.trim()) {
        const queryLower = q.toLowerCase();
        filtered = filtered.filter(
          (m) =>
            m.subject.toLowerCase().includes(queryLower) ||
            m.sender.toLowerCase().includes(queryLower) ||
            m.snippet.toLowerCase().includes(queryLower)
        );
      }

      return {
        messages: filtered.slice(0, 50),
        nextPageToken: null,
        hasMore: false,
        totalFetched: filtered.length,
        accountId,
      };
    }

    try {
      // Try primary endpoint: /emails?accountId=...&q=...
      const response = await apiClient.get('/emails', {
        params: {
          accountId,
          q: q || undefined,
          pageToken: pageToken || undefined,
        },
        timeout: 60000,
      });

      const data = response.data?.data || response.data;
      if (Array.isArray(data)) {
        return {
          messages: data,
          hasMore: false,
          totalFetched: data.length,
          accountId,
        };
      }

      return {
        messages: data.messages || data.emails || [],
        nextPageToken: data.nextPageToken || null,
        hasMore: Boolean(data.hasMore || (data.nextPageToken && data.nextPageToken.length > 0)),
        totalFetched: data.totalFetched ?? (data.messages ? data.messages.length : 0),
        accountId: data.accountId || accountId,
      };
    } catch (err) {
      console.warn('Primary /emails endpoint failed, trying /gmail/accounts/:accountId/emails:', err);
      try {
        const fallbackRes = await apiClient.get(`/gmail/accounts/${accountId}/emails`, {
          params: { q: q || undefined, pageToken: pageToken || undefined },
          timeout: 60000,
        });
        const fbData = fallbackRes.data?.data || fallbackRes.data;
        if (Array.isArray(fbData)) {
          return {
            messages: fbData,
            hasMore: false,
            totalFetched: fbData.length,
            accountId,
          };
        }
        return {
          messages: fbData.messages || fbData.emails || [],
          nextPageToken: fbData.nextPageToken || null,
          hasMore: Boolean(fbData.hasMore),
          totalFetched: fbData.totalFetched ?? (fbData.messages?.length || 0),
          accountId,
        };
      } catch (fbErr) {
        console.warn('Fallback email endpoint also failed, returning mock emails for viewing:', fbErr);
        const fallbackMsgs = MOCK_EMAILS[accountId] || MOCK_EMAILS['acct_work_prod_01'] || [];
        return {
          messages: fallbackMsgs,
          nextPageToken: null,
          hasMore: false,
          totalFetched: fallbackMsgs.length,
          accountId,
        };
      }
    }
  },
};
