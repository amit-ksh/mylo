import type { Metadata } from 'next';
import { PlusCircledIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { MainNav } from '@/components/MainNav';
import AppLogo from '@/components/AppLogo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return (
    <div className="flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center justify-between px-4">
          <AppLogo />

          <MainNav className="mx-6" />

          <div className="flex items-center space-x-4">
            <Button className="">Log Out</Button>
          </div>
        </div>
      </div>

      <div className="m-4 flex items-center gap-4">
        <h2 className="text-2xl font-bold">Apps</h2>
        <Button
          className="flex items-center gap-2"
          variant="outline"
          onClick={() => console.log('open modal')}
        >
          <PlusCircledIcon />
          Create App
        </Button>
      </div>

      <div className="m-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card className="relative  transition-shadow hover:shadow-xl">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-lg font-medium underline">
              <Link
                href="/app/app-name"
                className="before:absolute before:left-0 before:top-0 before:h-full before:w-full"
              >
                App Name
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">10-Aug-2023</p>
            <p className="text-xs font-semibold">99 subscribers</p>
          </CardContent>
        </Card>
        <Card className="relative  transition-shadow hover:shadow-xl">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-lg font-medium underline">
              <Link
                href="/app/app-name"
                className="before:absolute before:left-0 before:top-0 before:h-full before:w-full"
              >
                App Name
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">10-Aug-2023</p>
            <p className="text-xs font-semibold">99 subscribers</p>
          </CardContent>
        </Card>
        <Card className="relative  transition-shadow hover:shadow-xl">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-lg font-medium underline">
              <Link
                href="/app/app-name"
                className="before:absolute before:left-0 before:top-0 before:h-full before:w-full"
              >
                App Name
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">10-Aug-2023</p>
            <p className="text-xs font-semibold">99 subscribers</p>
          </CardContent>
        </Card>
        <Card className="relative  transition-shadow hover:shadow-xl">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-lg font-medium underline">
              <Link
                href="/app/app-name"
                className="before:absolute before:left-0 before:top-0 before:h-full before:w-full"
              >
                App Name
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">10-Aug-2023</p>
            <p className="text-xs font-semibold">99 subscribers</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
