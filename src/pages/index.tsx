import type { GetServerSidePropsContext, Metadata } from 'next';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateAppModal } from '@/components/CreateAppModal';
import MainLayout from '@/components/layouts/MainLayout';
import { isAutheticated } from '@/lib/protected';

export const metadata: Metadata = {
  title: 'Dashboard',
};

interface IAppCard {
  name: string;
  createdAt: Date;
  totalSubscribers: number;
}
function AppCard({ name, createdAt, totalSubscribers }: IAppCard) {
  return (
    <Card className="relative  transition-shadow hover:shadow-xl">
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-lg font-medium underline">
          <Link
            href="/app/app-name"
            className="before:absolute before:left-0 before:top-0 before:h-full before:w-full"
          >
            {name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          {createdAt.getDate().toString()}-{createdAt.getMonth().toString()}-
          {createdAt.getFullYear().toString()}
        </p>
        <p className="text-xs font-semibold">{totalSubscribers} subscribers</p>
      </CardContent>
    </Card>
  );
}
export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="m-4 flex items-center gap-4">
        <h2 className="text-2xl font-bold">Apps</h2>
        <div className="max-w-lg">
          <CreateAppModal />
        </div>
      </div>

      <ul className="m-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <li>
          <AppCard
            name="app-name"
            createdAt={new Date(Date.now())}
            totalSubscribers={87}
          />
        </li>
        <li>
          <AppCard
            name="app-name"
            createdAt={new Date(Date.now())}
            totalSubscribers={87}
          />
        </li>
        <li>
          <AppCard
            name="app-name"
            createdAt={new Date(Date.now())}
            totalSubscribers={87}
          />
        </li>
        <li>
          <AppCard
            name="app-name"
            createdAt={new Date(Date.now())}
            totalSubscribers={87}
          />
        </li>
        <li>
          <AppCard
            name="app-name"
            createdAt={new Date(Date.now())}
            totalSubscribers={87}
          />
        </li>
        <li>
          <AppCard
            name="app-name"
            createdAt={new Date(Date.now())}
            totalSubscribers={87}
          />
        </li>
      </ul>
    </MainLayout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await isAutheticated(ctx);
}
