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
        <Dialog.Overlay className="site-modal-overlay" />
        <Dialog.Content className="site-modal-content">
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}