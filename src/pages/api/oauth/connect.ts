import type { NextApiRequest, NextApiResponse } from 'next';
import { Draft, Nylas, nylas } from '@/lib/nylas';
import { appCaller } from '@/server/api/routers/app';

export default async function authorize(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { state, code } = req.query as unknown as Record<string, string>;

  const { appId } = JSON.parse(state!) as { appId: string };

  if (!code || !appId) return res.redirect('/?errorMsg=Server error!');

  try {
    const { accessToken, emailAddress } =
      await Nylas.exchangeCodeForToken(code);

    if (!accessToken) new Error('Error authenticating!');

    const app = await appCaller.update({
      id: appId,
      data: {
        email: emailAddress,
        accessToken,
      },
    });

    const draft = new Draft(nylas, {
      subject: `${app.name} app successfully connected to your email address`,
      body: `Your email is successfully connected to your Mylo app - ${app.name}.`,
      to: [{ email: emailAddress }],
    });
    draft
      .send()
      .then(message => {
        console.log(`${message.id} was sent`);
      })
      .catch(() => console.log('Server error! Try agian later.'));

    return res.redirect('/?successMsg=App created successfully!');
  } catch (e) {
    console.log(e);

    res.redirect('/error');
  }
}
