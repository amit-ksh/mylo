import type { ReactNode } from 'react';
import { signOut } from 'next-auth/react';

import { Button } from '../ui/button';
import { MainNav } from '../MainNav';
import AppLogo from '../AppLogo';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="">
      <div className="border-b">
        <div className="flex h-16 items-center justify-between px-4">
          <AppLogo />

          <MainNav className="mx-6" />

          <div className="flex items-center space-x-4">
            <Button className="" onClick={void signOut}>
              Log Out
            </Button>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
