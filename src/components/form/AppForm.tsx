'use client';

import { type BaseSyntheticEvent } from 'react';
import { type z } from 'zod';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { api } from '@/utils/api';
import { appCreateSchema } from '@/schemas/app';
import { useSession } from 'next-auth/react';
import ConnectButton from '../ConnectButton';
import { useToast } from '../ui/use-toast';

const formSchema = appCreateSchema.pick({ name: true, url: true });

export default function CreateAppForm({ id }: { id: string }) {
  const { toast } = useToast();

  const { data: sessionData } = useSession();

  const userId = sessionData?.user.id ?? '';

  const { refetch: getApps } = api.app.getAll.useQuery({ userId });
  const {
    mutate: createApp,
    data: app,
    isLoading,
  } = api.app.create.useMutation({
    onSuccess: data => {
      void getApps();
      toast({
        title: 'App Created!',
        description: `${data?.name ?? ''} app created successfully!`,
      });
    },
    onError: ({ message }) => {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', url: '' },
  });

  function onSubmit(
    values: z.infer<typeof formSchema>,
    e?: BaseSyntheticEvent,
  ) {
    e?.preventDefault();
    if (!sessionData?.user)
      form.setError('root', { message: 'User not found' });

    createApp({ ...values, userId });
  }

  return !app ? (
    <Form {...form}>
      <form
        id={id}
        className="grid gap-2"
        onSubmit={e => void form.handleSubmit(onSubmit)(e)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormDescription>Enter a unique app name.</FormDescription>
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
              <FormDescription>
                <span>Enter a url for subscriber to subscribe.</span>
                <span className="block text-sm text-black">
                  <span className="font-medium">URL: </span>
                  <span>{window.origin}/</span>
                  <span className="font-medium">{form.getValues('url')}</span>
                  <span>/subscribe</span>
                </span>
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
        <Button type="submit" form="app-form" disabled={isLoading}>
          Create
        </Button>
      </form>
    </Form>
  ) : (
    <ConnectButton appId={app.id} />
  );
}
