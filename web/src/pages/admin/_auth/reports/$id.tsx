import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Ban,
  CalendarIcon,
  CheckCheck,
  FileTextIcon,
  Loader,
  Loader2,
  MessageSquareIcon,
} from 'lucide-react';
import { Separator } from '@radix-ui/react-separator';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Dialog } from '@radix-ui/react-dialog';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
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
import { env } from '@/env';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/admin/_auth/reports/$id')({
  component: RouteComponent,
});

async function getReport(id: string): Promise<Report | null> {
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

  if (!response?.data?.report) {
    return null;
  }

  const { latitude, longitude, ...rest } = response.data.report;

  return { ...rest, coordinates: { lat: latitude, lng: longitude } };
}

function RouteComponent() {
  const params = Route.useParams();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');

  const { data: report } = useQuery({
    queryKey: ['report', params.id],
    queryFn: () => getReport(params.id),
  });

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const updateStatus = useCallback(async () => {
    if (!status) {
      toast.error('Por favor, selecione um status para atualizar.');
      return;
    }

    try {
      await api.patch(
        `/reports/${params.id}/status`,
        {
          status,
        },
        { withCredentials: true },
      );

      toast.success('Status atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['report', params.id] });
    } catch (error) {
      toast.error('Erro ao atualizar o status. Tente novamente.');
    }
  }, [status]);

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
          <CardContent>
            <div>
              {loadError ? (
                <div className="p-4 text-sm text-red-500">
                  Erro ao carregar o mapa.
                </div>
              ) : !isLoaded ? (
                <div
                  className="flex items-center justify-center"
                  style={{ height: 400 }}
                >
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={{
                    width: '100%',
                    height: '500px',
                    borderRadius: '0.75rem',
                  }}
                  center={{
                    lat: -3.119,
                    lng: -60.0217,
                  }}
                  zoom={15}
                  options={{
                    disableDefaultUI: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    minZoom: 15,
                    maxZoom: 15,
                  }}
                >
                  <Marker
                    position={{
                      lat: -3.119,
                      lng: -60.0217,
                    }}
                    animation={google.maps.Animation.BOUNCE}
                  />
                </GoogleMap>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-100 space-y-6">
        {['pending', 'in_progress'].includes(report.status) && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Atualizar Status</CardTitle>
                <CardDescription>
                  Atualize o status deste relatório.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="atualizar status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_progress">
                      <Loader />
                      Em Andamento
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

                <Button
                  className="mt-4 w-full"
                  variant="default"
                  onClick={updateStatus}
                >
                  Atualizar Status
                </Button>
              </CardContent>
            </Card>

            <AssignReportCard
              reportId={params.id}
              currentAssignedTo={report.assignedTo?.id}
            />
          </>
        )}

        {report.timeline.length > 0 && (
          <ReportTimeline timeline={report.timeline} />
        )}
      </div>
    </div>
  );
}
