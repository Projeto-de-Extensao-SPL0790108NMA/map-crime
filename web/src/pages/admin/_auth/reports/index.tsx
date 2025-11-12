import { useInfiniteQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { Fragment, useState } from 'react';
import { EyeIcon, Loader2, SearchIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import api from '@/lib/axios';
import { formatDate, mapReports } from '@/lib/utils';

export const Route = createFileRoute('/admin/_auth/reports/')({
  component: ReportsComponent,
});

interface SearchParams {
  search: string;
  status: string;
}

const fetchUsers = async (page: number, filters: SearchParams) => {
  const response = await api.get('/api/denuncias/', {
    params: {
      page: page,
      ...filters,
    },
  });

  const nextPage = response.data.next ? page + 1 : null;
  return {
    reports: mapReports(response.data.results as Array<any>),
    count: response.data.count,
    nextPage,
  };
};

function ReportsComponent() {
  const [searchInput, setSearchInput] = useState<string>('');
  const [statusInput, setStatusInput] = useState<string>('');

  const [filters, applyFilters] = useState<SearchParams>({
    search: '',
    status: '',
  });

  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['reports', filters],
    queryFn: (params) => fetchUsers(params.pageParam, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const handleFilter = () => {
    applyFilters({
      search: searchInput,
      status: statusInput,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Denúncias</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie todas as denúncias do sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por código ou título..."
                className="pl-9"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Select value={statusInput} onValueChange={setStatusInput}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="em_analise">Em Andamento</SelectItem>
                <SelectItem value="aprovado">Resolvida</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleFilter}>
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios de Denúncias</CardTitle>
          <CardDescription>
            Total de denúncias: {data?.pages[0]?.count ?? 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'pending' ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 bg-muted/50 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {data?.pages.map(({ reports }, page) => (
                <Fragment key={page}>
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h1 className="font-mono text-sm font-semibold">
                            {report.code}
                          </h1>
                          <StatusBadge status={report.status} />
                        </div>
                        <h3 className="font-medium mt-1 truncate">
                          {report.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Criada em {formatDate(report.createdAt)}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => {}}>
                        <Link
                          to={'/admin/reports/$id'}
                          params={{ id: report.id }}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </Fragment>
              ))}

              <div className="flex justify-center items-center w-full pt-2 pb-8 lg:pb-0">
                {hasNextPage && (
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetching || isFetchingNextPage}
                    variant="outline"
                  >
                    {isFetchingNextPage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Carregar mais'
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
