'use client';

import type { BaseSyntheticEvent } from 'react';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import DangerModal from '@/components/DangerModal';
import TokenField from '@/components/TokenField';
import { api } from '@/utils/api';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appCreateSchema } from '@/schemas/app';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';

const formSchema = appCreateSchema.pick({ name: true, url: true });

interface ISettingPanel {
  app: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    token: string;
    url: string;
  };
}

export function SettingPanel({ app }: ISettingPanel) {
  const { mutate: deleteapp } = api.app.delete.useMutation();
  const { mutate: saveapp } = api.app.update.useMutation();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: app.name, url: app.url },
  });

  const deleteApp = () => {
    deleteapp({ id: app.id });
    void router.push({ pathname: '/' });
  };

  function saveApp(values: z.infer<typeof formSchema>, e?: BaseSyntheticEvent) {
    e?.preventDefault();

    saveapp({ id: app.id, data: values });

    void router.push('/app/' + values.name);
  }

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
          <div>
            <Button form="update-app-form">Save</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form
            id="update-app-form"
            className="grid gap-2"
            onSubmit={e => void form.handleSubmit(saveApp)(e)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="app-name" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <div className="h-9 rounded-md border border-input bg-gray-300 px-3 py-1 text-sm font-medium">
                        {window.origin}/
                      </div>
                      <Input
                        type="text"
                        placeholder="my-newsletter"
                        required
                        {...field}
                      />
                      <div className="h-9 rounded-md border border-input bg-gray-300 px-3 py-1 text-sm font-medium">
                        /subscribe
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="flex items-center gap-2">
          <h4 className="font-semibold">Subscribe URL:</h4>
          <a
            className="text-sm font-medium hover:text-gray-600"
            href={`${window.origin}/${app.url}/subscribe`}
            target="_blank"
          >
            {`${window.origin}/${app.url}/subscribe`}
            <span className="inline-block">
              <ArrowTopRightIcon />
            </span>
          </a>
        </div>
        <div className="flex items-center gap-2">
          <h4 className="font-semibold">Unsubscribe URL:</h4>
          <a
            className="text-sm font-medium hover:text-gray-600"
            href={`${window.origin}/${app.url}/unsubscribe`}
            target="_blank"
          >
            {`${window.origin}/${app.url}/unsubscribe`}
            <span className="inline-block">
              <ArrowTopRightIcon />
            </span>
          </a>
        </div>
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
}
