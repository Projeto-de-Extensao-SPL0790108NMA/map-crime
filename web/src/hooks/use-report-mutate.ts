import { useMutation } from '@tanstack/react-query';
import type { CreateReportDTO } from '@/interfaces/report';
import api from '@/lib/axios';

interface Output {
  code: string;
}

async function submitReport(data: CreateReportDTO): Promise<Output> {
  const { title, description, coordinates, address, attachments } = data;

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('latitude', String(coordinates.lat));
  formData.append('longitude', String(coordinates.lng));
  formData.append('address', address);

  if (attachments && attachments.length > 0) {
    attachments.forEach((file) => {
      formData.append('attachments', file);
    });
  }

  const reponse = await api.post<Output>('/reports', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return reponse.data;
}

export function useReportMutate() {
  return useMutation({
    mutationFn: submitReport,
  });
}
