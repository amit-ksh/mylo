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

export function MailPanel({ appId }: { appId: string }) {
  const { data: mailBatch, isLoading } = api.mail.getAll.useQuery({ appId });

  return (
    <div>
      <div className="m-4 flex items-center gap-4">
        <h2 className="text-2xl font-semibold">Mails</h2>
        <div className="max-w-lg">
          <CreateModal id="mail-form" title="Send Mail">
            <MailForm id="mail-form" appId={appId} />
          </CreateModal>
        </div>
      </div>
      <Table className="my-2 min-w-[500px] overflow-x-auto">
        <TableCaption>List of mails send by you.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">S. No.</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="">Subject</TableHead>
            <TableHead className="">Total Mails Sent</TableHead>
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
                <TableCell className="">
                  {mails[0]!.createdAt.toUTCString()}
                </TableCell>
                <TableCell className="">{mails[0]!.subject}</TableCell>
                <TableCell className="">{mails.length}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
