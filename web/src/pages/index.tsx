import { Link, createFileRoute } from '@tanstack/react-router';
import { EyeIcon, FileTextIcon, PlusIcon, ShieldIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SearchForm } from '@/components/search-form';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <div className="container min-h-screen max-w-2xl px-6 py-12 md:py-16 mx-auto flex flex-col items-center">
      <div className="max-w-2xl text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-4">
            <ShieldIcon className="h-10 w-10 md:h-12 md:w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight px-4">
          Sistema de Denúncias
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed px-4">
          Registre uma nova denúncia ou acompanhe denúncias existentes de forma
          segura e transparente.
        </p>
      </div>

      <div className="w-full max-w-md my-8">
        <Button size="lg" className="w-full h-14 text-lg">
          <Link
            to="/reports/create"
            className="flex items-center justify-center w-full"
          >
            <PlusIcon className="mr-2 h-5 w-5" />
            Registrar Nova Denúncia
          </Link>
        </Button>
      </div>

      <div className="w-full max-w-md mb-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou acompanhe uma denúncia
            </span>
          </div>
        </div>
      </div>

      <SearchForm />

      <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-4xl w-full">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <FileTextIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="font-semibold">Digite o código</h3>
          <p className="text-sm text-muted-foreground">
            Informe o código de rastreio recebido
          </p>
        </div>
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <EyeIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="font-semibold">Consulte os detalhes</h3>
          <p className="text-sm text-muted-foreground">
            Visualize informações e status atualizado
          </p>
        </div>
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <ShieldIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="font-semibold">Seus dados protegidos</h3>
          <p className="text-sm text-muted-foreground">
            Informações tratadas com confidencialidade
          </p>
        </div>
      </div>
    </div>
  );
}
