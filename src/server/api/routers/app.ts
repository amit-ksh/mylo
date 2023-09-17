import { z } from 'zod';
import jwt from 'jsonwebtoken';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { appCreateSchema } from '@/schemas/app';
import { Draft, nylas } from '@/lib/nylas';

export const appRouter = createTRPCRouter({
  create: publicProcedure
    .input(appCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const payload = {
        name: input.name,
        email: input.email,
        userId: input.userId,
      };
      // eslint-disable-next-line
      const token = jwt.sign(payload, 'secret');

      return ctx.prisma.app
        .create({
          data: {
            ...payload,
            token,
          },
        })
        .then(({ id }) => {
          const draft = new Draft(nylas, {
            subject: 'Verify your app email',
            body: `Click the following link to verify for email: https://localhost:3000/app/verify/${id}`,
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
      return ctx.prisma.app.findMany({ where: input });
    }),

  get: publicProcedure
    .input(z.object({ userId: z.string(), id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.app.findMany({ where: input });
    }),
});
