import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Ban,
  CalendarIcon,
  CheckCheck,
  FileTextIcon,
  Loader,
  MapPinIcon,
  MessageSquareIcon,
  UserIcon,
} from 'lucide-react';
import { Separator } from '@radix-ui/react-separator';
import { AssignReportCard } from './-components/assign-report-card';
import type { Report } from '@/interfaces/report';
import api from '@/lib/axios';
import { formatDate } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import { CATEGORIES_MAP } from '@/constants/categories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReportTimeline } from '@/components/report-timeline';

export const Route = createFileRoute('/admin/_auth/reports/$id')({
  component: RouteComponent,
});

async function getReport(id: string): Promise<Report> {
  const response = await api
    .get(`/reports/${id}`, {
      withCredentials: true,
    })
    .catch((error) => {
      if (error.response.status === 404) {
        return null;
      }

      throw error;
    });

  return response?.data?.report;
}

function RouteComponent() {
  const params = Route.useParams();

  const { data: report } = useQuery({
    queryKey: ['report', params.id],
    queryFn: () => getReport(params.id),
  });

  if (!report) {
    return <h1>error</h1>;
  }

  return (
    <div className="min-h-screen bg-muted p-8 space-y-6 flex gap-4">
      <div className="flex-1 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <CardTitle className="text-2xl">
                  {CATEGORIES_MAP[report.title]}
                </CardTitle>
                <CardDescription className="text-base">
                  Código:{' '}
                  <span className="font-mono font-semibold">{report.code}</span>
                </CardDescription>
              </div>

              <StatusBadge status={report.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                <FileTextIcon className="h-4 w-4" />
                Descrição
              </h3>
              <p className="text-foreground leading-relaxed">
                {report.description}
              </p>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                  <CalendarIcon className="w-4 h-4" />
                  Data de Criação
                </h3>
                <p className="text-sm">{formatDate(report.createdAt)}</p>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                  <CalendarIcon className="w-4 h-4" />
                  Última Atualização
                </h3>
                <p className="text-sm">{formatDate(report.updatedAt)}</p>
              </div>
            </div>

            {report.note && (
              <>
                <Separator />
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-4">
                    <MessageSquareIcon className="h-4 w-4" />
                    Observações
                  </h3>
                  <div className="space-y-6">
                    <div className="border-l-2 border-primary pl-4">
                      <p className="text-sm text-foreground leading-relaxed">
                        {report.note}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {report.attachments.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-4">
                    <FileTextIcon className="h-4 w-4" />
                    Anexos
                  </h3>
                  <div className="space-y-4">
                    {report.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          {attachment.name}
                        </a>
                        <span className="text-xs text-muted-foreground">
                          ({attachment.type},{' '}
                          {(attachment.size / 1024).toFixed(2)} KB)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <h1>Mapa aqui</h1>
          </CardContent>
        </Card>
      </div>
      <div className="w-80 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Atualizar Status</CardTitle>
            <CardDescription>
              Atualize o status deste relatório.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="atualizar status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_progress">
                  <Loader />
                  Em progresso
                </SelectItem>
                <SelectItem value="resolved">
                  <CheckCheck />
                  Resolvido
                </SelectItem>
                <SelectItem value="rejected">
                  <Ban />
                  Rejeitado
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <AssignReportCard
          reportId={params.id}
          currentAssignedTo={report.assignedTo?.id}
        />

        <ReportTimeline timeline={report.timeline} />
      </div>
    </div>
  );
}
