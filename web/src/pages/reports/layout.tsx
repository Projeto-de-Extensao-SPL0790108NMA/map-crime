import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/reports')({
  component: ReportLayout,
});

function ReportLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost">
            <Link className="flex gap-2" to="/">
              <ArrowLeftIcon className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6 pb-20">
        <div className="max-w-2xl mx-auto space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
