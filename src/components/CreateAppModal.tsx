import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { PlusCircledIcon } from '@radix-ui/react-icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

import { api } from '@/utils/api';
import { appCreateSchema } from '@/schemas/app';

const formSchema = appCreateSchema.omit({ userId: true });

export function CreateAppModal() {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex w-full items-center gap-2">
          <PlusCircledIcon />
          Create App
        </Button>
      </DialogTrigger>
      <DialogContent className="w-80">
        <div className="grid gap-4">
          <DialogHeader className="space-y-2">
            <DialogTitle>Create New App</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={void form.handleSubmit(onSubmit)}
              className="grid gap-2"
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
