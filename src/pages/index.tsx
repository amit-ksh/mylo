import type { GetServerSidePropsContext, Metadata } from 'next';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateModal } from '@/components/modals/CreateModal';
import MainLayout from '@/components/layouts/MainLayout';
import AppForm from '@/components/form/AppForm';
import { isAutheticated } from '@/lib/protected';
import { useSession } from 'next-auth/react';
import { api } from '@/utils/api';
import Loader from '@/components/Loader';
import { useEffect } from 'react';

export const metadata: Metadata = {
  title: 'Dashboard',
};

interface IAppCard {
  name: string;
  createdAt: Date;
  totalSubscribers: number;
  totalMails: number;
}
function AppCard({ name, createdAt, totalSubscribers, totalMails }: IAppCard) {
  return (
    <Card className="relative  transition-shadow hover:shadow-xl">
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          <Link
            as={`/app/${name}`}
            href={`/app/${name}`}
            className="underline before:absolute before:left-0 before:top-0 before:h-full before:w-full"
          >
            {name}
          </Link>
          <p className="text-xs text-muted-foreground">
            Created At: {createdAt.getDate().toString()}-
            {createdAt.getMonth().toString()}-
            {createdAt.getFullYear().toString()}
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs font-semibold">{totalSubscribers} subscribers</p>
        <p className="text-xs font-semibold">{totalMails} mails sent.</p>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const { data: sessionData } = useSession();
  const {
    data: apps,
    isLoading,
    error,
  } = api.app.getAll.useQuery({
    userId: sessionData?.user.id ?? '',
  });

  return (
    <MainLayout>
      <div className="m-4 flex items-center gap-4">
        <h2 className="text-2xl font-bold">Apps</h2>
        <div className="max-w-lg">
          <CreateModal id="app-form" title="Create App">
            <AppForm id="app-form" />
          </CreateModal>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      )}

      {!isLoading && error && (
        <p className="text-center text-red-500">No app created yet.</p>
      )}

      {!isLoading && !error && (
        <ul className="m-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {!apps || apps?.length > 0 ? (
            apps?.map((app, idx) => (
              <li key={idx}>
                <AppCard
                  name={app.name}
                  createdAt={app.createdAt}
                  totalSubscribers={app._count.subscriber}
                  totalMails={app._count.mails}
                />
              </li>
            ))
          ) : (
            <p className="text-center text-foreground">No app created yet.</p>
          )}
        </ul>
      )}
    </MainLayout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await isAutheticated(ctx);
}
