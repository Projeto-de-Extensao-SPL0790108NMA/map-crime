import { createFileRoute } from '@tanstack/react-router';
import { Pencil, Search, Trash2, UserPlus } from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
import type { User } from '@/interfaces/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/admin/_auth/users')({
  component: Users,
});

const fetchUsers = async () => {
  const response = await api.get('users', { withCredentials: true });
  return response.data.users as Array<User>;
};

function Users() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return <div>Carregando usuários...</div>;
  }

  return (
    <div className="min-h-screen bg-muted p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Usuários</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os usuários do sistema
          </p>
        </div>
        <Button className="gap-2 px-4">
          <UserPlus className="w-4 h-4" />
          Novo Usuário
        </Button>
      </div>

      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome ou email..." className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            {users?.length} usuário(s) encontrado(s)
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
                          variant={user.role === 'user' ? 'outline' : 'default'}
                          className={cn(
                            'text-muted-foreground',
                            user.role === 'admin' &&
                              'bg-gray-200 text-gray-700 hover:bg-gray-200',
                          )}
                        >
                          {user.role === 'admin' ? 'Administrador' : 'Usuário'}
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Users;
