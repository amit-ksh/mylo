import { z } from 'zod';

export const appCreateSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'App name must be at least 3 characters.',
    })
    .max(30, {
      message: 'App name must be less than  30 characters.',
    }),
  email: z.string().email().nonempty(),
  userId: z.string().nonempty(),
});
