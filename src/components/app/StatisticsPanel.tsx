import { api } from '@/utils/api';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from '../ui/table';

const Link = ({ url }: { url: string }) => (
  <a
    className="text-sm font-medium hover:text-gray-600"
    href={url}
    target="_blank"
  >
    {url}
    <span className="inline-block">
      <ArrowTopRightIcon />
    </span>
  </a>
);

export function StatisticsPanel({ appId }: { appId: string }) {
  const { data: app } = api.app.get.useQuery({ id: appId });

  return (
    <div>
      <Table className="my-2 min-w-[500px] overflow-x-auto">
        <TableCaption>Your app Stats.</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell className="first-of-type:font-medium">
              App Name
            </TableCell>
            <TableCell>{app?.name ?? ''}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="first-of-type:font-medium">
              Created At
            </TableCell>
            <TableCell>{app?.name ?? ''}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="first-of-type:font-medium">
              Last Updated
            </TableCell>
            <TableCell>{app?.createdAt.toUTCString() ?? ''}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="first-of-type:font-medium">
              Subscribe URL
            </TableCell>
            <TableCell>
              <Link url={`${window.origin}/${app?.name}/subscribe`} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="first-of-type:font-medium">
              Unsubscribe URL
            </TableCell>
            <TableCell>
              <Link url={`${window.origin}/${app?.name}/unsubscribe`} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="first-of-type:font-medium">
              Total Subscriber
            </TableCell>
            <TableCell>{app?._count.subscriber ?? 0}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="first-of-type:font-medium">
              Total Mail Sent
            </TableCell>
            <TableCell>{app?._count.mails ?? 0}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
