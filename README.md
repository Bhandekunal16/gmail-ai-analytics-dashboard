# Gmail AI Analytics Dashboard

A modern, responsive, production-ready React analytics dashboard for multi-account Gmail AI classification and synchronization pipelines.

Built to interface with an existing Node.js, Express, MongoDB, Neo4j, and Python NLP classification backend.

---

## Architecture & Features

### 1. Dashboard Overview
- Executive-style summary of connected, active, inactive, and expired/revoked Gmail accounts.
- Total classified emails and identified category clusters.
- Visual analytics powered by Recharts:
  - Donut chart: Email classification distribution across primary categories.
  - Bar chart: Category-wise email volume.
  - Subcategory breakdown with interactive category selector and proportion indicators.
  - Account-wise comparison of ingested messages and batch counts.
- Date filters and Gmail account filters adhering strictly to the **Asia/Kolkata (IST)** timezone partition.

### 2. Multi-Account Gmail Management
- View all connected accounts with email, account ID, status, last synchronization time, and creation date.
- Status management: Activate or Deactivate (`PATCH /gmail/accounts/:accountId/status`).
- On-demand synchronization trigger (`POST /gmail/accounts/:accountId/sync`) to poll the latest batch of up to 50 messages.
- Secure Google OAuth 2.0 connection (`GET /gmail/accounts/connect`) via top-level browser redirect.
- Safe deletion flow with destructive confirmation modal (`DELETE /gmail/accounts/:accountId`).
- Zero token exposure: OAuth access and refresh tokens reside strictly in server-side MongoDB.

### 3. Email Explorer
- Account selector and Gmail search query bar (`q=newer_than:1d`, `from:stripe.com`, etc.).
- 50-message paginated table with sender information, subject, snippet, and received timestamp.
- Detailed message inspector modal displaying full headers, Gmail labels, thread ID, and body snippet.
- Responsive pagination driven by `nextPageToken` and `hasMore`.

### 4. Classification Analytics
- Query classification summaries combining Neo4j graph aggregates and MongoDB email references (`GET /emails/classificationSummary/:date?accountId=acct_123`).
- Category and subcategory breakdowns with percentage distribution.
- Searchable and category-filterable email references list with classification confidence indicators.

### 5. Pipeline Monitoring
- Real-time monitoring of the nightly `0 23 * * *` (23:00 Asia/Kolkata) Node-cron synchronization job.
- Clear distinction between Gmail ingestion (Node.js) and email classification (Python/NLP).
- Interactive diagnostic probe for `POST /trainer/run` that gracefully reflects when the endpoint is unmounted (404) without fabricating mock training runs.
- Account-level sync error tracking and health statuses.

### 6. Environment & Settings
- Dynamic Base URL configuration (defaults to `http://localhost:8002` from `VITE_API_BASE_URL`).
- Support for `X-Admin-Token` authentication header (`VITE_ADMIN_API_TOKEN`).
- Offline Demo Mode toggle to preview full dashboard capabilities even when the local backend is offline.
- Dual-theme support (Light / Dark mode).

---

## Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 with custom font pairing (Plus Jakarta Sans + JetBrains Mono)
- **State & Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios with automatic request configuration and decryption interceptor
- **Routing**: React Router v7
- **Charts & Visualizations**: Recharts
- **Icons**: Lucide React

---

## Installation & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` if custom endpoints or tokens are needed:
```bash
VITE_API_BASE_URL="http://localhost:8002"
VITE_ADMIN_API_TOKEN=""
```

### 3. Run Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

---

## Backend API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/gmail/accounts` | List all connected Gmail accounts |
| `GET` | `/gmail/accounts/connect` | Initiates Google OAuth 2.0 redirect flow |
| `GET` | `/gmail/accounts/:accountId` | Retrieve specific account metadata |
| `PATCH` | `/gmail/accounts/:accountId/status` | Update account status (`ACTIVE` or `INACTIVE`) |
| `DELETE` | `/gmail/accounts/:accountId` | Disconnect and delete Gmail account |
| `POST` | `/gmail/accounts/:accountId/sync` | Trigger manual message synchronization |
| `GET` | `/emails?accountId=...&q=...` | Query ingested Gmail messages (up to 50) |
| `GET` | `/emails/classificationSummary/:date` | Retrieve Neo4j summary & MongoDB references for date (IST) |
| `POST` | `/trainer/run` | Python NLP trainer trigger (diagnostically probed) |
