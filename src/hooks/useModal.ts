import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

export const useModal = (modalId: string) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const isOpen = () => !!searchParams.get('modalId');

  const open = () => {
    void router.replace({
      query: { ...router.query, modalId },
    });
  };

  const close = () => {
    void router.replace({
      query: { ...router.query, modalId: null },
    });
  };

  return {
    isOpen,
    open,
    close,
  };
};
