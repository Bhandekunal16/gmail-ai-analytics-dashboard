/**
 * Date utilities with strict Asia/Kolkata (IST) timezone awareness.
 */

// Return current date formatted as YYYY-MM-DD in Asia/Kolkata timezone
export function getKolkataDateString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date); // en-CA produces YYYY-MM-DD
}

// Format an ISO string or Date into human-readable format in Asia/Kolkata
export function formatKolkataDateTime(
  dateInput: string | number | Date | null | undefined
): string {
  if (!dateInput) return 'Never';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);

    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(d) + ' IST';
  } catch {
    return String(dateInput);
  }
}

// Short date format (e.g., 08 Nov 2026)
export function formatKolkataDate(
  dateInput: string | number | Date | null | undefined
): string {
  if (!dateInput) return '—';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);

    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return String(dateInput);
  }
}

// Relative time formatter (e.g., "5 mins ago", "2 hours ago")
export function formatRelativeTime(
  dateInput: string | number | Date | null | undefined
): string {
  if (!dateInput) return 'Never';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);

    const now = Date.now();
    const diffMs = now - d.getTime();
    if (diffMs < 0) return 'Just now';

    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;

    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;

    const diffDays = Math.floor(diffHr / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return formatKolkataDate(d);
  } catch {
    return String(dateInput);
  }
}

// Get array of past N dates in YYYY-MM-DD (Asia/Kolkata)
export function getRecentKolkataDates(count: number = 7): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(getKolkataDateString(d));
  }
  return dates;
}
