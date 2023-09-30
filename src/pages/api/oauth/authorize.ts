import { env } from '@/env.mjs';
import { Nylas } from '@/lib/nylas';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NativeAuthenticationProvider } from 'nylas/lib/models/connect';

export const redirectURI = new URL(`api/oauth/connect/`, env.NEXTAUTH_URL).href;

export const SCOPES = ['email.send', 'email.modify'];

export default function authorize(req: NextApiRequest, res: NextApiResponse) {
  const { appId } = req.query as unknown as Record<string, string>;

  const url = Nylas.urlForAuthentication({
    redirectURI,
    scopes: SCOPES,
    state: JSON.stringify({
      appId,
    }),
    provider: NativeAuthenticationProvider.Gmail,
  });

  return res.json({ url });
}
