import z from 'zod/v3';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { SearchIcon } from 'lucide-react';

import { Field, FieldDescription, FieldError, FieldLabel } from './ui/field';
import { Button } from './ui/button';
import { Input } from './ui/input';

const formSchema = z.object({
  trackingCode: z.string().trim().min(1, 'O código de rastreio é obrigatório.'),
});

type FormSchema = z.infer<typeof formSchema>;

export const SearchForm = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, reset } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trackingCode: '',
    },
  });

  const handleSearch = ({ trackingCode }: FormSchema) => {
    reset();
    navigate({
      to: '/reports/$code',
      params: { code: trackingCode },
    });
  };

  return (
    <form
      className="w-full max-w-md space-y-4"
      onSubmit={handleSubmit(handleSearch)}
    >
      <Controller
        control={control}
        name="trackingCode"
        render={({ field, fieldState }) => (
          <Field className="text-start">
            <FieldLabel htmlFor="codigo" className="text-base font-semibold">
              Código de Rastreio
            </FieldLabel>
            <div className="flex">
              <Input
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                id="codigo"
                placeholder="Ex: DEN001"
                className="flex-1 h-12"
                aria-label="Digite o código de rastreio da denúncia"
              />

              <Button
                size="lg"
                className="h-12 px-6"
                type="submit"
                aria-label="Buscar denúncia pelo código de rastreio"
                disabled={!field.value.trim()}
              >
                <SearchIcon className="size-5" />
              </Button>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            <FieldDescription>
              Digite o código fornecido no momento do registro da denúncia.
            </FieldDescription>
          </Field>
        )}
      />
    </form>
  );
};
