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

import { DangerModal } from '@/components/modals';
import TokenField from '@/components/TokenField';
import { api } from '@/utils/api';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appCreateSchema } from '@/schemas/app';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { GConnectButton } from '@/components/ConnectButton';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { useToast } from '../ui/use-toast';

const formSchema = appCreateSchema.pick({ name: true, url: true });

interface ISettingPanel {
  app: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string | null;
    name: string;
    token: string;
    url: string;
  };
  userId: string;
}

export function SettingPanel({ app, userId }: ISettingPanel) {
  const { toast } = useToast();

  const { refetch: refetchUesrDetails } = api.app.getAll.useQuery({ userId });
  const { mutate: deleteapp } = api.app.delete.useMutation({
    onSuccess: ({ name }) => {
      void refetchUesrDetails();
      toast({
        title: 'App deleted!',
        description: `${name} app deleted successfully.`,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Server Error! Try again later.',
        variant: 'destructive',
      });
    },
  });
  const { mutate: saveapp } = api.app.update.useMutation({
    onSuccess: ({ name }) => {
      toast({
        title: 'App Details Updated!',
        description: `App details (${name}) is updated successfully.`,
      });
      void router.push('/app/' + name);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Server Error! Try again later.',
        variant: 'destructive',
      });
    },
  });

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
            <Button type="submit" form="update-app-form">
              Save
            </Button>
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
                  <FormDescription className="text-sm font-medium text-black">
                    <span>{window.origin}/</span>
                    <span className="font-medium">{form.getValues('url')}</span>
                    <span>/subscribe</span>
                  </FormDescription>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
                        type="text"
                        placeholder="my-newsletter"
                        required
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        {!app.email ? (
          <div className="flex items-center gap-4">
            <p>Email: </p>
            <GConnectButton appId={app.id} />
          </div>
        ) : (
          <p className="my-8 font-medium">
            Email:{' '}
            <span className="flex items-center gap-2 italic text-green-600">
              {app.email} <CheckCircledIcon />
            </span>
          </p>
        )}

        <TokenField id="appId" label="App ID" value={app.id} />
        <TokenField id="token" label="Token" value={app.token} />
      </CardContent>
      <CardFooter className="flex items-center justify-end">
        <DangerModal
          id="delete-app"
          confirmationText={app.name}
          onConfirm={deleteApp}
        >
          Delete App
        </DangerModal>
      </CardFooter>
    </Card>
  );
}
