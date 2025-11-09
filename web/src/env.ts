import z from 'zod';

const envShema = z.object({
  VITE_GOOGLE_MAPS_API_KEY: z
    .string()
    .min(1, 'VITE_GOOGLE_MAPS_API_KEY is required'),
});

export const env = envShema.parse(import.meta.env);
