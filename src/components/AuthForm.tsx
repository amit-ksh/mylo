'use client';

import * as React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Icons } from './ui/icons';

const providers = [
  {
    value: 'github',
    name: 'Github',
    icon: Icons.gitHub,
  },
  {
    value: 'google',
    name: 'Google',
    icon: Icons.google,
  },
] as const;

interface IUserAuthForm {
  className?: Parameters<typeof cn>;
}

export function UserAuthForm({ className, ...props }: IUserAuthForm) {
  const { data: sessionData } = useSession();

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      {providers.map(provider => (
        <Button
          key={provider.value}
          variant="outline"
          type="button"
          onClick={
            sessionData
              ? () => void signOut()
              : () => void signIn(provider.value)
          }
        >
          <provider.icon className="mr-2 h-4 w-4" />
          {provider.name}
        </Button>
      ))}
    </div>
  );
}
