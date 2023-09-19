import DeleteModal from '@/components/DeleteModal';
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
import { CheckIcon } from '@radix-ui/react-icons';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

export default function Setting() {
  const params = useParams();
  const [name, setName] = useState<string>('John Doe');

  const email = 'johndoe@mail.com';
  const createdAt = '12-06-2023';
  const verified = true;

  console.log(params);
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
            defaultValue={name}
          />
          <InputField
            id="createdAt"
            type="data"
            label="Created At"
            className="disabled:opacity-1 font-semibold"
            value={createdAt}
            disabled
          />

          <InputField
            id="email"
            type="email"
            label="Email"
            value={email}
            className="disabled:opacity-1 font-semibold"
            disabled
          />
          <div className="flex items-center gap-2">
            <p
              className={`font-medium ${
                !verified ? 'text-red-600' : 'text-green-400'
              }`}
            >
              Email Verified{' '}
              <span className="inline-block ">{verified && <CheckIcon />}</span>
            </p>
            {!verified && (
              <Button variant="outline" className="p-1 text-sm">
                Resend Email
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-end">
          <DeleteModal
            confirmationText={email}
            onConfirm={() => console.log('delete account')}
          >
            Delete Account
          </DeleteModal>
        </CardFooter>
      </Card>
    </MainLayout>
  );
}
