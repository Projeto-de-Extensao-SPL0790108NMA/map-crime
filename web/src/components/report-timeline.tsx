import { Clock, FileText, MessageSquare, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TimelineEvent } from '@/interfaces/report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReportTimelineProps {
  timeline: Array<TimelineEvent>;
}

const getEventIcon = (type: TimelineEvent['action']) => {
  switch (type) {
    case 'created':
      return <FileText className="h-4 w-4" />;
    case 'status_updated':
      return <Clock className="h-4 w-4" />;
    case 'comment_added':
      return <MessageSquare className="h-4 w-4" />;
    case 'assigned_to_user':
      return <UserCheck className="h-4 w-4" />;
  }
};

const getEventTitle = (event: TimelineEvent) => {
  switch (event.action) {
    case 'created':
      return 'Denúncia Criada';
    case 'status_updated':
      return 'Status Atualizado';
    case 'comment_added':
      return 'Comentário Adicionado';
    case 'assigned_to_user':
      return 'Atribuído';
  }
};

const UserDetails = ({ user }: { user: TimelineEvent['createdBy'] }) => {
  if (!user) return null;

  return (
    <>
      {user.name && (
        <span className="font-medium text-foreground">{user.name} - </span>
      )}
      <span className="font-medium text-foreground">{user.entity}</span>
    </>
  );
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pendente: 'Pendente',
    em_analise: 'Em Análise',
    resolvida: 'Resolvida',
    arquivada: 'Arquivada',
  };
  return labels[status] || status;
};

export const ReportTimeline = ({ timeline }: ReportTimelineProps) => {
  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Linha do Tempo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6">
          {/* Timeline line */}
          <div className="absolute left-5 top-2 bottom-2 w-px bg-border" />

          {sortedTimeline.map((event) => (
            <div key={event.id} className="relative flex gap-4 group">
              {/* Icon */}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-background bg-card shadow-sm">
                <div className="rounded-full bg-primary/10 p-1.5 text-primary">
                  {getEventIcon(event.action)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2 pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">
                      {getEventTitle(event)}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(event.createdAt),
                        "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                        { locale: ptBR },
                      )}
                    </p>
                  </div>
                </div>

                {/* Event details */}
                <div className="space-y-2 text-sm">
                  {event.action === 'created' && (
                    <p className="text-muted-foreground">
                      Denúncia registrada anonimamente no sistema
                    </p>
                  )}

                  {event.action === 'status_updated' && (
                    <div className="space-y-2">
                      {event.createdBy && (
                        <p className="text-muted-foreground">
                          Atualizado por: <UserDetails user={event.createdBy} />
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {getStatusLabel(event.metadata.previousStatus || '')}
                        </Badge>
                        <span className="text-muted-foreground">→</span>
                        <Badge variant="default" className="text-xs">
                          {getStatusLabel(event.metadata.newStatus || '')}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {event.action === 'comment_added' && (
                    <div className="space-y-2">
                      {event.createdBy && (
                        <p className="text-muted-foreground">
                          Comentado por: <UserDetails user={event.createdBy} />
                        </p>
                      )}
                      {event.metadata.comment && (
                        <div className="rounded-md bg-muted p-3 text-foreground">
                          {event.metadata.comment}
                        </div>
                      )}
                    </div>
                  )}

                  {event.action === 'assigned_to_user' && (
                    <div className="space-y-1">
                      {event.createdBy && (
                        <p className="text-muted-foreground">
                          Atribuído por: <UserDetails user={event.createdBy} />
                        </p>
                      )}
                      {event.metadata.assignedUser && (
                        <p className="text-muted-foreground">
                          Responsável:{' '}
                          <UserDetails user={event.metadata.assignedUser} />
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
