import { useQuery } from '@tanstack/react-query';

import type { AnonymousReport } from '@/interfaces/report';
import api from '@/lib/axios';

const fetchReport = async (code: string): Promise<AnonymousReport | null> => {
  const { data } = await api.get(`/reports/${code}/track`).catch((error) => {
    if (error.response?.status === 404) {
      return {
        data: null,
      };
    }
    throw error;
  });

  if (!data) {
    return null;
  }

  const { assignedTo, latitude, longitude, ...report } = data.report;

  return {
    ...report,
    coordinates: {
      lat: latitude,
      lng: longitude,
    },
    assignedTo: assignedTo?.entity,
  };
};

export function useReportByCode(code: string) {
  const query = useQuery({
    queryKey: ['report-by-code', code],
    queryFn: () => fetchReport(code),
    enabled: !!code,
  });

  return query;
}
