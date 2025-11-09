import { Link } from '@tanstack/react-router';
import { AlertCircleIcon, ArrowLeftIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ReportNotFound({ code }: { code: string }) {
  return (
    <Card className="border-destructive/50 animate-in fade-in-50 duration-500">
      <CardHeader className="text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertCircleIcon className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <CardTitle className="text-2xl">Denúncia não encontrada</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">
          A denúncia com o código{' '}
          <span className="font-mono font-semibold text-foreground">
            "{code}"
          </span>{' '}
          não foi encontrada.
        </p>
        <p className="text-sm text-muted-foreground">
          Verifique se o código foi digitado corretamente e tente novamente.
        </p>
        <div className="pt-4">
          <Button size="lg" variant="default">
            <Link className="flex items-center gap-2" to="/">
              <ArrowLeftIcon className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
