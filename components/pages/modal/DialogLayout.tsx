'use client';
import { ModalContext } from '@/app/@modal/(all)/context';
import AppLoading from '@/components/AppLoading';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

export default function DialogLayout ({ children }: any) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [animation, setAnimation] = useState(false);
  const [compact, setCompact] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

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

  const useCompactMode = useCallback((compact: boolean) => {
    useEffect(() => {
      setCompact(compact);
      return () => {
        if (mountedRef.current) {
          setCompact(false);
        }
      };
    }, [compact]);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal forceMount={animation ? true : undefined}>
        <Dialog.Overlay className="site-modal-overlay" />
        <Dialog.Content
          className={clsx('site-modal-content', { compact })}
          onAnimationEndCapture={handleAnimationEnd}
        >
          <ModalContext.Provider value={{ closeModal, useCompactMode }}>
            <Suspense fallback={<AppLoading />}>
              {children}
            </Suspense>
          </ModalContext.Provider>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}