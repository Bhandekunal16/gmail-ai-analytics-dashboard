import React from 'react';
import { Mail, Calendar, User, Tag, Hash, FileText } from 'lucide-react';
import { GmailMessage } from '../../types/email.types';
import { Modal } from '../common/Modal';
import { formatKolkataDateTime } from '../../utils/date';
import { formatBytes } from '../../utils/format';

interface EmailDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: GmailMessage | null;
}

export const EmailDetailModal: React.FC<EmailDetailModalProps> = ({
  isOpen,
  onClose,
  message,
}) => {
  if (!message) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={message.subject || '(No Subject)'}
      description={`Message ID: ${message.id}`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Header Metadata Grid */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800 space-y-2.5 text-xs">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
            <User className="w-4 h-4 text-neutral-400 shrink-0" />
            <span className="font-medium text-neutral-400 w-16">Sender:</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 select-all">
              {message.sender || message.from}
            </span>
          </div>

          {message.to && (
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
              <span className="font-medium text-neutral-400 w-16">To:</span>
              <span className="select-all">{message.to}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
            <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
            <span className="font-medium text-neutral-400 w-16">Received:</span>
            <span className="font-mono tabular-nums">
              {formatKolkataDateTime(message.receivedAt || message.date)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
            <Hash className="w-4 h-4 text-neutral-400 shrink-0" />
            <span className="font-medium text-neutral-400 w-16">Thread ID:</span>
            <span className="font-mono text-[11px] text-neutral-500">{message.threadId}</span>
          </div>

          {message.sizeEstimate !== undefined && (
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
              <span className="font-medium text-neutral-400 w-16">Size:</span>
              <span className="font-mono">{formatBytes(message.sizeEstimate)}</span>
            </div>
          )}
        </div>

        {/* Labels */}
        {message.labels && message.labels.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Gmail Labels</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
              {message.labels.map((label, i) => (
                <span
                  key={label}
                  className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[11px] font-mono text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Snippet / Content Preview */}
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Message Snippet / Body Preview
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs leading-relaxed text-neutral-800 dark:text-neutral-200 font-mono whitespace-pre-wrap select-text">
            {message.snippet || '(No snippet provided by Gmail API)'}
          </div>
        </div>
      </div>
    </Modal>
  );
};
