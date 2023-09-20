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

const formSchema = mailSchema.omit({ mailId: true });

const languages = ['english', 'hindi', 'french', 'spanish'];

export default function CreateMailForm() {
  const { mutate } = api.mail.send.useMutation();

  const appId = '2131';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: '', subject: '', language: languages[0], appId },
  });

  function onSubmit(data: z.infer<typeof formSchema>, e?: BaseSyntheticEvent) {
    console.log(e);

    e?.preventDefault();
    console.log(data);
    console.log(mutate, appId);
  }

  return (
    <Form {...form}>
      <form
        lang={form.getValues('language')}
        onSubmit={void form.handleSubmit(onSubmit)}
        className="grid gap-2"
      >
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {languages.map(lang => (
                        <SelectItem
                          key={lang}
                          value={lang}
                          className="capitalize"
                        >
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
        <Button type="submit">Send</Button>
      </form>
    </Form>
  );
}
