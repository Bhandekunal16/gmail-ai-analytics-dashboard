import React, { useState } from 'react';
import { CategoryMetric } from '../../types/classification.types';
import { Card } from '../common/Card';
import { formatNumber, getCategoryColor } from '../../utils/format';
import { EmptyState } from '../common/EmptyState';
import { Layers } from 'lucide-react';

interface SubcategoryBreakdownProps {
  categories: CategoryMetric[];
}

export const SubcategoryBreakdown: React.FC<SubcategoryBreakdownProps> = ({ categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories.length > 0 ? categories[0].category : ''
  );

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

  const currentCategory =
    categories.find((c) => c.category === selectedCategory) || categories[0];
  const activeColor = getCategoryColor(currentCategory.category);

  return (
    <Card
      title="Subcategory Distribution"
      subtitle="Granular classification metrics within primary clusters"
      headerAction={
        <div className="flex items-center gap-1 overflow-x-auto max-w-[280px] sm:max-w-md p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                currentCategory.category === cat.category
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
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
          <span>Subcategory</span>
          <span>Volume & Distribution</span>
        </div>

        {currentCategory.subcategories.length === 0 ? (
          <p className="text-xs text-neutral-500 py-4 text-center">
            No specific subcategories recorded for {currentCategory.category}.
          </p>
        ) : (
          currentCategory.subcategories.map((sub) => {
            const subPercent =
              sub.percentage ??
              (currentCategory.count > 0
                ? Math.round((sub.count / currentCategory.count) * 100)
                : 0);

            return (
              <div key={sub.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {sub.name}
                  </span>
                  <div className="flex items-center gap-2 font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {formatNumber(sub.count)}
                    </span>
                    <span className="text-[11px] text-neutral-400 w-10 text-right">
                      {subPercent}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.max(4, subPercent))}%`,
                      backgroundColor: activeColor,
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
