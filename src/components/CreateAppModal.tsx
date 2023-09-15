import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { appCreateSchema } from '@/schemas/app';
import { PlusCircledIcon } from '@radix-ui/react-icons';
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
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex items-center gap-2" variant="outline">
          <PlusCircledIcon />
          Create App
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="text-center font-medium leading-none">
              Create New App
            </h4>
          </div>
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
      </PopoverContent>
    </Popover>
  );
}
