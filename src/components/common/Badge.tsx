import React from 'react';
import { AccountStatus } from '../../types/account.types';
import { getStatusTheme } from '../../utils/format';

interface StatusBadgeProps {
  status: AccountStatus;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showDot = true }) => {
  const theme = getStatusTheme(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md border ${theme.bgColor} ${theme.borderColor} ${theme.textColor}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${theme.dotColor}`}
          aria-hidden="true"
        />
      )}
      <span>{theme.label}</span>
    </span>
  );
};

export const TextSeparator: React.FC = () => (
  <span className="text-neutral-300 dark:text-neutral-700 select-none" aria-hidden="true">
    ·
  </span>
);
