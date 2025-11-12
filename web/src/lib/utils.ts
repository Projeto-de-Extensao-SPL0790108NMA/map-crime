import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ClassValue } from 'clsx';
import type { Report, ReportStatus } from '@/interfaces/report';
import type { User } from '@/interfaces/user';

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

export const reportMapper = (data: any): SimpleReport => {
  return {
    id: data.id,
    code: data.protocolo,
    status: reportStatusMapper(data.status),
    title: data.categoria,
    createdAt: data.created_at,
  };
};

export const reportsMapper = (data: Array<any>): Array<SimpleReport> => {
  return data.map(reportMapper);
};

export const userMapper = (data: any): User => {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role ?? 'user',
    organization: data.organization,
    status: data.is_active ? 'active' : 'inactive',
  };
};

export const usersMapper = (data: Array<any>): Array<User> => {
  return data.map(userMapper);
};
