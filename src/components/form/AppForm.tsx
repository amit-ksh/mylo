import type { z } from 'zod';
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

const formSchema = appCreateSchema.omit({ userId: true });

export default function CreateAppForm() {
  const { mutate } = api.app.create.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const userId = '';
    mutate({ ...values, userId });
  }

  return (
    <Form {...form}>
      <form onSubmit={void form.handleSubmit(onSubmit)} className="grid gap-2">
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormDescription>
                Enter an email for sending your mails.
              </FormDescription>
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
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
