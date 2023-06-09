import { State } from '@/store/store';
import { shallowEqual, useSelector } from 'react-redux';

export default function DebugInfo () {
  const { dirty, committing } = useSelector<State, { dirty: number, committing: number }>(({ draft }) => ({
    dirty: draft.dirty.length,
    committing: draft.committing.length,
  }), shallowEqual);

  return (
    <div className="fixed right-0 bottom-0 z-50 font-sans text-sm text-gray-400">
      <b>dashboard debug info:</b>
      {' '}
      {`uncommitted changes: ${dirty}, committing changes: ${committing}`}
    </div>
  );
}