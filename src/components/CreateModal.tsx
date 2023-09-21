import type { ReactNode } from 'react';
import { Cross2Icon, PlusCircledIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/useModal';

export default function CreateModal({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  const { isOpen, open, close } = useModal(id);

  return (
    <Dialog open={isOpen()}>
      <DialogTrigger asChild>
        <Button className="flex w-full items-center gap-2" onClick={open}>
          <PlusCircledIcon />
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 border-black">
        <CloseButton close={close} />
        <div className="grid gap-4">
          <DialogHeader className="space-y-2">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div>{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const CloseButton = ({ close }: { close: () => void }) => (
  <button
    onClick={close}
    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
  >
    <Cross2Icon className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </button>
);
