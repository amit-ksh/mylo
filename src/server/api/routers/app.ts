import { z } from 'zod';
import jwt from 'jsonwebtoken';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { appCreateSchema } from '@/schemas/app';
import { Draft, nylas } from '@/lib/nylas';
import { env } from '@/env.mjs';
import { prisma } from '@/server/db';

export const appRouter = createTRPCRouter({
  create: publicProcedure
    .input(appCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const payload = {
        name: input.name,
        email: input.email,
        userId: input.userId,
      };
      const token = jwt.sign(payload, env.JWT_SECRET);

      return ctx.prisma.app
        .create({
          data: {
            ...payload,
            token,
          },
        })
        .then(({ id }) => {
          const encodedId = jwt.sign(id, env.JWT_SECRET);
          const draft = new Draft(nylas, {
            subject: 'Verify your app email',
            body: `Click the following link to verify for email: https://localhost:3000/app/verify/${encodedId}`,
            to: [{ email: payload.email }],
          });
          draft
            .send()
            .then(message => {
              console.log(`${message.id} was sent`);
            })
            .catch(() => 'Server error! Try agian later.');

          return id;
        })
        .catch(() => 'Invalid Inputs');
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
        data: z.object({ name: z.string() }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.app
        .update({
          where: {
            id: input.id,
          },
          data: input.data,
        })
        .then(({ id }) => id)
        .catch(() => 'Invalid Inputs');
    }),

  delete: publicProcedure
    .input(z.object({ userId: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const app = await ctx.prisma.app.delete({
        where: input,
      });

      return {
        id: app.id,
      };
    }),

  getAll: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.app.findMany({
        where: input,
        include: {
          _count: {
            select: { mails: true, subscriber: true },
          },
        },
      });
    }),

  get: publicProcedure
    .input(z.object({ userId: z.string(), name: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.app.findFirst({
        where: input,
        include: {
          _count: {
            select: { mails: true, subscriber: true },
          },
        },
      });
    }),
  verify: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const id = jwt.decode(input) as string;
    try {
      void ctx.prisma.app.update({
        where: { id },
        data: {
          emailVerified: true,
        },
      });
    } catch (error) {
      return 'Invalid verification link.';
    }

    return {
      id,
    };
  }),
});

export const appCaller = appRouter.createCaller({ session: null, prisma });
