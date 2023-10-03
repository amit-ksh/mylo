import { api } from '@/utils/api';
import { ArrowTopRightIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from '../ui/table';
import { GConnectButton } from '@/components/ConnectButton';
import Loader from '@/components/Loader';

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
  const { data: app, isLoading } = api.app.get.useQuery({ id: appId });

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );
  else
    return (
      <div>
        <Table className="my-2 min-w-[500px] overflow-x-auto">
          <TableCaption>Your App Stats.</TableCaption>
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
              <TableCell>{app?.createdAt.toUTCString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="first-of-type:font-medium">
                Last Updated
              </TableCell>
              <TableCell>{app?.createdAt.toUTCString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="first-of-type:font-medium">Email</TableCell>
              <TableCell>
                {!app?.email ? (
                  <GConnectButton appId={app?.id ?? ''} />
                ) : (
                  <p className="flex items-center gap-2 font-medium italic text-green-600">
                    {app.email} <CheckCircledIcon />
                  </p>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="first-of-type:font-medium">
                Subscribe URL
              </TableCell>
              <TableCell>
                <Link url={`${window.origin}/${app?.url}/subscribe`} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="first-of-type:font-medium">
                Unsubscribe URL
              </TableCell>
              <TableCell>
                <Link url={`${window.origin}/${app?.url}/unsubscribe`} />
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
