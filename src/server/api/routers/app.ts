import { z } from 'zod';
import jwt from 'jsonwebtoken';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { appCreateSchema } from '@/schemas/app';
import { env } from '@/env.mjs';
import { prisma } from '@/server/db';
import { TRPCError } from '@trpc/server';
import { createNewUserMail } from '@/lib/templates';

export const appRouter = createTRPCRouter({
  create: publicProcedure
    .input(appCreateSchema.omit({ email: true, accessToken: true }))
    .mutation(async ({ ctx, input }) => {
      const payload = {
        name: input.name,
        url: input.url,
        userId: input.userId,
      };
      const token = jwt.sign(payload, env.JWT_SECRET);

      const isUrlAlreadyTaken = await ctx.prisma.app.findUnique({
        where: { url: input.url },
      });

      if (isUrlAlreadyTaken)
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'This url is already taken, please use different one.',
        });

      try {
        const app = await ctx.prisma.app.create({
          data: {
            ...payload,
            token,
          },
          select: {
            id: true,
            name: true,
            url: true,

            user: { select: { email: true } },
          },
        });

        void createNewUserMail(
          app.user.email,
          app.name,
          new URL(`${env.NEXTAUTH_URL}/${app.url}`).href,
        )
          .send()
          .then(message => {
            console.log(`${message.id} was sent`);
          })
          .catch(e => {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Error while sending mails.',
              cause: e,
            });
          });

        return { id: app.id, name: app.name };
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Server Error!',
        });
      }
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
        data: appCreateSchema.omit({ userId: true }).partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.app.update({
        where: {
          id: input.id,
        },
        data: input.data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const app = await ctx.prisma.app.delete({
        where: input,
      });

      return {
        id: app.id,
        name: app.name,
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
    .input(
      z.object({
        userId: z.string().optional(),
        name: z.string().optional(),
        id: z.string().optional(),
        url: z.string().optional(),
      }),
    )
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
});

export const appCaller = appRouter.createCaller({ session: null, prisma });
