import { createFileRoute } from '@tanstack/react-router';
import { Loader2, Pencil, SearchIcon, Trash2, UserCircle, UserRoundPlus, UserRoundX } from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { CreateUserSheet } from './-components/create-user-sheet';
import { EditUserSheet } from './-components/edit-user-sheet';
import type { User } from '@/interfaces/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

export const Route = createFileRoute('/admin/_auth/users')({
  component: Users,
});

const fetchUsers = async (search: string) => {
  const response = await api.get('users', {
    withCredentials: true,
    params: { search },
  });
  return response.data.users as Array<User>;
};

function Users() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const {
    data: users,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['users', debouncedSearch],
    queryFn: () => fetchUsers(debouncedSearch),
    placeholderData: (pre) => pre,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Usuários</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os usuários do sistema
          </p>
        </div>
        <CreateUserSheet />
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          {isLoading ? (
            <div>Carregando usuários...</div>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-4 text-foreground">
                {users?.length} usuário(s) encontrado(s)
                {isFetching && (
                  <Loader2 className="inline-block ml-2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </h2>

              <div className="space-y-4">
                {users?.map((user) => (
                  <Card key={user.id} className="shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">
                              {user.name}
                            </h3>

                            <Badge
                              variant={
                                user.role === 'user' ? 'outline' : 'default'
                              }
                              className={cn(
                                'text-muted-foreground',
                                user.role === 'admin' &&
                                  'bg-gray-200 text-gray-700 hover:bg-gray-200',
                              )}
                            >
                              {user.role === 'admin'
                                ? 'Administrador'
                                : 'Usuário'}
                            </Badge>

                            <Badge
                              variant="outline"
                              className={cn({
                                'border-green-600 text-green-700 bg-green-50':
                                  user.status === 'active',
                                'border-yellow-600 text-yellow-700 bg-yellow-50':
                                  user.status === 'inactive',
                                'border-red-600 text-red-700 bg-red-50':
                                  user.status === 'suspended',
                              })}
                            >
                              {user.status === 'active' && 'Ativo'}
                              {user.status === 'inactive' && 'Inativo'}
                              {user.status === 'suspended' && 'Suspenso'}
                            </Badge>
                          </div>

                          <p className="text-muted-foreground text-sm">
                            {user.email}
                          </p>
                          <p className="text-muted-foreground text-xs mt-0.5">
                            Cadastrado em {user.createdAt}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <EditUserSheet user={user}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </EditUserSheet>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Users;
