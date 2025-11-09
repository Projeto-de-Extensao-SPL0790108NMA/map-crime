import {
  CalendarIcon,
  FileTextIcon,
  MapPinIcon,
  MessageSquareIcon,
  UserIcon,
} from 'lucide-react';

import type { AnonymousReport } from '@/interfaces/report';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/status-badge';
import { formatDate } from '@/lib/utils';
import { CATEGORIES_MAP } from '@/constants/categories';

interface ReportDetailsProps {
  report: AnonymousReport;
}

export function ReportDetails({ report }: ReportDetailsProps) {
  return (
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

        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
            <MapPinIcon className="h-4 w-4" />
            Localização
          </h3>
          <p className="text-sm">{report.address}</p>
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

        {report.assignedTo && (
          <>
            <Separator />
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                <UserIcon className="h-4 w-4" />
                Responsável
              </h3>
              <p className="text-sm">{report.assignedTo}</p>
            </div>
          </>
        )}

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
                      ({attachment.type}, {(attachment.size / 1024).toFixed(2)}{' '}
                      KB)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
