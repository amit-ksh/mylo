import type { ReactNode } from 'react';
import { PlusCircledIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export default function CreateModal({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex w-full items-center gap-2">
          <PlusCircledIcon />
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent>
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
