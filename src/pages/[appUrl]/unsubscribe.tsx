import { useState, type BaseSyntheticEvent } from 'react';
import type { GetServerSidePropsContext } from 'next';
import type { z } from 'zod';
import type { Languages } from '@/types';
import AppLogo from '@/components/AppLogo';
import { appCaller } from '@/server/api/routers/app';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { subscriberSchema } from '@/schemas/subscriber';
import { useForm } from 'react-hook-form';
import { api } from '@/utils/api';
import { CheckCircledIcon } from '@radix-ui/react-icons';

interface App {
  id: string;
  name: string;
  url: string;
}

const formSchema = subscriberSchema.pick({ email: true });

export default function Subscribe({ app }: { app: App; languages: Languages }) {
  const [unsubscribed, setUnsubscribed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });
  const { mutate: unsubscribe } = api.subscriber.unsubscribe.useMutation({
    onError: ({ message }) => {
      setErrorMessage(message);
    },
    onSuccess: () => {
      setUnsubscribed(true);
    },
  });

  function onSubmit(
    values: z.infer<typeof formSchema>,
    e?: BaseSyntheticEvent,
  ) {
    e?.preventDefault();

    unsubscribe({ ...values, appId: app.id });
  }

  return (
    <div className="max-h-screen">
      <h1 className="flex items-center justify-center py-4">
        <AppLogo />
      </h1>

      <main className="flex h-[90vh] flex-col items-center justify-center">
        {!unsubscribed && (
          <div className="">
            <div className="mb-4 text-center">
              <h2 className="text-xl font-semibold capitalize">
                Unsubscribe to {app.name.split('-').join(' ')}
              </h2>
              {errorMessage && <p>{errorMessage}</p>}
            </div>
            <div className=" w-[300px]">
              <Form {...form}>
                <form
                  id={'subscribe-form'}
                  className="grid gap-2"
                  onSubmit={e => void form.handleSubmit(onSubmit)(e)}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@doe.com"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" form="subscribe-form">
                    Unsubscribe
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        )}

        {unsubscribed && (
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4  flex items-center gap-2 text-3xl font-semibold">
              <CheckCircledIcon className="h-10 w-10" />{' '}
              <span>Unsubscribed</span>
            </div>
            <p className="text-xl font-medium">
              You have been successfully unsubscribed from{' '}
              <span className="font-bold">{app.name}</span>.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const app = await appCaller.get({ url: ctx.params?.appUrl as string });

  if (!app) {
    return {
      redirect: {
        permanent: false,
        destination: '/error',
      },
    };
  }

  return {
    props: {
      app: {
        id: app?.id,
        name: app?.name,
        url: app?.url,
      },
    },
  };
}
