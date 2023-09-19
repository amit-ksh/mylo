'use client';

import Link from 'next/link';

import { UserAuthForm } from '@/components/form/AuthForm';
import AppLogo from '@/components/AppLogo';

export default function LoginPage() {
  return (
    <div className="mx-8 my-4 flex flex-col items-center justify-center">
      <div className="mb-20">
        <AppLogo />
      </div>
      <div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
          </div>

          <UserAuthForm />

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="#`"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
