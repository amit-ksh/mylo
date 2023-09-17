import * as z from 'zod';

export const mailSchema = z.object({
  mailId: z.string({
    required_error: 'Email is required',
  }),
  language: z.string({
    required_error: 'Language is required',
  }),
  content: z.string({
    required_error: 'Content is required',
  }),
  subject: z.string({
    required_error: 'Subject is required',
  }),
  appId: z.string({
    required_error: 'App ID is required',
  }),
});
