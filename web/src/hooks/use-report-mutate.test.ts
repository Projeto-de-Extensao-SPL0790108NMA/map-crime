import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useReportMutate } from './use-report-mutate';
import type { Mocked } from 'vitest';
import type { PropsWithChildren } from 'react';
import api from '@/lib/axios';

vi.mock('@/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
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
describe('useReportMutate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should submit a report successfully', async () => {
    const mockResponse = { code: 'REPORT123' };
    mockedApi.post.mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => useReportMutate(), {
      wrapper: createWrapper(),
    });

    const reportData = {
      title: 'Test Report',
      description: 'This is a test report',
      coordinates: { lat: 10, lng: 20 },
      address: '123 Test St',
      attachments: [],
    };

    result.current.mutate(reportData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedApi.post).toHaveBeenCalledWith(
      '/reports',
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  });

  it('should handle submission error', async () => {
    mockedApi.post.mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useReportMutate(), {
      wrapper: createWrapper(),
    });

    const reportData = {
      title: 'Test Report',
      description: 'This is a test report',
      coordinates: { lat: 10, lng: 20 },
      address: '123 Test St',
      attachments: [],
    };

    result.current.mutate(reportData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network Error');
  });
});
