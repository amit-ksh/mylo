import Link from 'next/link';
import { useRouter } from 'next/router';

import { UserAuthForm } from '@/components/AuthForm';
import AppLogo from '@/components/AppLogo';
import { type ILogin } from '@/types';
import { signIn } from 'next-auth/react';

export default function SignUpPage() {
  const router = useRouter();

  async function handleSignup(data: ILogin & { retypedPassword: string }) {
    try {
      const { password, retypedPassword } = data;

      if (password !== retypedPassword) {
        return;
      }

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
      console.error('🚀 SignUp Error: ', err);
    }
  }

  return (
    <div className="mx-8 my-4 flex flex-col items-center justify-center">
      <div className="mb-20">
        <AppLogo />
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>

          <UserAuthForm type="signup" onSubmit={void handleSignup} />

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
