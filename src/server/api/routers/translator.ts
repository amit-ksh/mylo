import type { Languages } from '@/types';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { prisma } from '@/server/db';

export const translatorRouter = createTRPCRouter({
  languages: publicProcedure.query(async () => {
    const resp = await fetch(
      'https://api.cognitive.microsofttranslator.com/languages?api-version=3.0&scope=translation',
    );
    const languages = (await resp.json()) as {
      translation: Languages;
    };
    return languages.translation;
  }),
});

export const tanslatorCaller = translatorRouter.createCaller({
  session: null,
  prisma,
});
