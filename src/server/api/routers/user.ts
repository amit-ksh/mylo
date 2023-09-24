import * as z from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const userRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: input,
        select: {
          id: true,
          name: true,
          createdAt: true,
          email: true,
        },
      });
    }),

  update: publicProcedure
    .input(z.object({ id: z.string(), data: z.object({ name: z.string() }) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.delete({ where: input });
    }),
});
