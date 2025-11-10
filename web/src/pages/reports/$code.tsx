import { Link, createFileRoute } from '@tanstack/react-router';
import { AlertCircleIcon, Loader2 } from 'lucide-react';

import { useEffect } from 'react';
import { ReportNotFound } from './-components/report-not-found';
import { ReportDetails } from './-components/report-details';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useReportByCode } from '@/hooks/use-get-report-by-code';
import { ReportTimeline } from '@/components/report-timeline';

export const Route = createFileRoute('/reports/$code')({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { isLoading, data, isError } = useReportByCode(params.code);

  useEffect(() => {
    console.log('Denúncia carregada:', data);
  }, [data]);

  if (isLoading) {
    return (
      <Card className="w-full p-4 flex items-center justify-center">
        <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
        <span>Carregando...</span>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/50 animate-in fade-in-50 duration-500">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircleIcon className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            Ocorreu um erro ao carregar a denúncia
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>Por favor, tente novamente mais tarde.</p>
          <Button>
            <Link className="flex items-center gap-2" to="/">
              Voltar para a página inicial
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return <ReportNotFound code={params.code} />;
  }

  return (
    <>
      <ReportDetails report={data} />
      {data.timeline.length > 0 && <ReportTimeline timeline={data.timeline} />}
    </>
  );
}
