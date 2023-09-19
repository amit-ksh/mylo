import Link from 'next/link';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const router = useRouter();

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      <Link
        href="/"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          router.pathname !== '/' ? 'text-muted-foreground' : ''
        }`}
      >
        Apps
      </Link>
      <Link
        href="/setting"
        className={`text-sm font-medium  transition-colors hover:text-primary ${
          router.pathname !== '/setting' ? 'text-muted-foreground' : ''
        }`}
      >
        Settings
      </Link>
    </nav>
  );
}
