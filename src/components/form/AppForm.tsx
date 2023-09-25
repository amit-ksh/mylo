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
import { useModal } from '@/hooks/useModal';

const formSchema = appCreateSchema.pick({ name: true, url: true });

const APP_URL = 'https://mylo.app/subscribe/';

export default function CreateAppForm({ id }: { id: string }) {
  const { mutate } = api.app.create.useMutation();
  const { data: sessionData } = useSession();

  const userId = sessionData?.user.id ?? '';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', url: '' },
  });

  const { close } = useModal(id);

  function onSubmit(
    values: z.infer<typeof formSchema>,
    e?: BaseSyntheticEvent,
  ) {
    e?.preventDefault();
    if (!sessionData?.user)
      form.setError('root', { message: 'User not found' });

    mutate({ ...values, userId });

    close();
  }

  return (
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
                Enter a url for subscriber to subscribe.
              </FormDescription>
              <FormControl>
                <div className="flex items-center">
                  <div className="h-9 rounded-md border border-input bg-gray-300 px-3 py-1 text-sm font-medium">
                    {APP_URL}
                  </div>
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
        <Button type="submit" form="app-form">
          Create
        </Button>
      </form>
    </Form>
  );
}
