'use client';
import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useWatchReactiveValueField } from '@/packages/ui/hooks/bind/hooks';
import { appState } from '@/app/bind';
import LoadingIndicator from '@/src/components/LoadingIndicator';

export default function Layout (props: any) {
  const ref = useRef<HTMLDivElement>(null);
  const saving = useWatchReactiveValueField(appState, 'saving');

  return (
    <>
      <CSSTransition key="saving" classNames="fade" timeout={400} unmountOnExit mountOnEnter in={saving} nodeRef={ref}>
        <div ref={ref} className="fixed z-50 top-4 w-full left-0 flex justify-center pointer-events-none">
          <div className="relative rounded p-2 bg-white flex items-center justify-center gap-2">
            <LoadingIndicator />
            <span>
               Saving
            </span>
          </div>
        </div>
      </CSSTransition>
      {props.children}
    </>
  );
}