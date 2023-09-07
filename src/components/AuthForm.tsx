'use client';

import * as React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

import { cn } from '@/lib/utils';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Icons } from './ui/icons';
import { type ILogin } from '@/types';
import { useForm } from 'react-hook-form';

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
  className?: string;
  type: 'signin' | 'signup';
  onSubmit: (data: ILogin) => void;
}

export function UserAuthForm({
  className = '',
  type,
  onSubmit,
  ...props
}: IUserAuthForm) {
  const { data: sessionData } = useSession();
  const { handleSubmit } = useForm<ILogin & { retypedPassword?: string }>({
    defaultValues: {
      email: '',
      password: '',
      retypedPassword: '',
    },
  });

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={void handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              required
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="your password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              required
            />
          </div>
          {type === 'signup' && (
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="retypedPassword">
                Retype Your Password
              </Label>
              <Input
                id="retypedPassword"
                placeholder="retype your password"
                type="password"
                autoCapitalize="none"
                autoCorrect="off"
                required
              />
            </div>
          )}
          <Button>
            {type === 'signin' ? 'Sign In' : 'Sign Up'} with Email
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

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
