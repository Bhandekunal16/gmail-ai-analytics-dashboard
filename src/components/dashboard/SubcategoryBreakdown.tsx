import React, { useState } from 'react';
import { CategoryMetric, SubcategoryMetric } from '../../types/classification.types';
import { Card } from '../common/Card';
import { formatNumber, getCategoryColor } from '../../utils/format';
import { EmptyState } from '../common/EmptyState';
import { Layers } from 'lucide-react';

interface SubcategoryBreakdownProps {
  categories: CategoryMetric[];
  allSubcategories?: SubcategoryMetric[];
}

export const SubcategoryBreakdown: React.FC<SubcategoryBreakdownProps> = ({
  categories,
  allSubcategories = [],
}) => {
  // If we have an aggregate list of subcategories, provide an "ALL" option
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!categories || categories.length === 0) {
    return (
      <Card title="Subcategory Distribution" subtitle="Granular breakdown inside each cluster">
        <EmptyState
          icon={<Layers className="w-5 h-5" />}
          title="No subcategories"
          description="Subcategories will appear once classification algorithms process emails."
        />
      </Card>
    );
  }

  // Derive subcategory list to display based on tab
  let displaySubcategories: SubcategoryMetric[] = [];
  let activeColor = '#4f46e5';

  if (selectedCategory === 'ALL') {
    if (allSubcategories && allSubcategories.length > 0) {
      displaySubcategories = allSubcategories;
    } else {
      displaySubcategories = categories.flatMap((c) =>
        c.subcategories.map((s) => ({ ...s, parentCategory: c.category }))
      );
    }
  } else {
    const currentCategory = categories.find((c) => c.category === selectedCategory);
    if (currentCategory) {
      activeColor = getCategoryColor(currentCategory.category);
      displaySubcategories = currentCategory.subcategories;
    }
  }

  // Calculate highest count for proportional progress bars
  const maxCount = displaySubcategories.reduce(
    (max, s) => Math.max(max, s.count),
    1
  );

  return (
    <Card
      title="Subcategory Distribution"
      subtitle="Granular classification metrics within primary clusters"
      headerAction={
        <div className="flex items-center gap-1 overflow-x-auto max-w-[280px] sm:max-w-md p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            All Subcategories ({displaySubcategories.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.category
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              {cat.category} ({cat.count})
            </button>
          ))}
        </div>
      }
    >
      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pb-1 border-b border-neutral-100 dark:border-neutral-800">
          <span>Subcategory & Cluster</span>
          <span>Volume & Proportion</span>
        </div>

        {displaySubcategories.length === 0 ? (
          <p className="text-xs text-neutral-500 py-4 text-center">
            No specific subcategories recorded for {selectedCategory}.
          </p>
        ) : (
          displaySubcategories.map((sub) => {
            const barColor =
              sub.parentCategory ? getCategoryColor(sub.parentCategory) : activeColor;
            const barWidthPercent = Math.min(100, Math.max(6, Math.round((sub.count / maxCount) * 100)));

            return (
              <div key={sub.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: barColor }}
                      aria-hidden="true"
                    />
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {sub.name}
                    </span>
                    {sub.parentCategory && selectedCategory === 'ALL' && (
                      <span className="text-[10px] text-neutral-400 font-mono">
                        ({sub.parentCategory})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {formatNumber(sub.count)}
                    </span>
                    <span className="text-[11px] text-neutral-400 w-12 text-right">
                      {sub.percentage !== undefined ? `${sub.percentage}%` : ''}
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${barWidthPercent}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
