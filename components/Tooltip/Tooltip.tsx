'use client';
import * as RuiTooltip from '@radix-ui/react-tooltip';
import { ReactElement, ReactNode } from 'react';

export interface TooltipProps {
  label: ReactNode;
  children: ReactElement;
}

export default function Tooltip ({ children, label }: TooltipProps) {
  return (
    <RuiTooltip.Provider delayDuration={0}>
      <RuiTooltip.Root>
        <RuiTooltip.Trigger asChild>
          {children}
        </RuiTooltip.Trigger>
        <RuiTooltip.Portal>
          <RuiTooltip.Content className='tooltip-content' sideOffset={5}>
            <RuiTooltip.Arrow className="fill-white" />
            {label}
          </RuiTooltip.Content>
        </RuiTooltip.Portal>
      </RuiTooltip.Root>
    </RuiTooltip.Provider>
  );
}