import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';

import { useState } from 'react';
import type { ChartConfig } from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';

const chartConfig = {
  open: {
    label: 'Abertos',
    color: 'var(--chart-2)',
  },
  resolved: {
    label: 'Resolvidos',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

interface ResponseData {
  timeline: Array<{
    date: string;
    open: number;
    resolved: number;
  }>;
}

const DATE_RANGE_OPTIONS = ['14', '30', '45', '60'] as const;
type DateRangeOption = (typeof DATE_RANGE_OPTIONS)[number];

const getDateRange = (range: DateRangeOption) => {
  const today = new Date();

  return {
    startDate: subDays(today, +range),
    endDate: today,
  };
};

export function DashboardChartBar() {
  const [dateRange, setDateRange] = useState<DateRangeOption>('30');

  const { data: chartData } = useQuery({
    queryKey: ['admin', 'dashboard', 'chart-bar-data', dateRange],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange(dateRange);
      const { data } = await api.get<ResponseData>(
        '/dashboard/reports-timeline',
        {
          withCredentials: true,
          params: {
            startDate,
            endDate,
          },
        },
      );

      return data.timeline;
    },
  });

  return (
    <Card className="py-0">
      <CardHeader className="border-b pt-6">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle>Casos Abertos vs Resolvidos</CardTitle>
          <CardDescription>
            Número de casos abertos e resolvidos ao longo do tempo
          </CardDescription>
        </div>
        <div className="flex justify-end pt-2 pr-4">
          {DATE_RANGE_OPTIONS.map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? 'default' : 'outline'}
              size="sm"
              className="ml-2"
              onClick={() => setDateRange(range)}
            >
              Últimos {range} dias
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('pt-BR', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('pt-BR', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                />
              }
            />
            <Bar dataKey="open" fill={'var(--color-chart-2)'} />
            <Bar dataKey="resolved" fill={'var(--color-chart-3)'} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
