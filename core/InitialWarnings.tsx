import { authenticatedWarnings, SiteWarnings } from '@/store/common/warnings';
import notifications from '@/store/features/notifications';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export function InitialWarnings () {
  const dispatch = useDispatch();

  useEffect(() => {
    const h = setInterval(() => {
      const warnings = Cookies.get('ossinsight-lite.site-warnings');
      const toRemove = new Set(authenticatedWarnings);
      if (warnings) {
        for (let warning of warnings.split(',') as SiteWarnings[]) {
          dispatch(notifications.actions.addWarning({ warning }));
          toRemove.delete(warning);
        }
      }
      toRemove.forEach(warning => {
        dispatch(notifications.actions.dismissWarning({ warning }));
      });
    }, 3000);

    return () => {
      clearInterval(h);
    };
  }, []);

  return <></>;
}
