import { SessionProvider } from 'next-auth/react';
import { type Session } from 'next-auth';
import { type AppType } from 'next/app';
import '@/styles/globals.css';
import { api } from '@/utils/api';
import { Toaster } from '@/components/ui/toaster';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Toaster />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
