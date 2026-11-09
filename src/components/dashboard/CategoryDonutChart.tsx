import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CategoryMetric } from '../../types/classification.types';
import { getCategoryColor, formatNumber } from '../../utils/format';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { PieChart as PieIcon } from 'lucide-react';

interface CategoryDonutChartProps {
  categories: CategoryMetric[];
  totalClassified: number;
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  categories,
  totalClassified,
}) => {
  if (!categories || categories.length === 0 || totalClassified === 0) {
    return (
      <Card title="Classification Distribution" subtitle="Distribution across identified categories">
        <EmptyState
          icon={<PieIcon className="w-5 h-5" />}
          title="No classification data"
          description="No classified emails found for the selected date and account."
        />
      </Card>
    );
  }

  const chartData = categories.map((cat, index) => ({
    name: cat.category,
    value: cat.count,
    color: getCategoryColor(cat.category, index),
    percentage: cat.percentage ?? (totalClassified > 0 ? Math.round((cat.count / totalClassified) * 100) : 0),
  }));

  return (
    <Card
      title="Classification Distribution"
      subtitle={`Total ${formatNumber(totalClassified)} classified messages`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Donut Chart */}
        <div className="md:col-span-6 h-56 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={58}
                outerRadius={84}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-neutral-900 text-neutral-100 dark:bg-neutral-800 text-xs px-3 py-2 rounded-lg shadow-lg border border-neutral-700">
                        <div className="font-semibold">{data.name}</div>
                        <div className="font-mono tabular-nums text-neutral-300 mt-1">
                          {formatNumber(data.value)} emails ({data.percentage}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Metric */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
              {formatNumber(totalClassified)}
            </span>
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Total</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="md:col-span-6 space-y-2 max-h-56 overflow-y-auto pr-1">
          {chartData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs py-1 border-b border-neutral-100 dark:border-neutral-800/80 last:border-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span className="text-neutral-700 dark:text-neutral-300 truncate font-medium">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono tabular-nums text-neutral-500 dark:text-neutral-400 shrink-0">
                <span className="text-neutral-900 dark:text-neutral-100 font-semibold">
                  {formatNumber(item.value)}
                </span>
                <span className="text-[10px] w-8 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
