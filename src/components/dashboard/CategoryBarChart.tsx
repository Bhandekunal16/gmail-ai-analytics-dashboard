import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import { CategoryMetric } from '../../types/classification.types';
import { getCategoryColor, formatNumber } from '../../utils/format';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { BarChart3 } from 'lucide-react';

interface CategoryBarChartProps {
  categories: CategoryMetric[];
}

export const CategoryBarChart: React.FC<CategoryBarChartProps> = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return (
      <Card title="Category-Wise Email Volume" subtitle="Aggregated count per category cluster">
        <EmptyState
          icon={<BarChart3 className="w-5 h-5" />}
          title="No category metrics"
          description="Classification metrics will render here once email clusters are fetched."
        />
      </Card>
    );
  }

  const chartData = categories.map((cat, index) => ({
    category: cat.category,
    count: cat.count,
    color: getCategoryColor(cat.category, index),
    subCount: cat.subcategories.length,
  }));

  return (
    <Card
      title="Category-Wise Email Volume"
      subtitle="Email volume distribution across classified topics"
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-neutral-200 dark:stroke-neutral-800"
            />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              className="text-[11px] fill-neutral-500 dark:fill-neutral-400 font-sans"
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-[11px] fill-neutral-400 dark:fill-neutral-500 font-mono tabular-nums"
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-neutral-900 text-neutral-100 dark:bg-neutral-800 text-xs px-3 py-2 rounded-lg shadow-lg border border-neutral-700">
                      <div className="font-semibold">{data.category}</div>
                      <div className="font-mono tabular-nums text-indigo-300 mt-1">
                        {formatNumber(data.count)} emails
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">
                        {data.subCount} subcategories
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
