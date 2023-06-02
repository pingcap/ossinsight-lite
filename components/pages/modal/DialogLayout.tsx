'use client';
import { ModalContext } from '@/app/@modal/(all)/context';
import AppLoading from '@/components/AppLoading';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import * as Dialog from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';

export default function DialogLayout ({ children }: any) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [animation, setAnimation] = useState(false);

  const handleAnimationEnd = useRefCallback((ev) => {
    setAnimation(false);
  });

  useEffect(() => {
    if (!open && !animation) {
      router.back();
    }
  }, [animation, open]);

  const closeModal = useCallback(() => {
    setAnimation(true);
    setOpen(false);
  }, []);

  const onOpenChange = useRefCallback((open: boolean) => {
    setOpen(open);
    if (!open) {
      setAnimation(true);
    }
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal forceMount={animation ? true : undefined}>
        <Dialog.Overlay className="site-modal-overlay" />
        <Dialog.Content
          className="site-modal-content"
          onAnimationEndCapture={handleAnimationEnd}
        >
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