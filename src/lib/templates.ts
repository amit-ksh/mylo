import { Draft, nylas } from './nylas';

export const createNewUserMail = (to: string, appName: string) => {
  return new Draft(nylas, {
    to: [{ email: to }],
    subject: `Successfully created app: ${appName}`,
    body: `
      You have successfully created app. Here the details of your app-
      
      <p>App Name: ${appName}</p>
      <p>Subscribe Url: <i>some url</i></p>
      <p>Unsubscribe Url: <i>some url</i></p>
      </div>
    `,
  });
};
