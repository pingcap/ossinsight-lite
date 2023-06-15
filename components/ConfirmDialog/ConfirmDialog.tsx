import { ConfirmAction, ConfirmDialogContext } from '@/components/ConfirmDialog/context';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import * as RuiDialog from '@radix-ui/react-dialog';
import { ReactNode, useCallback, useRef, useState } from 'react';

export default function ConfirmDialog ({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<ConfirmAction>();
  const resolveRef = useRef<(result: boolean) => void>(noop);
  const finishedRef = useRef(true);

  const openAction = useCallback((action: ConfirmAction) => {
    if (resolveRef.current !== noop) {
      resolveRef.current(false);
    }
    return new Promise<boolean>(resolve => {
      setAction(action);
      setOpen(true);
      resolveRef.current = resolve;
      finishedRef.current = false;
    });
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      setOpen(true);
    } else {
      if (!finishedRef.current) {
        resolveRef.current(false);
        finishedRef.current = true;
      }
      setOpen(false);
    }
  }, []);

  const onConfirm = useRefCallback(() => {
    resolveRef.current(true);
    finishedRef.current = true;
  });

  const onReject = useRefCallback(() => {
    resolveRef.current(false);
    finishedRef.current = true;
  });

  return (
    <>
      <RuiDialog.Root open={open} onOpenChange={handleOpenChange}>
        <RuiDialog.Portal>
          <RuiDialog.Overlay className="site-modal-overlay" />
          <RuiDialog.Content className="site-modal-content compact"
          >
            <RuiDialog.Title asChild={!!action?.title}>
              {action?.title}
            </RuiDialog.Title>
            <RuiDialog.Description asChild={!!action?.description}>
              {action?.description}
            </RuiDialog.Description>
            <div className='mt-4'>
              <RuiDialog.DialogClose asChild>
                <button className="btn btn-primary" onClick={onConfirm}>
                  {action?.confirmText ?? 'Confirm'}
                </button>
              </RuiDialog.DialogClose>
              <RuiDialog.DialogClose asChild>
                <button className="btn" onClick={onReject}>
                  {action?.rejectText ?? 'Cancel'}
                </button>
              </RuiDialog.DialogClose>
            </div>
          </RuiDialog.Content>
        </RuiDialog.Portal>
      </RuiDialog.Root>
      <ConfirmDialogContext.Provider
        value={{ open: openAction }}
      >
        {children}
      </ConfirmDialogContext.Provider>
    </>
  );
}

const noop = () => {};
