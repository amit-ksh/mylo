import Link from 'next/link';

import { UserAuthForm } from '@/components/AuthForm';
import AppLogo from '@/components/AppLogo';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { type ILogin } from '@/types';

export default function LoginPage() {
  const router = useRouter();

  async function handleSignin(data: ILogin) {
    try {
      await signIn('credentials', { ...data })
        .then(res => {
          if (res?.ok === true) {
            void router.push('/');
          } else {
          }
        })
        .catch(err => {
          console.error(err);
        });
    } catch (err) {
      console.error('🚀 SignIn Error: ', err);
    }
  }

  return (
    <div className="mx-8 my-4 flex flex-col items-center justify-center">
      <div className="mb-20">
        <AppLogo />
      </div>
      <div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password
            </p>
          </div>

          <UserAuthForm type="signin" onSubmit={void handleSignin} />

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
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
