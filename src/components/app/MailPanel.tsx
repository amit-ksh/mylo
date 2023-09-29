import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import CreateModal from '@/components/CreateModal';
import MailForm from '@/components/form/MailForm';
import { api } from '@/utils/api';
import { isObjectEmpty } from '@/lib/utils';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';

export function MailPanel({ appId }: { appId: string }) {
  const { data: mailBatch, isLoading } = api.mail.getAll.useQuery({ appId });

  return (
    <div>
      <div className="m-4 flex items-center gap-4">
        <h2 className="text-2xl font-semibold">Mails</h2>
        <div className="">
          <CreateModal id="mail-form" title="Send Mail">
            <MailForm id="mail-form" appId={appId} />
          </CreateModal>
        </div>
      </div>
      <Table className="my-2 min-w-[500px] overflow-x-auto">
        <TableCaption>List of mails send by you.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>S. No.</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Total Mails Sent</TableHead>
            <TableHead>
              <EnvelopeClosedIcon />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && 'Loading...'}
          {!isLoading && isObjectEmpty(mailBatch!) && '0 mails sent'}
          {!isLoading &&
            !isObjectEmpty(mailBatch!) &&
            Object.values(mailBatch!)?.map((mails, idx) => (
              <TableRow key={mails[0]!.batchId}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>{mails[0]!.createdAt.toUTCString()}</TableCell>
                <TableCell>{mails[0]!.subject}</TableCell>
                <TableCell>{mails.length}</TableCell>
                <TableCell>
                  <MailDialog mails={mails}></MailDialog>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

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
