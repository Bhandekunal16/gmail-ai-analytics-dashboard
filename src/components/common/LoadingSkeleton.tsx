import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number; className?: string }> = ({
  rows = 4,
  className = '',
}) => {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-9 bg-neutral-200/70 dark:bg-neutral-800 rounded-lg w-full"
          style={{ opacity: 1 - i * 0.15 }}
        />
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 animate-pulse space-y-4">
      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
      <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
      <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
    </div>
  );
};
