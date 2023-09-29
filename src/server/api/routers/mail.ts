import * as z from 'zod';
import type { MailBatch } from '@/types';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { mailSchema } from '@/schemas/mail';
import { nylas, sendMail } from '@/lib/nylas';
import { tanslatorCaller } from './translator';

export const mailRouter = createTRPCRouter({
  send: publicProcedure
    .input(
      mailSchema
        .omit({ mailId: true })
        .extend({ userEmail: z.string().email() }),
    )
    .mutation(async ({ ctx, input }) => {
      const [subscribedLanguages, subscribers] = await Promise.all([
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
      ]);
      const languages = new Set(subscribedLanguages.map(l => l.language));
      const translatedMail = await tanslatorCaller.translate({
        ...input,
        languages: Array.from(languages),
      });

      // Send a copy to sender
      translatedMail[input.language] = {
        subject: input.subject,
        content: input.content,
      };
      const subscribersWithSenderEmail = [
        { email: input.userEmail, language: input.language },
      ].concat(subscribers);
      const batchId = crypto.randomUUID();
      subscribersWithSenderEmail.forEach(subscriber => {
        void sendMail(
          translatedMail[subscriber.language]?.subject,
          translatedMail[subscriber.language]?.content,
          subscriber.email,
        ).then(async message => {
          const sentMail = await ctx.prisma.mail.create({
            data: {
              language: subscriber.language,
              batchId,
              subject: translatedMail[subscriber.language]?.subject ?? '',
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
          createdAt: 'asc',
        },
      });

      const response: Record<string, MailBatch[]> = {};

      for (const batch of batches) {
        const mail = await nylas.messages.find(batch.mailId);

        if (!response.hasOwnProperty(batch.batchId)) {
          response[batch.batchId] = [{ ...batch, content: mail.body }];
        } else {
          response[batch.batchId]!.push({ ...batch, content: mail.body });
        }
      }

      return response;
    }),
});
