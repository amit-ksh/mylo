import { useState } from 'react';
import { TrashIcon } from '@radix-ui/react-icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from './ui/button';

interface IDeleteModal {
  onConfirm: () => void;
}

export default function DeleteModal({ onConfirm }: IDeleteModal) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} modal>
      <PopoverTrigger asChild>
        <Button
          variant="destructive"
          className=" gap-2 "
          onClick={() => setOpen(true)}
        >
          <TrashIcon />
          <span>Delete App</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="">
        <h4 className="text-lg font-semibold">Delete App</h4>
        <div className="mt-2 flex gap-2">
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
