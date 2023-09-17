import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { subscriberSchema } from '@/schemas/subscriber';

export const subscriberRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(subscriberSchema)
    .mutation(async ({ ctx, input }) => {
      const subscriber = await ctx.prisma.subscriber.create({
        data: input,
      });

      return {
        id: subscriber.id,
      };
    }),

  delete: publicProcedure
    .input(subscriberSchema.omit({ language: true }))
    .mutation(async ({ ctx, input }) => {
      const subscriber = await ctx.prisma.subscriber.findFirst({
        where: input,
      });

      const { id } = await ctx.prisma.subscriber.delete({
        where: { id: subscriber?.id },
      });

      return {
        id,
      };
    }),
});
