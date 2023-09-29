import { useRef } from 'react';
import type { ChangeEvent, ReactNode, FormEvent } from 'react';
import { TrashIcon } from '@radix-ui/react-icons';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import InputField from '@/components/InputField';

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

export function DangerModal({
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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    onConfirm();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className=" gap-2 ">
          <TrashIcon />
          <span>{children}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 border-black">
        <form id="delete-form" onSubmit={handleSubmit}>
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
              type="submit"
              form="delete-form"
              variant="destructive"
              disabled={true}
            >
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}