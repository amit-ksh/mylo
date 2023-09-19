import { getServerAuthSession } from '@/server/auth';
import type { GetServerSidePropsContext } from 'next';

export async function isAutheticated(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (!session?.user) {
    return {
      redirect: {
        permanent: false,
        destination: '/auth',
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
