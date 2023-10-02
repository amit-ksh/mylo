import type Message from 'nylas/lib/models/message';
import { Draft, Nylas } from './nylas';
import { env } from '@/env.mjs';

export const createNewUserMail = (to: string, appName: string, url: string) => {
  return new Draft(Nylas.with(env.NYLAS_ACCESS_TOKEN), {
    to: [{ email: to }],
    subject: `Successfully created app: ${appName}`,
    body: `
      You have successfully created <i>${appName}</i> app. Here is the details of your app -
      
      <p>App Name: ${appName}</p>
      <p>Subscribe Url: <i>${url}/subscribe</i></p>
      <p>Unsubscribe Url: <i>${url}/unsubscribe</i></p>
      </div>
    `,
  });
};

export const sendMail = (
  from: string,
  to: string,
  appName: string,
  subject: string | undefined,
  body: string | undefined,
  accessToken: string,
): Promise<Message> => {
  const draft = new Draft(Nylas.with(accessToken), {
    subject: subject,
    body: body,
    from: [{ email: from, name: appName }],
    to: [{ email: to }],
  });

  return draft.send();
};
