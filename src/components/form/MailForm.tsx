import type { BaseSyntheticEvent } from 'react';
import type { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { api } from '@/utils/api';
import { mailSchema } from '@/schemas/mail';
import { useModal } from '@/hooks/useModal';
import SelectLanguage from '../SelectLanguage';

const formSchema = mailSchema.omit({ mailId: true });

export default function MailForm({ id, appId }: { id: string; appId: string }) {
  const { mutate } = api.mail.send.useMutation();
  const { data: languages } = api.translator.languages.useQuery();

  console.log(languages);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: '', subject: '', language: 'en', appId },
  });

  const { close } = useModal(id);

  function onSubmit(
    values: z.infer<typeof formSchema>,
    e?: BaseSyntheticEvent,
  ) {
    e?.preventDefault();

    mutate(values);

    close();
  }

  return (
    <Form {...form}>
      <form
        id="mail-form"
        lang={form.getValues('language')}
        onSubmit={e => void form.handleSubmit(onSubmit)(e)}
        className="grid gap-2"
      >
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                {languages && (
                  <SelectLanguage
                    onChange={field.onChange}
                    defaultValue={field.value}
                    languages={languages}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Subject" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  className="h-40"
                  placeholder="Content"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" form="mail-form">
          Send
        </Button>
      </form>
    </Form>
  );
}
