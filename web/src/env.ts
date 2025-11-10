import z from 'zod';

const envShema = z.object({
  VITE_GOOGLE_MAPS_API_KEY: z
    .string()
    .min(1, 'VITE_GOOGLE_MAPS_API_KEY is required'),
  VITE_API_BASE_URL: z.url().default('http://localhost:3333'),
});

export const env = envShema.parse(import.meta.env);
