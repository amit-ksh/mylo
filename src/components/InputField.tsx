import { Label } from '@radix-ui/react-label';
import React from 'react';
import { Input, type InputProps } from './ui/input';

interface IInputField extends InputProps {
  id: string;
  label: string;
}
export default function InputField({ id, label, ...props }: IInputField) {
  return (
    <div className="space-y-1">
      <Label htmlFor="current">{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}
