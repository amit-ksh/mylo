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
import { tanslatorCaller } from '@/server/api/routers/translator';
import SelectLanguage from '@/components/SelectLanguage';
import { api } from '@/utils/api';
import { CheckCircledIcon } from '@radix-ui/react-icons';

interface App {
  id: string;
  name: string;
  url: string;
}

const formSchema = subscriberSchema.pick({ email: true, language: true });

export default function Subscribe({
  app,
  languages,
}: {
  app: App;
  languages: Languages;
}) {
  const [subscribed, setSubscribed] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', language: 'en' },
  });
  const { mutate: subscribe } = api.subscriber.subscribe.useMutation({
    onError: ({ message }) => {
      form.setError('root', { message }, { shouldFocus: true });
    },
    onSuccess: () => {
      setSubscribed(true);
    },
  });

  function onSubmit(
    values: z.infer<typeof formSchema>,
    e?: BaseSyntheticEvent,
  ) {
    e?.preventDefault();

    subscribe({ ...values, appId: app.id });
  }

  return (
    <div className="max-h-screen">
      <h1 className="flex items-center justify-center py-4">
        <AppLogo />
      </h1>

      <main className="flex h-[90vh] flex-col items-center justify-center">
        {!subscribed && (
          <div className="">
            <div className="mb-4 text-center">
              <h2 className="text-xl font-semibold capitalize">
                Subscribe to {app.name.split('-').join(' ')}
              </h2>
              <p>{form.formState.errors.root?.message}</p>
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
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <FormControl>
                          <SelectLanguage
                            onChange={field.onChange}
                            defaultValue={field.value}
                            languages={languages}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" form="subscribe-form">
                    Subscribe
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        )}

        {subscribed && (
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4  flex items-center gap-2 text-3xl font-semibold">
              <CheckCircledIcon className="h-10 w-10" /> <span>Subscribed</span>
            </div>
            <p className="text-xl font-medium">
              You have been subscribed to{' '}
              <span className="font-bold">{app.name}</span> successfully.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const app = await appCaller.get({ url: ctx.params?.appUrl as string });

  const languages = await tanslatorCaller.languages();

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
      languages,
    },
  };
}
