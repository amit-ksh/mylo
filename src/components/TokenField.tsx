import { Label } from '@radix-ui/react-label';
import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ClipboardCopyIcon } from '@radix-ui/react-icons';

interface ITokenField {
  id: string;
  label: string;
  value: string;
}
export default function TokenField({ id, label, value }: ITokenField) {
  return (
    <div className="space-y-1">
      <Label htmlFor="new" className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <Input id={id} type="password" value="•••••••••••••••••••••" disabled />
        <Button
          variant="outline"
          className="absolute right-0 top-0"
          onClick={() => void navigator.clipboard.writeText(value)}
        >
          <ClipboardCopyIcon />
        </Button>
      </div>
    </div>
  );
}
