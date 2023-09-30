import { useRef } from 'react';
import type { ChangeEvent, ReactNode, FormEvent } from 'react';
import { Cross2Icon, TrashIcon } from '@radix-ui/react-icons';
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
import { useModal } from '@/hooks/useModal';

const ConfirmationText = ({ text }: { text: string }) => (
  <span>
    Retype the following to confirm: <code>{text}.</code>
  </span>
);
interface IDeleteModal {
  id: string;
  children: ReactNode;
  confirmationText: string;
  onConfirm: () => void;
}

export function DangerModal({
  id,
  children,
  onConfirm,
  confirmationText,
}: IDeleteModal) {
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const { isOpen, open, close } = useModal(id);

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
    <Dialog open={isOpen()}>
      <DialogTrigger asChild>
        <Button variant="destructive" className=" gap-2 " onClick={open}>
          <TrashIcon />
          <span>{children}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 border-black">
        <CloseButton close={close} />
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

const CloseButton = ({ close }: { close: () => void }) => (
  <button
    onClick={close}
    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
  >
    <Cross2Icon className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </button>
);
