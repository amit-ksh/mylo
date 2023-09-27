import * as z from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { mailSchema } from '@/schemas/mail';
import { Draft, nylas } from '@/lib/nylas';
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
      const languages = new Set(subscribedLanguages.map(l => l.language)).add(
        input.language,
      );

      const translatedMail = await tanslatorCaller.translate({
        ...input,
        languages: Array.from(languages),
      });

      const batchId = crypto.randomUUID();
      subscribers.forEach(subscriber => {
        const draft = new Draft(nylas, {
          subject: translatedMail[subscriber.language]?.subject,
          body: translatedMail[subscriber.language]?.content,
          to: [{ email: subscriber.email }],
        });

        void draft.send().then(message => {
          void ctx.prisma.mail
            .create({
              data: {
                language: subscriber.language,
                batchId,
                mailId: message.id ?? '',
                appId: input.appId,
              },
            })
            .then(({ id }) => {
              console.log(id);
            });
        });
      });

      return batchId;
    }),
  getAll: publicProcedure
    .input(z.object({ appId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.mail.findMany({
        where: input,
        distinct: 'batchId',
        include: {
          app: {
            select: {
              _count: {
                select: {
                  mails: true,
                },
              },
            },
          },
        },
      });
    }),
});
