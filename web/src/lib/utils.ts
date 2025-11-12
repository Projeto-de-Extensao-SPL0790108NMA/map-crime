import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ClassValue } from 'clsx';
import type { Report, ReportStatus } from '@/interfaces/report';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string | Date) => {
  return format(new Date(date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'", {
    locale: ptBR,
  });
};

const reportStatusMapper = (status: string): ReportStatus => {
  switch (status) {
    case 'pending':
      return 'pending';
    case 'em_analise':
      return 'in_progress';
    case 'aprovado':
      return 'resolved';
    case 'rejeitado':
      return 'rejected';
    default:
      throw new Error(`Unknown status: ${status}`);
  }
};

type SimpleReport = Pick<
  Report,
  'id' | 'code' | 'status' | 'title' | 'createdAt'
>;

export const reportsMapper = (data: any): SimpleReport => {
  return {
    id: data.id,
    code: data.protocolo,
    status: reportStatusMapper(data.status),
    title: data.categoria,
    createdAt: data.created_at,
  };
};

export const mapReports = (data: Array<any>): Array<SimpleReport> => {
  return data.map(reportsMapper);
};
