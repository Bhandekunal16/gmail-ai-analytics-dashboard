import React, { useState } from 'react';
import { Mail, Calendar, Eye, ChevronRight } from 'lucide-react';
import { GmailMessage } from '../../types/email.types';
import { formatKolkataDateTime, formatRelativeTime } from '../../utils/date';
import { truncateText } from '../../utils/format';
import { Button } from '../common/Button';
import { EmailDetailModal } from './EmailDetailModal';

interface EmailTableProps {
  messages: GmailMessage[];
  isLoading: boolean;
}

export const EmailTable: React.FC<EmailTableProps> = ({ messages, isLoading }) => {
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 text-neutral-500 dark:text-neutral-400 font-medium select-none">
              <th className="px-4 py-3 w-1/4">Sender</th>
              <th className="px-4 py-3 w-1/2">Subject & Snippet</th>
              <th className="px-4 py-3">Received Date</th>
              <th className="px-4 py-3 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
            {messages.map((msg) => (
              <tr
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
              >
                {/* Sender */}
                <td className="px-4 py-3 align-top">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate max-w-[200px]">
                    {msg.sender || msg.from}
                  </div>
                  {msg.labels && msg.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {msg.labels.slice(0, 2).map((lbl) => (
                        <span
                          key={lbl}
                          className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                        >
                          {lbl}
                        </span>
                      ))}
                      {msg.labels.length > 2 && (
                        <span className="text-[10px] text-neutral-400">+{msg.labels.length - 2}</span>
                      )}
                    </div>
                  )}
                </td>

                {/* Subject & Snippet */}
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-neutral-900 dark:text-neutral-100 line-clamp-1">
                    {msg.subject || '(No Subject)'}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1 leading-normal font-sans">
                    {msg.snippet || 'No preview available'}
                  </div>
                </td>

                {/* Received Date */}
                <td className="px-4 py-3 align-top whitespace-nowrap">
                  <div className="font-mono tabular-nums text-neutral-800 dark:text-neutral-200">
                    {formatRelativeTime(msg.receivedAt || msg.date)}
                  </div>
                  <div className="text-[10px] text-neutral-400 dark:text-neutral-500">
                    {formatKolkataDateTime(msg.receivedAt || msg.date)}
                  </div>
                </td>

                {/* Action */}
                <td className="px-4 py-3 align-top text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMessage(msg);
                    }}
                    className="p-1.5 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 rounded-md hover:bg-neutral-200/60 dark:hover:bg-neutral-700 transition-colors"
                    aria-label="Inspect message details"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Detail */}
      <EmailDetailModal
        isOpen={Boolean(selectedMessage)}
        onClose={() => setSelectedMessage(null)}
        message={selectedMessage}
      />
    </div>
  );
};
