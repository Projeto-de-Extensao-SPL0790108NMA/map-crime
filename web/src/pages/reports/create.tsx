import { createFileRoute } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod/v3';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { TrackingCodeModal } from './-components/tracking-code-modal';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldLabel, FieldSet } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useReportMutate } from '@/hooks/use-report-mutate';
import { LocationPicker } from '@/components/location-picker';
import { FilePicker } from '@/components/file-picker';
import { CATEGORIES } from '@/constants/categories';

export const Route = createFileRoute('/reports/create')({
  component: CreateReport,
});

const fileSchema = z
  .instanceof(File, { message: 'Anexo deve ser um arquivo válido' })
  .refine((file) => 'size' in file, 'Arquivo não possui informação de tamanho')
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    'Cada arquivo deve ter no máximo 5MB',
  )
  .refine((file) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
    ];
    return allowedTypes.includes(file.type);
  }, 'Tipo de arquivo não permitido');

const formSchema = z.object({
  title: z.string().min(1, 'Categoria é obrigatória'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  coordinates: z.object(
    {
      lat: z.number(),
      lng: z.number(),
    },
    { required_error: 'Localização é obrigatória' },
  ),
  address: z.string().nonempty('Endereço é obrigatório'),
  attachments: z
    .array(fileSchema)
    .max(3, 'No máximo 3 arquivos podem ser anexados')
    .optional(),
});

type FormSchema = z.infer<typeof formSchema>;

function CreateReport() {
  const { control, ...form } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const { isPending, mutate, data } = useReportMutate();

  const onSubmit = (formData: FormSchema) => {
    mutate(formData, {
      onError: (err) => {
        toast.error(err.message, {
          duration: 5000,
          className: 'text-red-500',
          style: { backgroundColor: '#FFCACA', color: '#7F1D1D' },
        });
      },
    });
  };

  return (
    <>
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Registrar Denúncia</h1>
        <p className="text-muted-foreground">
          Suas informações serão tratadas com confidencialidade
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">
            Informações da Denúncia
          </CardTitle>
          <CardDescription>
            Campos marcados com * são obrigatórios
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
          >
            <FieldSet disabled={isPending}>
              <Controller
                control={control}
                name="title"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Categoria *</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Descrição *</FieldLabel>
                    <Textarea
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="coordinates"
                render={({ field, fieldState }) => (
                  <LocationPicker
                    value={field.value}
                    onLocationSelect={field.onChange}
                    onAddressSelect={(address) =>
                      form.setValue('address', address)
                    }
                    errors={[fieldState.error]}
                  />
                )}
              />

              <Controller
                control={control}
                name="attachments"
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <FilePicker
                        onChange={field.onChange}
                        multiple
                        errors={[fieldState.error]}
                        value={field.value}
                        max={3}
                        validateFile={(file) => {
                          const result = fileSchema.safeParse(file);
                          return result.success
                            ? null
                            : result.error.errors[0].message;
                        }}
                      />
                    </>
                  );
                }}
              />
            </FieldSet>

            <Button
              type="submit"
              className="mt-4"
              size="lg"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                'Enviar Denúncia'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <TrackingCodeModal trackingCode={data?.code} />
    </>
  );
}
