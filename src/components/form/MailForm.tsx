import { useState, type BaseSyntheticEvent } from 'react';
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

import { Textarea } from '@/components/ui/textarea';

import { api } from '@/utils/api';
import { mailSchema } from '@/schemas/mail';
import { useModal } from '@/hooks/useModal';
import SelectLanguage from '../SelectLanguage';
import { useSession } from 'next-auth/react';

const formSchema = mailSchema.omit({ mailId: true });

export default function MailForm({ id, appId }: { id: string; appId: string }) {
  const { mutate: sendMail } = api.mail.send.useMutation();
  const { data: languages } = api.translator.languages.useQuery();
  const { data: userSession } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: 'onChange',
    defaultValues: { content: '', subject: '', language: 'en', appId },
  });
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const { close } = useModal(id);

  function onSubmit(
    values: z.infer<typeof formSchema>,
    e?: BaseSyntheticEvent,
  ) {
    e?.preventDefault();
    if (!userSession?.user.email) return;

    sendMail({ ...values });

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
        <div className="relative h-[350px]">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    className={`h-[300px] resize-none overflow-auto ${
                      showPreview ? 'opacity-0' : 'opacity-100'
                    }`}
                    placeholder="Content"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            className="absolute right-1 top-9 z-50 h-8 w-16"
            onClick={() => setShowPreview(v => !v)}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
          {showPreview && (
            <div className="absolute right-0 top-8 h-[300px] w-full">
              <iframe
                title="HTML Preview"
                srcDoc={form.getValues('content')}
                className="block h-[300px] w-full  rounded-md border-[1px] border-black"
              ></iframe>
            </div>
          )}
        </div>
        <Button type="submit" form="mail-form">
          Send
        </Button>
      </form>
    </Form>
  );
}
