'use client';
import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useWatchReactiveValueField } from '@/packages/ui/hooks/bind/hooks';
import { appState } from '@/app/bind';

export default function Layout (props: any) {
  const ref = useRef<HTMLDivElement>(null);
  const saving = useWatchReactiveValueField(appState, 'saving');

  return (
    <>
      <CSSTransition key="saving" classNames="fade" timeout={400} unmountOnExit mountOnEnter in={saving} nodeRef={ref}>
        <div ref={ref} className="fixed z-50 top-4 w-full left-0 flex justify-center pointer-events-none">
          <div className="relative rounded p-2 bg-white">
            Saving
          </div>
        </div>
      </CSSTransition>
      {props.children}
    </>
  );
}