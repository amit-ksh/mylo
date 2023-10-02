import { cn } from '@/lib/utils';
import { Icons } from './ui/icons';

export default function Loader({ className = '' }: { className?: string }) {
  return (
    <div>
      <Icons.spinner className={cn('h-10 w-10 animate-spin', className)} />
    </div>
  );
}
