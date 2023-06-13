import { State } from '@/store/store';
import clientOnly from '@/utils/clientOnly';
import { useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

function DebugInfo () {
  const showDebugInfo = useMemo(() => {
    return localStorage.getItem('ossinsight-lite.debug') === 'true';
  }, []);

  const { dirty, committing, local } = useSelector<State, { dirty: number, committing: number, local: number }>(({ draft }) => ({
    dirty: draft.dirty.length,
    committing: draft.committing.length,
    local: draft.localStorageUncommittedChanges.length,
  }), shallowEqual);

  if (!showDebugInfo) {
    return <></>;
  }

  return (
    <div className="fixed right-0 bottom-0 z-50 font-sans text-sm text-gray-400">
      <b>dashboard debug info:</b>
      {' '}
      {`uncommitted changes: ${dirty}, committing changes: ${committing}, local: ${local}`}
    </div>
  );
}

export default clientOnly(DebugInfo);
