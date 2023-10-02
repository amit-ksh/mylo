/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { env } from '@/env.mjs';
import type {
  Languages,
  TranslationApiResponse,
  TranslationResponse,
} from '@/types';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { prisma } from '@/server/db';
import { mailSchema } from '@/schemas/mail';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { TRPCError } from '@trpc/server';

const ENDPOINT = new URL('/translate', env.AZURE_AI_TRANSLATOR_ENDPOINT).href;

export const translatorRouter = createTRPCRouter({
  translate: publicProcedure
    .input(
      mailSchema
        .pick({
          subject: true,
          content: true,
          language: true,
        })
        .extend({ languages: z.string().array() }),
    )
    .mutation(async ({ input }) => {
      const params =
        `?api-version=3.0&textType=html&from=${input.language}` +
          input.languages.map(l => `&to=${l}`).join('') ?? '';

      const reqUrl = ENDPOINT + params;

      const resp = await fetch(reqUrl, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': env.AZURE_AI_TRANSLATOR_APIKEY,
          // location required if you're using a multi-service or regional (not global) resource.
          'Ocp-Apim-Subscription-Region': env.AZURE_AI_TRANSLATOR_REGION,
          'Content-type': 'application/json',
          'X-ClientTraceId': randomUUID().toString(),
        },
        body: JSON.stringify([
          {
            text: input.subject,
          },
          {
            text: input.content,
          },
        ]),
      });

      if (!resp.ok) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to translate the content. Please try agian later!',
        });
      }

      const translationResult: TranslationApiResponse = await resp.json();

      const response: TranslationResponse = {};

      translationResult[0]?.translations.forEach(({ text, to }) => {
        const translation = { subject: text };
        response[to] = translation;
      });
      translationResult[1]?.translations.forEach(({ text, to }) => {
        const translation = { content: text };
        response[to] = { ...response[to], ...translation };
      });

      return response;
    }),
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
