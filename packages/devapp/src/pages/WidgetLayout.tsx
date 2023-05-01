import { Outlet, useLocation } from 'react-router';
import WidgetWrapper from '../components/WidgetWrapper';
import { useMemo } from 'react';

export default function Widget () {
  const location = useLocation();
  const name = useMemo(() => location.pathname.replace('/browse/', ''), [location.pathname]);

  return (
    <WidgetWrapper name={name}>
      <Outlet />
    </WidgetWrapper>
  );
}
