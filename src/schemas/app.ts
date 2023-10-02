import { z } from 'zod';

export const appCreateSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'App name must be at least 3 characters.',
    })
    .max(30, {
      message: 'App name must be less than  30 characters.',
    })
    .trim(),
  url: z
    .string()
    .min(3)
    .nonempty()
    .regex(/^[\w-]+$/, 'Please enter a valid URL route.')
    .trim(),
  email: z.string().email().nonempty().trim(),
  userId: z.string().nonempty(),
  accessToken: z.string().nonempty(),
});
