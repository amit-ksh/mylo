import * as z from 'zod';
import type { MailBatch } from '@/types';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { mailSchema } from '@/schemas/mail';
import { nylas } from '@/lib/nylas';
import { tanslatorCaller } from './translator';
import { sendMail } from '@/lib/templates';
import { TRPCClientError } from '@trpc/client';

export const mailRouter = createTRPCRouter({
  send: publicProcedure
    .input(mailSchema.omit({ mailId: true }))
    .mutation(async ({ ctx, input }) => {
      const [subscribedLanguages, subscribers, app] = await Promise.all([
        ctx.prisma.subscriber.findMany({
          select: { language: true },
          where: { appId: input.appId },
          orderBy: {
            language: 'asc',
          },
        }),
        ctx.prisma.subscriber.findMany({
          where: { appId: input.appId },
          select: { language: true, email: true },
          orderBy: {
            language: 'asc',
          },
        }),
        ctx.prisma.app.findUnique({ where: { id: input.appId } }),
      ]);

      if (!app) return new TRPCClientError('Bad Request: No App Found!');

      if (!app?.email || !app?.accessToken)
        return new TRPCClientError(
          'No email is connected to your app. Please an email first.',
        );

      const languages = new Set(subscribedLanguages.map(l => l.language));
      const translatedMail = await tanslatorCaller.translate({
        ...input,
        languages: Array.from(languages),
      });

      // For sending a copy to sender
      translatedMail[input.language] = {
        subject: input.subject,
        content: input.content,
      };
      subscribers.push({ email: app.email, language: input.language });
      const batchId = crypto.randomUUID();

      subscribers.forEach(subscriber => {
        void sendMail(
          app.email!,
          subscriber.email,
          app.name,
          translatedMail[subscriber.language]?.subject,
          translatedMail[subscriber.language]?.content,
          app.accessToken!,
        ).then(async message => {
          const sentMail = await ctx.prisma.mail.create({
            data: {
              language: subscriber.language,
              batchId,
              mailId: message.id ?? '',
              appId: input.appId,
            },
          });

          console.log(
            `${sentMail.batchId} (${sentMail.language}) is sent successfully.`,
          );
        });
      });

      return batchId;
    }),

  getAll: publicProcedure
    .input(z.object({ appId: z.string() }))
    .query(async ({ ctx, input }) => {
      const batches = await ctx.prisma.mail.findMany({
        where: input,
        select: {
          batchId: true,
          createdAt: true,
          language: true,
          subject: true,
          mailId: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const response: Record<string, MailBatch[]> = {};

      for (const batch of batches) {
        const mail = await nylas.messages.find(batch.mailId);

        if (!response.hasOwnProperty(batch.batchId)) {
          response[batch.batchId] = [
            { ...batch, content: mail.body, subject: mail.subject! },
          ];
        } else {
          response[batch.batchId]!.push({ ...batch, content: mail.body });
        }
      }

      return response;
    }),
});
