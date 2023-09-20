import { exampleRouter } from '@/server/api/routers/example';
import { appRouter as AppRouter } from '@/server/api/routers/app';
import { createTRPCRouter } from '@/server/api/trpc';
import { mailRouter } from './routers/mail';
import { subscriberRouter } from './routers/subscriber';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  app: AppRouter,
  mail: mailRouter,
  subscriber: subscriberRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
