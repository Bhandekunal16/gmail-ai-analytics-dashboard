import React, { useState } from 'react';
import { ClassifiedEmailReference, CategoryMetric } from '../../types/classification.types';
import { Card } from '../common/Card';
import { getCategoryColor, formatNumber } from '../../utils/format';
import { formatKolkataDateTime, formatRelativeTime } from '../../utils/date';
import { EmptyState } from '../common/EmptyState';
import { Mail, Filter, CheckCircle2 } from 'lucide-react';

interface EmailReferencesTableProps {
  emailReferences: ClassifiedEmailReference[];
  categories: CategoryMetric[];
}

export const EmailReferencesTable: React.FC<EmailReferencesTableProps> = ({
  emailReferences,
  categories,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredReferences = emailReferences.filter((ref) => {
    const matchesCategory =
      selectedCategoryFilter === 'ALL' || ref.category === selectedCategoryFilter;
    const matchesSearch =
      !searchQuery ||
      ref.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ref.summary && ref.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <Card
      title="Classified Email References"
      subtitle="Sample messages mapped from MongoDB and classified into Neo4j knowledge clusters"
      headerAction={
        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1 text-neutral-800 dark:text-neutral-200 focus:outline-hidden"
          >
            <option value="ALL">All Categories ({emailReferences.length})</option>
            {categories.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category}
              </option>
            ))}
          </select>
        </div>
      }
    >
      <div className="space-y-3">
        {/* Search filter within references */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search email references by subject, sender, or summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {filteredReferences.length === 0 ? (
          <EmptyState
            icon={<Mail className="w-5 h-5" />}
            title="No email references"
            description={
              searchQuery
                ? 'No classified emails match your search query.'
                : 'No specific email references were returned for this date and category.'
            }
          />
        ) : (
          <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 text-neutral-500 dark:text-neutral-400 font-medium select-none">
                  <th className="px-4 py-2.5">Subject & Summary</th>
                  <th className="px-4 py-2.5">Sender</th>
                  <th className="px-4 py-2.5">Classification</th>
                  <th className="px-4 py-2.5">Confidence</th>
                  <th className="px-4 py-2.5">Received Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {filteredReferences.map((ref, idx) => {
                  const catColor = getCategoryColor(ref.category);
                  const confidencePct = ref.confidence ? Math.round(ref.confidence * 100) : null;

                  return (
                    <tr
                      key={ref.id || `ref-${idx}`}
                      className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      {/* Subject & Summary */}
                      <td className="px-4 py-3 align-top max-w-sm">
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                          {ref.subject}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {ref.emailId && (
                            <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.2 rounded">
                              ID: {ref.emailId}
                            </span>
                          )}
                          {ref.summary && (
                            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                              {ref.summary}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Sender */}
                      <td className="px-4 py-3 align-top text-neutral-700 dark:text-neutral-300 font-mono text-[11px] truncate max-w-[160px]">
                        {ref.sender}
                      </td>

                      {/* Classification */}
                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: catColor }}
                            aria-hidden="true"
                          />
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {ref.category}
                          </span>
                        </div>
                        {ref.subcategory && (
                          <div className="text-[11px] text-neutral-400 dark:text-neutral-500 pl-3.5 mt-0.5">
                            {ref.subcategory}
                          </div>
                        )}
                      </td>

                      {/* Confidence */}
                      <td className="px-4 py-3 align-top whitespace-nowrap font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                        {confidencePct !== null ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="text-emerald-600 dark:text-emerald-400">●</span>
                            <span>{confidencePct}%</span>
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 align-top whitespace-nowrap font-mono tabular-nums text-neutral-500 dark:text-neutral-400">
                        <div>{formatRelativeTime(ref.receivedAt)}</div>
                        <div className="text-[10px] text-neutral-400">
                          {formatKolkataDateTime(ref.receivedAt)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
};
