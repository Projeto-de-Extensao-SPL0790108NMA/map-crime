import { Loader2 } from 'lucide-react';
import z from 'zod/v3';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useEffect, useRef } from 'react';
import { AxiosError } from 'axios';
import type { User } from '@/interfaces/user';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import api from '@/lib/axios';
import { toast } from '@/lib/sonner';

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' }),
  password: z.string().nonempty({ message: 'A senha é obrigatória.' }),
  organization: z
    .string()
    .nonempty({ message: 'A organização é obrigatória.' }),
});

type FormSchema = z.infer<typeof formSchema>;

interface EditUserSheetProps {
  user: User;
  children: React.ReactNode;
}

export function EditUserSheet({ user, children }: EditUserSheetProps) {
  const closeSheetRef = useRef<HTMLButtonElement>(null);
  const { register, handleSubmit, formState, setValue, ...form } =
    useForm<FormSchema>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: user.name,
        organization: user.organization,
      },
    });

  useEffect(() => {
    setValue('name', user.name);
    setValue('organization', user.organization);
  }, [user, setValue]);

  const onSubmit = (data: FormSchema) => {
    mutation.mutate(data);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: FormSchema) => {
      await api.patch(`/api/users/${user.id}/update/`, data);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onSuccess: () => {
      toast.success('Usuário atualizado com sucesso!');
      closeSheetRef.current?.click();
    },
    onError: (error) => {
      let message = 'Erro ao criar usuário.';
      if (error instanceof AxiosError && error.response) {
        const response = error.response;
        if (response.status == 400) {
          message = Object.entries(response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(' ');
        }
      }

      toast.error(message);
    },
  });

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
  };

  return (
    <Sheet onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        onPointerDownOutside={(e) => mutation.isPending && e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Editar usuário</SheetTitle>
          <SheetDescription>
            Atualize os detalhes do usuário abaixo.
          </SheetDescription>
        </SheetHeader>
        <form id="edit-user-form" onSubmit={handleSubmit(onSubmit)}>
          <fieldset
            className="grid flex-1 auto-rows-min gap-6 px-4 py-4"
            disabled={mutation.isPending}
          >
            <div className="grid gap-3">
              <Label htmlFor="email">E-mail</Label>
              <Input readOnly type="email" defaultValue={user.email} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Nome</Label>
              <Input {...register('name')} autoFocus />
              {formState.errors.name && (
                <p className="text-destructive text-sm">
                  {formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="organization">Organização</Label>
              <Input {...register('organization')} />
              {formState.errors.organization && (
                <p className="text-destructive text-sm">
                  {formState.errors.organization.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Senha</Label>
              <Input {...register('password')} type="password" />
              {formState.errors.password && (
                <p className="text-destructive text-sm">
                  {formState.errors.password.message}
                </p>
              )}
            </div>
          </fieldset>
        </form>
        <SheetFooter>
          <SheetClose asChild>
            <Button ref={closeSheetRef} variant="outline">
              Cancelar
            </Button>
          </SheetClose>
          <Button
            form="edit-user-form"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
