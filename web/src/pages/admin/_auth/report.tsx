import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const Route = createFileRoute('/admin/_auth/report')({
  component: Reports,
});

interface Report {
  id: string;
  title: string;
  period: string;
  generatedAt: string;
  status: 'Processando' | 'Erro' | 'Concluído';
  type: 'Mensal' | 'Trimestral' | 'Anual' | 'Personalizado';
}

const mockReports: Array<Report> = [
  {
    id: '1',
    title: 'Relatório de Denúncias - Janeiro 2024',
    period: '01/01/2024 - 30/01/2024',
    generatedAt: '20/10/2025',
    status: 'Processando',
    type: 'Mensal',
  },
  {
    id: '2',
    title: 'Relatório de Denúncias - Fevereiro 2024',
    period: '01/02/2024 - 30/02/2024',
    generatedAt: '25/10/2025',
    status: 'Erro',
    type: 'Personalizado',
  },
  {
    id: '3',
    title: 'Relatório de Denúncias - Março 2024',
    period: '01/03/2024 - 30/03/2024',
    generatedAt: '06/11/2025',
    status: 'Concluído',
    type: 'Trimestral',
  },
  {
    id: '4',
    title: 'Relatório de Denúncias - Abril 2024',
    period: '01/04/2024 - 30/04/2024',
    generatedAt: '08/11/2025',
    status: 'Concluído',
    type: 'Personalizado',
  },
  {
    id: '5',
    title: 'Relatório de Denúncias - Maio 2024',
    period: '01/05/2024 - 30/05/2024',
    generatedAt: '17/10/2025',
    status: 'Erro',
    type: 'Trimestral',
  },
  {
    id: '6',
    title: 'Relatório de Denúncias - Janeiro 2024',
    period: '01/06/2024 - 30/06/2024',
    generatedAt: '21/10/2025',
    status: 'Concluído',
    type: 'Anual',
  },
];

function Reports() {
  const [reports] = useState<Array<Report>>(mockReports);

  const renderStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'Concluído':
        return (
          <Badge className="bg-[#2E3A59] text-white hover:bg-[#2E3A59]">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Concluído
          </Badge>
        );
      case 'Erro':
        return (
          <Badge className="bg-[#E11D48] text-white hover:bg-[#E11D48]">
            <AlertCircle className="w-3 h-3 mr-1" />
            Erro
          </Badge>
        );
      case 'Processando':
        return (
          <Badge className="bg-[#E5E7EB] text-[#4B5563] hover:bbg-[#E5E7EB]">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin-slow" />
            Processando
          </Badge>
        );
    }
  };

  const renderTypeBadge = (type: Report['type']) => (
    <Badge variant="outline" className="text-muted-foreground">
      {type}
    </Badge>
  );

  return (
    <div className="min-h-screen bg-muted p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Relatórios
          </h1>
          <p className="text-muted-foreground text-sm">
            Gere e baixe relatórios do sistema
          </p>
        </div>
        <Button className="gap-2 px-4 bg-[#2E3A59] hover:bg-[#3B496D]">
          <Plus className="w-4 h-4" />
          Gerar Relatório
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            Relatórios Gerados
          </h2>

          <div className="space-y-4">
            {reports.map((report) => (
              <Card
                key={report.id}
                className="shadow-sm border border-border/60"
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-muted rounded-full p-3">
                        <FileText className="w-6 h-6 text-[#2E3A59]" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">
                            {report.title}
                          </h3>
                          {renderStatusBadge(report.status)}
                          {renderTypeBadge(report.type)}
                        </div>

                        <p className="text-muted-foreground text-sm">
                          Período: {report.period}
                        </p>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          Gerado em {report.generatedAt} por Admin Sistema
                        </p>
                      </div>
                    </div>

                    <div>
                      {report.status === 'Concluído' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Reports;
