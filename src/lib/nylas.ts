import Nylas from 'nylas';
import { Region, regionConfig } from 'nylas/lib/config';
import Draft from 'nylas/lib/models/draft';
import Message from 'nylas/lib/models/message';

import { env } from '@/env.mjs';

Nylas.config({
  clientId: env.NYLAS_CLIENT_ID,
  clientSecret: env.NYLAS_CLIENT_SECRET,
  apiServer: regionConfig[Region.Us].nylasAPIUrl,
});

export { Nylas, Draft, Message };
