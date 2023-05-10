import { RegisterMenuItemOptions, useContextMenuContext } from './context.tsx';
import { useEffect } from 'react';

// use _version if you need to force update children or action
export function ContextMenuItem (props: RegisterMenuItemOptions & { id: string }, _version = 0) {
  const { register, unregister, update } = useContextMenuContext();

  useEffect(() => {
    const { id, ...rest } = props;
    register(id, {
      ...rest,
    });
    return () => {
      unregister(id);
    };
  }, [props.id]);

  useEffect(() => {
    const { id, group, order, ...rest } = props;
    update(props.id, rest);
  }, [props.text, props.disabled, props.extraText, _version]);

  return <></>;
}
