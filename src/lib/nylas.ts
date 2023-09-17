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

export { nylas, Draft };
