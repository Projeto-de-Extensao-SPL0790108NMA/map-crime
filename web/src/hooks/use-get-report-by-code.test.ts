import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGetReportByCode } from './use-get-report-by-code';
import type { Mocked } from 'vitest';
import type { PropsWithChildren } from 'react';
import api from '@/lib/axios';

vi.mock('@/lib/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockedApi = api as Mocked<typeof api>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: PropsWithChildren) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};
describe('useReportByCode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not fetch when code is empty', () => {
    const { result } = renderHook(() => useGetReportByCode(''), {
      wrapper: createWrapper(),
    });
    expect(result.current.data).toBeUndefined();
    expect(result.current.isFetching).toBe(false);
  });

  it('should return null for invalid code (404)', async () => {
    mockedApi.get.mockRejectedValueOnce({
      response: {
        status: 404,
      },
    });

    const { result } = renderHook(() => useGetReportByCode('INVALID'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeNull();
    expect(mockedApi.get).toHaveBeenCalledWith('/reports/track/INVALID');
  });

  it('should return report data for valid code', async () => {
    const mockReport = {
      report: {
        code: 'ABC123',
        status: 'pending' as const,
        title: 'Test Report',
        latitude: -23.5505,
        longitude: -46.6333,
        address: 'São Paulo, SP',
        assignedTo: {
          organization: 'Police Department',
        },
        timeline: [],
        attachments: [],
        description: 'Test description',
        createdAt: '2025-11-09T10:00:00Z',
        updatedAt: '2025-11-09T10:00:00Z',
      },
    };

    mockedApi.get.mockResolvedValueOnce({ data: mockReport });

    const { result } = renderHook(() => useGetReportByCode('ABC123'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({
      code: 'ABC123',
      status: 'pending',
      title: 'Test Report',
      coordinates: {
        lat: -23.5505,
        lng: -46.6333,
      },
      address: 'São Paulo, SP',
      assignedTo: 'Police Department',
      timeline: [],
      attachments: [],
      description: 'Test description',
      createdAt: '2025-11-09T10:00:00Z',
      updatedAt: '2025-11-09T10:00:00Z',
    });
    expect(mockedApi.get).toHaveBeenCalledWith('/reports/track/ABC123');
  });

  it('should throw error for non-404 errors', async () => {
    mockedApi.get.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    const { result } = renderHook(() => useGetReportByCode('ERROR'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.data).toBeUndefined();
  });
});
