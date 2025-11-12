import { toast as sonner } from 'sonner';

export const toast = {
  success: (message: string) => {
    sonner.success(message, {
      style: {
        backgroundColor: 'var(--color-green-100)',
        color: 'var(--color-green-900)',
        borderColor: 'var(--color-green-200)',
      },
    });
  },
  error: (message: string) => {
    sonner.error(message, {
      style: {
        backgroundColor: 'var(--color-red-100)',
        color: 'var(--color-red-900)',
        borderColor: 'var(--color-red-200)',
      },
    });
  },
};
