import type Message from 'nylas/lib/models/message';
import { env } from '@/env.mjs';
import Nylas from 'nylas';
import { Region, regionConfig } from 'nylas/lib/config';
import Draft from 'nylas/lib/models/draft';

Nylas.config({
  clientId: env.NYLAS_CLIENT_ID,
  clientSecret: env.NYLAS_CLIENT_SECRET,
  apiServer: regionConfig[Region.Us].nylasAPIUrl,
});

const nylas = Nylas.with(env.NYLAS_ACCESS_TOKEN);

const sendMail = (
  subject: string | undefined,
  body: string | undefined,
  to: string,
): Promise<Message> => {
  const draft = new Draft(nylas, {
    subject: subject,
    body: body,
    to: [{ email: to }],
  });

  return draft.send();
};

export { sendMail };
