import type { GetServerSidePropsContext } from 'next';

import DeleteModal from '@/components/DangerModal';
import InputField from '@/components/InputField';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { isAutheticated } from '@/lib/protected';
import { signOut, useSession } from 'next-auth/react';
import { api } from '@/utils/api';

export default function Setting() {
  const { data: sessionData } = useSession();
  const { data: user } = api.user.get.useQuery({
    id: sessionData?.user.id ?? '',
  });
  const { mutate } = api.user.delete.useMutation();

  const deleteUser = () => {
    mutate({ id: sessionData?.user.id ?? '' });
    void signOut();
  };

  return (
    <MainLayout>
      <Card className="mx-auto my-4 max-w-5xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Setting</CardTitle>
              <CardDescription>Your account details.</CardDescription>
            </div>
            <div>
              <Button>Save</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <InputField
            id="name"
            type="text"
            label="Name"
            className="disabled:opacity-1 font-semibold"
            defaultValue={user?.name ?? ''}
          />
          <InputField
            id="createdAt"
            type="data"
            label="Created At"
            className="disabled:opacity-1 font-semibold"
            value={user?.createdAt.toUTCString()}
            disabled
          />

          <InputField
            id="email"
            type="email"
            label="Email"
            value={user?.email ?? ''}
            className="disabled:opacity-1 font-semibold"
            disabled
          />
        </CardContent>
        <CardFooter className="flex items-center justify-end">
          <DeleteModal
            confirmationText={user?.email ?? ''}
            onConfirm={deleteUser}
          >
            Delete Account
          </DeleteModal>
        </CardFooter>
      </Card>
    </MainLayout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await isAutheticated(ctx);
}
