import { usePageContext } from '../../renderer/usePageContext';
import { useMemo } from 'react';
import Widget from '../../src/components/Widget'
import widgets from 'app:widgets-manifest';

export function Page () {
  const { urlPathname } = usePageContext();

  const name = useMemo(() => {
    return urlPathname.slice(1);
  }, [urlPathname]);

  return <Widget name={name} widget={widgets[name]} />;
}
