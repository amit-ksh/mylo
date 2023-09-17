import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import AppLogo from '@/components/AppLogo';
import { appCaller } from '@/server/api/routers/app';

export const getServerSideProps = (async context => {
  try {
    (await appCaller.verify((context.params?.id as string) ?? '')) as string;
  } catch (error) {
    return {
      props: { success: false },
    };
  }

  return {
    props: { success: true },
  };
}) satisfies GetServerSideProps<{
  success: boolean;
}>;

export default function Page({
  success,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <AppLogo />

      <div>
        {success ? (
          <h2>You app email is verified!</h2>
        ) : (
          <h2>Wrong Verification Link!</h2>
        )}
      </div>
    </div>
  );
}
