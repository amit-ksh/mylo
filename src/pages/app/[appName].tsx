import type { GetServerSidePropsContext } from 'next';
import { useParams } from 'next/navigation';
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
import { isAutheticated } from '@/lib/protected';
import CreateAppForm from '@/components/form/CreateAppForm';

export default function AppPage() {
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
            <Mails />
          </TabsContent>
          <TabsContent value="analytics">Analytics</TabsContent>
          <TabsContent value="setting" className="mx-auto">
            <SettingPanel />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

const mails = [
  {
    id: 'kasdnk24ksdq4lki',
    batchId: 'asfjeillnldfskln',
    createdAt: '12-08-2023',
    totalMailsSend: 23,
  },
];

export function Mails() {
  return (
    <div>
      <div>
        <CreateModal title="Create Mail">
          <CreateAppForm />
        </CreateModal>
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
          {mails.map(mail => (
            <TableRow key={mail.batchId}>
              <TableCell className="font-medium">{mail.batchId}</TableCell>
              <TableCell className="">{mail.createdAt}</TableCell>
              <TableCell className="">{mail.totalMailsSend}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const SettingPanel = () => {
  const params = useParams();
  const token = 'sdslsfja4wklmtk3kp';
  const appId = 'kskliiragkfjgfld';
  const senderEmail = 'johndoe@mail.com';

  const [appName, setAppName] = useState('app-name');

  console.log(params);
  return (
    <Card className="mx-auto max-w-5xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="">
            <CardTitle className="text-2xl">Setting</CardTitle>
            <CardDescription>
              You can change your app setting here.
            </CardDescription>
          </div>
          <div className="">
            <Button>Save</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <InputField
          id="appName"
          type="text"
          label="App Name"
          value={appName}
          onChange={e =>
            console.log(e.target.value, setAppName(e.target.value))
          }
        />
        <InputField
          id="updatedAt"
          type="date"
          label="Update At"
          value={'2023-09-14'}
          className="disabled:opacity-1"
          disabled
        />
        <InputField
          id="senderEmail"
          type="email"
          label="Sender's Name"
          value={senderEmail}
          className="disabled:opacity-90"
          disabled
        />

        <TokenField id="appId" label="App ID" value={appId} />
        <TokenField id="token" label="Token" value={token} />
      </CardContent>
      <CardFooter className="flex items-center justify-end">
        <DangerModal
          confirmationText={appName}
          onConfirm={() => console.log('delete app')}
        >
          Delete App
        </DangerModal>
      </CardFooter>
    </Card>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await isAutheticated(ctx);
}
