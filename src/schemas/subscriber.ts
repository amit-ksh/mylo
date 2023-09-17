import * as z from 'zod';

export const subscriberSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email(),
  language: z.string({
    required_error: 'Language is required',
  }),
  appId: z.string({
    required_error: 'App ID is required',
  }),
});
