'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function Layout ({ children }: any) {
  const router = useRouter();

  const onOpenChange = useCallback((open: boolean) => {
    if (!open) {
      router.back();
    }
  }, []);

  return (
    <Dialog.Root open onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-70 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="z-10 bg-white data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] h-full w-[600px] max-w-[calc(100vw-16px)] p-[25px] translate-x-[-50%] translate-y-[-50%] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}