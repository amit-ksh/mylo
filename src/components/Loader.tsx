import { Icons } from './ui/icons';

export default function Loader() {
  return (
    <div className="h-10 w-10 animate-spin">
      <Icons.spinner className="h-10 w-10" />
    </div>
  );
}
