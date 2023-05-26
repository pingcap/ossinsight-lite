import * as Accordion from '@radix-ui/react-accordion';
import { AccordionContentProps, AccordionItemProps, AccordionTriggerProps } from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import { forwardRef } from 'react';

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Item
    className={clsx(
      'mt-px overflow-hidden first:mt-0 focus-within:relative focus-within:z-10',
      className,
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </Accordion.Item>
));

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className="flex">
    <Accordion.Trigger
      className={clsx(
        'cursor-pointer text-gray-400 group flex h-8 flex-1 gap-2 items-center justify-start px-2 text-sm leading-none outline-none data-[state=open]:text-gray-900 data-[state=open]:bg-gray-100 transition-colors hover:bg-gray-100',
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <ChevronDownIcon
        className="text-gray-400 ml-auto ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-all duration-300 group-data-[state=open]:text-gray-700 group-data-[state=open]:rotate-180"
        aria-hidden
      />
    </Accordion.Trigger>
  </Accordion.Header>
));

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={clsx(
      'AccordionContent data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]',
      className,
    )}
    {...props}
    ref={forwardedRef}
  >
    <div className="pl-2">{children}</div>
  </Accordion.Content>
));