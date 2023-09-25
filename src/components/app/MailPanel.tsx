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

export function MailPanel({ appId }: { appId: string }) {
  const { data: mails } = api.mail.getAll.useQuery({ appId });

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
            <TableHead className="">ID</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="">Total Mails Send</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {mails?.map(mail => (
            <TableRow key={mail.batchId}>
              <TableCell className="font-medium">{mail.batchId}</TableCell>
              <TableCell className="">{mail.createdAt.toUTCString()}</TableCell>
              <TableCell className="">{mail.app._count.mails}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
