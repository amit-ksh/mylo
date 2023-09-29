import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { CreateModal, MailDialog } from '@/components/modals';
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
