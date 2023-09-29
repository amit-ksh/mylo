import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Languages, MailBatch } from '@/types';
import { useState } from 'react';
import SelectLanguage from '@/components/SelectLanguage';

export function MailDialog({ mails }: { mails: MailBatch[] }) {
  const [open, setOpen] = useState(false);
  const [mail, setMail] = useState<MailBatch | undefined>(mails[0]);

  const languageNames = new Intl.DisplayNames(['en'], {
    type: 'language',
  });

  const languages: Languages = mails.reduce((acc: Languages, mail) => {
    acc[mail.language] = {
      name: mail.language,
      nativeName: languageNames.of(mail.language),
    };

    return acc;
  }, {});

  const onLanguageChange = (value: string) => {
    const mail = mails.find(m => m.language === value);
    setMail(mail);
  };

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button className="h-8 w-16" onClick={() => setOpen(true)}>
          Open
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen">
        <DialogHeader>
          <DialogTitle>Mails</DialogTitle>
          <DialogDescription>
            Check all the your mails you sent in different language.
          </DialogDescription>
        </DialogHeader>

        <div className="">
          <div className="mb-2">
            <div className="">
              <label className="mb-2 font-medium">Language</label>
              <SelectLanguage
                onChange={onLanguageChange}
                defaultValue={mail?.language ?? ''}
                languages={languages}
              />
            </div>
          </div>

          <div className="">
            <p className="mb-2 font-medium">Sent At</p>
            <p className="rounded-md border-[1px] border-black p-2">
              {mail?.createdAt.toUTCString()}
            </p>
          </div>

          <div className="">
            <p className="mb-2 font-medium">Subject</p>
            <p className="rounded-md border-[1px] border-black p-2">
              {mail?.subject}
            </p>
          </div>

          <div className="">
            <p className="mb-2 font-medium">Content</p>
            <div className="h-[300px]">
              <iframe
                title="Mail Preview"
                srcDoc={mail?.content}
                className="block h-[300px] w-full  rounded-md border-[1px] border-black"
              ></iframe>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
