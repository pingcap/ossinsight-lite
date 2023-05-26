'use client';
import { ModalContext } from '@/app/@modal/(all)/context';
import AppLoading from '@/app/app-loading';
import * as Dialog from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import { Suspense, useCallback } from 'react';

export default function DialogLayout ({ children }: any) {
  const router = useRouter();

  const closeModal = useCallback(() => {
    router.back();
  }, []);

  const onOpenChange = useCallback((open: boolean) => {
    if (!open) {
      closeModal();
    }
  }, []);

  return (
    <Dialog.Root open onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="site-modal-overlay" />
        <Dialog.Content className="site-modal-content">
          <ModalContext.Provider value={{ closeModal }}>
            <Suspense fallback={<AppLoading />}>
              {children}
            </Suspense>
          </ModalContext.Provider>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}