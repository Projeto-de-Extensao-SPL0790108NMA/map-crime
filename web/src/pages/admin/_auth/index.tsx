import { createFileRoute } from '@tanstack/react-router';
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ClockIcon,
  FileTextIcon,
  TrendingDown,
  TrendingUp,
  UsersIcon,
  XCircleIcon,
} from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
import { DashboardStats } from './-components/dashboard-stats';
import { DashboardChartBar } from './-components/dashboard-chart-bar';
import { DashboardHeatmap } from './-components/dashboard-heatmap';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/admin/_auth/')({
  component: Dashboard,
});

interface Metrics {
  totalActiveUsers: number;
  totalReports: number;
  reportsByStatus: {
    rejected: number;
    in_progress: number;
    pending: number;
    resolved: number;
  };
  resolutionRateComparison: {
    currentMonth: {
      month: string;
      total: number;
      resolved: number;
      rate: number;
    };
    lastMonth: {
      month: string;
      total: number;
      resolved: number;
      rate: number;
    };
    difference: number;
    percentageChange: number;
  };
}

function Dashboard() {
  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const { data } = await api.get<{ metrics: Metrics }>(
        '/dashboard/metrics',
        {
          withCredentials: true,
        },
      );

      return data.metrics;
    },
  });

  const stats = [
    {
      title: 'Total de Denúncias',
      value: metrics?.totalReports || 0,
      icon: FileTextIcon,
      description: 'Todas as denúncias registradas',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Pendentes',
      value: metrics?.reportsByStatus.pending || 0,
      icon: AlertCircleIcon,
      description: 'Aguardando análise',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Em Análise',
      value: metrics?.reportsByStatus.in_progress || 0,
      icon: ClockIcon,
      description: 'Sendo processadas',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Resolvidas',
      value: metrics?.reportsByStatus.resolved || 0,
      icon: CheckCircle2Icon,
      description: 'Concluídas com sucesso',
      iconColor: 'text-green-600',
    },
    {
      title: 'Rejeitadas',
      value: metrics?.reportsByStatus.rejected || 0,
      icon: XCircleIcon,
      description: 'Denúncias rejeitadas',
      iconColor: 'text-red-600',
    },
    {
      title: 'Usuários Ativos',
      value: metrics?.totalActiveUsers || 0,
      icon: UsersIcon,
      description: 'Cadastrados no sistema',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardStats stats={stats} isLoading={isLoadingMetrics} />

      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Taxa de Resolução - Comparação Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground capitalize">
                    {metrics.resolutionRateComparison.currentMonth.month}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        {metrics.resolutionRateComparison.currentMonth.rate.toFixed(
                          1,
                        )}
                        %
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {metrics.resolutionRateComparison.currentMonth.resolved}{' '}
                      de {metrics.resolutionRateComparison.currentMonth.total}{' '}
                      denúncias
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground capitalize">
                    {metrics.resolutionRateComparison.lastMonth.month}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        {metrics.resolutionRateComparison.lastMonth.rate.toFixed(
                          1,
                        )}
                        %
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {metrics.resolutionRateComparison.lastMonth.resolved} de{' '}
                      {metrics.resolutionRateComparison.lastMonth.total}{' '}
                      denúncias
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  {metrics.resolutionRateComparison.difference >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium">
                      {metrics.resolutionRateComparison.difference >= 0 && '+'}
                      {metrics.resolutionRateComparison.difference.toFixed(
                        2,
                      )}{' '}
                      pontos percentuais
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Variação de{' '}
                      {metrics.resolutionRateComparison.percentageChange.toFixed(
                        1,
                      )}
                      % em relação ao mês anterior
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <DashboardChartBar />

      <DashboardHeatmap />
    </div>
  );
}
