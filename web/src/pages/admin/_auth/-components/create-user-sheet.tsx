import { Loader2, UserPlus } from 'lucide-react';
import z from 'zod/v3';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRef } from 'react';
import { AxiosError } from 'axios';
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

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' }),
  email: z.string().email({ message: 'E-mail inválido.' }),
  organization: z
    .string()
    .nonempty({ message: 'A organização é obrigatória.' }),
});

type FormSchema = z.infer<typeof formSchema>;

export function CreateUserSheet() {
  const closeSheetRef = useRef<HTMLButtonElement>(null);
  const { register, handleSubmit, formState, ...form } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      organization: '',
    },
  });

  const onSubmit = (data: FormSchema) => {
    mutation.mutate(data);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: FormSchema) => {
      await api.post('/users', data, { withCredentials: true });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onSuccess: () => {
      toast.success('Usuário criado com sucesso!');
      closeSheetRef.current?.click();
      form.reset();
    },
    onError: (error) => {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.status === 422
      ) {
        const { property, message } = error.response.data;
        toast.error(`${property}: ${message}`);
      } else {
        toast.error('Erro ao criar usuário.');
      }
    },
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-2 px-4">
          <UserPlus className="w-4 h-4" />
          Novo Usuário
        </Button>
      </SheetTrigger>
      <SheetContent
        onPointerDownOutside={(e) => mutation.isPending && e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Novo usuário</SheetTitle>
          <SheetDescription>
            Preencha os detalhes do novo usuário abaixo.
          </SheetDescription>
        </SheetHeader>
        <form id="create-user-form" onSubmit={handleSubmit(onSubmit)}>
          <fieldset
            className="grid flex-1 auto-rows-min gap-6 px-4"
            disabled={mutation.isPending}
          >
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input {...register('name')} />
              {formState.errors.name && (
                <p className="text-destructive text-sm">
                  {formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">E-mail</Label>
              <Input {...register('email')} type="email" />
              {formState.errors.email && (
                <p className="text-destructive text-sm">
                  {formState.errors.email.message}
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
          </fieldset>
        </form>
        <SheetFooter>
          <Button
            form="create-user-form"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Criar Usuário'
            )}
          </Button>
          <SheetClose asChild>
            <Button ref={closeSheetRef} variant="outline">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
