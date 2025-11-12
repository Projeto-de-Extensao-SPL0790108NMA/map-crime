import { createFileRoute } from '@tanstack/react-router';
import { Loader2, Pencil, UserRoundPlus, UserRoundX } from 'lucide-react';

import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { Fragment } from 'react';
import { CreateUserSheet } from './-components/create-user-sheet';
import { EditUserSheet } from './-components/edit-user-sheet';
import type { User } from '@/interfaces/user';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/axios';
import { cn, usersMapper } from '@/lib/utils';
import { toast } from '@/lib/sonner';

export const Route = createFileRoute('/admin/_auth/users')({
  component: Users,
});

const fetchUsers = async ({ pageParam }: { pageParam: number }) => {
  const response = await api.get('/api/users/', {
    params: {
      page: pageParam,
    },
  });

  const nextPage = response.data.next ? pageParam + 1 : null;
  return {
    nextPage,
    total: response.data.count,
    users: usersMapper(response.data.results as Array<any>),
  };
};

function Users() {
  const {
    data,
    status,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    retry: 1,
  });

  const updateUserState = useMutation({
    mutationFn: async (user: User) => {
      const is_active = user.status === 'active';
      await api.patch(`/api/users/${user.id}/update/`, {
        is_active: !is_active,
      });
    },
    onSuccess: (_, user) => {
      user.status = user.status === 'active' ? 'inactive' : 'active';
      toast.success(
        `Usuário ${
          user.status === 'active' ? 'ativado' : 'desativado'
        } com sucesso!`,
      );
    },
    onError: () => {
      toast.error('Erro ao atualizar o estado do usuário.');
    },
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

      <Card className="shadow-sm">
        <CardContent className="p-6">
          {status === 'pending' ? (
            <div>Carregando usuários...</div>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-4 text-foreground">
                {data?.pages[0]?.total} usuário(s) encontrado(s)
              </h2>

              <div className="space-y-4">
                {data?.pages.map(({ users }, index) => (
                  <Fragment key={index}>
                    {users.map((user) => (
                      <Card key={user.id} className="shadow-sm">
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">
                                  {user.name}
                                </h3>

                                {user.role && (
                                  <Badge
                                    variant={
                                      user.role === 'user'
                                        ? 'outline'
                                        : 'default'
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
                                )}

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

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateUserState.mutate(user)}
                                disabled={updateUserState.isPending}
                              >
                                {user.status === 'active' ? (
                                  <UserRoundX className="w-4 h-4 text-destructive hover:text-destructive hover:bg-destructive/10" />
                                ) : (
                                  <UserRoundPlus className="w-4 h-4 text-green-600 hover:text-green-600 hover:bg-green-600/10" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Users;
