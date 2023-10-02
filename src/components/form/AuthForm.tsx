import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Icons } from '../ui/icons';

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
[];
export function UserAuthForm({ className, ...props }: IUserAuthForm) {
  const router = useRouter();

  const signin = (provider: string) => {
    void signIn(provider);
    void router.push({ pathname: '/' });
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      {providers.map(provider => (
        <Button
          key={provider.value}
          variant="outline"
          type="button"
          onClick={() => signin(provider.value)}
        >
          <provider.icon className="mr-2 h-4 w-4" />
          {provider.name}
        </Button>
      ))}
    </div>
  );
}
