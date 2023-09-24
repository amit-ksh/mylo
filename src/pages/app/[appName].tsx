import type { GetServerSidePropsContext } from 'next';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import MainLayout from '@/components/layouts/MainLayout';

import DangerModal from '@/components/DangerModal';
import TokenField from '@/components/TokenField';
import InputField from '@/components/InputField';
import CreateModal from '@/components/CreateModal';
import MailForm from '@/components/form/MailForm';
import { isAutheticated } from '@/lib/protected';
import { api } from '@/utils/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function AppPage() {
  const pathname = usePathname();
  const appName = pathname.split('/').at(-1) ?? '';

  const { data: sessionData } = useSession();
  const { data: app } = api.app.get.useQuery({
    userId: sessionData?.user.id ?? '',
    name: appName,
  }) as unknown as { data: ISettingPanel['app'] };
  const appId = app?.id ?? '';

  return (
    <MainLayout>
      <div className="m-4 ">
        <Tabs defaultValue="mails">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mails">Mails</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="setting">Setting</TabsTrigger>
          </TabsList>
          <TabsContent value="mails">
            <Mails appId={appId} />
          </TabsContent>
          <TabsContent value="analytics">Analytics</TabsContent>
          <TabsContent value="setting" className="mx-auto">
            <SettingPanel app={app} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

export function Mails({ appId }: { appId: string }) {
  const { data: mails } = api.mail.getAll.useQuery({ appId });

  return (
    <div>
      <div className="m-4 flex items-center gap-4">
        <h2 className="text-2xl font-semibold">Mails</h2>
        <div className="max-w-lg">
          <CreateModal id="mail-form" title="Send Mail">
            <MailForm id="mail-form" appId={appId} />
          </CreateModal>
        </div>
      </div>
      <Table className="my-2 min-w-[500px] overflow-x-auto">
        <TableCaption>List of mails send by you.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">ID</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="">Total Mails Send</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {mails?.map(mail => (
            <TableRow key={mail.batchId}>
              <TableCell className="font-medium">{mail.batchId}</TableCell>
              <TableCell className="">{mail.createdAt.toUTCString()}</TableCell>
              <TableCell className="">{mail.app._count.mails}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface ISettingPanel {
  app: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    token: string;
    userId: string;
  };
}

const SettingPanel = ({ app }: ISettingPanel) => {
  const [appName, setAppName] = useState(app.name);
  const { mutate: deleteapp } = api.app.delete.useMutation();
  const { mutate: saveapp } = api.app.update.useMutation();

  const router = useRouter();

  const deleteApp = () => {
    deleteapp({ id: app.id, userId: app.userId });
    void router.push({ pathname: '/' });
  };

  const saveApp = () => {
    if (app.name === appName) return;
    saveapp({ id: app.id, data: { name: appName } });
  };

  return (
    <Card className="mx-auto max-w-5xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="">
            <CardTitle className="text-2xl">App Setting</CardTitle>
            <CardDescription>
              You can change your app setting here.
            </CardDescription>
          </div>
          <div className="">
            <Button onClick={saveApp}>Save</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <InputField
          id="appName"
          type="text"
          label="App Name"
          value={appName}
          onChange={e => setAppName(e.target.value)}
        />
        <InputField
          id="updatedAt"
          type="date"
          label="Update At"
          value={'2023-09-14'}
          className="disabled:opacity-1"
          disabled
        />

        <TokenField id="appId" label="App ID" value={app.id} />
        <TokenField id="token" label="Token" value={app.token} />
      </CardContent>
      <CardFooter className="flex items-center justify-end">
        <DangerModal confirmationText={app.name} onConfirm={deleteApp}>
          Delete App
        </DangerModal>
      </CardFooter>
    </Card>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await isAutheticated(ctx);
}
