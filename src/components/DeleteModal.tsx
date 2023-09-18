import { type ChangeEvent, useRef } from 'react';
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
    Type the name of app to confirm: <code>{text}.</code>
  </span>
);
interface IDeleteModal {
  confirmationText: string;
  onConfirm: () => void;
}

export default function DeleteModal({
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
          <span>Delete App</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete App</DialogTitle>
        </DialogHeader>

        <InputField
          id="confirm-text"
          placeholder="Type the name of app to confirm"
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
