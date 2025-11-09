import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ClassValue } from 'clsx';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string | Date) => {
  return format(new Date(date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'", {
    locale: ptBR,
  });
};
