import type { GetServerSidePropsContext } from 'next';
import { usePathname } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import MainLayout from '@/components/layouts/MainLayout';

import { isAutheticated } from '@/lib/protected';
import { api } from '@/utils/api';
import { useSession } from 'next-auth/react';

import { MailPanel, SettingPanel, StatisticsPanel } from '@/components/app';
import { Icons } from '@/components/ui/icons';

export default function AppPage() {
  const pathname = usePathname();
  const appName = pathname.split('/').at(-1) ?? '';

  const { data: sessionData } = useSession();
  const {
    data: app,
    isLoading,
    isError,
  } = api.app.get.useQuery({
    userId: sessionData?.user.id ?? '',
    name: appName,
  });
  const appId = app?.id ?? '';

  return (
    <MainLayout>
      <div className="m-4 ">
        <Tabs defaultValue="mails">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mails">Mails</TabsTrigger>
            <TabsTrigger value="statistics">
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsTrigger>
            <TabsTrigger value="setting">Setting</TabsTrigger>
          </TabsList>
          <TabsContent value="mails">
            <MailPanel appId={appId} />
          </TabsContent>
          <TabsContent value="statistics">
            <StatisticsPanel appId={appId} />
          </TabsContent>
          <TabsContent value="setting" className="mx-auto">
            {!isLoading && isError && (
              <div className="flex h-[80vh] items-center justify-center">
                {!isLoading && isError && (
                  <p className="text-lg text-red-600">
                    Error while loading app.
                  </p>
                )}
                {isLoading && <Icons.spinner className="h-10 w-10" />}
              </div>
            )}
            {app && !isLoading && <SettingPanel app={app} />}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await isAutheticated(ctx);
}
