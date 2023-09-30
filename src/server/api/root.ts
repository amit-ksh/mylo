import { appRouter as AppRouter } from '@/server/api/routers/app';
import { createTRPCRouter } from '@/server/api/trpc';
import { mailRouter } from './routers/mail';
import { subscriberRouter } from './routers/subscriber';
import { userRouter } from './routers/user';
import { translatorRouter } from './routers/translator';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  app: AppRouter,
  mail: mailRouter,
  subscriber: subscriberRouter,
  user: userRouter,
  translator: translatorRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
