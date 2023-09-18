import { Label } from '@radix-ui/react-label';
import { Input, type InputProps } from './ui/input';
import type { ReactNode } from 'react';

interface IInputField extends InputProps {
  id: string;
  label: ReactNode;
}
export default function InputField({ id, label, ...props }: IInputField) {
  return (
    <div className="space-y-1">
      <Label htmlFor="current">{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}
