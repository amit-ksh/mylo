import * as z from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { mailSchema } from '@/schemas/mail';
import { Draft, nylas } from '@/lib/nylas';

export const mailRouter = createTRPCRouter({
  send: publicProcedure
    .input(mailSchema.omit({ mailId: true }))
    .mutation(async ({ ctx, input }) => {
      const [subscribedLanguages, subscribers, app] = await Promise.all([
        ctx.prisma.subscriber.findMany({
          where: { appId: input.appId },
          select: { language: true },
          distinct: 'language',
        }),
        ctx.prisma.subscriber.findMany({
          where: { appId: input.appId },
          select: { language: true, email: true },
        }),
        ctx.prisma.app.findFirst({
          where: { id: input.appId },
          select: { email: true, emailVerified: true },
        }),
      ]);

      if (!app?.emailVerified) return 'Email not verified!';

      const mailsContent = {
        [input.language]: {
          content: input.content,
          subject: input.subject,
        },
      };
      subscribedLanguages.forEach(language => {
        // translate the language
        const translatedContent = input.content;
        const translatedSubject = input.subject;

        mailsContent[language as unknown as string] = {
          content: translatedContent,
          subject: translatedSubject,
        };
      });

      const batchId = crypto.randomUUID();
      subscribers.forEach(subscriber => {
        const draft = new Draft(nylas, {
          subject: mailsContent[subscriber.language]?.subject,
          body: mailsContent[subscriber.language]?.content,
          from: [{ email: app.email }],
          to: [{ email: subscriber.email }],
        });

        void draft.send().then(message => {
          void ctx.prisma.mail.create({
            data: {
              language: subscriber.language,
              batchId,
              mailId: message.id ?? '',
              appId: input.appId,
            },
          });
        });
      });

      return { id: batchId };
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
