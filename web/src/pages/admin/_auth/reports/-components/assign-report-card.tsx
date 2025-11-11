import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import type { User } from '@/interfaces/user';
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
import { Button } from '@/components/ui/button';

const fetchUsers = async () => {
  const response = await api.get('users', { withCredentials: true });
  return response.data.users as Array<User>;
};

interface AssignReportCardProps {
  reportId: string;
  currentAssignedTo?: string;
}

export function AssignReportCard({
  reportId,
  currentAssignedTo,
}: AssignReportCardProps) {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const [selectedUser, setSelectedUser] = useState(currentAssignedTo);
  const queryClient = useQueryClient();

  const handleAssign = async () => {
    if (!selectedUser) {
      toast.error('Por favor, selecione um usuário para atribuir o relatório.');
      return;
    }

    try {
      await api.patch(
        `/reports/${reportId}/assign`,
        {
          userId: selectedUser,
        },
        { withCredentials: true, withXSRFToken: true },
      );

      toast.success('Relatório atribuído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['report', reportId] });
    } catch (error) {
      toast.error('Erro ao atribuir o relatório. Tente novamente.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuário Responsável</CardTitle>
        <CardDescription>
          Atribua este relatório a um usuário ou equipe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedUser}
          disabled={isLoading}
          onValueChange={setSelectedUser}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um usuário..." />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading" disabled>
                Carregando usuários...
              </SelectItem>
            ) : (
              users?.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} - {user.organization}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <Button
          variant="default"
          className="mt-4 w-full"
          onClick={handleAssign}
        >
          Atribuir relatório
        </Button>
      </CardContent>
    </Card>
  );
}
