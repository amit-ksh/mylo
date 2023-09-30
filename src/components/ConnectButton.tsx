/* eslint-disable */

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { useRouter } from 'next/router';

export default function ConnectButton({ appId }: { appId: string }) {
  const router = useRouter();

  const onConnect = async () => {
    const resp = await fetch(`/api/oauth/authorize/?appId=${appId}`);
    const { url } = await resp.json();

    void router.push(url);
  };

  return (
    <div>
      <div className="mb-2">
        <p className="font-semibold text-black">Connect an email address</p>
        <p className="text-sm text-muted-foreground">
          The email you will select is used for sending mails
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={onConnect}>
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
    </div>
  );
}

export function GConnectButton({ appId }: { appId: string }) {
  const router = useRouter();

  const onConnect = async () => {
    const resp = await fetch(`/api/oauth/authorize/?appId=${appId}`);
    const { url } = await resp.json();

    void router.push(url);
  };

  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="outline" onClick={onConnect}>
        <Icons.google className="mr-2 h-4 w-4" />
        Connect App with Google
      </Button>
    </div>
  );
}
