import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import z from 'zod/v3';

import { ShieldIcon } from 'lucide-react';

import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z
  .object({
    email: z.string().email('Email inválido.'),
    password: z
      .string()
      .refine((value) => value.length, 'A senha é obrigatória.'),
  })
  .required();

type FormSchema = z.infer<typeof formSchema>;

const FALLBACK_REDIRECT = '/admin';

export const Route = createFileRoute('/admin/sign-in')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad({ context, search }) {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: search.redirect || FALLBACK_REDIRECT,
      });
    }
  },
  component: SignIn,
});

function SignIn() {
  const router = useRouter();
  const search = Route.useSearch();
  const { auth } = Route.useRouteContext();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: FormSchema) => {
      await auth.login(data);
    },
    onSuccess: async () => {
      form.reset();
      toast.success('Login realizado com sucesso!');

      await router.invalidate();
      await router.navigate({ to: search.redirect || FALLBACK_REDIRECT });
    },
    onError: () => {
      form.resetField('password');
      form.setError('email', { message: 'Email ou senha inválidos.' });
    },
    retry: false,
  });

  const onSubmit = (data: FormSchema) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <ShieldIcon className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Painel Administrativo</CardTitle>
          <CardDescription>Faça login para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@sistema.com"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
