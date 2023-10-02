import * as z from 'zod';
import type { MailBatch, TranslationResponse } from '@/types';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { mailSchema } from '@/schemas/mail';
import { Nylas, type Message } from '@/lib/nylas';
import { tanslatorCaller } from './translator';
import { sendMail } from '@/lib/templates';
import { TRPCError } from '@trpc/server';

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

      if (!app)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'App not found!',
        });

      if (!app?.email || !app?.accessToken)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No email is connected to your app. Please an email first.',
        });

      let translatedMail: TranslationResponse = {};

      if (subscribers.length) {
        const languages = new Set(subscribedLanguages.map(l => l.language));
        translatedMail = await tanslatorCaller.translate({
          ...input,
          languages: Array.from(languages),
        });
      }

      // For sending a copy to sender
      translatedMail[input.language] = {
        subject: input.subject,
        content: input.content,
      };
      subscribers.push({ email: app.email, language: input.language });
      const batchId = crypto.randomUUID();

      let totalMailSent = 0;
      subscribers.forEach(subscriber => {
        void sendMail(
          app.email!,
          subscriber.email,
          app.name,
          translatedMail[subscriber.language]?.subject,
          translatedMail[subscriber.language]?.content,
          app.accessToken!,
        )
          .then(async message => {
            const sentMail = await ctx.prisma.mail.create({
              data: {
                language: subscriber.language,
                batchId,
                mailId: message.id!,
                appId: input.appId,
              },
            });

            console.log(
              `${sentMail.batchId} (${sentMail.language}) is sent successfully.`,
            );
          })
          .catch(() => {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: `${totalMailSent} mails sent. Error while sending mails.`,
            });
          });
        totalMailSent++;
      });

      return { batchId, totalMailSent };
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
          mailId: true,
          app: {
            select: {
              accessToken: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (batches.length <= 0)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No mail found.',
        });

      const response: Record<string, MailBatch[]> = {};

      const nylas = Nylas.with(batches[0]!.app.accessToken!);

      for (const batch of batches) {
        let mail: Message;
        try {
          mail = await nylas.messages.find(batch.mailId);
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'No able to retrive the mails.',
          });
        }

        if (!response.hasOwnProperty(batch.batchId)) {
          response[batch.batchId] = [
            { ...batch, content: mail.body, subject: mail.subject! },
          ];
        } else {
          response[batch.batchId]!.push({
            ...batch,
            content: mail.body,
            subject: mail.subject!,
          });
        }
      }

      return response;
    }),
});
