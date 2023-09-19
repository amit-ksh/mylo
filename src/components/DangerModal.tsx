import { type ChangeEvent, useRef, type ReactNode } from 'react';
import { TrashIcon } from '@radix-ui/react-icons';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import InputField from './InputField';

const ConfirmationText = ({ text }: { text: string }) => (
  <span>
    Retype the following to confirm: <code>{text}.</code>
  </span>
);
interface IDeleteModal {
  children: ReactNode;
  confirmationText: string;
  onConfirm: () => void;
}

export default function DangerModal({
  children,
  onConfirm,
  confirmationText,
}: IDeleteModal) {
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const checkConfirmationText = (e: ChangeEvent<HTMLInputElement>) => {
    if (!deleteButtonRef.current) return;
    const text = e.target.value;

    if (text === confirmationText) {
      deleteButtonRef.current.disabled = false;
    } else {
      deleteButtonRef.current.disabled = true;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className=" gap-2 ">
          <TrashIcon />
          <span>{children}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{children}</DialogTitle>
        </DialogHeader>

        <InputField
          id="confirm-text"
          label={<ConfirmationText text={confirmationText} />}
          onChange={checkConfirmationText}
        />

        <DialogFooter className="mt-2 flex gap-2">
          <Button
            ref={deleteButtonRef}
            variant="destructive"
            onClick={onConfirm}
            disabled={true}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
