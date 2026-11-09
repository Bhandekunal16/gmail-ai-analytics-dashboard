import { GmailAccount } from '../types/account.types';
import { GmailMessage } from '../types/email.types';
import { ClassificationSummaryResponse } from '../types/classification.types';
import { PipelineStatus } from '../types/pipeline.types';
import { getKolkataDateString } from '../utils/date';

export const MOCK_ACCOUNTS: GmailAccount[] = [
  {
    accountId: 'acct_work_prod_01',
    email: 'roboticdev07@gmail.com',
    status: 'ACTIVE',
    lastSyncTimestamp: new Date(Date.now() - 1000 * 60 * 34).toISOString(), // 34 mins ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days ago
    syncCount: 312,
    messagesTotal: 12480,
    lastMessageCount: 42,
  },
  {
    accountId: 'acct_operations_02',
    email: 'ops-alerts@autonomous-ai.co',
    status: 'ACTIVE',
    lastSyncTimestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    syncCount: 145,
    messagesTotal: 6520,
    lastMessageCount: 29,
  },
  {
    accountId: 'acct_finance_03',
    email: 'billing-invoices@autonomous-ai.co',
    status: 'INACTIVE',
    lastSyncTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    lastError: 'Account paused by administrator',
    syncCount: 58,
    messagesTotal: 1980,
    lastMessageCount: 0,
  },
  {
    accountId: 'acct_legacy_dev_04',
    email: 'sandbox-test@dev-legacy.io',
    status: 'EXPIRED',
    lastSyncTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    lastError: 'OAuth refresh token expired or grant revoked by Google',
    syncCount: 410,
    messagesTotal: 8430,
    lastMessageCount: 0,
  },
];

export const MOCK_EMAILS: Record<string, GmailMessage[]> = {
  acct_work_prod_01: [
    {
      id: 'msg_101',
      threadId: 'th_101',
      sender: 'Stripe Billing <invoices@stripe.com>',
      from: 'invoices@stripe.com',
      to: 'roboticdev07@gmail.com',
      subject: 'Invoice #inv_20261108 for Cloud Platform Services',
      snippet: 'Your monthly invoice of $428.50 for Cloud Infrastructure has been processed successfully via Visa ending in 4242...',
      receivedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      labels: ['INBOX', 'FINANCE', 'RECEIPT'],
      sizeEstimate: 24500,
      accountId: 'acct_work_prod_01',
    },
    {
      id: 'msg_102',
      threadId: 'th_102',
      sender: 'GitHub Notifications <notifications@github.com>',
      from: 'notifications@github.com',
      to: 'roboticdev07@gmail.com',
      subject: '[Pull Request #412] Merge release/v2.4.0 into main',
      snippet: 'Automated CI pipeline has passed all 84 test suites. Review requested from backend-lead on commit a9f4c12...',
      receivedAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
      labels: ['INBOX', 'DEVELOPMENT', 'GITHUB'],
      sizeEstimate: 18200,
      accountId: 'acct_work_prod_01',
    },
    {
      id: 'msg_103',
      threadId: 'th_103',
      sender: 'Dr. Arjun Mehta <arjun.mehta@quantum-labs.org>',
      from: 'arjun.mehta@quantum-labs.org',
      to: 'roboticdev07@gmail.com',
      subject: 'Updated Neo4j Knowledge Graph Schema for Classification Clusters',
      snippet: 'Attached is the revised Cypher query plan for aggregating subcategory hierarchies across daily email ingestion partitions...',
      receivedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      labels: ['INBOX', 'IMPORTANT', 'WORK'],
      sizeEstimate: 51200,
      accountId: 'acct_work_prod_01',
    },
    {
      id: 'msg_104',
      threadId: 'th_104',
      sender: 'Google Cloud Platform <gcp-noreply@google.com>',
      from: 'gcp-noreply@google.com',
      to: 'roboticdev07@gmail.com',
      subject: 'Security Alert: New OAuth App authorized for project analytics-prod',
      snippet: 'A new OAuth 2.0 Client credentials grant was accessed from IP 34.120.14.99 at 2026-11-08 19:45 IST...',
      receivedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      labels: ['INBOX', 'SECURITY', 'IMPORTANT'],
      sizeEstimate: 16400,
      accountId: 'acct_work_prod_01',
    },
    {
      id: 'msg_105',
      threadId: 'th_105',
      sender: 'AWS Alerts <no-reply-aws@amazon.com>',
      from: 'no-reply-aws@amazon.com',
      to: 'roboticdev07@gmail.com',
      subject: 'AWS Budget Alert: 85% threshold reached for month of November',
      snippet: 'Your current forecast indicates your monthly spend is on track to reach $1,840 against a budget limit of $2,000...',
      receivedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      labels: ['INBOX', 'FINANCE', 'ALERTS'],
      sizeEstimate: 21900,
      accountId: 'acct_work_prod_01',
    },
    {
      id: 'msg_106',
      threadId: 'th_106',
      sender: 'Linear App <notifications@linear.app>',
      from: 'notifications@linear.app',
      to: 'roboticdev07@gmail.com',
      subject: 'Issue ENG-892: Fix timezone offset in classification report export',
      snippet: 'Priyesh assigned you to ENG-892: The daily summary report needs strict Asia/Kolkata date handling to prevent midnight rollover splits...',
      receivedAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
      labels: ['INBOX', 'WORK', 'LINEAR'],
      sizeEstimate: 12400,
      accountId: 'acct_work_prod_01',
    },
    {
      id: 'msg_107',
      threadId: 'th_107',
      sender: 'Datadog Alerts <alerts@datadoghq.com>',
      from: 'alerts@datadoghq.com',
      to: 'roboticdev07@gmail.com',
      subject: '[RESOLVED] Cron job execution latency normal: Node-cron 23:00 IST',
      snippet: 'Monitor [Cron Sync Ingestion Latency] returned to OK status. P99 latency dropped below 1.2s across all 4 worker threads...',
      receivedAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
      labels: ['INBOX', 'MONITORING'],
      sizeEstimate: 29800,
      accountId: 'acct_work_prod_01',
    },
    {
      id: 'msg_108',
      threadId: 'th_108',
      sender: 'Hacker News Digest <digest@hackernews.email>',
      from: 'digest@hackernews.email',
      to: 'roboticdev07@gmail.com',
      subject: 'Top Engineering Stories: High throughput graph indexing with Neo4j 5.x',
      snippet: 'Curated discussions: Vector indexing inside relational graphs, optimizing Python BERT inference pipelines for mail servers...',
      receivedAt: new Date(Date.now() - 1000 * 60 * 1100).toISOString(),
      labels: ['NEWSLETTERS', 'UPDATES'],
      sizeEstimate: 45000,
      accountId: 'acct_work_prod_01',
    },
  ],
  acct_operations_02: [
    {
      id: 'msg_201',
      threadId: 'th_201',
      sender: 'PagerDuty Alert <alerts@pagerduty.com>',
      from: 'alerts@pagerduty.com',
      to: 'ops-alerts@autonomous-ai.co',
      subject: '[P3 Incident] Memory usage 78% on Redis Cache worker node',
      snippet: 'Incident #10892 triggered. Node cluster-redis-02 memory usage exceeded warning watermark. Automated flush policy active...',
      receivedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      labels: ['INBOX', 'ALERTS', 'OPERATIONS'],
      sizeEstimate: 14200,
      accountId: 'acct_operations_02',
    },
    {
      id: 'msg_202',
      threadId: 'th_202',
      sender: 'Cloudflare Notifications <no-reply@cloudflare.com>',
      from: 'no-reply@cloudflare.com',
      to: 'ops-alerts@autonomous-ai.co',
      subject: 'Weekly SSL/TLS Certificate Expiration Summary',
      snippet: 'Zero certificates expiring within the next 30 days across your 6 registered apex domains and reverse proxies...',
      receivedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      labels: ['INBOX', 'SECURITY'],
      sizeEstimate: 22100,
      accountId: 'acct_operations_02',
    },
  ],
};

export function getMockClassificationSummary(date: string, accountId?: string): ClassificationSummaryResponse {
  // Deterministic count variations based on account
  const isAcct1 = !accountId || accountId === 'acct_work_prod_01';
  const multiplier = isAcct1 ? 1 : 0.65;

  const categories = [
    {
      category: 'Work',
      count: Math.round(184 * multiplier),
      percentage: 38,
      subcategories: [
        { name: 'Engineering & Code Review', count: Math.round(76 * multiplier), percentage: 41 },
        { name: 'Architecture & RFCs', count: Math.round(44 * multiplier), percentage: 24 },
        { name: 'Team Discussions', count: Math.round(38 * multiplier), percentage: 21 },
        { name: 'Customer Support', count: Math.round(26 * multiplier), percentage: 14 },
      ],
    },
    {
      category: 'Transactional',
      count: Math.round(112 * multiplier),
      percentage: 23,
      subcategories: [
        { name: 'Invoices & Receipts', count: Math.round(52 * multiplier), percentage: 46 },
        { name: 'Order Confirmations', count: Math.round(36 * multiplier), percentage: 32 },
        { name: 'Authentication Codes & 2FA', count: Math.round(24 * multiplier), percentage: 22 },
      ],
    },
    {
      category: 'Updates',
      count: Math.round(92 * multiplier),
      percentage: 19,
      subcategories: [
        { name: 'CI/CD Deployments', count: Math.round(46 * multiplier), percentage: 50 },
        { name: 'Monitoring & Logs', count: Math.round(30 * multiplier), percentage: 33 },
        { name: 'Security Warnings', count: Math.round(16 * multiplier), percentage: 17 },
      ],
    },
    {
      category: 'Promotions',
      count: Math.round(64 * multiplier),
      percentage: 13,
      subcategories: [
        { name: 'SaaS Software Offers', count: Math.round(38 * multiplier), percentage: 59 },
        { name: 'Conference & Events', count: Math.round(26 * multiplier), percentage: 41 },
      ],
    },
    {
      category: 'Social',
      count: Math.round(34 * multiplier),
      percentage: 7,
      subcategories: [
        { name: 'LinkedIn Messages', count: Math.round(22 * multiplier), percentage: 65 },
        { name: 'Community Forums', count: Math.round(12 * multiplier), percentage: 35 },
      ],
    },
  ];

  const totalClassified = categories.reduce((sum, c) => sum + c.count, 0);

  const emailReferences = [
    {
      id: 'ref_001',
      messageId: 'msg_101',
      subject: 'Invoice #inv_20261108 for Cloud Platform Services',
      sender: 'invoices@stripe.com',
      receivedAt: `${date}T18:24:00+05:30`,
      category: 'Transactional',
      subcategory: 'Invoices & Receipts',
      confidence: 0.98,
      accountId: accountId || 'acct_work_prod_01',
      summary: 'Automated invoice receipt for monthly cloud compute resources.',
    },
    {
      id: 'ref_002',
      messageId: 'msg_102',
      subject: '[Pull Request #412] Merge release/v2.4.0 into main',
      sender: 'notifications@github.com',
      receivedAt: `${date}T17:15:20+05:30`,
      category: 'Work',
      subcategory: 'Engineering & Code Review',
      confidence: 0.96,
      accountId: accountId || 'acct_work_prod_01',
      summary: 'Automated notification regarding successful test execution on release candidate.',
    },
    {
      id: 'ref_003',
      messageId: 'msg_103',
      subject: 'Updated Neo4j Knowledge Graph Schema for Classification Clusters',
      sender: 'arjun.mehta@quantum-labs.org',
      receivedAt: `${date}T15:42:10+05:30`,
      category: 'Work',
      subcategory: 'Architecture & RFCs',
      confidence: 0.94,
      accountId: accountId || 'acct_work_prod_01',
      summary: 'Technical proposal on node indexing and daily Cypher batch queries.',
    },
    {
      id: 'ref_004',
      messageId: 'msg_104',
      subject: 'Security Alert: New OAuth App authorized for project analytics-prod',
      sender: 'gcp-noreply@google.com',
      receivedAt: `${date}T14:10:00+05:30`,
      category: 'Updates',
      subcategory: 'Security Warnings',
      confidence: 0.99,
      accountId: accountId || 'acct_work_prod_01',
      summary: 'Critical warning about newly granted Google Workspace OAuth credentials.',
    },
    {
      id: 'ref_005',
      messageId: 'msg_105',
      subject: 'AWS Budget Alert: 85% threshold reached for month of November',
      sender: 'no-reply-aws@amazon.com',
      receivedAt: `${date}T11:05:00+05:30`,
      category: 'Transactional',
      subcategory: 'Invoices & Receipts',
      confidence: 0.91,
      accountId: accountId || 'acct_work_prod_01',
      summary: 'Financial budget projection notification for cloud spending.',
    },
    {
      id: 'ref_006',
      messageId: 'msg_106',
      subject: 'Issue ENG-892: Fix timezone offset in classification report export',
      sender: 'notifications@linear.app',
      receivedAt: `${date}T09:30:00+05:30`,
      category: 'Work',
      subcategory: 'Engineering & Code Review',
      confidence: 0.95,
      accountId: accountId || 'acct_work_prod_01',
      summary: 'Ticket assignment for date normalization in Asia/Kolkata timezone.',
    },
  ];

  return {
    date,
    accountId,
    totalClassified,
    categories,
    emailReferences,
    generatedAt: new Date().toISOString(),
  };
}

export const MOCK_PIPELINE_STATUS: PipelineStatus = {
  lastKnownClassificationDate: getKolkataDateString(),
  latestSummaryAvailable: true,
  cronSchedule: '0 23 * * * (Asia/Kolkata)',
  cronBatchLimit: 50,
  cronDescription:
    'Nightly Node-cron job runs daily at 23:00 IST. It fetches up to 50 new Gmail messages for each active account. Note: it does NOT trigger the Python classification algorithm.',
  trainerEndpointMounted: false,
  trainerEndpointStatusMessage:
    'Endpoint POST /trainer/run is not mounted in Express (returns 404). Manual classification trigger is currently disabled in backend.',
};
