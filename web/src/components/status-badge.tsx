import { Badge } from './ui/badge';

import type { ReportStatus } from '@/interfaces/report';

import { cn } from '@/lib/utils';

const statusConfig = {
  pending: {
    label: 'Pendente',
    className:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  in_progress: {
    label: 'Em Andamento',
    className:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  resolved: {
    label: 'Resolvido',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  rejected: {
    label: 'Rejeitado',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
};

export const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn('font-semibold', config.className)}>
      {config.label}
    </Badge>
  );
};
