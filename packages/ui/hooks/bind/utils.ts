export type UpdateContext<Data> = { changed: boolean, changedKeys?: (`${string & keyof Data}${string}`)[] };
export type UpdateAction<Data> = Data | ((prevState: Data, ctx: UpdateContext<Data>) => Data)

export function nextValue<T, C> (prev: T, setStateAction: UpdateAction<T>, context: C) {
  if (typeof setStateAction === 'function') {
    return (setStateAction as (prev: T, ctx: C) => T)(prev, context);
  } else {
    return setStateAction;
  }
}
