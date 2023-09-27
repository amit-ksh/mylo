import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { subscriberSchema } from '@/schemas/subscriber';
import { TRPCClientError } from '@trpc/client';

export const subscriberRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(subscriberSchema)
    .mutation(async ({ ctx, input }) => {
      const hasSubscribed = await ctx.prisma.subscriber.findFirst({
        where: { email: input.email, appId: input.appId },
        select: { id: true, language: true },
      });

      if (hasSubscribed?.id && hasSubscribed?.language === input.language) {
        throw new TRPCClientError(
          'You are already subscribed to this newsletter.',
        );
      }

      let subscriber;
      if (!hasSubscribed?.id) {
        subscriber = await ctx.prisma.subscriber.create({
          data: input,
        });
      } else {
        subscriber = await ctx.prisma.subscriber.update({
          where: {
            id: hasSubscribed.id,
          },
          data: input,
        });
      }

      return {
        id: subscriber.id,
      };
    }),

  unsubscribe: publicProcedure
    .input(subscriberSchema.omit({ language: true }))
    .mutation(async ({ ctx, input }) => {
      const subscriber = await ctx.prisma.subscriber.findFirst({
        where: input,
      });

      if (!subscriber?.id) {
        throw new TRPCClientError(
          'Email not found. Please check your email address.',
        );
      }

      const { id } = await ctx.prisma.subscriber.delete({
        where: { id: subscriber?.id },
      });

      return {
        id,
      };
    }),
});
